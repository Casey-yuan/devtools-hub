# 🧰 DevTools Hub - 开发者工具箱

<p align="center">
  简体中文 | <a href="./README.md">English</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18.2.0-61DAFB?logo=react" alt="React">
  <img src="https://img.shields.io/badge/TypeScript-5.2.0-3178C6?logo=typescript" alt="TypeScript">
  <img src="https://img.shields.io/badge/TailwindCSS-3.4.0-06B6D4?logo=tailwindcss" alt="TailwindCSS">
  <img src="https://img.shields.io/badge/Vite-5.0.8-646CFF?logo=vite" alt="Vite">
  <img src="https://img.shields.io/badge/License-MIT-green.svg" alt="License">
</p>

<p align="center">
  <b>简洁、高效、安全的在线开发者工具集合</b>
</p>

<p align="center">
  🌐 <a href="https://Casey-yuan.github.io/devtools-hub/" target="_blank">在线体验</a> •
  📖 <a href="#功能介绍">功能介绍</a> •
  🚀 <a href="#快速开始">快速开始</a> •
  🤝 <a href="#贡献">贡献代码</a>
</p>

---

## 🏷️ 标签

`developer-tools` `online-tools` `json-formatter` `base64` `md5` `hash` `regex` `url-encoder` `timestamp` `uuid` `password-generator` `color-converter` `markdown-editor` `html-preview` `code-formatter` `frontend` `react` `typescript` `vite` `devtools`

---

## ✨ 特点

- 🚀 **纯前端实现** - 所有数据处理在浏览器本地完成，无需上传服务器
- 🔒 **隐私安全** - 敏感数据不会离开您的设备
- 📱 **响应式设计** - 完美适配桌面、平板和手机
- 🎨 **精美界面** - 现代化的 UI 设计，支持深色模式
- ⚡ **极速加载** - 基于 Vite 构建，首屏加载飞快
- 🛠️ **丰富工具** - 涵盖开发、编码、格式化等多种实用工具

---

## 🎯 功能介绍

### 格式化工具
| 工具 | 描述 |
|------|------|
| 📝 JSON 格式化 | JSON 美化、压缩、校验、转义 |
| 🌐 HTML 格式化 | HTML 代码美化和压缩 |
| 🎨 CSS 格式化 | CSS 代码美化和压缩 |
| 📄 SQL 格式化 | SQL 语句美化和格式化 |
| 📋 XML 格式化 | XML 代码美化和压缩 |

### 编码解码
| 工具 | 描述 |
|------|------|
| 🔐 Base64 编解码 | Base64 编码和解码 |
| 🔑 URL 编解码 | URL 编码和解码 |
| 🔒 JWT 解码 | JWT Token 解析和验证 |
| 📝 Unicode 转换 | Unicode 编码转换 |

### 哈希计算
| 工具 | 描述 |
|------|------|
| 🧮 MD5 加密 | MD5 哈希值计算 |
| 🔐 SHA 系列 | SHA1、SHA256、SHA512 哈希计算 |
| 📝 HMAC 计算 | HMAC 哈希消息认证码 |

### 开发工具
| 工具 | 描述 |
|------|------|
| 🌍 IP 查询 | 查询公网 IP 和地理位置 |
| ⏰ 时间戳转换 | Unix 时间戳与日期互转 |
| 🧪 正则测试 | 正则表达式在线测试和匹配 |
| 🆔 UUID 生成 | 生成唯一标识符 |
| ⏱️ Cron 表达式 | Cron 表达式解析和生成 |

### 文本工具
| 工具 | 描述 |
|------|------|
| 📊 文本对比 | 文本差异对比工具 |
| 🔤 文本处理 | 大小写转换、去除空格等 |
| 🔀 密码生成 | 安全随机密码生成器 |

### 转换工具
| 工具 | 描述 |
|------|------|
| 🎨 颜色转换 | HEX、RGB、HSL 互转 |
| 📐 进制转换 | 二进制、八进制、十进制、十六进制互转 |
| 📏 单位转换 | 长度、重量、温度等单位转换 |

### 预览工具
| 工具 | 描述 |
|------|------|
| 🌐 HTML 预览 | 实时 HTML 代码预览 |
| 📝 Markdown 编辑器 | Markdown 实时预览和编辑 |
| 🖼️ 图片转 Base64 | 图片与 Base64 互转 |

### 解析工具
| 工具 | 描述 |
|------|------|
| 🔗 URL 解析 | URL 参数解析和编码 |
| 🧮 计算器 | 科学计算器 |

---

## 🚀 快速开始

### 在线使用
直接访问：[https://Casey-yuan.github.io/devtools-hub/](https://Casey-yuan.github.io/devtools-hub/)

### 本地开发

```bash
# 克隆项目
git clone https://github.com/Casey-yuan/devtools-hub.git
cd devtools-hub

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

---

## 🛠️ 技术栈

- **框架**: React 18 + TypeScript
- **构建工具**: Vite 5
- **样式**: Tailwind CSS
- **路由**: React Router v6
- **状态管理**: Zustand
- **图标**: Lucide React
- **部署**: GitHub Pages / Gitee Pages

---

## 📁 项目结构

```
devtools-hub/
├── public/              # 静态资源
├── src/
│   ├── components/      # 组件
│   │   ├── layout/      # 布局组件
│   │   └── ui/          # UI 组件
│   ├── pages/           # 页面/工具
│   ├── config/          # 配置文件
│   ├── stores/          # 状态管理
│   ├── hooks/           # 自定义 Hooks
│   └── utils/           # 工具函数
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

---

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建你的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的修改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开一个 Pull Request

---

## 📄 开源协议

本项目基于 [MIT](LICENSE) 协议开源。

---

## 🙏 鸣谢

感谢以下开源项目的支持：

- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Lucide Icons](https://lucide.dev/)

---

<p align="center">
  如果这个项目对你有帮助，请给个 ⭐ Star 支持一下！
</p>

<p align="center">
  Made with ❤️ by <a href="https://github.com/Casey-yuan">Casey-yuan</a>
</p>
