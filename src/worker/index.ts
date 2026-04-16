import { Hono } from "hono";

type Env = {
	ASSETS: Fetcher;
};

const app = new Hono<{ Bindings: Env }>();

// ==============================================
// 【强制拦截】所有 /api 开头的请求！优先级最高！
// ==============================================
app.all('/api/*', (c) => {
  return c.json({ 
    status: "success",
    name: "Cloudflare" 
  });
});

// ==============================================
// 【最后】其他所有路径返回前端页面 111 33
// ==============================================
app.get("*", (c) => {
	return c.env.ASSETS.fetch(c.req.raw);
});

export default app;