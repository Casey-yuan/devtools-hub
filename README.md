# 🧰 DevTools Hub

<p align="center">
  <a href="./README.zh.md">简体中文</a> | English
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Tools-20+-brightgreen?style=flat-square" alt="Tools Count">
  <img src="https://img.shields.io/badge/React-18.2.0-61DAFB?logo=react&style=flat-square" alt="React">
  <img src="https://img.shields.io/badge/TypeScript-5.2.0-3178C6?logo=typescript&style=flat-square" alt="TypeScript">
  <img src="https://img.shields.io/badge/Vite-5.0.8-646CFF?logo=vite&style=flat-square" alt="Vite">
  <img src="https://img.shields.io/badge/TailwindCSS-3.4.0-06B6D4?logo=tailwindcss&style=flat-square" alt="TailwindCSS">
  <img src="https://img.shields.io/badge/License-MIT-green.svg?style=flat-square" alt="License">
  <img src="https://img.shields.io/badge/PRs-Welcome-brightgreen.svg?style=flat-square" alt="PRs Welcome">
</p>

<p align="center">
  <b>🚀 A curated collection of 20+ essential developer tools to supercharge your productivity</b><br>
  Formatting, encoding, hashing, regex testing, API testing, and much more — all in one place
</p>

<p align="center">
  ✨ <b>Zero Installation</b> — Works instantly in your browser<br>
  🔒 <b>Privacy First</b> — All processing happens locally, no data leaves your device<br>
  📱 <b>Responsive Design</b> — Works seamlessly on desktop, tablet, and mobile<br>
  🌙 <b>Dark Mode</b> — Easy on the eyes during those late-night coding sessions<br>
  ⚡ <b>Lightning Fast</b> — Built with Vite for optimal performance
</p>

<p align="center">
  🌐 <a href="https://Casey-yuan.github.io/devtools-hub/" target="_blank"><b>Try It Live →</b></a> •
  📖 <a href="#-features">Features</a> •
  🚀 <a href="#-quick-start">Quick Start</a> •
  🤝 <a href="#-contributing">Contribute</a>
</p>

---

## 📸 Preview

<p align="center">
  <i>Experience a clean, modern interface designed for developers</i>
</p>

---

## � Why DevTools Hub?

As developers, we constantly switch between different online tools for formatting JSON, testing regex, encoding URLs, and more. **DevTools Hub** brings all these essential tools together in one unified, beautiful interface.

### Key Benefits

- **🎨 Consistent Experience** — Same UI patterns across all tools, no learning curve
- **⚡ Instant Access** — No signup, no installation, just open and use
- **🔐 Secure by Design** — Your data never leaves your browser
- **📴 Offline Ready** — Works without internet once loaded (PWA support coming soon)
- **🆓 Forever Free** — Open source and free for personal and commercial use

---

## ✨ Features

### 📝 Formatting Tools
| Tool | Description |
|------|-------------|
| JSON Formatter | Beautify, minify, validate, and escape JSON |
| HTML Formatter | Clean and format HTML code |
| CSS Formatter | Organize and minify CSS |
| SQL Formatter | Format SQL queries with proper indentation |
| XML Formatter | Pretty-print XML documents |

### 🔐 Encoding & Decoding
| Tool | Description |
|------|-------------|
| Base64 Codec | Encode/decode text and files to Base64 |
| URL Codec | URL encode and decode strings |
| JWT Decoder | Parse and validate JWT tokens |
| Unicode Converter | Convert between Unicode and text |

### 🧮 Hash & Crypto
| Tool | Description |
|------|-------------|
| MD5 Hash | Generate MD5 checksums |
| SHA Family | SHA1, SHA256, SHA512 hashing |
| HMAC | Hash-based message authentication |

### 🛠️ Developer Tools
| Tool | Description |
|------|-------------|
| IP Query | Check your public IP and geolocation |
| Timestamp Converter | Convert between Unix timestamps and dates |
| Regex Tester | Test and debug regular expressions |
| UUID Generator | Generate v4 UUIDs instantly |
| Cron Expression Parser | Understand and generate cron schedules |
| HTTP Request Tester | Test APIs with a lightweight Postman alternative |

### 🗄️ Backend Tools
| Tool | Description |
|------|-------------|
| SQL to Entity | Convert SQL tables to Java/C#/Go/TypeScript classes |
| JSON to Struct | Transform JSON to typed structures |

### 📝 Text Utilities
| Tool | Description |
|------|-------------|
| Text Diff | Compare two texts side by side |
| Text Processor | Case conversion, whitespace cleanup |
| Password Generator | Create secure random passwords |

### 🎨 Converters
| Tool | Description |
|------|-------------|
| Color Converter | HEX ↔ RGB ↔ HSL conversion |
| Base Converter | Binary, octal, decimal, hexadecimal |
| Unit Converter | Length, weight, temperature units |

### 👁️ Preview Tools
| Tool | Description |
|------|-------------|
| HTML Preview | Live HTML rendering |
| Markdown Editor | Real-time Markdown preview |
| Image to Base64 | Convert images to Base64 strings |

