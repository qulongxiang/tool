// PDF合并工具 - 多文件版本

let uploadedFiles = []; // 存储所有上传的文件
let mergedPDFBlob = null;

// 文件上传处理
document.getElementById('pdfFiles').addEventListener('change', function(e) {
    handleFiles(Array.from(e.target.files));
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
    if (files.length > 0) {
        handleFiles(files);
    }
});

function handleFiles(files) {
    const pdfFiles = files.filter(file => file.type === 'application/pdf');
    
    if (pdfFiles.length === 0) {
        showError('请上传PDF格式的文件');
        return;
    }
    
    pdfFiles.forEach(file => {
        uploadedFiles.push({
            id: Date.now() + Math.random(),
            file: file,
            name: file.name,
            size: formatFileSize(file.size)
        });
    });
    
    renderFileList();
    updateMergeButton();
}

function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

function renderFileList() {
    const fileList = document.getElementById('fileList');
    const placeholder = document.getElementById('uploadPlaceholder');
    
    if (uploadedFiles.length === 0) {
        placeholder.style.display = 'block';
        fileList.innerHTML = '';
        return;
    }
    
    placeholder.style.display = 'none';
    
    fileList.innerHTML = uploadedFiles.map((item, index) => `
        <div class="file-item" draggable="true" data-index="${index}" ondragstart="handleDragStart(event)" ondragover="handleDragOver(event)" ondrop="handleDrop(event)">
            <div class="file-drag-handle">&#9776;</div>
            <div class="file-icon">&#128196;</div>
            <div class="file-info">
                <div class="file-name">${item.name}</div>
                <div class="file-size">${item.size}</div>
            </div>
            <div class="file-number">${index + 1}</div>
            <button class="btn-remove-file" onclick="removeFile(${index})">&times;</button>
        </div>
    `).join('');
}

let draggedIndex = null;

function handleDragStart(e) {
    draggedIndex = parseInt(e.target.dataset.index);
    e.target.classList.add('dragging');
}

function handleDragOver(e) {
    e.preventDefault();
}

function handleDrop(e) {
    e.preventDefault();
    const dropIndex = parseInt(e.target.closest('.file-item')?.dataset.index);
    
    if (draggedIndex !== null && dropIndex !== undefined && draggedIndex !== dropIndex) {
        const item = uploadedFiles.splice(draggedIndex, 1)[0];
        uploadedFiles.splice(dropIndex, 0, item);
        renderFileList();
    }
    
    document.querySelectorAll('.file-item').forEach(el => el.classList.remove('dragging'));
    draggedIndex = null;
}

function removeFile(index) {
    uploadedFiles.splice(index, 1);
    renderFileList();
    updateMergeButton();
}

function updateMergeButton() {
    const mergeBtn = document.getElementById('mergeBtn');
    const toolTip = document.getElementById('toolTip');
    
    if (uploadedFiles.length === 0) {
        mergeBtn.disabled = true;
        toolTip.textContent = '请至少上传一个PDF文件';
        toolTip.style.color = '#666';
    } else {
        mergeBtn.disabled = false;
        toolTip.textContent = `已上传 ${uploadedFiles.length} 个文件,可以开始合并`;
        toolTip.style.color = '#28a745';
    }
}

async function mergePDFs() {
    if (uploadedFiles.length === 0) {
        showError('请至少上传一个PDF文件');
        return;
    }
    
    // 清除上一次的结果和错误
    mergedPDFBlob = null;
    document.getElementById('resultArea').style.display = 'none';
    document.getElementById('errorArea').style.display = 'none';
    
    const mergeBtn = document.getElementById('mergeBtn');
    
    // 获取配置
    const filesPerPage = parseInt(document.getElementById('filesPerPage').value);
    const pageSize = document.querySelector('input[name="pageSize"]:checked').value;
    const layout = document.querySelector('input[name="layout"]:checked').value;
    const orientation = document.querySelector('input[name="orientation"]:checked').value;
    
    // 显示加载状态
    mergeBtn.disabled = true;
    mergeBtn.textContent = '处理中...';
    
    try {
        const formData = new FormData();
        
        uploadedFiles.forEach((item, index) => {
            formData.append(`pdf_${index}`, item.file);
        });
        
        formData.append('filesPerPage', filesPerPage);
        formData.append('pageSize', pageSize);
        formData.append('layout', layout);
        formData.append('orientation', orientation);
        
        const response = await fetch('/api/merge-pdf', {
            method: 'POST',
            body: formData
        });
        
        // 检查响应类型
        const contentType = response.headers.get('content-type');
        
        if (!contentType || !contentType.includes('application/pdf')) {
            const data = await response.json().catch(() => ({}));
            throw new Error(data.message || data.error || '合并失败,请检查文件格式');
        }
        
        if (!response.ok) {
            throw new Error('合并失败: HTTP ' + response.status);
        }
        
        mergedPDFBlob = await response.blob();
        
        // 计算页数
        const totalPages = Math.ceil(uploadedFiles.length / filesPerPage);
        
        // 显示成功区域
        document.getElementById('resultInfo').textContent = 
            `共 ${uploadedFiles.length} 个文件合并为 ${totalPages} 页`;
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
        mergeBtn.textContent = '开始合并';
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
    uploadedFiles = [];
    mergedPDFBlob = null;
    
    document.getElementById('pdfFiles').value = '';
    renderFileList();
    updateMergeButton();
    
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
