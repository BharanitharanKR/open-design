import { describe, expect, it } from 'vitest';
import { renderHtmlTemplateV1 } from '../../src/live-artifacts/render.js';

// The template derives the total from current rows on every render. It never
// depends on a separately seeded aggregate that a source refresh can leave stale.
describe('live artifact numeric sum bindings', () => {
  const templateHtml = '<ul><li data-od-repeat="row in data.items">{{row.name}}: {{row.count}}</li></ul><p>Total: {{sum data.items count}}</p>';

  it('recomputes totals with the same template when source rows change', () => {
    const first = renderHtmlTemplateV1({ templateHtml, dataJson: {
      items: [{ name: 'A', count: 8 }, { name: 'B', count: 13 }], total: 999,
    } });
    const second = renderHtmlTemplateV1({ templateHtml, dataJson: {
      items: [{ name: 'A', count: 3 }, { name: 'B', count: 0 }], total: 999,
    } });
    expect(first.html).toBe('<ul><li>A: 8</li><li>B: 13</li></ul><p>Total: 21</p>');
    expect(second.html).toBe('<ul><li>A: 3</li><li>B: 0</li></ul><p>Total: 3</p>');
  });

  it('renders zero for an empty source, without retaining old rows or a seeded total', () => {
    expect(renderHtmlTemplateV1({ templateHtml, dataJson: { items: [], total: 21 } }).html)
      .toBe('<ul></ul><p>Total: 0</p>');
  });

  it('supports nested source and numeric field paths, negatives, and decimals', () => {
    expect(renderHtmlTemplateV1({
      templateHtml: '{{sum data.report.rows amounts.net}}',
      dataJson: { report: { rows: [{ amounts: { net: 4.5 } }, { amounts: { net: -1.25 } }] } },
    }).html).toBe('3.25');
  });

  it('uses the root source inside a repeat and keeps substituted text inert', () => {
    expect(renderHtmlTemplateV1({
      templateHtml: '<p data-od-repeat="row in data.items">{{row.name}} / {{sum data.items count}}</p>',
      dataJson: { items: [{ name: '<b>{{sum data.other count}}</b>', count: 2 }], other: [{ count: 50 }] },
    }).html).toBe('<p>&lt;b&gt;{{sum data.other count}}&lt;/b&gt; / 2</p>');
  });

  it.each([{}, { items: null }, { items: {} }, { items: 'missing' }])(
    'rejects a missing or non-array source instead of reporting a false zero: %j', (dataJson) => {
      expect(() => renderHtmlTemplateV1({ templateHtml: '{{sum data.items count}}', dataJson }))
        .toThrow(/sum source must be an array/);
    },
  );

  it.each([null, '4', true, {}, [], Number.NaN, Number.POSITIVE_INFINITY])(
    'rejects non-finite or non-numeric values instead of coercing or skipping them: %j', (count) => {
      expect(() => renderHtmlTemplateV1({
        templateHtml: '{{sum data.items count}}', dataJson: { items: [{ count }] },
      })).toThrow(/sum field must be a finite number/);
    },
  );

  it('rejects missing fields and inherited values', () => {
    for (const row of [{}, Object.create({ count: 4 })]) {
      expect(() => renderHtmlTemplateV1({
        templateHtml: '{{sum data.items count}}', dataJson: { items: [row] },
      })).toThrow(/sum field must be a finite number/);
    }
    expect(() => renderHtmlTemplateV1({
      templateHtml: '{{sum data.items count}}', dataJson: Object.create({ items: [{ count: 4 }] }),
    })).toThrow(/sum source must be an array/);
  });

  it('rejects a non-finite total', () => {
    expect(() => renderHtmlTemplateV1({
      templateHtml: '{{sum data.items count}}',
      dataJson: { items: [{ count: Number.MAX_VALUE }, { count: Number.MAX_VALUE }] },
    })).toThrow(/sum total must be finite/);
  });

  it.each(['sum data.items', 'sum items count', 'sum data.items count + 1', 'sum data.items count()', 'data.items.reduce(fn)', 'sum data.items[count] count']) (
    'does not accept arbitrary expressions: %s', (binding) => {
      expect(() => renderHtmlTemplateV1({
        templateHtml: `{{${binding}}}`, dataJson: { items: [{ count: 2 }] },
      })).toThrow(/invalid template binding path/);
    },
  );
});
