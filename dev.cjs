const http = require('http');
const fs = require('fs');
const path = require('path');
const { IncomingForm } = require('formidable');

const PORT = 8787;
const DIST_DIR = path.join(__dirname, 'dist', 'client');

const mimeTypes = {
    '.html': 'text/html',
    '.js': 'application/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.pdf': 'application/pdf',
    '.ico': 'image/x-icon'
};

// A4和Letter纸张尺寸(单位: point, 1 point = 1/72 inch)
const PAGE_SIZES = {
    a4: { width: 595.28, height: 841.89 },      // 210mm × 297mm
    letter: { width: 612, height: 792 }          // 8.5in × 11in
};

// 解析multipart/form-data (使用formidable)
function parseFormData(req) {
    return new Promise((resolve, reject) => {
        const form = new IncomingForm({
            uploadDir: '/tmp',
            keepExtensions: true,
            multiples: true
        });

        form.parse(req, (err, fields, files) => {
            if (err) {
                reject(err);
                return;
            }

            // 转换fields为普通对象
            const normalizedFields = {};
            for (const [key, value] of Object.entries(fields)) {
                normalizedFields[key] = Array.isArray(value) ? value[0] : value;
            }

            // 转换files格式
            const normalizedFiles = {};
            for (const [key, value] of Object.entries(files)) {
                const fileArray = Array.isArray(value) ? value : [value];
                normalizedFiles[key] = fileArray.map(f => ({
                    path: f.filepath,
                    filename: f.originalFilename || 'unknown'
                }));
            }

            resolve({ fields: normalizedFields, files: normalizedFiles });
        });
    });
}

// 多文件PDF合并
async function mergeMultiplePDFs(filePaths, config) {
    const { PDFDocument } = require('pdf-lib');
    
    const { filesPerPage, pageSize, layout, orientation } = config;
    
    // 获取页面尺寸
    let pageWidth, pageHeight;
    if (pageSize === 'auto') {
        pageWidth = null;
        pageHeight = null;
    } else {
        const size = PAGE_SIZES[pageSize] || PAGE_SIZES.a4;
        pageWidth = size.width;
        pageHeight = size.height;
        
        // 处理方向
        if (orientation === 'landscape') {
            [pageWidth, pageHeight] = [pageHeight, pageWidth];
        }
    }
    
    const mergedPdf = await PDFDocument.create();
    
    // 按每页数量分组
    const groups = [];
    for (let i = 0; i < filePaths.length; i += filesPerPage) {
        groups.push(filePaths.slice(i, i + filesPerPage));
    }
    
    for (const group of groups) {
        // 加载组内所有PDF
        const pdfs = [];
        for (const filePath of group) {
            const bytes = fs.readFileSync(filePath);
            const pdf = await PDFDocument.load(bytes);
            const pages = pdf.getPages();
            if (pages.length > 0) {
                pdfs.push({ pdf, page: pages[0] });
            }
        }
        
        if (pdfs.length === 0) continue;
        
        // 计算布局
        let cols, rows;
        if (layout === 'horizontal') {
            cols = pdfs.length;
            rows = 1;
        } else if (layout === 'vertical') {
            cols = 1;
            rows = pdfs.length;
        } else {
            // 网格布局 - 计算最佳行列数
            cols = Math.ceil(Math.sqrt(pdfs.length));
            rows = Math.ceil(pdfs.length / cols);
        }
        
        // 确定页面尺寸
        let finalPageWidth = pageWidth;
        let finalPageHeight = pageHeight;
        
        if (pageSize === 'auto') {
            // 自动模式:根据内容计算
            if (layout === 'horizontal') {
                finalPageWidth = pdfs.reduce((sum, p) => sum + p.page.getWidth(), 0);
                finalPageHeight = Math.max(...pdfs.map(p => p.page.getHeight()));
            } else if (layout === 'vertical') {
                finalPageWidth = Math.max(...pdfs.map(p => p.page.getWidth()));
                finalPageHeight = pdfs.reduce((sum, p) => sum + p.page.getHeight(), 0);
            } else {
                const maxWidth = Math.max(...pdfs.map(p => p.page.getWidth()));
                const maxHeight = Math.max(...pdfs.map(p => p.page.getHeight()));
                finalPageWidth = maxWidth * cols;
                finalPageHeight = maxHeight * rows;
            }
        }
        
        // 创建新页面
        const newPage = mergedPdf.addPage([finalPageWidth, finalPageHeight]);
        
        // 嵌入并绘制每个PDF
        for (let i = 0; i < pdfs.length; i++) {
            const { pdf, page } = pdfs[i];
            const pdfBytes = fs.readFileSync(group[i]);
            const [embeddedPage] = await mergedPdf.embedPdf(pdfBytes, [0]);
            
            const col = i % cols;
            const row = Math.floor(i / cols);
            
            const cellWidth = finalPageWidth / cols;
            const cellHeight = finalPageHeight / rows;
            
            const sourceWidth = page.getWidth();
            const sourceHeight = page.getHeight();
            
            // 计算缩放比例以保持宽高比
            const scaleX = cellWidth / sourceWidth;
            const scaleY = cellHeight / sourceHeight;
            const scale = Math.min(scaleX, scaleY);
            
            const scaledWidth = sourceWidth * scale;
            const scaledHeight = sourceHeight * scale;
            
            // 居中放置
            const x = col * cellWidth + (cellWidth - scaledWidth) / 2;
            const y = finalPageHeight - (row + 1) * cellHeight + (cellHeight - scaledHeight) / 2;
            
            newPage.drawPage(embeddedPage, {
                x,
                y,
                width: scaledWidth,
                height: scaledHeight
            });
        }
    }
    
    return await mergedPdf.save();
}

