import { Hono } from "hono";
import { serveStatic } from "hono/cloudflare-workers";

// 模板自带的 Env 类型
type Env = {
  __STATIC_CONTENT: KVNamespace;
};

const app = new Hono<{ Bindings: Env }>();

// ==============================================
// 1. 【最高优先级】API 接口（写在最前面！）
// ==============================================
app.get("/api", (c) => c.json({ status: "ok", name: "Cloudflare" }));
app.get("/api/", (c) => c.json({ status: "ok", name: "Cloudflare" }));

// ==============================================
// 2. 【最后】静态文件（React前端）
// ==============================================
app.get("*", serveStatic());

export default app;