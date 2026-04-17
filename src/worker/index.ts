import { Hono } from "hono";
import { PDFDocument } from "pdf-lib";

type Env = {
	ASSETS: Fetcher;
};

const app = new Hono<{ Bindings: Env }>();

// ==============================================
// PDF合并API
// ==============================================
app.post('/api/merge-pdf', async (c) => {
	try {
		const formData = await c.req.formData();
		const pdf1File = formData.get('pdf1') as File;
		const pdf2File = formData.get('pdf2') as File;
		const layout = formData.get('layout') as string || 'horizontal';

		if (!pdf1File || !pdf2File) {
			return c.json({ error: '请上传两个PDF文件' }, 400);
		}

		// 读取PDF文件
		const pdf1Bytes = await pdf1File.arrayBuffer();
		const pdf2Bytes = await pdf2File.arrayBuffer();

		// 加载PDF文档
		const pdf1 = await PDFDocument.load(pdf1Bytes);
		const pdf2 = await PDFDocument.load(pdf2Bytes);

		// 创建新的PDF文档
		const mergedPdf = await PDFDocument.create();

		// 获取两个PDF的第一页尺寸
		const pdf1Pages = pdf1.getPages();
		const pdf2Pages = pdf2.getPages();

		if (pdf1Pages.length === 0 || pdf2Pages.length === 0) {
			return c.json({ error: 'PDF文件必须至少有一页' }, 400);
		}

		const page1 = pdf1Pages[0];
		const page2 = pdf2Pages[0];

		const page1Width = page1.getWidth();
		const page1Height = page1.getHeight();
		const page2Width = page2.getWidth();
		const page2Height = page2.getHeight();

		// 根据布局方式计算新页面尺寸
		let newPageWidth: number, newPageHeight: number;

		if (layout === 'horizontal') {
			// 水平并排
			newPageWidth = page1Width + page2Width;
			newPageHeight = Math.max(page1Height, page2Height);
		} else {
			// 垂直堆叠
			newPageWidth = Math.max(page1Width, page2Width);
			newPageHeight = page1Height + page2Height;
		}

		// 嵌入页面
		const [embeddedPage1] = await mergedPdf.embedPdf(pdf1Bytes, [0]);
		const [embeddedPage2] = await mergedPdf.embedPdf(pdf2Bytes, [0]);

		// 创建新页面
		const newPage = mergedPdf.addPage([newPageWidth, newPageHeight]);

		if (layout === 'horizontal') {
			// 水平并排 - 左右放置
			newPage.drawPage(embeddedPage1, {
				x: 0,
				y: newPageHeight - page1Height,
				width: page1Width,
				height: page1Height
			});
			newPage.drawPage(embeddedPage2, {
				x: page1Width,
				y: newPageHeight - page2Height,
				width: page2Width,
				height: page2Height
			});
		} else {
			// 垂直堆叠 - 上下放置
			newPage.drawPage(embeddedPage1, {
				x: 0,
				y: page2Height,
				width: page1Width,
				height: page1Height
			});
			newPage.drawPage(embeddedPage2, {
				x: 0,
				y: 0,
				width: page2Width,
				height: page2Height
			});
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
