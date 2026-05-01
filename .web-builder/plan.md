# DevTools Hub - 开发者工具箱

## 项目概述
一个面向开发者的综合在线工具网站，所有工具在浏览器本地运行，无需后端服务。

## 目标用户
开发者、程序员、技术人员

## 原型
`spa` - 单页应用

## 技术栈
- **前端框架**: React 18 + TypeScript
- **构建工具**: Vite
- **样式**: Tailwind CSS
- **路由**: React Router v7
- **状态管理**: Zustand
- **UI组件**: shadcn/ui
- **图标**: Lucide React

## 目录结构
```
/
├── src/
│   ├── components/
│   │   ├── ui/           # shadcn/ui 组件
│   │   ├── layout/       # Header, Sidebar, Footer
│   │   └── tools/        # 工具组件
│   ├── pages/
│   ├── hooks/
│   ├── stores/           # Zustand 状态管理
│   ├── utils/            # 工具函数
│   ├── types/
│   ├── App.tsx
│   └── main.tsx
├── public/
├── package.json
├── vite.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

## 路由规划

| 路由 | 页面 | 描述 | 状态 |
|------|------|------|------|
| / | 首页 | 工具导航网格 | ✅ |
| /json | JSON工具 | 格式化/压缩/转义/校验 | ✅ |
| /encode | 编码工具 | Base64/URL/HTML编解码 | ✅ |
| /hash | 哈希工具 | MD5/SHA1/SHA256/SHA512 | ✅ |
| /timestamp | 时间戳 | 时间戳与日期互转 | ✅ |
| /regex | 正则测试 | 正则表达式实时测试 | ✅ |
| /color | 颜色工具 | HEX/RGB/HSL转换 | ✅ |
| /diff | 文本对比 | 文本Diff对比 | ✅ |
| /password | 密码生成 | 随机密码生成器 | ✅ |
| /cron | Cron表达式 | 生成和解析定时任务 | ✅ |
| /uuid | UUID生成 | 各种格式唯一标识符 | ✅ |
| /qrcode | 二维码 | 文本/URL转二维码 | ✅ |
| /baseconvert | 进制转换 | 2/8/10/16进制互转 | ✅ |

## 共享组件
- Header - 顶部导航栏 ✅
- Sidebar - 左侧工具菜单 ✅
- ToolLayout - 工具页面统一布局 ✅
- CopyButton - 复制到剪贴板按钮 ✅

## 设计规范
- 5种主题切换: 浅色/深色/深蓝/紫色/绿色
- 渐变按钮 + 悬浮发光效果
- 卡片悬浮动画
- 左侧固定侧边栏导航
- 右侧主内容区

## 进度

### Phase 1: 项目结构 ✅
### Phase 2: 全局样式 ✅
### Phase 3: 布局骨架 ✅
### Phase 4: 路由占位 ✅
### Phase 5: 逐页实现 ✅
### Phase 6: 验证与收尾 ✅

## 更新日志
### v1.1.0
- 新增5种主题切换功能
- 按钮样式升级：渐变背景、悬浮发光、点击缩放
- 新增4个工具：Cron表达式、UUID生成、二维码、进制转换
- 卡片悬浮动画效果
- 主题状态持久化存储
