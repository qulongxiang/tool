import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { cloudflare } from "@cloudflare/vite-plugin";

export default defineConfig(({ command, mode }) => ({
	plugins: [
		react(),
		// 只在 dev 和 build 模式启用 cloudflare 插件,preview 时禁用
		...(command === "serve" && mode !== "production" ? [cloudflare()] : []),
		...(command === "build" ? [cloudflare()] : [])
	],
	preview: {
		port: 4173,
		strictPort: false
	}
}));