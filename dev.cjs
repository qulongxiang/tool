const http = require('http');
const fs = require('fs');
const path = require('path');

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

// 解析multipart/form-data
function parseFormData(req) {
    return new Promise((resolve, reject) => {
        const chunks = [];
        req.on('data', chunk => chunks.push(chunk));
        req.on('end', () => {
            const buffer = Buffer.concat(chunks);
            const contentType = req.headers['content-type'];
            const boundaryMatch = contentType.match(/boundary=(?:"([^"]+)"|([^;]+))/i);
            const boundary = boundaryMatch ? (boundaryMatch[1] || boundaryMatch[2]) : null;

            if (!boundary) {
                reject(new Error('No boundary found'));
                return;
            }

            const parts = buffer.split(Buffer.from('--' + boundary));
            const formData = {};
            const files = {};

            for (let i = 1; i < parts.length - 1; i++) {
                const part = parts[i];
                const headerEnd = part.indexOf('\r\n\r\n');
                if (headerEnd === -1) continue;

                const headers = part.slice(0, headerEnd).toString();
                const data = part.slice(headerEnd + 4, part.length - 2);

                const nameMatch = headers.match(/name="([^"]+)"/);
                const filenameMatch = headers.match(/filename="([^"]+)"/);

                if (nameMatch) {
                    const name = nameMatch[1];
                    if (filenameMatch) {
                        const filename = filenameMatch[1];
                        const tempPath = path.join('/tmp', `upload_${Date.now()}_${Math.random().toString(36).substr(2, 9)}_${filename}`);
                        fs.writeFileSync(tempPath, data);
                        if (!files[name]) {
                            files[name] = [];
                        }
                        files[name].push({ path: tempPath, filename });
                    } else {
                        formData[name] = data.toString();
                    }
                }
            }

            resolve({ fields: formData, files });
        });
        req.on('error', reject);
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
            
            // 收集所有PDF文件路径
            const pdfFiles = [];
            let index = 0;
            while (files[`pdf_${index}`]) {
                pdfFiles.push(files[`pdf_${index}`][0]);
                index++;
            }

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
