import { Typography, Row, Col, Card } from "antd";
import {
  AimOutlined,
  EyeOutlined,
  HeartOutlined,
} from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;

const missions = [
  {
    icon: <AimOutlined />,
    title: "我们的使命",
    desc: "简化复杂的系统配置过程，让开发者能够专注于代码本身，而不是环境搭建。我们相信好的工具应该让开发变得更简单、更高效。",
  },
  {
    icon: <EyeOutlined />,
    title: "我们的愿景",
    desc: "成为全球开发者首选的 Linux 开发工具平台，推动开源社区发展，构建更加开放、协作的技术生态。",
  },
  {
    icon: <HeartOutlined />,
    title: "核心价值",
    desc: "开源、创新、协作、卓越。我们坚持开源精神，持续创新，与社区共同成长，追求极致的用户体验。",
  },
];

const team = [
  { name: "陈明", role: "创始人 & CEO", desc: "10年+ Linux 系统开发经验，前大厂技术专家" },
  { name: "刘芳", role: "技术总监", desc: "全栈开发专家，开源社区活跃贡献者" },
  { name: "赵强", role: "产品经理", desc: "专注开发者体验，打造极致产品" },
  { name: "孙丽", role: "UI/UX 设计师", desc: "追求简洁优雅的设计美学" },
];

const timeline = [
  { year: "2020年", desc: "项目启动，发布第一个版本" },
  { year: "2021年", desc: "用户突破 1000，获得开源社区认可" },
  { year: "2022年", desc: "推出云端部署功能，支持全球 CDN" },
  { year: "2023年", desc: "用户突破 10000，成为热门开源项目" },
];

