import { Typography, Button, Row, Col, Card, Space } from "antd";
import {
  SettingOutlined,
  LaptopOutlined,
  CloudOutlined,
  SafetyOutlined,
  RocketOutlined,
  DashboardOutlined,
  FilePdfOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Title, Text, Paragraph } = Typography;

const stats = [
  { number: "10K+", label: "活跃用户" },
  { number: "50+", label: "实用工具" },
  { number: "99%", label: "用户满意度" },
  { number: "24/7", label: "技术支持" },
];

const features = [
  { icon: <SettingOutlined />, title: "快速配置", desc: "一键生成 Wrangler 配置，无需手动编写 JSON，节省宝贵时间。" },
  { icon: <LaptopOutlined />, title: "多语言支持", desc: "完美支持 TypeScript, JavaScript, Python 等多种语言环境。" },
  { icon: <CloudOutlined />, title: "云端部署", desc: "无缝集成 Cloudflare Workers，实现极速全球分发。" },
  { icon: <SafetyOutlined />, title: "安全可靠", desc: "企业级安全标准，数据加密传输，保障您的代码安全。" },
  { icon: <RocketOutlined />, title: "性能优化", desc: "智能缓存策略，自动压缩优化，提升应用加载速度。" },
  { icon: <DashboardOutlined />, title: "实时监控", desc: "全方位监控应用状态，及时发现问题，保障稳定运行。" },
];

const steps = [
  { number: 1, title: "安装工具", desc: "通过 npm 或 yarn 快速安装 Linux Tool", code: "npm install linux-tool" },
  { number: 2, title: "初始化配置", desc: "运行初始化命令，自动生成配置文件", code: "npx linux-tool init" },
  { number: 3, title: "开始开发", desc: "启动开发服务器，开始您的项目", code: "npm run dev" },
];

const testimonials = [
  { content: "Linux Tool 极大地简化了我的工作流程，配置时间减少了 80%！", name: "张三", role: "全栈开发工程师" },
  { content: "界面简洁，功能强大，是我用过最好的 Linux 开发工具。", name: "李四", role: "DevOps 工程师" },
  { content: "云端部署功能太棒了，一键发布到全球 CDN，速度飞快！", name: "王五", role: "前端技术专家" },
];

