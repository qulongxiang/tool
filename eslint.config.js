import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";

export default tseslint.config(
	{ ignores: ["dist"] }, // 👈 不检查 dist 打包文件夹
	{
		// 继承官方推荐的 JS + TS 规范
		extends: [js.configs.recommended, ...tseslint.configs.recommended],
		// 只检查 .ts .tsx 文件
		files: ["**/*.{ts,tsx}"],
		languageOptions: {
			ecmaVersion: 2020,
			globals: globals.browser, // 👈 浏览器环境（window/document）
		},
		// 插件：增强 React 检查
		plugins: {
			"react-hooks": reactHooks,       // 检查 Hooks 用法
			"react-refresh": reactRefresh,    // React 热更新规范
		},
		// 具体规则
		rules: {
			...reactHooks.configs.recommended.rules,
			"react-refresh/only-export-components": ["warn"],
		},
	},
);