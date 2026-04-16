import { Hono } from "hono";

// 官方模板自带类型，必须保留
type Env = {
	// 由 vite-plugin 自动注入
	ASSETS: Fetcher;
};

// 初始化 Hono
const app = new Hono<{ Bindings: Env }>();

// ==============================================
// 👇 【核心】API 写在最前面！！！（官方模板这里写反了）
// ==============================================
app.get("/api/", (c) => {
	return c.json({ name: "Cloudflare" });
});

// ==============================================
// 👇 官方原版：最后处理前端页面（自动托管 React）
// ==============================================
app.get("*", (c) => {
	return c.env.ASSETS.fetch(c.req.raw);
});

export default app;