const server = http.createServer(async (req, res) => {
    console.log(`${req.method} ${req.url}`);

    // 设置CORS头
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    // 处理PDF合并API
    if (req.url === '/api/merge-pdf' && req.method === 'POST') {
        try {
            const { fields, files } = await parseFormData(req);
            
            console.log('Received fields:', Object.keys(fields));
            console.log('Received files:', Object.keys(files));
            
            // 收集所有PDF文件路径
            const pdfFiles = [];
            let index = 0;
            while (files[`pdf_${index}`]) {
                pdfFiles.push(files[`pdf_${index}`][0]);
                index++;
            }
            
            console.log(`Total PDF files collected: ${pdfFiles.length}`);

            if (pdfFiles.length === 0) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: '请上传至少一个PDF文件' }));
                return;
            }

            const config = {
                filesPerPage: parseInt(fields.filesPerPage) || 2,
                pageSize: fields.pageSize || 'a4',
                layout: fields.layout || 'grid',
                orientation: fields.orientation || 'portrait'
            };

            const mergedBytes = await mergeMultiplePDFs(pdfFiles.map(f => f.path), config);

            // 清理临时文件
            pdfFiles.forEach(f => {
                try { fs.unlinkSync(f.path); } catch (e) {}
            });

            res.writeHead(200, {
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'attachment; filename="merged.pdf"',
                'Content-Length': mergedBytes.length,
                'Access-Control-Allow-Origin': '*'
            });
            res.end(Buffer.from(mergedBytes));

        } catch (error) {
            console.error('PDF merge error:', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'PDF合并失败: ' + error.message }));
        }
        return;
    }

    // 静态文件服务
    let filePath = path.join(DIST_DIR, req.url === '/' ? 'index.html' : req.url);

    const extname = path.extname(filePath).toLowerCase();
    const contentType = mimeTypes[extname] || 'application/octet-stream';

    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                fs.readFile(path.join(DIST_DIR, 'index.html'), (err, indexContent) => {
                    if (err) {
                        res.writeHead(404);
                        res.end('File not found');
                    } else {
                        res.writeHead(200, { 'Content-Type': 'text/html' });
                        res.end(indexContent, 'utf-8');
                    }
                });
            } else {
                res.writeHead(500);
                res.end('Server Error: ' + error.code);
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, '0.0.0.0', () => {
    console.log(`\n🚀 Local Dev Server (with full PDF support)`);
    console.log(`📍 URL: http://localhost:${PORT}`);
    console.log(`📁 Serving: ${DIST_DIR}`);
    console.log(`✨ Features: Multi-file PDF merge with custom layout\n`);
});
