import { Layout as AntLayout } from "antd";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

const { Content } = AntLayout;

export default function Layout() {
  return (
    <AntLayout style={{ minHeight: "100vh" }}>
      <Header />
      <Content style={{ background: "#f5f5f5" }}>
        <Outlet />
      </Content>
      <Footer />
    </AntLayout>
  );
}
