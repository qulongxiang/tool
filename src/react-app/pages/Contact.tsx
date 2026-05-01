import { Typography, Row, Col, Card, Form, Input, Select, Button, Space } from "antd";
import {
  MailOutlined,
  MessageOutlined,
  GithubOutlined,
  GlobalOutlined,
} from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const contactMethods = [
  { icon: <MailOutlined />, title: "电子邮件", desc: "发送邮件至我们的支持团队", link: "support@linuxtool.com", href: "mailto:support@linuxtool.com" },
  { icon: <MessageOutlined />, title: "在线聊天", desc: "工作日 9:00-18:00 实时响应", link: "开始聊天", href: "#" },
  { icon: <GithubOutlined />, title: "GitHub", desc: "提交 Issue 或参与讨论", link: "github.com/linux-tool", href: "#" },
  { icon: <GlobalOutlined />, title: "社区论坛", desc: "与其他开发者交流经验", link: "访问论坛", href: "#" },
];

const faqs = [
  { q: "如何开始使用 Linux Tool？", a: "您可以通过 npm 安装 Linux Tool，然后运行初始化命令即可快速开始。查看我们的快速入门指南了解更多详情。" },
  { q: "Linux Tool 是否免费？", a: "是的，Linux Tool 是开源免费的工具。我们也提供企业版服务，包含更多高级功能和专业支持。" },
  { q: "如何贡献代码？", a: "欢迎您在 GitHub 上 Fork 项目，提交 Pull Request。请先阅读我们的贡献指南了解详细流程。" },
  { q: "遇到技术问题怎么办？", a: "您可以在 GitHub Issues 中搜索类似问题，或者提交新的 Issue。我们的社区和技术团队会尽快为您解答。" },
];

export default function Contact() {
  const [form] = Form.useForm();

  const handleSubmit = (values: Record<string, string>) => {
    console.log("Form values:", values);
    // TODO: 对接后端 API
  };

  return (
    <>
      {/* Hero */}
      <section style={{ background: "linear-gradient(135deg, #1677ff 0%, #0958d9 100%)", padding: "80px 0", textAlign: "center" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px" }}>
          <Title level={1} style={{ color: "#fff", marginBottom: 8 }}>
            联系我们
          </Title>
          <Paragraph style={{ color: "rgba(255,255,255,0.9)", fontSize: 18 }}>
            我们随时为您提供帮助
          </Paragraph>
        </div>
      </section>

      {/* 联系方式 */}
      <section style={{ padding: "80px 0", background: "#fff" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px" }}>
          <Row gutter={[24, 24]}>
            {contactMethods.map((m, i) => (
              <Col key={i} xs={24} sm={12} md={6}>
                <Card hoverable style={{ textAlign: "center", height: "100%" }}>
                  <div style={{ fontSize: 48, color: "#1677ff", marginBottom: 16 }}>{m.icon}</div>
                  <Title level={4}>{m.title}</Title>
                  <Text type="secondary" style={{ display: "block", marginBottom: 12 }}>
                    {m.desc}
                  </Text>
                  <a href={m.href} style={{ color: "#1677ff", fontWeight: 500 }}>
                    {m.link}
                  </a>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* 联系表单 */}
      <section style={{ padding: "80px 0", background: "#f5f5f5" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 20px" }}>
          <Card>
            <div style={{ textAlign: "center", marginBottom: 40 }}>
              <Title level={2}>发送消息</Title>
              <Text type="secondary">填写以下表单，我们会尽快回复您</Text>
            </div>
            <Form form={form} layout="vertical" onFinish={handleSubmit}>
              <Row gutter={20}>
                <Col xs={24} md={12}>
                  <Form.Item
                    label="姓名"
                    name="name"
                    rules={[{ required: true, message: "请输入您的姓名" }]}
                  >
                    <Input placeholder="请输入您的姓名" size="large" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    label="邮箱"
                    name="email"
                    rules={[
                      { required: true, message: "请输入您的邮箱" },
                      { type: "email", message: "请输入有效的邮箱地址" },
                    ]}
                  >
                    <Input placeholder="example@email.com" size="large" />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item label="主题" name="subject">
                <Select placeholder="请选择主题" size="large">
                  <Select.Option value="general">一般咨询</Select.Option>
                  <Select.Option value="support">技术支持</Select.Option>
                  <Select.Option value="feature">功能建议</Select.Option>
                  <Select.Option value="bug">问题反馈</Select.Option>
                  <Select.Option value="business">商务合作</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item
                label="消息内容"
                name="message"
                rules={[{ required: true, message: "请输入消息内容" }]}
              >
                <TextArea rows={6} placeholder="请详细描述您的问题或建议..." />
              </Form.Item>
              <Form.Item>
                <Space direction="vertical" style={{ width: "100%" }} align="center">
                  <Button type="primary" htmlType="submit" size="large">
                    发送消息
                  </Button>
                  <Text type="secondary">我们将在 24 小时内回复您的消息</Text>
                </Space>
              </Form.Item>
            </Form>
          </Card>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: "100px 0", background: "#fff" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px" }}>
          <Title level={2} style={{ textAlign: "center", marginBottom: 8 }}>
            常见问题
          </Title>
          <Paragraph style={{ textAlign: "center", color: "#666", marginBottom: 50, fontSize: 16 }}>
            快速找到您需要的答案
          </Paragraph>
          <div style={{ maxWidth: 800, margin: "0 auto" }}>
            {faqs.map((f, i) => (
              <Card key={i} style={{ marginBottom: 16 }}>
                <Title level={5} style={{ color: "#1677ff", marginBottom: 8 }}>
                  {f.q}
                </Title>
                <Text type="secondary">{f.a}</Text>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: "linear-gradient(135deg, #1677ff 0%, #0958d9 100%)", padding: "80px 0", textAlign: "center" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px" }}>
          <Title level={2} style={{ color: "#fff", marginBottom: 16 }}>
            准备好开始了吗？
          </Title>
          <Paragraph style={{ color: "rgba(255,255,255,0.9)", fontSize: 18, marginBottom: 32 }}>
            立即体验 Linux Tool 的强大功能
          </Paragraph>
          <Button ghost size="large" href="/#quick-start">
            快速开始
          </Button>
        </div>
      </section>
    </>
  );
}
