// PDF合并工具前端逻辑

let file1 = null;
let file2 = null;
let mergedPDFBlob = null;

// 文件上传处理
document.getElementById('pdfFile1').addEventListener('change', function(e) {
    handleFileSelect(e, 1);
});

document.getElementById('pdfFile2').addEventListener('change', function(e) {
    handleFileSelect(e, 2);
});

// 拖拽上传
const uploadArea = document.getElementById('uploadArea');

uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.classList.add('drag-over');
});

uploadArea.addEventListener('dragleave', () => {
    uploadArea.classList.remove('drag-over');
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('drag-over');

    const files = Array.from(e.dataTransfer.files).filter(f => f.type === 'application/pdf');

    if (files.length >= 2) {
        handleFile(files[0], 1);
        handleFile(files[1], 2);
    } else if (files.length === 1) {
        if (!file1) {
            handleFile(files[0], 1);
        } else if (!file2) {
            handleFile(files[0], 2);
        }
    }
});

function handleFileSelect(e, num) {
    const file = e.target.files[0];
    if (file) {
        handleFile(file, num);
    }
}

function handleFile(file, num) {
    if (file.type !== 'application/pdf') {
        showError('请上传PDF格式的文件');
        return;
    }

    if (num === 1) {
        file1 = file;
        showFileInfo(1, file.name);
    } else {
        file2 = file;
        showFileInfo(2, file.name);
    }

    checkMergeButton();
}

function showFileInfo(num, fileName) {
    const fileInfo = document.getElementById(`fileInfo${num}`);
    const uploadBox = document.getElementById(`uploadBox${num}`);
    const nameElement = fileInfo.querySelector('.file-name');

    nameElement.textContent = fileName;
    fileInfo.style.display = 'flex';
    uploadBox.classList.add('has-file');
}

function removeFile(num) {
    if (num === 1) {
        file1 = null;
        document.getElementById('pdfFile1').value = '';
    } else {
        file2 = null;
        document.getElementById('pdfFile2').value = '';
    }

    const fileInfo = document.getElementById(`fileInfo${num}`);
    const uploadBox = document.getElementById(`uploadBox${num}`);

    fileInfo.style.display = 'none';
    uploadBox.classList.remove('has-file');

    checkMergeButton();
}

function checkMergeButton() {
    const mergeBtn = document.getElementById('mergeBtn');
    const toolTip = document.querySelector('.tool-tip');

    if (file1 && file2) {
        mergeBtn.disabled = false;
        toolTip.textContent = '准备好合并!';
        toolTip.style.color = '#28a745';
    } else {
        mergeBtn.disabled = true;
        toolTip.textContent = '请先上传两个PDF文件';
        toolTip.style.color = '#666';
    }
}

async function mergePDFs() {
    if (!file1 || !file2) {
        showError('请先上传两个PDF文件');
        return;
    }

    // 清除上一次的结果和错误
    mergedPDFBlob = null;
    document.getElementById('resultArea').style.display = 'none';
    document.getElementById('errorArea').style.display = 'none';

    const mergeBtn = document.getElementById('mergeBtn');
    const layout = document.querySelector('input[name="layout"]:checked').value;

    // 显示加载状态
    mergeBtn.disabled = true;
    mergeBtn.textContent = '处理中...';

    try {
        const formData = new FormData();
        formData.append('pdf1', file1);
        formData.append('pdf2', file2);
        formData.append('layout', layout);

        const response = await fetch('/api/merge-pdf', {
            method: 'POST',
            body: formData
        });

        // 检查响应类型
        const contentType = response.headers.get('content-type');
        
        if (!contentType || !contentType.includes('application/pdf')) {
            // 如果不是PDF响应,可能是错误信息
            const data = await response.json().catch(() => ({}));
            throw new Error(data.message || data.error || '合并失败,请检查文件格式');
        }

        if (!response.ok) {
            throw new Error('合并失败: HTTP ' + response.status);
        }

        mergedPDFBlob = await response.blob();

        // 显示成功区域
        document.getElementById('resultArea').style.display = 'block';
        document.querySelector('.tool-container').scrollIntoView({ behavior: 'smooth' });

    } catch (error) {
        console.error('Merge error:', error);
        const message = error.message.includes('Failed to fetch') 
            ? '无法连接到服务器,请确保服务正在运行'
            : error.message || '合并失败,请重试';
        showError(message);
    } finally {
        mergeBtn.disabled = false;
        mergeBtn.textContent = '合并PDF';
    }
}

function downloadMergedPDF() {
    if (!mergedPDFBlob) return;

    const url = URL.createObjectURL(mergedPDFBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `merged_${Date.now()}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function resetTool() {
    file1 = null;
    file2 = null;
    mergedPDFBlob = null;

    document.getElementById('pdfFile1').value = '';
    document.getElementById('pdfFile2').value = '';

    removeFile(1);
    removeFile(2);

    document.getElementById('resultArea').style.display = 'none';
    document.getElementById('errorArea').style.display = 'none';

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showError(message) {
    const errorArea = document.getElementById('errorArea');
    const errorMessage = document.getElementById('errorMessage');

    errorMessage.textContent = message;
    errorArea.style.display = 'block';

    document.querySelector('.tool-container').scrollIntoView({ behavior: 'smooth' });
}

function hideError() {
    document.getElementById('errorArea').style.display = 'none';
}
