// 1. 导入 Ant Design 组件：Layout(布局)、Menu(菜单)
import { Layout, Menu } from "antd";
// 导入 Ant Design 图标：设置图标
import { HomeOutlined } from "@ant-design/icons";
// 导入路由钩子：
// useLocation = 获取当前浏览器地址栏路径
// useNavigate = 编程式跳转页面
import { useLocation, useNavigate } from "react-router-dom";

// 从 Layout 里解构出 Header，并重命名为 AntHeader（避免名字冲突）
const { Header: AntHeader } = Layout;

// 🔥 导航菜单配置（核心数据）
// key = 路由地址 ｜ label = 菜单显示文字
const navItems = [
  { key: "/", label: "首页" },
  {
    key: "about",
    label: "关于我们",
    children: [
      { key: "/about", label: "公司介绍" },
      { key: "/about/team", label: "团队成员" },
    ],
  },
  {
    key: "test",
    label: "测试中心",
    children: [
      { key: "/test/qlx", label: "qlx" },
      {
        key: "sub-test",
        label: "子测试菜单",
        children: [
          { key: "/test/sub1", label: "子页面1" },
          { key: "/test/sub2", label: "子页面2" },
        ],
      },
    ],
  },
  { key: "/contact", label: "联系我们" },
  { key: "/pdf-merge", label: "PDF工具" },
];
// 导出 Header 组件
export default function Header() {
  // 获取当前页面地址（比如 /about / 等）
  const location = useLocation();
  // 获取跳转函数（用来点击菜单跳页）
  const navigate = useNavigate();

  // 开始渲染导航栏
  return (
    // Ant Design 顶部导航容器
    <AntHeader
      style={{
        display: "flex",                  // 弹性布局
        alignItems: "center",             // 垂直居中
        justifyContent: "space-between",  // 左右分开
        background: "#001529",            // 深色背景
        padding: "0 50px",                // 内边距
        position: "sticky",               // 固定顶部
        top: 0,
        zIndex: 1000,                     // 置顶不被遮挡
      }}
    >
      {/* 左侧：Logo + 标题 */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,           // 图标和文字间距
          color: "#fff",     // 白色文字
          fontSize: 20,
          fontWeight: "bold",
          cursor: "pointer", // 鼠标变小手
          marginRight: 40,
          whiteSpace: "nowrap",
        }}
        onClick={() => navigate("/")}  // 点击跳回首页
      >
        <HomeOutlined />
        Linux Tool            {/* 网站标题 */}
      </div>
      {/* 🔥 右侧：导航菜单 */}
      <Menu
        theme="dark"         // 深色主题
        mode="horizontal"    // 横向菜单
        selectedKeys={[location.pathname]}  // 自动高亮当前页面
        items={navItems}     // 菜单数据（上面定义的数组）
        onClick={({ key }) => navigate(key)}  // 点击菜单跳转
        style={{ flex: 1, minWidth: 0, borderBottom: "none" }}
      />
    </AntHeader>
  );
}