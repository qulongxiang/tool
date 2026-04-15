import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { cloudflare } from "@cloudflare/vite-plugin";

export default defineConfig({
	plugins: [
		react(),
		// 👇 只修改这里：指定 worker 入口文件
		cloudflare({
			worker: {
				entry: "src/worker/index.ts" // 明确告诉插件：后端在这里！
			}
		})
	],
});