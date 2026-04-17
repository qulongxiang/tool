import { Hono } from "hono";
import { PDFDocument } from "pdf-lib";

type Env = {
	ASSETS: Fetcher;
};

const app = new Hono<{ Bindings: Env }>();

// A4和Letter纸张尺寸(单位: point)
const PAGE_SIZES: Record<string, { width: number; height: number }> = {
	a4: { width: 595.28, height: 841.89 },
	letter: { width: 612, height: 792 }
};

// ==============================================
// PDF合并API - 多文件版本
// ==============================================
app.post('/api/merge-pdf', async (c) => {
	try {
		const formData = await c.req.formData();

		// 收集所有PDF文件
		const pdfFiles: File[] = [];
		let index = 0;
		while (true) {
			const file = formData.get(`pdf_${index}`);
			if (!file || !(file instanceof File)) break;
			pdfFiles.push(file);
			index++;
		}

		if (pdfFiles.length === 0) {
			return c.json({ error: '请上传至少一个PDF文件' }, 400);
		}

		// 获取配置
		const filesPerPage = parseInt(formData.get('filesPerPage') as string || '2');
		const pageSize = formData.get('pageSize') as string || 'a4';
		const layout = formData.get('layout') as string || 'grid';
		const orientation = formData.get('orientation') as string || 'portrait';

		// 确定页面尺寸
		let pageWidth: number | null = null;
		let pageHeight: number | null = null;

		if (pageSize !== 'auto') {
			const size = PAGE_SIZES[pageSize] || PAGE_SIZES.a4;
			pageWidth = size.width;
			pageHeight = size.height;

			if (orientation === 'landscape') {
				[pageWidth, pageHeight] = [pageHeight, pageWidth];
			}
		}

		// 创建新的PDF文档
		const mergedPdf = await PDFDocument.create();

		// 按每页数量分组
		const groups: File[][] = [];
		for (let i = 0; i < pdfFiles.length; i += filesPerPage) {
			groups.push(pdfFiles.slice(i, i + filesPerPage));
		}

		for (const group of groups) {
			// 加载组内所有PDF
			const pdfPages: { pdf: PDFDocument; page: any; bytes: ArrayBuffer }[] = [];

			for (const file of group) {
				const bytes = await file.arrayBuffer();
				const pdf = await PDFDocument.load(bytes);
				const pages = pdf.getPages();
				if (pages.length > 0) {
					pdfPages.push({ pdf, page: pages[0], bytes });
				}
			}

			if (pdfPages.length === 0) continue;

			// 计算布局行列数
			let cols: number, rows: number;
			if (layout === 'horizontal') {
				cols = pdfPages.length;
				rows = 1;
			} else if (layout === 'vertical') {
				cols = 1;
				rows = pdfPages.length;
			} else {
				// 网格布局
				cols = Math.ceil(Math.sqrt(pdfPages.length));
				rows = Math.ceil(pdfPages.length / cols);
			}

			// 确定最终页面尺寸
			let finalPageWidth = pageWidth;
			let finalPageHeight = pageHeight;

			if (pageSize === 'auto') {
				if (layout === 'horizontal') {
					finalPageWidth = pdfPages.reduce((sum, p) => sum + p.page.getWidth(), 0);
					finalPageHeight = Math.max(...pdfPages.map(p => p.page.getHeight()));
				} else if (layout === 'vertical') {
					finalPageWidth = Math.max(...pdfPages.map(p => p.page.getWidth()));
					finalPageHeight = pdfPages.reduce((sum, p) => sum + p.page.getHeight(), 0);
				} else {
					const maxWidth = Math.max(...pdfPages.map(p => p.page.getWidth()));
					const maxHeight = Math.max(...pdfPages.map(p => p.page.getHeight()));
					finalPageWidth = maxWidth * cols;
					finalPageHeight = maxHeight * rows;
				}
			}

			// 创建新页面
			const newPage = mergedPdf.addPage([finalPageWidth!, finalPageHeight!]);

			// 嵌入并绘制每个PDF
			for (let i = 0; i < pdfPages.length; i++) {
				const { page, bytes } = pdfPages[i];
				const [embeddedPage] = await mergedPdf.embedPdf(bytes, [0]);

				const col = i % cols;
				const row = Math.floor(i / cols);

				const cellWidth = finalPageWidth! / cols;
				const cellHeight = finalPageHeight! / rows;

				const sourceWidth = page.getWidth();
				const sourceHeight = page.getHeight();

				// 计算缩放比例
				const scaleX = cellWidth / sourceWidth;
				const scaleY = cellHeight / sourceHeight;
				const scale = Math.min(scaleX, scaleY);

				const scaledWidth = sourceWidth * scale;
				const scaledHeight = sourceHeight * scale;

				// 居中放置
				const x = col * cellWidth + (cellWidth - scaledWidth) / 2;
				const y = finalPageHeight! - (row + 1) * cellHeight + (cellHeight - scaledHeight) / 2;

				newPage.drawPage(embeddedPage, {
					x,
					y,
					width: scaledWidth,
					height: scaledHeight
				});
			}
		}

		// 保存PDF
		const mergedBytes = await mergedPdf.save();

		// 返回PDF文件
		return new Response(mergedBytes, {
			headers: {
				'Content-Type': 'application/pdf',
				'Content-Disposition': 'attachment; filename="merged.pdf"'
			}
		});

	} catch (error) {
		console.error('PDF merge error:', error);
		return c.json({ error: 'PDF合并失败: ' + (error as Error).message }, 500);
	}
});

// ==============================================
// 【最后】其他所有路径返回前端页面
// ==============================================
app.get("*", (c) => {
	return c.env.ASSETS.fetch(c.req.raw);
});

export default app;
