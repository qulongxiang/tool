import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ConfigProvider } from "antd";
import zhCN from "antd/locale/zh_CN";
import { lazy, Suspense, ComponentType } from "react";
import Layout from "./components/Layout";

type PageModule = { default: ComponentType<any> };

// 🔥 升级：扫描 pages 下所有文件（包括子目录，如 test/qlx）
const pageFiles = import.meta.glob<PageModule>("./pages/**/*.tsx");

// 🔥 全自动生成路由（支持多级目录 /test/qlx）
const autoRoutes = Object.entries(pageFiles).map(([filePath, importer]) => {
  // 提取路径：pages/test/Qlx.tsx → test/Qlx
  const routePath = filePath
    .replace("./pages/", "")
    .replace(".tsx", "")
    // 驼峰转横杠 Qlx → qlx
    .replace(/([A-Z])/g, "-$1")
    .toLowerCase()
    // 移除开头多余的 -
    .replace(/^-/, "");

  const LazyComponent = lazy(importer);

  // Home 作为首页
  if (routePath === "home") {
    return { index: true, element: <LazyComponent /> };
  }

  return { path: routePath, element: <LazyComponent /> };
});

function App() {
  return (
    <ConfigProvider
      locale={zhCN}
      theme={{ token: { colorPrimary: "#1677ff", borderRadius: 8 } }}
    >
      <BrowserRouter>
        <Suspense fallback={<div style={{ textAlign: 'center', marginTop: 50 }}>加载中...</div>}>
          <Routes>
            <Route path="/" element={<Layout />}>
              {autoRoutes.map((route, i) => <Route key={i} {...route} />)}
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ConfigProvider>
  );
}

export default App;