
# 项目框架（最终定论）
## 🔥 整体定位
**全栈 Web 项目（前后端一体）**
基于 **React + Vite + Hono + Cloudflare Workers** 构建的现代化工具站

---

## 前端框架（src/react-app/）
1. **核心框架**：**React 18**（UI 开发）
2. **语言**：**TypeScript**（类型安全）
3. **构建工具**：**Vite**（极速编译）
4. **UI 组件库**：**Ant Design**（导航、按钮、布局等）
5. **路由**：**React Router**（页面切换：首页/关于/PDF工具）

---

## 后端框架（src/worker/）
1. **运行平台**：**Cloudflare Workers**（无服务器）
2. **Web 框架**：**Hono**（轻量、快，类似 Express）
3. **核心库**：**pdf-lib**（PDF 合并处理）

---

## 一句话概括（最好记）
**Vite + React + TypeScript + Ant Design + Hono + Cloudflare Workers**
✅ 前端：React 全家桶
✅ 后端：Hono + 无服务器
✅ 部署：Cloudflare 全球节点


# 运行
```
npm config set registry https://registry.npmmirror.com/
npm install
npm run dev

查看项目结构
tree -I ".wrangler|node_modules"
```

# 项目结构
```
.
├── README.md               # 项目说明文档
├── eslint.config.js        # 代码规范检查配置
├── index.html              # 前端唯一入口HTML（Vite）
├── package-lock.json       # 依赖版本锁定
├── package.json            # 项目命令+依赖配置
├── public                  # 公共静态资源
│   └── vite.svg
├── src                     # 核心源码（前后端都在这里）
│   ├── react-app           # ✅ 前端：React 全量代码
│   │   ├── App.css         # 组件样式
│   │   ├── App.tsx         # 路由配置（首页/关于/PDF工具）
│   │   ├── assets          # 项目图片/图标资源
│   │   ├── components      # 公共组件（导航/页脚/布局）
│   │   ├── index.css       # 全局样式
│   │   ├── main.tsx        # 前端项目入口
│   │   ├── pages           # 所有业务页面
│   │   └── vite-env.d.ts   # Vite类型声明
│   └── worker              # ✅ 后端：Cloudflare Workers
│       └── index.ts        # Hono框架+PDF合并API接口
├── style.css               # 全局样式文件
├── tsconfig.*.json         # TypeScript 全套配置
├── vite.config.ts          # Vite构建/代理配置
├── worker-configuration.d.ts
└── wrangler.json           # Cloudflare部署配置
```


[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/cloudflare/templates/tree/main/vite-react-template)

This template provides a minimal setup for building a React application with TypeScript and Vite, designed to run on Cloudflare Workers. It features hot module replacement, ESLint integration, and the flexibility of Workers deployments.

![React + TypeScript + Vite + Cloudflare Workers](https://imagedelivery.net/wSMYJvS3Xw-n339CbDyDIA/fc7b4b62-442b-4769-641b-ad4422d74300/public)

<!-- dash-content-start -->

🚀 Supercharge your web development with this powerful stack:

- [**React**](https://react.dev/) - A modern UI library for building interactive interfaces
- [**Vite**](https://vite.dev/) - Lightning-fast build tooling and development server
- [**Hono**](https://hono.dev/) - Ultralight, modern backend framework
- [**Cloudflare Workers**](https://developers.cloudflare.com/workers/) - Edge computing platform for global deployment

### ✨ Key Features

- 🔥 Hot Module Replacement (HMR) for rapid development
- 📦 TypeScript support out of the box
- 🛠️ ESLint configuration included
- ⚡ Zero-config deployment to Cloudflare's global network
- 🎯 API routes with Hono's elegant routing
- 🔄 Full-stack development setup
- 🔎 Built-in Observability to monitor your Worker

Get started in minutes with local development or deploy directly via the Cloudflare dashboard. Perfect for building modern, performant web applications at the edge.

<!-- dash-content-end -->

## Getting Started

To start a new project with this template, run:

```bash
npm create cloudflare@latest -- --template=cloudflare/templates/vite-react-template
```

A live deployment of this template is available at:
[https://react-vite-template.templates.workers.dev](https://react-vite-template.templates.workers.dev)

## Development

Install dependencies:

```bash
npm install
```

Start the development server with:

```bash
npm run dev
```

Your application will be available at [http://localhost:5173](http://localhost:5173).

## Production

Build your project for production:

```bash
npm run build
```

Preview your build locally:

```bash
npm run preview
```

Deploy your project to Cloudflare Workers:

```bash
npm run build && npm run deploy
```

Monitor your workers:

```bash
npx wrangler tail
```

## Additional Resources

- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)
- [Vite Documentation](https://vitejs.dev/guide/)
- [React Documentation](https://reactjs.org/)
- [Hono Documentation](https://hono.dev/)
