import { createServer, request, type ServerResponse, type ClientRequest } from 'node:http';

/** Transparent loopback transport fault. All business responses and SSE frames
 * come from the owned AMR server; only the selected workspace stream is cut. */
export async function createWorkspaceStreamProxy(upstream: string, workspaceId: string) {
  const target = new URL(upstream);
  if (target.protocol !== 'http:' || target.hostname !== '127.0.0.1') throw new Error('Owned loopback AMR required');
  let blocked = false;
  let sequence = 0;
  const active = new Set<{ response: ServerResponse; upstream: ClientRequest }>();
  const observations: { at: number; kind: string; connection: number; workspaceId?: string }[] = [];
  const server = createServer((incoming, outgoing) => {
    const selected = new URL(incoming.url ?? '/', upstream).pathname === '/api/v1/collab/events'
      && incoming.headers['x-vela-workspace-id'] === workspaceId;
    const connection = selected ? ++sequence : 0;
    if (selected) observations.push({ at: Date.now(), kind: blocked ? 'blocked-attempt' : 'connect', connection });
    if (selected && blocked) {
      outgoing.destroy();
      return;
    }
    const forwarded = request(new URL(incoming.url ?? '/', upstream), {
      method: incoming.method, headers: { ...incoming.headers, host: target.host },
    }, response => {
      outgoing.writeHead(response.statusCode ?? 502, response.headers);
      if (selected) {
        let buffer = '';
        response.on('data', (chunk: Buffer) => {
          buffer += chunk.toString('utf8');
          buffer = buffer.replace(/\r\n/g, '\n');
          let end: number;
          while ((end = buffer.indexOf('\n\n')) >= 0) {
            const frame = buffer.slice(0, end);
            buffer = buffer.slice(end + 2);
            if (!/^event: ?ready$/m.test(frame)) continue;
            const raw = frame.split('\n').filter(line => line.startsWith('data:')).map(line => line.slice(5).trim()).join('\n');
            try {
              const ready = JSON.parse(raw) as { workspaceId?: string };
              observations.push({ at: Date.now(), kind: 'upstream-ready', connection,
                ...(ready.workspaceId ? { workspaceId: ready.workspaceId } : {}) });
            } catch { observations.push({ at: Date.now(), kind: 'invalid-ready', connection }); }
          }
          if (buffer.length > 64 * 1024) buffer = '';
        });
      }
      response.pipe(outgoing);
    });
    const entry = { response: outgoing, upstream: forwarded };
    if (selected) active.add(entry);
    outgoing.on('close', () => {
      active.delete(entry);
      forwarded.destroy();
      if (selected) observations.push({ at: Date.now(), kind: 'closed', connection });
    });
    forwarded.on('error', () => outgoing.destroy());
    incoming.pipe(forwarded);
  });
  await new Promise<void>(resolve => server.listen(0, '127.0.0.1', resolve));
  const address = server.address();
  if (!address || typeof address === 'string') throw new Error('Proxy port missing');
  return {
    url: `http://127.0.0.1:${address.port}`,
    observations,
    disconnect() {
      blocked = true;
      observations.push({ at: Date.now(), kind: 'fault-enabled', connection: sequence });
      for (const entry of active) { entry.upstream.destroy(); entry.response.destroy(); }
    },
    reconnect() {
      blocked = false;
      observations.push({ at: Date.now(), kind: 'fault-disabled', connection: sequence });
    },
    async close() {
      server.closeAllConnections();
      await new Promise<void>((resolve, reject) => server.close(error => error ? reject(error) : resolve()));
    },
  };
}