export default function Home() {
  const navigate = useNavigate();

  return (
    <>
      {/* Hero */}
      <section style={{ background: "linear-gradient(135deg, #1677ff 0%, #0958d9 100%)", padding: "120px 0", textAlign: "center" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px" }}>
          <Title level={1} style={{ color: "#fff", fontSize: 48, marginBottom: 16 }}>
            提升您的 Linux 开发效率
          </Title>
          <Paragraph style={{ color: "rgba(255,255,255,0.9)", fontSize: 20, marginBottom: 40 }}>
            一站式工具集，简化配置，优化工作流，让开发更简单。
          </Paragraph>
          <Space size="middle">
            <Button type="primary" size="large" onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}>
              了解更多
            </Button>
            <Button ghost size="large" onClick={() => document.getElementById("quick-start")?.scrollIntoView({ behavior: "smooth" })}>
              快速开始
            </Button>
          </Space>
        </div>
      </section>

      {/* 统计数据 */}
      <section style={{ background: "#fff", padding: "60px 0" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px" }}>
          <Row gutter={[30, 30]} justify="center">
            {stats.map((s, i) => (
              <Col key={i} xs={12} sm={6}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 48, fontWeight: 700, color: "#1677ff" }}>{s.number}</div>
                  <Text type="secondary">{s.label}</Text>
                </div>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* 功能特性 */}
      <section id="features" style={{ padding: "100px 0", background: "#fff" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px" }}>
          <Title level={2} style={{ textAlign: "center", marginBottom: 8 }}>
            核心功能
          </Title>
          <Paragraph style={{ textAlign: "center", color: "#666", marginBottom: 50, fontSize: 16 }}>
            为您提供全方位的 Linux 开发解决方案
          </Paragraph>
          <Row gutter={[24, 24]}>
            {features.map((f, i) => (
              <Col key={i} xs={24} sm={12} md={8}>
                <Card hoverable style={{ textAlign: "center", height: "100%" }}>
                  <div style={{ fontSize: 48, color: "#1677ff", marginBottom: 16 }}>{f.icon}</div>
                  <Title level={4}>{f.title}</Title>
                  <Text type="secondary">{f.desc}</Text>
                </Card>
              </Col>
            ))}
            {/* PDF 工具卡片 */}
            <Col xs={24} sm={12} md={8}>
              <Card
                hoverable
                style={{
                  textAlign: "center",
                  height: "100%",
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "#fff",
                }}
                onClick={() => navigate("/pdf-merge")}
              >
                <div style={{ fontSize: 48, marginBottom: 16 }}>
                  <FilePdfOutlined />
                </div>
                <Title level={4} style={{ color: "#fff" }}>
                  PDF合并工具
                </Title>
                <Text style={{ color: "rgba(255,255,255,0.8)" }}>
                  在线合并多个PDF文件为一页，支持水平和垂直布局。
                </Text>
                <div style={{ marginTop: 16 }}>
                  <span
                    style={{
                      background: "rgba(255,255,255,0.3)",
                      padding: "4px 16px",
                      borderRadius: 20,
                      fontSize: 13,
                      fontWeight: 600,
                    }}
                  >
                    新工具
                  </span>
                </div>
              </Card>
            </Col>
          </Row>
        </div>
      </section>

      {/* 快速开始 */}
      <section id="quick-start" style={{ padding: "100px 0", background: "#f5f5f5" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px" }}>
          <Title level={2} style={{ textAlign: "center", marginBottom: 8 }}>
            快速开始
          </Title>
          <Paragraph style={{ textAlign: "center", color: "#666", marginBottom: 50, fontSize: 16 }}>
            只需三步，即可开始使用
          </Paragraph>
          <Row gutter={[40, 40]}>
            {steps.map((s, i) => (
              <Col key={i} xs={24} md={8}>
                <Card style={{ textAlign: "center" }}>
                  <div
                    style={{
                      width: 60,
                      height: 60,
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #1677ff 0%, #0958d9 100%)",
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 24,
                      fontWeight: "bold",
                      margin: "0 auto 20px",
                    }}
                  >
                    {s.number}
                  </div>
                  <Title level={4}>{s.title}</Title>
                  <Paragraph type="secondary">{s.desc}</Paragraph>
                  <code
                    style={{
                      display: "block",
                      background: "#2d2d2d",
                      color: "#f8f8f2",
                      padding: 12,
                      borderRadius: 6,
                      fontFamily: "monospace",
                    }}
                  >
                    {s.code}
                  </code>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* 用户评价 */}
      <section style={{ padding: "100px 0", background: "#fff" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px" }}>
          <Title level={2} style={{ textAlign: "center", marginBottom: 8 }}>
            用户评价
          </Title>
          <Paragraph style={{ textAlign: "center", color: "#666", marginBottom: 50, fontSize: 16 }}>
            听听开发者们怎么说
          </Paragraph>
          <Row gutter={[24, 24]}>
            {testimonials.map((t, i) => (
              <Col key={i} xs={24} md={8}>
                <Card>
                  <Paragraph style={{ fontStyle: "italic", fontSize: 16, marginBottom: 20 }}>
                    "{t.content}"
                  </Paragraph>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, #1677ff 0%, #0958d9 100%)",
                        color: "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 18,
                        fontWeight: "bold",
                      }}
                    >
                      {t.name[0]}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600 }}>{t.name}</div>
                      <Text type="secondary">{t.role}</Text>
                    </div>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: "linear-gradient(135deg, #1677ff 0%, #0958d9 100%)", padding: "80px 0", textAlign: "center" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px" }}>
          <Title level={2} style={{ color: "#fff", marginBottom: 16 }}>
            准备好开始了吗？
          </Title>
          <Paragraph style={{ color: "rgba(255,255,255,0.9)", fontSize: 18, marginBottom: 32 }}>
            加入数千名开发者的行列，提升您的开发效率
          </Paragraph>
          <Button size="large" ghost onClick={() => document.getElementById("quick-start")?.scrollIntoView({ behavior: "smooth" })}>
            立即开始
          </Button>
        </div>
      </section>
    </>
  );
}
