import { Layout, Row, Col, Typography, Space } from "antd";
import { Link } from "react-router-dom";

const { Footer: AntFooter } = Layout;
const { Title, Text } = Typography;

export default function Footer() {
  return (
    <AntFooter style={{ background: "#001529", color: "#aaa", padding: "60px 50px 20px" }}>
      <Row gutter={[40, 40]} justify="center">
        <Col xs={24} sm={12} md={6}>
          <Title level={4} style={{ color: "#fff" }}>
            Linux Tool
          </Title>
          <Text style={{ color: "#aaa" }}>
            为开发者打造的高效 Linux 开发工具集
          </Text>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Title level={5} style={{ color: "#fff" }}>
            产品
          </Title>
          <Space direction="vertical">
            <Link to="/#features" style={{ color: "#aaa" }}>
              功能特性
            </Link>
            <Link to="/pdf-merge" style={{ color: "#aaa" }}>
              PDF工具
            </Link>
            <Link to="#" style={{ color: "#aaa" }}>
              更新日志
            </Link>
          </Space>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Title level={5} style={{ color: "#fff" }}>
            资源
          </Title>
          <Space direction="vertical">
            <Link to="#" style={{ color: "#aaa" }}>
              文档中心
            </Link>
            <Link to="#" style={{ color: "#aaa" }}>
              API 参考
            </Link>
            <Link to="#" style={{ color: "#aaa" }}>
              社区论坛
            </Link>
          </Space>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Title level={5} style={{ color: "#fff" }}>
            关于
          </Title>
          <Space direction="vertical">
            <Link to="/about" style={{ color: "#aaa" }}>
              关于我们
            </Link>
            <Link to="/contact" style={{ color: "#aaa" }}>
              联系我们
            </Link>
            <Link to="#" style={{ color: "#aaa" }}>
              隐私政策
            </Link>
          </Space>
        </Col>
      </Row>
      <div
        style={{
          textAlign: "center",
          paddingTop: 30,
          marginTop: 40,
          borderTop: "1px solid #333",
        }}
      >
        <Text style={{ color: "#aaa" }}>
          &copy; 2023 Linux Tool Project. All rights reserved.
        </Text>
      </div>
    </AntFooter>
  );
}
