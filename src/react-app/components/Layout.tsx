// 导入Ant Design的布局组件，并重命名为 AntLayout（避免名字冲突）
import { Layout as AntLayout } from "antd";
// 导入路由插槽：这是子页面渲染的核心！
import { Outlet } from "react-router-dom";
// 导入顶部导航、底部页脚
import Header from "./Header";
import Footer from "./Footer";

// 从 AntLayout 中解构出 Content 组件（中间内容区）
const { Content } = AntLayout;

export default function Layout() {
  return (
    // 整个页面的最外层容器，最小高度占满屏幕
    <AntLayout style={{ minHeight: "100vh" }}>

      {/* 🔥 1. 顶部导航栏 —— 所有页面永远显示！ */}
      <Header />

      {/* 🔥 2. 中间内容区域 */}
      <Content>
        {/* ✅ 核心中的核心：子页面渲染位置 */}
        <Outlet /> 
      </Content>

      {/* 🔥 3. 底部页脚 —— 所有页面永远显示！ */}
      <Footer />

    </AntLayout>
  );
}