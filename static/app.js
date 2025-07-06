// Configuration
const API_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:5000' 
    : window.location.origin;

// Global variables
let processedChapters = [];
let currentFile = null;

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    initializeFileInput();
    initializeTabs();
    initializeButtons();
});

function initializeFileInput() {
    const fileInput = document.getElementById('docx-file');
    const fileNameDisplay = document.getElementById('file-name');
    const dropArea = document.querySelector('.file-input-label');
    
    fileInput.addEventListener('change', function() {
        if (this.files.length > 0) {
            currentFile = this.files[0];
            fileNameDisplay.textContent = currentFile.name;
            document.getElementById('status-text').textContent = 'Documento carregado, pronto para processamento';
            updateProgress(10);
        } else {
            currentFile = null;
            fileNameDisplay.textContent = 'Nenhum arquivo selecionado';
            updateProgress(0);
        }
    });
    
    // Drag and drop functionality
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, preventDefaults, false);
    });
    
    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    ['dragenter', 'dragover'].forEach(eventName => {
        dropArea.addEventListener(eventName, highlight, false);
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, unhighlight, false);
    });
    
    function highlight() {
        dropArea.style.borderColor = '#4361ee';
        dropArea.style.backgroundColor = 'rgba(67, 97, 238, 0.1)';
    }
    
    function unhighlight() {
        dropArea.style.borderColor = 'rgba(255, 255, 255, 0.2)';
        dropArea.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';
    }
    
    dropArea.addEventListener('drop', handleDrop, false);
    
    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        
        if (files.length > 0 && files[0].name.endsWith('.docx')) {
            fileInput.files = files;
            currentFile = files[0];
            fileNameDisplay.textContent = files[0].name;
            document.getElementById('status-text').textContent = 'Documento carregado, pronto para processamento';
            updateProgress(10);
        } else {
            alert('Por favor, selecione apenas arquivos .docx');
        }
    }
}

function initializeTabs() {
    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs and content
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked tab
            tab.classList.add('active');
            
            // Show corresponding content
            const tabName = tab.getAttribute('data-tab');
            document.getElementById(`${tabName}-tab`).classList.add('active');
        });
    });
}

function initializeButtons() {
    document.getElementById('process-btn').addEventListener('click', processDocument);
    document.getElementById('copy-preview-btn').addEventListener('click', copyPreviewContent);
    document.getElementById('export-zip-btn').addEventListener('click', exportAsZip);
    document.getElementById('download-all-btn').addEventListener('click', downloadAllChapters);
}

function updateProgress(percentage) {
    document.getElementById('progress').style.width = `${percentage}%`;
}

function updateStatus(text) {
    document.getElementById('status-text').textContent = text;
}

async function processDocument() {
    if (!currentFile) {
        alert('Por favor, selecione um arquivo DOCX.');
        return;
    }
    
    const summary = document.getElementById('chapter-summary').value.trim();
    if (!summary) {
        alert('Por favor, insira os títulos dos capítulos.');
        return;
    }
    
    const chapterTitles = summary.split('\n')
        .map(title => title.trim())
        .filter(title => title.length > 0);
    
    if (chapterTitles.length === 0) {
        alert('Por favor, insira pelo menos um título de capítulo.');
        return;
    }
    
    try {
        updateStatus('Enviando documento para processamento...');
        updateProgress(20);
        
        const formData = new FormData();
        formData.append('file', currentFile);
        formData.append('chapter_titles', chapterTitles.join('\n'));
        
        updateProgress(40);
        updateStatus('Processando documento no servidor...');
        
        const response = await fetch(`${API_URL}/api/split`, {
            method: 'POST',
            body: formData
        });
        
        updateProgress(70);
        
        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (!result.success) {
            throw new Error(result.error || 'Processing failed');
        }
        
        updateProgress(90);
        updateStatus('Finalizando processamento...');
        
        processedChapters = result.chapters;
        renderChapters(processedChapters);
        
        updateProgress(100);
        updateStatus(`Documento processado com sucesso! ${result.total_chapters} capítulos encontrados.`);
        
        setTimeout(() => {
            alert(`Documento processado com sucesso!\n${result.total_chapters} capítulos foram criados.`);
        }, 300);
        
    } catch (error) {
        console.error('Processing error:', error);
        updateStatus('Erro ao processar documento');
        updateProgress(0);
        
        if (error.message.includes('fetch')) {
            alert('Erro de conexão. Verifique se o servidor está funcionando ou tente usar apenas o processamento local.');
            // Fallback to client-side processing
            await processDocumentClientSide();
        } else {
            alert(`Erro ao processar documento: ${error.message}`);
        }
    }
}

// Fallback client-side processing (simplified version of original)
async function processDocumentClientSide() {
    try {
        updateStatus('Processando documento localmente...');
        updateProgress(30);
        
        const arrayBuffer = await currentFile.arrayBuffer();
        const result = await mammoth.convertToHtml({ arrayBuffer: arrayBuffer });
        
        updateProgress(60);
        updateStatus('Dividindo em capítulos...');
        
        const summary = document.getElementById('chapter-summary').value.trim();
        const chapterTitles = summary.split('\n')
            .map(title => title.trim())
            .filter(title => title.length > 0);
        
        const html = result.value;
        const chapters = splitDocumentIntoChapters(html, chapterTitles);
        
        processedChapters = chapters.map(chapter => ({
            title: chapter.title,
            content: [{ text: chapter.content, style: 'Normal' }],
            paragraph_count: 1,
            found_at: 'Client-side processing'
        }));
        
        renderChapters(processedChapters);
        
        updateProgress(100);
        updateStatus('Documento processado localmente com sucesso!');
        
    } catch (error) {
        console.error('Client-side processing error:', error);
        updateStatus('Erro no processamento local');
        alert('Erro ao processar documento localmente. Verifique se é um arquivo DOCX válido.');
    }
}

