# Repository Guidelines

## Project Structure & Module Organization
Parcel 的入口位于 `src/index.html`，内部引导 `src/index.js` 初始化渲染流程。核心渲染模块集中在 `src/packages`：`Camera`、`Core`、`Scene`、`Worker` 分别负责相机、底层 WebGL 资源、场景管理与多线程任务。`src/Feature` 追踪实验性能力，`src/Examples` 存放可直接运行的示例，`src/PostEffect`、`src/Texture`、`src/Utils` 提供图像与公共工具。新增子系统时请放入对应包目录，并暴露单一入口确保导入路径稳定。

## Build, Test, and Development Commands
首次克隆后执行 `pnpm install`，仓库依赖 pnpm 锁文件。`pnpm start` 调用 Parcel 开启带热更新的本地服务并加载 `/src/index.html`。`pnpm build` 运行 `parcel build`，输出产物到 `dist/` 供部署。`pnpm exec eslint "src/**/*.{ts,js}"` 与 `pnpm exec prettier --check src` 用于静态检查与格式核验，修复时追加 `--write`。

## Coding Style & Naming Conventions
`tsconfig.json` 启用 `strict`，公开 API 请写明类型并维持 ES6 模块导入。遵循 Prettier 配置：2 空格缩进、单引号、行宽 80、尾随逗号、默认无分号。导出类的文件与类名保持 PascalCase（如 `SceneGraph.ts`），工具函数模块采用 camelCase。除包入口外避免默认导出，以利 tree-shaking。

## Testing Guidelines
当前 `pnpm test` 占位，请为新增功能同步补充自动化用例，可在相关包下创建如 `src/packages/Core/__tests__/Framebuffer.spec.ts`。推荐使用 Vitest 或带 `jsdom` 的 Jest 以模拟 WebGL 环境，并在测试中验证 shader 编译失败路径。提交 PR 前，附上手动冒烟步骤：场景能加载、相机轨道操作正常、后处理切换无异常。

## Commit & Pull Request Guidelines
沿用 Conventional Commits（`feat`、`chore`、`fix`、`refactor`、`docs` 等），标题不超过 72 字符并在正文引用相关 issue。每个 PR 需说明渲染侧改动、API 或 shader 影响、测试结果，并在视觉输出变化时附上运行 `pnpm start` 的截图或 GIF。保持 PR 聚焦，渲染实验与基础设施调整建议拆分处理，方便 Review。
