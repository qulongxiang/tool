const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const PORT = 8787;
const DIST_DIR = path.join(__dirname, 'dist', 'client');
const WORKER_DIR = path.join(__dirname, 'dist', 'tool');

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

// 简单的PDF合并处理(使用pdf-lib)
async function mergePDFs(pdf1Path, pdf2Path, layout) {
    const { PDFDocument } = require('pdf-lib');

    const pdf1Bytes = fs.readFileSync(pdf1Path);
    const pdf2Bytes = fs.readFileSync(pdf2Path);

    const pdf1 = await PDFDocument.load(pdf1Bytes);
    const pdf2 = await PDFDocument.load(pdf2Bytes);

    const mergedPdf = await PDFDocument.create();

    const pdf1Pages = pdf1.getPages();
    const pdf2Pages = pdf2.getPages();

    if (pdf1Pages.length === 0 || pdf2Pages.length === 0) {
        throw new Error('PDF文件必须至少有一页');
    }

    const page1 = pdf1Pages[0];
    const page2 = pdf2Pages[0];

    const page1Width = page1.getWidth();
    const page1Height = page1.getHeight();
    const page2Width = page2.getWidth();
    const page2Height = page2.getHeight();

    let newPageWidth, newPageHeight;

    if (layout === 'horizontal') {
        newPageWidth = page1Width + page2Width;
        newPageHeight = Math.max(page1Height, page2Height);
    } else {
        newPageWidth = Math.max(page1Width, page2Width);
        newPageHeight = page1Height + page2Height;
    }

    const [embeddedPage1] = await mergedPdf.embedPdf(pdf1Bytes, [0]);
    const [embeddedPage2] = await mergedPdf.embedPdf(pdf2Bytes, [0]);

    const newPage = mergedPdf.addPage([newPageWidth, newPageHeight]);

    if (layout === 'horizontal') {
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

    return await mergedPdf.save();
}

// 解析multipart/form-data
function parseFormData(req) {
    return new Promise((resolve, reject) => {
        const chunks = [];
        req.on('data', chunk => chunks.push(chunk));
        req.on('end', () => {
            const buffer = Buffer.concat(chunks);
            const contentType = req.headers['content-type'];
            const boundary = contentType.match(/boundary=(?:"([^"]+)"|([^;]+))/i)?.[1] || contentType.match(/boundary=(?:"([^"]+)"|([^;]+))/i)?.[2];

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
                        // 这是文件
                        const filename = filenameMatch[1];
                        const tempPath = path.join('/tmp', `upload_${Date.now()}_${filename}`);
                        fs.writeFileSync(tempPath, data);
                        files[name] = { path: tempPath, filename };
                    } else {
                        // 这是普通字段
                        formData[name] = data.toString();
                    }
                }
            }

            resolve({ fields: formData, files });
        });
        req.on('error', reject);
    });
}

const server = http.createServer(async (req, res) => {
    console.log(`${req.method} ${req.url}`);

    // 处理PDF合并API
    if (req.url === '/api/merge-pdf' && req.method === 'POST') {
        try {
            const { fields, files } = await parseFormData(req);

            if (!files.pdf1 || !files.pdf2) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: '请上传两个PDF文件' }));
                return;
            }

            const layout = fields.layout || 'vertical';
            const mergedBytes = await mergePDFs(files.pdf1.path, files.pdf2.path, layout);

            // 清理临时文件
            fs.unlinkSync(files.pdf1.path);
            fs.unlinkSync(files.pdf2.path);

            res.writeHead(200, {
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'attachment; filename="merged.pdf"',
                'Content-Length': mergedBytes.length
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
    console.log(`✨ Features: PDF merge API enabled\n`);
});
