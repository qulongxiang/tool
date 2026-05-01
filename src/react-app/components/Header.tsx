import { Layout, Menu } from "antd";
import { SettingOutlined } from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";

const { Header: AntHeader } = Layout;

const navItems = [
  { key: "/", label: "首页" },
  { key: "/about", label: "关于我们" },
  { key: "/contact", label: "联系我们" },
  { key: "/pdf-merge", label: "PDF工具" },
];

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();

  const currentKey = navItems.find(
    (item) => item.key === location.pathname
  )?.key || "/";

  return (
    <AntHeader
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: "#001529",
        padding: "0 50px",
        position: "sticky",
        top: 0,
        zIndex: 1000,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          color: "#fff",
          fontSize: 20,
          fontWeight: "bold",
          cursor: "pointer",
          marginRight: 40,
          whiteSpace: "nowrap",
        }}
        onClick={() => navigate("/")}
      >
        <SettingOutlined />
        Linux Tool
      </div>
      <Menu
        theme="dark"
        mode="horizontal"
        selectedKeys={[currentKey]}
        items={navItems}
        onClick={({ key }) => navigate(key)}
        style={{ flex: 1, minWidth: 0, borderBottom: "none" }}
      />
    </AntHeader>
  );
}
