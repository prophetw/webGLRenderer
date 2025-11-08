# WebGL Renderer

WebGL Renderer 是一个面向实验型实时渲染的引擎雏形，目标是在 Parcel + pnpm 的现代前端堆栈下，快速验证相机、材质、后处理与多线程加载等图形特性。仓库既是工具集，也是示例集合，可作为学习 WebGL 或构建定制渲染管线的起点。

## 现有特性
- **摄像机系统**：透视、正交、截锥体等模式可切换，支持多相机场景。
- **场景 / 核心模块**：封装 Framebuffer、ShaderProgram、Resource Loader、BVH、Picking、Job Scheduler 等基础设施。
- **着色器与材质**：包含 Path Tracing、PBR、Phong 等渲染示例，并提供 Texture / PostEffect 目录管理相关资源。
- **异步能力**：Worker 与（规划中的）WASM 目录用于加速模型解析、贴图解码等昂贵任务。

## 项目结构
```
src/
  index.html            # Parcel 入口
  index.js              # Demo 引导
  packages/             # 引擎模块（Camera/Core/Scene/Worker）
  Examples/             # 可以直接运行的场景示例
  Feature/              # 实验性功能
  PostEffect/           # 屏幕后处理
  Texture/              # 纹理与相关工具
  Utils/                # 通用辅助函数
tsconfig.json           # TypeScript 严格模式配置
AGENTS.md               # 贡献说明（中文）
```

## 快速开始
1. 安装 Node.js LTS 与 pnpm（`corepack enable` 推荐）。
2. 安装依赖：`pnpm install`
3. 本地预览：`pnpm start`（Parcel Dev Server，默认打开 `src/index.html`）
4. 生产构建：`pnpm build`（输出到 `dist/`）

常用维护命令：
```bash
pnpm exec eslint "src/**/*.{ts,js}"   # 语法与类型约束
pnpm exec prettier --check src        # 格式校验（添加 --write 自动修复）
```

## 开发说明
- TypeScript 运行在 `strict` 模式，公开 API 务必申明类型，模块保持 ES6 导入导出。
- 文件命名建议：导出类使用 PascalCase（`SceneGraph.ts`），工具函数使用 camelCase。
- 新增渲染能力时请同步更新 `Examples` 中的演示，便于肉眼验证。
- 多线程或重资源操作请放入 `Worker`/`Feature` 子目录，保持核心目录简洁。

## 路线图
- **相机**：补全轨道、自由、跟随等控制器；增强多相机合成。
- **场景**：完善模型加载（GLTF / FBX）、多场景调度、LOD 与裁剪。
- **核心**：增加更多 Framebuffer/PostProcess 组合与资源缓存策略。
- **着色器**：扩展 PBR 材质工作流，丰富 Path Tracing 与屏幕后处理示例。
- **工具链**：集成真实测试（Vitest/Jest + jsdom 或 headless WebGL）并增加基准脚本。

## 参与贡献
- 阅读 `AGENTS.md` 获取目录规范、命令、提交格式等细则。
- 使用 Conventional Commit（`feat: ...`, `fix: ...` 等）并在 PR 中附上可视化结果与测试说明。
- 若计划引入新第三方库或大型架构调整，先在 Issue/Discussion 中与维护者对齐。
