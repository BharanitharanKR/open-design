> Historical CS03 draft. The integrated definitions, wiring and current limitations
> are in [stability-metrics.md](../../telemetry/stability-metrics.md); that document supersedes this draft.

# 进入项目 → Ready 口径卡（CS03 草稿，未评审／未发布）

依据：本次任务给定的 `~/code/tmp/okr-1022-plan/plan.md` 第 2 项和第六章 CS03。此文件仅登记本分支候选口径，不代表公共合同、QA 或线上验收。

## 测量边界与 Ready

- 路径：项目列表／卡片等共用 `App.handleOpenProject` → 导航前 Workspace／项目读取 → 路由提交 → ProjectView 业务数据和权限就绪 → 前台下一动画帧检查仍可操作 → Ready。
- 起点：同步进入项目打开 handler，早于第一个 await；使用 `performance.now()`，不是组件 mount，也不是 URL 更新。
- Ready：项目详情与作用域已读到、会话及其当前权限代的消息已成功读取、消息属于当前会话、输入发送与新建会话的现有业务门均允许操作。后台标签不报 Ready，回到前台后重新检查。动画帧是提交后可操作检查，不声称像素已绘制或 iframe 预览完成。
- 明确错误（项目打开、详情／作用域、会话／消息读取）报 failed；权限只读、物化等待、账单身份未就绪等操作不可用状态不冒充 Ready。没有固定超时；未终结的 started 必须列为缺测，不能删掉或计作成功。
- 只读访问未达到本稿“可操作”口径，不纳入 Ready 分位数，需评审是否另设 readable Ready；不得以 0ms 填充。
- 取消：新点击替代旧点击（包括同一项目）、离开源页面／加载中的项目、页面退出。迟到请求、迟到动画帧和重复 effect 不能生成旧尝试的 Ready。
- 同项目历史会话选择单独标为 conversation_switch；程序内部的会话恢复跳转不伪造一次用户选择；普通文件 tab 的 URL 同步不创建进入项目尝试。首次直达／刷新没有可证点击起点，不生成 project_entry；启动 Ready 由 CS02 单独定义。

## 本地候选事件（需 CS01 对齐）

事件 `client_navigation_result`：一次 started 和至多一次终态 ready／cancelled／failed，共用 navigation_id；duration_ms 从同一单调时钟起点计算，started 为 0。

| 字段 | 本地含义 |
| --- | --- |
| navigation_id | 每次真实意图新建，终态关联／去重键 |
| navigation_type | project_entry / conversation_switch，分别查询 |
| source_type / target_type | 固定页面种类（home 子页归 source_type），目标 project / conversation |
| status | started / ready / cancelled / failed |
| duration_ms | 意图至本次状态，毫秒；禁止将 cancelled 当快成功 |
| reason | 固定原因枚举，无异常文本／路径／prompt |

目标 project／conversation ID 仅用于进程内归属匹配，不新增上报身份字段。身份、版本、环境、schema、采样与 launch_attempt_id 的真值由 CS01／CS02 提供，本分支不手工复制公共字段。

## 统计草案

- 主体：可观测的导航尝试；去重 `(navigation_id, status)`，每个 id 最多一个终态。按项目进入与会话切换分组，不能混成一张耗时图。
- 成功耗时：仅 ready 终态的 duration_ms，报告 P50/P90、成功 N；同时列 started 去重 N、failed N、cancelled N、无终态 N 和覆盖率。
- 成功率分母建议列全量 started；另列排除明确用户取消后的辅助成功率，必须同时展示取消比例。跨统计窗口按 started 的发生时间归队，留出结算窗口，避免只查终态漏掉悬空尝试。
- 账号映射、安装设备、版本／平台／发布环境三维切分依赖 CS01 公共字段；未对齐前不提供伪 SQL 或声称线上当前值。
- 当前值、发布版本和真实落库：缺测。本地 mock 单测不代表线上链路可用。

## 验证与待集成

先写 `navigation-timing.test.ts`（缺模块红灯）再实现；另外把 App／ProjectView 两个接线文件临时恢复到起始提交 `9b5dc619d` 后，接线专测 6 个关键断言失败，恢复候选后转绿。非安全来源 UUID 缺失和 App 权限错误页漏终态另有先红后绿验证。这里的基线验证保留了候选本地测量模块，只替换这两个接线文件，不冒充整棵 main 的回归结果。

相关测试命令（只跑这 6 个文件，不跑全 web suite）：

```sh
corepack pnpm --filter @open-design/web test \
  tests/observability/navigation-timing.test.ts \
  tests/observability/chat-health.test.ts \
  tests/observability/chat-health-wiring.test.ts \
  tests/components/ProjectView.navigation-ready.test.tsx \
  tests/components/ProjectView.tabs-navigation.test.tsx \
  tests/components/App.project-create-race.test.tsx
corepack pnpm --filter @open-design/web typecheck
corepack pnpm guard
```

覆盖取消、切走、重复进入、迟到异步完成、当前消息加载／失败、物化阻塞、会话选择、后台转前台、StrictMode 重放和 Ready 去重。2026-10-16 本地结果：6 个文件、127 个测试通过；web typecheck 与仓库 guard 均通过。未跑全 web／daemon suite 或仓库全量 typecheck；本次没有发布动作。

需他人接线／集成：CS01 确认事件 union、字段名／枚举、schema、公共环境身份与去重策略；CS02 提供启动 attempt 关联和独立的启动业务 Ready；CS05 若需 App／ProjectView 接线，交 CS03 串行处理。现有 router 导航守卫拒绝／取代提交时没有取消回调，需 router owner 提供终态接线（本次不越界修改）；此类 started 暂列无终态，不能当成功。普通页面切换、首次创建／导入／复制项目和外部深链未复用该点击入口，不能声称已覆盖其意图耗时。

待 heggria 评审：上述严格可操作 Ready 是否为最终业务定义；只读／运行中无法新建等有意受限场景是否另设分组或另设可读 Ready。后续需 macOS／Windows 打包版、新旧项目、慢网、失败、取消手工 QA，以及实际发布后的落库证据；本次未执行。