export default function About() {
  return (
    <>
      {/* Hero */}
      <section style={{ background: "linear-gradient(135deg, #1677ff 0%, #0958d9 100%)", padding: "80px 0", textAlign: "center" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px" }}>
          <Title level={1} style={{ color: "#fff", marginBottom: 8 }}>
            关于 Linux Tool
          </Title>
          <Paragraph style={{ color: "rgba(255,255,255,0.9)", fontSize: 18 }}>
            为开发者而生的高效工具集
          </Paragraph>
        </div>
      </section>

      {/* 使命与愿景 */}
      <section style={{ padding: "80px 0", background: "#fff" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px" }}>
          <Row gutter={[24, 24]}>
            {missions.map((m, i) => (
              <Col key={i} xs={24} md={8}>
                <Card hoverable style={{ textAlign: "center", height: "100%" }}>
                  <div style={{ fontSize: 48, color: "#1677ff", marginBottom: 16 }}>{m.icon}</div>
                  <Title level={3}>{m.title}</Title>
                  <Text type="secondary">{m.desc}</Text>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* 项目介绍 */}
      <section style={{ padding: "100px 0", background: "#f5f5f5" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px" }}>
          <Row gutter={[60, 40]} align="middle">
            <Col xs={24} md={12}>
              <Title level={2}>项目介绍</Title>
              <Paragraph type="secondary" style={{ fontSize: 16 }}>
                Linux Tool 是一个开源项目，旨在为开发者提供便捷的 Linux 环境配置和管理工具。我们整合了业界最佳实践，打造了一套完整的开发工作流解决方案。
              </Paragraph>
              <Paragraph type="secondary" style={{ fontSize: 16 }}>
                从项目初始化到云端部署，从性能优化到实时监控，Linux Tool 覆盖了开发的每一个环节，让您能够专注于业务逻辑的实现。
              </Paragraph>
              <Row gutter={40} style={{ marginTop: 30 }}>
                <Col>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 32, fontWeight: 700, color: "#1677ff" }}>2020</div>
                    <Text type="secondary">项目成立</Text>
                  </div>
                </Col>
                <Col>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 32, fontWeight: 700, color: "#1677ff" }}>100+</div>
                    <Text type="secondary">贡献者</Text>
                  </div>
                </Col>
                <Col>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 32, fontWeight: 700, color: "#1677ff" }}>500+</div>
                    <Text type="secondary">GitHub Stars</Text>
                  </div>
                </Col>
              </Row>
            </Col>
            <Col xs={24} md={12}>
              <div style={{ background: "#2d2d2d", borderRadius: 8, overflow: "hidden", boxShadow: "0 10px 30px rgba(0,0,0,0.12)" }}>
                <div style={{ background: "#1a1a1a", padding: "12px 15px", display: "flex", gap: 8 }}>
                  <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#ff5f56" }} />
                  <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#ffbd2e" }} />
                  <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#27c93f" }} />
                </div>
                <pre style={{ padding: 20, margin: 0, color: "#f8f8f2", fontFamily: "monospace", lineHeight: 1.8 }}>
                  <code>{`# 快速开始
$ npm install linux-tool
$ npx linux-tool init
$ npm run dev

# 一键部署
$ npm run deploy`}</code>
                </pre>
              </div>
            </Col>
          </Row>
        </div>
      </section>

      {/* 团队介绍 */}
      <section style={{ padding: "100px 0", background: "#fff" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px" }}>
          <Title level={2} style={{ textAlign: "center", marginBottom: 8 }}>
            核心团队
          </Title>
          <Paragraph style={{ textAlign: "center", color: "#666", marginBottom: 50, fontSize: 16 }}>
            由一群热爱开源和 Linux 系统的开发者组成
          </Paragraph>
          <Row gutter={[24, 24]}>
            {team.map((t, i) => (
              <Col key={i} xs={24} sm={12} md={6}>
                <Card hoverable style={{ textAlign: "center" }}>
                  <div
                    style={{
                      width: 100,
                      height: 100,
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #1677ff 0%, #0958d9 100%)",
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 32,
                      fontWeight: "bold",
                      margin: "0 auto 20px",
                    }}
                  >
                    {t.name[0]}
                  </div>
                  <Title level={4}>{t.name}</Title>
                  <Text style={{ color: "#1677ff", fontWeight: 500, display: "block", marginBottom: 8 }}>
                    {t.role}
                  </Text>
                  <Text type="secondary">{t.desc}</Text>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* 发展历程 */}
      <section style={{ padding: "100px 0", background: "#f5f5f5" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px" }}>
          <Title level={2} style={{ textAlign: "center", marginBottom: 8 }}>
            发展历程
          </Title>
          <Paragraph style={{ textAlign: "center", color: "#666", marginBottom: 50, fontSize: 16 }}>
            我们的成长足迹
          </Paragraph>
          <div style={{ maxWidth: 800, margin: "0 auto", position: "relative" }}>
            {/* 时间线竖线 */}
            <div
              style={{
                position: "absolute",
                left: "50%",
                transform: "translateX(-50%)",
                width: 3,
                height: "100%",
                background: "#1677ff",
              }}
            />
            {timeline.map((t, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  marginBottom: 40,
                  position: "relative",
                  justifyContent: i % 2 === 0 ? "flex-start" : "flex-end",
                  paddingLeft: i % 2 === 0 ? 0 : "calc(50% + 30px)",
                  paddingRight: i % 2 === 0 ? "calc(50% + 30px)" : 0,
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: 20,
                    height: 20,
                    background: "#1677ff",
                    borderRadius: "50%",
                    border: "4px solid #fff",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
                  }}
                />
                <Card style={{ width: "100%" }}>
                  <Title level={4} style={{ color: "#1677ff", marginBottom: 8 }}>
                    {t.year}
                  </Title>
                  <Text type="secondary">{t.desc}</Text>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: "linear-gradient(135deg, #1677ff 0%, #0958d9 100%)", padding: "80px 0", textAlign: "center" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px" }}>
          <Title level={2} style={{ color: "#fff", marginBottom: 16 }}>
            加入我们
          </Title>
          <Paragraph style={{ color: "rgba(255,255,255,0.9)", fontSize: 18, marginBottom: 32 }}>
            一起构建更好的开发体验
          </Paragraph>
        </div>
      </section>
    </>
  );
}
