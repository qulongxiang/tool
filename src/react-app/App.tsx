// 1. 导入路由核心模块（页面跳转专用）
import { BrowserRouter, Routes, Route } from "react-router-dom";
// 2. 导入Ant Design全局配置组件
import { ConfigProvider } from "antd";
// 3. 导入Ant Design中文语言包
import zhCN from "antd/locale/zh_CN";

// 4. 导入公共布局组件（头部+底部）
import Layout from "./components/Layout";
// 5. 导入所有页面组件
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import PdfMerge from "./pages/PdfMerge";

// 定义根组件 App
function App() {
  return (
    /* 第一部分：Ant Design 全局配置 */
    <ConfigProvider
      locale={zhCN}          // 全局使用中文
      theme={{
        token: {
          colorPrimary: "#1677ff", // 全局主题色（蓝色）
          borderRadius: 8,        // 全局圆角 8px
        },
      }}
    >
      {/* ========== 第二部分：路由配置（页面切换） ========== */}
      <BrowserRouter>  {/* 路由根容器：开启单页应用路由功能 */}
        <Routes>       {/* 路由列表容器 */}
          
          {/* 嵌套路由：所有页面都共用 Layout 布局（头部+底部） */}
          <Route path="/" element={<Layout />}>
            
            {/* 默认首页：访问 / 时渲染 Home 页面 */}
            <Route index element={<Home />} />
            
            {/* 关于页面：访问 /about 时渲染 About 页面 */}
            <Route path="about" element={<About />} />
            
            {/* 联系我们：访问 /contact 时渲染 Contact 页面 */}
            <Route path="contact" element={<Contact />} />
            
            {/* PDF合并工具：访问 /pdf-merge 时渲染 PdfMerge 页面 */}
            <Route path="pdf-merge" element={<PdfMerge />} />
            
          </Route>

        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
}

// 导出组件，供 main.tsx 引入使用
export default App;