### 🔗 Parsers
| Tool | Description |
|------|-------------|
| URL Parser | Extract URL components and parameters |
| Calculator | Scientific calculator with history |

---

## 🚀 Quick Start

### 🌐 Use Online (Recommended)
**Simply visit:** [https://Casey-yuan.github.io/devtools-hub/](https://Casey-yuan.github.io/devtools-hub/)

No installation, no registration — start using immediately!

### 💻 Local Development

```bash
# 1. Clone the repository
git clone https://github.com/Casey-yuan/devtools-hub.git
cd devtools-hub

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Open http://localhost:5173 in your browser
```

### 📦 Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **React 18** | UI library with hooks and concurrent features |
| **TypeScript** | Type-safe JavaScript development |
| **Vite 5** | Lightning-fast build tool and dev server |
| **Tailwind CSS** | Utility-first CSS framework |
| **React Router v6** | Client-side routing |
| **Zustand** | Lightweight state management |
| **Lucide React** | Beautiful, consistent icons |

---

## 📁 Project Structure

```
devtools-hub/
├── 📁 public/              # Static assets
├── 📁 src/
│   ├── 📁 components/      # Reusable components
│   │   ├── 📁 layout/      # Layout components (ToolLayout, etc.)
│   │   └── 📁 ui/          # UI primitives
│   ├── 📁 pages/           # Tool pages (one per tool)
│   ├── 📁 config/          # Tool configurations
│   ├── 📁 stores/          # Zustand state stores
│   ├── 📁 hooks/           # Custom React hooks
│   └── 📁 utils/           # Utility functions
├── 📄 index.html
├── 📄 package.json
├── 📄 tailwind.config.js
├── 📄 tsconfig.json
└── 📄 vite.config.ts
```

---

## 🤝 Contributing

We ❤️ contributions! Whether you're fixing a bug, adding a new tool, or improving documentation, your help is welcome.

### 🎯 What We're Looking For

- 🆕 **New Tools** — Have an idea for a useful developer tool? [Open an issue](https://github.com/Casey-yuan/devtools-hub/issues) to discuss!
- 🐛 **Bug Fixes** — Found something broken? We'd love your fix!
- 🎨 **UI/UX Improvements** — Help us make the interface even better
- 🌍 **Translations** — Help translate to more languages
- 📖 **Documentation** — Improve README, add examples, write tutorials

### 🚀 How to Contribute

1. **Fork** the repository
2. **Create** your feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** your changes: `git commit -m 'Add amazing feature'`
4. **Push** to the branch: `git push origin feature/amazing-feature`
5. **Open** a [Pull Request](https://github.com/Casey-yuan/devtools-hub/pulls)

### 📋 Contribution Guidelines

- Follow the existing code style and patterns
- Add TypeScript types for all new code
- Test your changes locally before submitting
- Update documentation if needed
- Be respectful and constructive in discussions

### 💡 Tool Ideas

Have an idea for a new tool? Here are some we're considering:

- [ ] CSV to JSON/Excel converter
- [ ] JSON Schema generator
- [ ] Code minifier (JS/CSS/HTML)
- [ ] Lorem ipsum generator
- [ ] QR Code generator
- [ ] Barcode generator
- [ ] Color palette generator
- [ ] CSS box-shadow generator
- [ ] Flexbox/Grid playground
- [ ] API mock generator

[Open an issue](https://github.com/Casey-yuan/devtools-hub/issues/new) to suggest your idea!

---

## 🗺️ Roadmap

- [ ] **PWA Support** — Install as desktop/mobile app
- [ ] **Tool Favorites** — Pin your most-used tools
- [ ] **History** — Recent conversions and results
- [ ] **Keyboard Shortcuts** — Power-user features
- [ ] **Plugin System** — Allow custom tool extensions
- [ ] **Cloud Sync** — Optional account for settings sync

---

## 💬 Community & Support

- 🐛 **Found a bug?** [Open an issue](https://github.com/Casey-yuan/devtools-hub/issues)
- 💡 **Have an idea?** [Start a discussion](https://github.com/Casey-yuan/devtools-hub/discussions)
- ❓ **Need help?** Check existing issues or start a new discussion

---

## ⭐ Show Your Support

If you find DevTools Hub useful, please consider:

- ⭐ **Starring** this repository
- � **Sharing** on social media
- 📝 **Blogging** about your experience
- 🤝 **Contributing** to the project

Your support helps us grow and improve!

---

## �📄 License

This project is licensed under the [MIT License](LICENSE) — feel free to use it for personal or commercial projects.

---

## 🙏 Acknowledgments

Special thanks to these amazing open-source projects:

- [React](https://react.dev/) — The library for web and native user interfaces
- [Vite](https://vitejs.dev/) — Next generation frontend tooling
- [Tailwind CSS](https://tailwindcss.com/) — Utility-first CSS framework
- [Lucide Icons](https://lucide.dev/) — Beautiful & consistent icons
- [Zustand](https://github.com/pmndrs/zustand) — Bear necessities for state management

---

<p align="center">
  Made with ❤️ by developers, for developers
</p>

<p align="center">
  <a href="https://Casey-yuan.github.io/devtools-hub/">🌐 Try DevTools Hub</a>
</p>
