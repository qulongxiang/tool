// 1. 从 React 核心库中导入「严格模式」组件
import { StrictMode } from "react";

// 2. 从 React-DOM 中导入「创建根节点」的API（React18新特性）
import { createRoot } from "react-dom/client";

// 3. 导入全局CSS样式（整个项目的公共样式）
import "./index.css";

// 4. 导入项目的「根组件App」（所有页面/功能都在这里）
import App from "./App.tsx";

// 5. 核心逻辑：把React应用渲染到index.html的#root容器中
createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<App />
	</StrictMode>
);