// Original client-side splitting logic (simplified)
function splitDocumentIntoChapters(html, chapterTitles) {
    const chapters = [];
    let currentChapter = { title: chapterTitles[0], content: '' };
    let currentTitleIndex = 0;
    
    const headingRegex = /<(h[1-6])(.*?)>(.*?)<\/\1>/gi;
    let lastIndex = 0;
    let match;
    
    while ((match = headingRegex.exec(html)) !== null) {
        const headingText = match[3];
        
        if (currentTitleIndex < chapterTitles.length - 1 && 
            headingText.toLowerCase().includes(chapterTitles[currentTitleIndex + 1].toLowerCase())) {
            
            chapters.push(currentChapter);
            currentTitleIndex++;
            currentChapter = {
                title: chapterTitles[currentTitleIndex],
                content: ''
            };
        }
        
        const contentBetween = html.substring(lastIndex, match.index);
        currentChapter.content += contentBetween + match[0];
        lastIndex = headingRegex.lastIndex;
    }
    
    currentChapter.content += html.substring(lastIndex);
    chapters.push(currentChapter);
    
    return chapters;
}

function renderChapters(chapters) {
    const chapterList = document.getElementById('chapter-list');
    chapterList.innerHTML = '';
    
    chapters.forEach((chapter, index) => {
        const chapterCard = document.createElement('div');
        chapterCard.className = 'chapter-card';
        
        // Create preview content
        const previewContent = chapter.content
            .slice(0, 3)
            .map(p => `<p>${p.text.substring(0, 150)}${p.text.length > 150 ? '...' : ''}</p>`)
            .join('');
        
        chapterCard.innerHTML = `
            <div class="chapter-header">
                <div class="chapter-number">${index + 1}</div>
                <h3 class="chapter-title">${chapter.title}</h3>
            </div>
            <div class="chapter-content">
                ${previewContent}
                <div class="chapter-stats">
                    <small><i class="fas fa-paragraph"></i> ${chapter.paragraph_count} parágrafos</small>
                    <small><i class="fas fa-search"></i> ${chapter.found_at}</small>
                </div>
            </div>
            <div class="chapter-actions">
                <button class="btn btn-outline preview-btn" data-index="${index}">
                    <i class="fas fa-eye"></i> Visualizar
                </button>
                <button class="btn btn-success download-btn" data-index="${index}">
                    <i class="fas fa-download"></i> Baixar DOCX
                </button>
            </div>
        `;
        
        chapterList.appendChild(chapterCard);
    });
    
    // Add event listeners
    document.querySelectorAll('.preview-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const index = this.getAttribute('data-index');
            previewChapter(processedChapters[index]);
        });
    });
    
    document.querySelectorAll('.download-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const index = this.getAttribute('data-index');
            downloadChapter(processedChapters[index]);
        });
    });
}

function previewChapter(chapter) {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    
    document.querySelector('.tab[data-tab="preview"]').classList.add('active');
    document.getElementById('preview-tab').classList.add('active');
    
    const content = chapter.content
        .map(p => `<p class="chapter-paragraph">${p.text}</p>`)
        .join('');
    
    document.getElementById('preview-content').innerHTML = `
        <h1>${chapter.title}</h1>
        <div class="chapter-preview-content">${content}</div>
    `;
}

async function downloadChapter(chapter) {
    try {
        const response = await fetch(`${API_URL}/api/download_chapter`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title: chapter.title,
                content: chapter.content
            })
        });
        
        if (!response.ok) {
            throw new Error('Download failed');
        }
        
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${chapter.title}.docx`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
    } catch (error) {
        console.error('Download error:', error);
        alert('Erro ao baixar capítulo. Tente copiar o conteúdo manualmente.');
    }
}

function copyPreviewContent() {
    const content = document.getElementById('preview-content').innerHTML;
    navigator.clipboard.writeText(content).then(() => {
        showCopyAlert();
    }).catch(err => {
        console.error('Copy failed:', err);
    });
}

function showCopyAlert() {
    const alert = document.getElementById('copy-alert');
    alert.classList.add('show');
    
    setTimeout(() => {
        alert.classList.remove('show');
    }, 3000);
}

async function exportAsZip() {
    if (processedChapters.length === 0) {
        alert('Por favor, processe um documento primeiro.');
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/api/download_all`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chapters: processedChapters
            })
        });
        
        if (!response.ok) {
            throw new Error('ZIP creation failed');
        }
        
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'chapters.zip';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
    } catch (error) {
        console.error('ZIP export error:', error);
        alert('Erro ao criar ZIP. Tente baixar capítulos individuais.');
    }
}

async function downloadAllChapters() {
    if (processedChapters.length === 0) {
        alert('Por favor, processe um documento primeiro.');
        return;
    }
    
    // Download chapters one by one with delay
    for (let i = 0; i < processedChapters.length; i++) {
        await downloadChapter(processedChapters[i]);
        // Add delay to prevent overwhelming the browser
        await new Promise(resolve => setTimeout(resolve, 500));
    }
}