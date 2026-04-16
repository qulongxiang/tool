import { Hono } from "hono";
import { serveStatic } from 'hono/cloudflare-workers'

// 定义Env类型（模板自带，必须保留）
type Env = {
  // 你的环境变量（模板默认）
}

// 初始化Hono
const app = new Hono<{ Bindings: Env }>()

// ==============================================
// 👇 第一步：先写所有 API 接口（优先级最高！）
// ==============================================
app.get("/api", (c) => c.json({ name: "Cloudflare API 正常运行！" }));
app.get("/api/", (c) => c.json({ name: "Cloudflare API 正常运行！" }));
app.post("/api/test", (c) => c.json({ msg: "POST接口正常" }));

// ==============================================
// 👇 第二步：最后才返回前端页面（除了/api都走这里）
// ==============================================
app.get("*", serveStatic({ root: './' }))

// 导出（模板默认）
export default app