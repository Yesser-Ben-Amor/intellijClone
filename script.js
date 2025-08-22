// IntelliJ Clone - Main JavaScript
class IntelliJClone {
    constructor() {
        this.projectManager = new ProjectManager();
        this.currentFile = null;
        this.openFiles = new Map();
        this.fileContents = new Map();
        this.undoStack = [];
        this.redoStack = [];
        this.searchMatches = [];
        this.currentSearchIndex = -1;
        this.autoSaveTimeout = null;
        
        this.initializeEventListeners();
        this.updateLineNumbers();
        this.updateStatusBar();
        this.initializeProject();
    }
    
    initializeProject() {
        // Check if there's a last opened project
        const lastProject = localStorage.getItem('lastOpenedProject');
        if (lastProject && this.projectManager.projects.has(lastProject)) {
            this.openProject(lastProject);
        } else if (this.projectManager.projects.size > 0) {
            // Open first available project
            const firstProject = this.projectManager.listProjects()[0];
            this.openProject(firstProject);
        } else {
            // Show welcome screen
            this.showWelcomeScreen();
        }
    }
    
    initializeDefaultFiles() {
        // Default file contents
        this.fileContents.set('welcome.js', `// Willkommen bei IntelliJ Clone!
// Ein moderner Code-Editor gebaut mit Vanilla JavaScript

class WelcomeMessage {
    constructor(name) {
        this.name = name;
        this.greeting = "Hallo";
    }
    
    displayMessage() {
        console.log(\`\${this.greeting}, \${this.name}!\`);
        console.log("Viel Spaß beim Programmieren!");
    }
    
    // TODO: Weitere Features hinzufügen
    getFeatures() {
        return [
            "Syntax Highlighting",
            "Datei Explorer",
            "Multiple Tabs",
            "Suchen & Ersetzen",
            "Tastenkürzel",
            "Dunkles Theme"
        ];
    }
}

// Beispiel Verwendung
const welcome = new WelcomeMessage("Entwickler");
welcome.displayMessage();

// Zeige verfügbare Features
const features = welcome.getFeatures();
features.forEach((feature, index) => {
    console.log(\`\${index + 1}. \${feature}\`);
});`);
        
        this.fileContents.set('styles.css', `/* Beispiel CSS Datei */
.example-class {
    background-color: #2b2b2b;
    color: #a9b7c6;
    padding: 16px;
    border-radius: 4px;
}

/* Responsive Design */
@media (max-width: 768px) {
    .example-class {
        padding: 8px;
    }
}`);
        
        this.fileContents.set('index.html', `<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Beispiel HTML</title>
</head>
<body>
    <h1>Willkommen!</h1>
    <p>Dies ist eine Beispiel HTML-Datei.</p>
</body>
</html>`);
    }
    
    initializeEventListeners() {
        const codeEditor = document.getElementById('code-editor');
        const fileInput = document.getElementById('file-input');
        const searchInput = document.getElementById('search-input');
        
        // Code Editor Events
        codeEditor.addEventListener('input', (e) => {
            this.handleCodeChange(e);
            this.updateLineNumbers();
            this.applySyntaxHighlighting();
        });
        
        codeEditor.addEventListener('keydown', (e) => {
            this.handleKeyboardShortcuts(e);
        });
        
        codeEditor.addEventListener('keyup', () => {
            this.updateStatusBar();
        });
        
        codeEditor.addEventListener('click', () => {
            this.updateStatusBar();
        });
        
        // File Tree Events
        document.getElementById('file-tree').addEventListener('click', (e) => {
            if (e.target.closest('.file-item')) {
                const fileName = e.target.closest('.file-item').dataset.name;
                this.openFile(fileName);
            }
        });
        
        // Tab Events
        document.getElementById('tab-bar').addEventListener('click', (e) => {
            if (e.target.classList.contains('tab-close')) {
                e.stopPropagation();
                const tab = e.target.closest('.tab');
                const fileName = tab.dataset.file;
                this.closeTab(fileName);
            } else if (e.target.closest('.tab')) {
                const fileName = e.target.closest('.tab').dataset.file;
                this.switchToFile(fileName);
            }
        });
        
        // Menu Events
        document.addEventListener('click', (e) => {
            if (e.target.dataset.action) {
                this.handleMenuAction(e.target.dataset.action);
            }
        });
        
        // File Input
        fileInput.addEventListener('change', (e) => {
            this.handleFileUpload(e);
        });
        
        // New File Button
        document.getElementById('new-file-btn').addEventListener('click', () => {
            this.createNewFile();
        });
        
        // Project Management Buttons
        document.getElementById('new-project-btn').addEventListener('click', () => {
            this.showProjectModal();
        });
        
        document.getElementById('create-project-btn').addEventListener('click', () => {
            this.showProjectModal();
        });
        
        document.getElementById('open-project-btn').addEventListener('click', () => {
            this.showProjectSelector();
        });
        
        document.getElementById('live-preview-btn').addEventListener('click', () => {
            this.openLivePreview();
        });
        

        
        // Import Project Events
        document.getElementById('import-project-btn').addEventListener('click', () => {
            console.log('Import button clicked!');
            this.showImportDialog();
        });
        
        document.getElementById('import-file-input').addEventListener('change', (e) => {
            console.log('Files selected:', e.target.files.length);
            this.handleImportFiles(e.target.files);
        });
        
        // Modal Events
        document.getElementById('close-project-modal').addEventListener('click', () => {
            this.hideProjectModal();
        });
        
        document.getElementById('cancel-project').addEventListener('click', () => {
            this.hideProjectModal();
        });
        
        document.getElementById('create-project').addEventListener('click', () => {
            this.createProject();
        });
        
        // Close modal when clicking overlay
        document.getElementById('project-modal').addEventListener('click', (e) => {
            if (e.target.id === 'project-modal') {
                this.hideProjectModal();
            }
        });
        
        // Search Events
        searchInput.addEventListener('input', (e) => {
            this.performSearch(e.target.value);
        });
        
        document.getElementById('search-next').addEventListener('click', () => {
            this.nextSearchResult();
        });
        
        document.getElementById('search-prev').addEventListener('click', () => {
            this.previousSearchResult();
        });
        
        document.getElementById('search-close').addEventListener('click', () => {
            this.closeSearch();
        });
        
        // Global keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            this.handleGlobalShortcuts(e);
        });
    }
    
    handleKeyboardShortcuts(e) {
        // Tab key for indentation
        if (e.key === 'Tab') {
            e.preventDefault();
            const textarea = e.target;
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            
            if (e.shiftKey) {
                // Shift+Tab: Remove indentation
                this.removeIndentation(textarea, start, end);
            } else {
                // Tab: Add indentation
                this.addIndentation(textarea, start, end);
            }
        }
    }
    
    handleGlobalShortcuts(e) {
        if (e.ctrlKey || e.metaKey) {
            switch (e.key) {
                case 'n':
                    e.preventDefault();
                    if (e.shiftKey) {
                        this.showProjectModal();
                    } else {
                        this.createNewFile();
                    }
                    break;
                case 'o':
                    e.preventDefault();
                    document.getElementById('file-input').click();
                    break;
                case 's':
                    e.preventDefault();
                    this.saveCurrentFile();
                    break;
                case 'w':
                    e.preventDefault();
                    this.closeCurrentTab();
                    break;
                case 'f':
                    e.preventDefault();
                    this.showSearch();
                    break;
                case 'z':
                    e.preventDefault();
                    if (e.shiftKey) {
                        this.redo();
                    } else {
                        this.undo();
                    }
                    break;
                case 'y':
                    e.preventDefault();
                    this.redo();
                    break;
            }
        }
        
        if (e.key === 'Escape') {
            this.closeSearch();
        }
    }
    
    addIndentation(textarea, start, end) {
        const value = textarea.value;
        const beforeSelection = value.substring(0, start);
        const selection = value.substring(start, end);
        const afterSelection = value.substring(end);
        
        if (start === end) {
            // No selection, just add tab
            textarea.value = beforeSelection + '    ' + afterSelection;
            textarea.setSelectionRange(start + 4, start + 4);
        } else {
            // Selection exists, indent all lines
            const lines = selection.split('\n');
            const indentedLines = lines.map(line => '    ' + line);
            const newSelection = indentedLines.join('\n');
            
            textarea.value = beforeSelection + newSelection + afterSelection;
            textarea.setSelectionRange(start, start + newSelection.length);
        }
        
        this.updateLineNumbers();
    }
    
    removeIndentation(textarea, start, end) {
        const value = textarea.value;
        const beforeSelection = value.substring(0, start);
        const selection = value.substring(start, end);
        const afterSelection = value.substring(end);
        
        if (start === end) {
            // No selection, remove tab before cursor
            const lineStart = beforeSelection.lastIndexOf('\n') + 1;
            const lineBeforeCursor = beforeSelection.substring(lineStart);
            
            if (lineBeforeCursor.startsWith('    ')) {
                const newBefore = beforeSelection.substring(0, lineStart) + lineBeforeCursor.substring(4);
                textarea.value = newBefore + afterSelection;
                textarea.setSelectionRange(start - 4, start - 4);
            }
        } else {
            // Selection exists, unindent all lines
            const lines = selection.split('\n');
            const unindentedLines = lines.map(line => {
                if (line.startsWith('    ')) {
                    return line.substring(4);
                }
                return line;
            });
            const newSelection = unindentedLines.join('\n');
            
            textarea.value = beforeSelection + newSelection + afterSelection;
            textarea.setSelectionRange(start, start + newSelection.length);
        }
        
        this.updateLineNumbers();
    }
    
    handleMenuAction(action) {
        switch (action) {
            case 'new-project':
                this.showProjectModal();
                break;
            case 'open-project':
                this.showProjectSelector();
                break;
            case 'live-preview':
                this.openLivePreview();
                break;
            case 'export-project':
                this.exportProject();
                break;
            case 'new-file':
                this.createNewFile();
                break;
            case 'open-file':
                document.getElementById('file-input').click();
                break;
            case 'save-file':
                this.saveCurrentFile();
                break;
            case 'close-tab':
                this.closeCurrentTab();
                break;
            case 'undo':
                this.undo();
                break;
            case 'redo':
                this.redo();
                break;
            case 'find':
                this.showSearch();
                break;
            case 'replace':
                this.showReplace();
                break;
            case 'toggle-sidebar':
                this.toggleSidebar();
                break;
            case 'toggle-theme':
                this.toggleTheme();
                break;
        }
    }
    
    createNewFile() {
        if (!this.projectManager.currentProject) {
            alert('Bitte erstelle oder öffne zuerst ein Projekt!');
            return;
        }
        
        const fileName = prompt('Dateiname eingeben:', 'untitled.js');
        if (fileName && fileName.trim()) {
            const cleanFileName = fileName.trim();
            this.fileContents.set(cleanFileName, '');
            this.projectManager.addFileToProject(cleanFileName, '');
            this.addFileToTree(cleanFileName);
            this.openFile(cleanFileName);
        }
    }
    
    showWelcomeScreen() {
        this.currentFile = null;
        this.openFiles.clear();
        this.fileContents.clear();
        
        // Clear editor and tabs
        document.getElementById('code-editor').value = '';
        document.getElementById('tab-bar').innerHTML = '';
        
        // Show welcome message in file tree
        const fileTree = document.getElementById('file-tree');
        fileTree.innerHTML = `
            <div class="welcome-message" style="padding: 20px; text-align: center; color: #a9b7c6;">
                <h3 style="margin-bottom: 16px;">🚀 Willkommen bei IntelliJ Clone!</h3>
                <p style="margin-bottom: 20px; color: #808080;">Erstelle ein neues Projekt oder öffne ein bestehendes Projekt, um zu beginnen.</p>
            </div>
        `;
        
        this.updateProjectDisplay();
    }
    
    showProjectModal() {
        document.getElementById('project-modal').style.display = 'flex';
        document.getElementById('project-name-input').focus();
    }
    
    hideProjectModal() {
        document.getElementById('project-modal').style.display = 'none';
        // Clear form
        document.getElementById('project-name-input').value = '';
        document.getElementById('project-type').value = 'javascript';
        document.getElementById('project-description').value = '';
    }
    
    createProject() {
        const name = document.getElementById('project-name-input').value.trim();
        const type = document.getElementById('project-type').value;
        const description = document.getElementById('project-description').value.trim();
        
        if (!name) {
            alert('Bitte gib einen Projektnamen ein!');
            return;
        }
        
        try {
            const project = this.projectManager.createProject(name, type, description);
            this.openProject(name);
            this.hideProjectModal();
            console.log(`Projekt "${name}" wurde erfolgreich erstellt!`);
        } catch (error) {
            alert(error.message);
        }
    }
    
    showProjectSelector() {
        const projects = this.projectManager.listProjects();
        if (projects.length === 0) {
            alert('Keine Projekte vorhanden. Erstelle zuerst ein Projekt!');
            return;
        }
        
        const projectList = projects.map((name, index) => `${index + 1}. ${name}`).join('\n');
        const selection = prompt(`Wähle ein Projekt:\n\n${projectList}\n\nGib die Nummer ein:`);
        
        if (selection) {
            const index = parseInt(selection) - 1;
            if (index >= 0 && index < projects.length) {
                this.openProject(projects[index]);
            } else {
                alert('Ungültige Auswahl!');
            }
        }
    }
    
    openProject(projectName) {
        try {
            const project = this.projectManager.openProject(projectName);
            
            // Clear current state
            this.openFiles.clear();
            this.fileContents.clear();
            
            // Load project files
            for (const [fileName, content] of Object.entries(project.files || {})) {
                this.fileContents.set(fileName, content);
            }
            
            // Update UI
            this.updateProjectDisplay();
            this.updateFileTree();
            
            // Clear tabs and editor
            document.getElementById('tab-bar').innerHTML = '';
            document.getElementById('code-editor').value = '';
            this.currentFile = null;
            
            // Open first file if available
            const firstFile = Object.keys(project.files || {})[0];
            if (firstFile) {
                this.openFile(firstFile);
            }
            
            console.log(`Projekt "${projectName}" wurde geöffnet!`);
        } catch (error) {
            alert(error.message);
        }
    }
    
    updateProjectDisplay() {
        const projectNameEl = document.getElementById('project-name');
        const projectPathEl = document.getElementById('project-path');
        
        const currentProject = this.projectManager.getCurrentProject();
        if (currentProject) {
            projectNameEl.textContent = currentProject.name;
            projectPathEl.textContent = `${currentProject.type} • ${Object.keys(currentProject.files || {}).length} Dateien`;
        } else {
            projectNameEl.textContent = 'Willkommen';
            projectPathEl.textContent = 'Kein Projekt geöffnet';
        }
    }
    
    updateFileTree() {
        const fileTree = document.getElementById('file-tree');
        fileTree.innerHTML = '';
        
        const currentProject = this.projectManager.getCurrentProject();
        if (!currentProject) {
            this.showWelcomeScreen();
            return;
        }
        
        const files = currentProject.files || {};
        
        if (Object.keys(files).length === 0) {
            fileTree.innerHTML = `
                <div style="padding: 20px; text-align: center; color: #808080;">
                    <p>📁 Projekt ist leer</p>
                    <p>Erstelle deine erste Datei!</p>
                </div>
            `;
            return;
        }
        
        // Sort files by name
        const sortedFiles = Object.keys(files).sort();
        
        sortedFiles.forEach(fileName => {
            this.addFileToTree(fileName);
        });
    }
    

    
    openLivePreview() {
        const currentProject = this.projectManager.getCurrentProject();
        if (!currentProject) {
            alert('Bitte öffne zuerst ein Projekt!');
            return;
        }
        
        // Create preview content
        let previewContent;
        let windowTitle;
        
        if (currentProject.type === 'fullstack') {
            previewContent = this.createFullstackInstructions(currentProject);
            windowTitle = `${currentProject.name} - Setup Guide`;
        } else {
            const htmlFile = Object.keys(currentProject.files).find(fileName => 
                fileName.endsWith('.html') || fileName === 'index.html'
            );
            
            if (htmlFile) {
                previewContent = this.createPreviewHtml(currentProject, htmlFile);
                windowTitle = `${currentProject.name} - Live Preview`;
            } else {
                previewContent = `
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <title>Keine Vorschau verfügbar</title>
                        <style>
                            body { 
                                font-family: Arial, sans-serif; 
                                text-align: center; 
                                margin-top: 100px;
                                background: #f5f5f5;
                            }
                            .message {
                                background: white;
                                padding: 40px;
                                border-radius: 10px;
                                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                                display: inline-block;
                            }
                        </style>
                    </head>
                    <body>
                        <div class="message">
                            <h2>📄 Keine HTML-Datei gefunden</h2>
                            <p>Dieses Projekt enthält keine HTML-Dateien für die Vorschau.</p>
                            <p>Erstelle eine <code>index.html</code> Datei, um die Live Preview zu verwenden.</p>
                        </div>
                    </body>
                    </html>
                `;
                windowTitle = 'Keine Vorschau verfügbar';
            }
        }
        
        // Create blob URL for better compatibility
        const blob = new Blob([previewContent], { type: 'text/html;charset=utf-8' });
        const blobUrl = URL.createObjectURL(blob);
        
        // Open in new window with specific dimensions
        const newWindow = window.open(blobUrl, '_blank', 'width=1200,height=800,scrollbars=yes,resizable=yes');
        
        if (newWindow) {
            // Clean up the blob URL after a delay to prevent memory leaks
            setTimeout(() => {
                URL.revokeObjectURL(blobUrl);
            }, 5000);
            
            console.log(`Live Preview geöffnet für: ${currentProject.name}`);
        } else {
            // Clean up immediately if window failed to open
            URL.revokeObjectURL(blobUrl);
            alert('Popup wurde blockiert! Bitte erlaube Popups für diese Seite und versuche es erneut.');
        }
    }
    

    
    createPreviewHtml(project, htmlFile) {
        let htmlContent = project.files[htmlFile];
        
        console.log('Original HTML:', htmlContent.substring(0, 200) + '...');
        
        // Ensure we have a proper HTML structure
        if (!htmlContent.includes('<html>') && !htmlContent.includes('<HTML>')) {
            htmlContent = `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <title>${project.name} - Preview</title>
                </head>
                <body>
                    ${htmlContent}
                </body>
                </html>
            `;
        }
        
        // Inject CSS if exists
        const cssFiles = Object.keys(project.files).filter(fileName => fileName.endsWith('.css'));
        cssFiles.forEach(cssFile => {
            const cssContent = project.files[cssFile];
            console.log(`Injecting CSS from ${cssFile}:`, cssContent.substring(0, 100) + '...');
            
            if (htmlContent.includes('</head>')) {
                htmlContent = htmlContent.replace(
                    '</head>',
                    `<style>\n${cssContent}\n</style>\n</head>`
                );
            } else {
                // If no head tag, add one
                htmlContent = htmlContent.replace(
                    '<body>',
                    `<head><style>\n${cssContent}\n</style></head>\n<body>`
                );
            }
        });
        
        // Inject JS if exists
        const jsFiles = Object.keys(project.files).filter(fileName => fileName.endsWith('.js'));
        jsFiles.forEach(jsFile => {
            const jsContent = project.files[jsFile];
            console.log(`Injecting JS from ${jsFile}:`, jsContent.substring(0, 100) + '...');
            
            if (htmlContent.includes('</body>')) {
                htmlContent = htmlContent.replace(
                    '</body>',
                    `<script>\n${jsContent}\n</script>\n</body>`
                );
            } else {
                // If no body tag, add script at the end
                htmlContent += `<script>\n${jsContent}\n</script>`;
            }
        });
        
        console.log('Final HTML:', htmlContent.substring(0, 300) + '...');
        return htmlContent;
    }
    
    createFullstackInstructions(project) {
        return `
            <!DOCTYPE html>
            <html>
            <head>
                <title>${project.name} - Setup Guide</title>
                <style>
                    body { 
                        font-family: 'Segoe UI', sans-serif; 
                        max-width: 800px; 
                        margin: 30px auto; 
                        padding: 20px;
                        background: #f8f9fa;
                        line-height: 1.6;
                    }
                    .container {
                        background: white;
                        padding: 30px;
                        border-radius: 12px;
                        box-shadow: 0 4px 20px rgba(0,0,0,0.1);
                    }
                    h1 { 
                        color: #2d3748; 
                        margin-bottom: 20px;
                        text-align: center;
                    }
                    .step { 
                        background: #f7fafc; 
                        padding: 20px; 
                        margin: 20px 0; 
                        border-left: 4px solid #667eea;
                        border-radius: 8px;
                    }
                    .step h3 {
                        color: #2d3748;
                        margin-top: 0;
                    }
                    code { 
                        background: #edf2f7; 
                        padding: 4px 8px; 
                        border-radius: 4px;
                        font-family: 'JetBrains Mono', 'Courier New', monospace;
                        font-size: 14px;
                    }
                    .highlight { 
                        color: #667eea; 
                        font-weight: bold; 
                    }
                    a {
                        color: #667eea;
                        text-decoration: none;
                        font-weight: 500;
                    }
                    a:hover {
                        text-decoration: underline;
                    }
                    .warning {
                        background: #fed7d7;
                        border-left-color: #f56565;
                        color: #742a2a;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>🚀 ${project.name}</h1>
                    <p style="text-align: center; color: #718096;">Fullstack Development Setup</p>
                    
                    <div class="step">
                        <h3>1. 🌱 Backend starten (Spring Boot)</h3>
                        <p>Exportiere das Projekt und navigiere zum Backend-Ordner:</p>
                        <code>cd ${project.name}/backend</code><br><br>
                        <code>mvn spring-boot:run</code>
                        <p class="highlight">Backend Server: <a href="http://localhost:8080" target="_blank">http://localhost:8080</a></p>
                    </div>
                    
                    <div class="step">
                        <h3>2. 🌐 Frontend starten</h3>
                        <p>In einem neuen Terminal, navigiere zum Frontend-Ordner:</p>
                        <code>cd ${project.name}/frontend</code><br><br>
                        <code>python3 -m http.server 3000</code>
                        <p class="highlight">Frontend App: <a href="http://localhost:3000" target="_blank">http://localhost:3000</a></p>
                    </div>
                    
                    <div class="step">
                        <h3>3. 🔍 API testen</h3>
                        <p>Teste die REST API Endpoints:</p>
                        <p>📊 <a href="http://localhost:8080/api/users" target="_blank">Users API</a></p>
                        <p>💾 <a href="http://localhost:8080/h2-console" target="_blank">H2 Database Console</a></p>
                        <p><small>H2 Console Login: <code>jdbc:h2:mem:testdb</code>, User: <code>sa</code>, Password: <em>(leer)</em></small></p>
                    </div>
                    
                    <div class="step warning">
                        <h3>⚠️ Voraussetzungen</h3>
                        <p>Stelle sicher, dass folgende Software installiert ist:</p>
                        <ul>
                            <li><strong>Java 17+</strong> - für Spring Boot</li>
                            <li><strong>Maven 3.6+</strong> - für Build Management</li>
                            <li><strong>Python 3</strong> - für Frontend Server</li>
                        </ul>
                    </div>
                    
                    <div class="step">
                        <h3>🎉 Vollständige Anwendung</h3>
                        <p>Nach dem Start beider Server kannst du die komplette Anwendung verwenden:</p>
                        <p class="highlight">🔗 <a href="http://localhost:3000" target="_blank">Frontend öffnen</a></p>
                        <p>Das Frontend kommuniziert automatisch mit dem Backend über die REST API.</p>
                    </div>
                </div>
            </body>
            </html>
        `;
    }
    

    
    openExternalPreview() {
        // This is now the same as openLivePreview since we always open externally
        this.openLivePreview();
    }
    
    showImportDialog() {
        console.log('showImportDialog called');
        const fileInput = document.getElementById('import-file-input');
        console.log('File input element:', fileInput);
        if (fileInput) {
            fileInput.click();
            console.log('File input clicked');
        } else {
            console.error('File input element not found!');
            alert('Fehler: File input element nicht gefunden!');
        }
    }
    
    async handleImportFiles(files) {
        if (!files || files.length === 0) {
            alert('Keine Dateien ausgewählt!');
            return;
        }
        
        try {
            // Get project name from the first file's path
            const firstFile = files[0];
            const pathParts = firstFile.webkitRelativePath.split('/');
            const projectName = pathParts[0];
            
            // Check if project already exists
            if (this.projectManager.projectExists(projectName)) {
                const overwrite = confirm(`Projekt "${projectName}" existiert bereits. Überschreiben?`);
                if (!overwrite) {
                    return;
                }
            }
            
            // Process all files
            const projectFiles = {};
            const filePromises = Array.from(files).map(file => {
                return new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        // Get relative path within the project
                        const relativePath = file.webkitRelativePath.split('/').slice(1).join('/');
                        if (relativePath) { // Skip empty paths
                            projectFiles[relativePath] = e.target.result;
                        }
                        resolve();
                    };
                    reader.onerror = reject;
                    
                    // Read as text for most files, binary for images/etc
                    if (this.isTextFile(file.name)) {
                        reader.readAsText(file);
                    } else {
                        reader.readAsDataURL(file);
                    }
                });
            });
            
            await Promise.all(filePromises);
            
            // Create project with imported files
            const project = {
                name: projectName,
                type: this.detectProjectType(projectFiles),
                description: `Importiertes Projekt vom ${new Date().toLocaleDateString()}`,
                files: projectFiles,
                createdAt: new Date().toISOString()
            };
            
            // Save and open project
            this.projectManager.saveProject(project);
            this.openProject(projectName);
            
            console.log(`Projekt "${projectName}" erfolgreich importiert mit ${Object.keys(projectFiles).length} Dateien`);
            alert(`Projekt "${projectName}" wurde erfolgreich importiert!`);
            
        } catch (error) {
            console.error('Fehler beim Importieren:', error);
            alert('Fehler beim Importieren des Projekts: ' + error.message);
        }
        
        // Reset file input
        document.getElementById('import-file-input').value = '';
    }
    
    isTextFile(filename) {
        const textExtensions = ['.txt', '.js', '.html', '.css', '.json', '.md', '.xml', '.java', '.py', '.cpp', '.c', '.h', '.php', '.rb', '.go', '.ts', '.jsx', '.tsx', '.vue', '.yml', '.yaml', '.properties', '.sql', '.sh', '.bat', '.gitignore', '.env'];
        const ext = filename.toLowerCase().substring(filename.lastIndexOf('.'));
        return textExtensions.includes(ext) || !filename.includes('.');
    }
    
    detectProjectType(files) {
        const fileNames = Object.keys(files);
        
        // Check for Spring Boot (pom.xml or build.gradle + Java files)
        if (fileNames.some(f => f === 'pom.xml' || f === 'build.gradle') && 
            fileNames.some(f => f.endsWith('.java'))) {
            return 'fullstack';
        }
        
        // Check for Node.js project
        if (fileNames.includes('package.json')) {
            return 'javascript';
        }
        
        // Check for Python project
        if (fileNames.some(f => f.endsWith('.py')) || fileNames.includes('requirements.txt')) {
            return 'python';
        }
        
        // Check for HTML project
        if (fileNames.some(f => f.endsWith('.html'))) {
            return 'html';
        }
        
        // Default to general project
        return 'general';
    }
    
    createPreviewWindow(project) {
        // Create a new window for preview
        const previewWindow = window.open('', '_blank', 'width=1200,height=800');
        
        if (project.type === 'fullstack') {
            // For fullstack projects, show instructions
            previewWindow.document.write(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>${project.name} - Live Preview</title>
                    <style>
                        body { 
                            font-family: 'Segoe UI', sans-serif; 
                            max-width: 800px; 
                            margin: 50px auto; 
                            padding: 20px;
                            background: #f5f5f5;
                        }
                        .container {
                            background: white;
                            padding: 30px;
                            border-radius: 10px;
                            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                        }
                        h1 { color: #333; margin-bottom: 20px; }
                        .step { 
                            background: #f8f9fa; 
                            padding: 15px; 
                            margin: 15px 0; 
                            border-left: 4px solid #667eea;
                            border-radius: 5px;
                        }
                        code { 
                            background: #e9ecef; 
                            padding: 2px 6px; 
                            border-radius: 3px;
                            font-family: 'JetBrains Mono', monospace;
                        }
                        .highlight { color: #667eea; font-weight: bold; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h1>🚀 ${project.name} - Fullstack Preview</h1>
                        <p>Um dein Fullstack-Projekt zu starten, folge diesen Schritten:</p>
                        
                        <div class="step">
                            <h3>1. Backend starten (Spring Boot)</h3>
                            <p>Navigiere zum Backend-Ordner und starte den Server:</p>
                            <code>cd backend && mvn spring-boot:run</code>
                            <p class="highlight">Backend läuft auf: http://localhost:8080</p>
                        </div>
                        
                        <div class="step">
                            <h3>2. Frontend starten</h3>
                            <p>Navigiere zum Frontend-Ordner und starte einen lokalen Server:</p>
                            <code>cd frontend && python -m http.server 3000</code>
                            <p class="highlight">Frontend läuft auf: http://localhost:3000</p>
                        </div>
                        
                        <div class="step">
                            <h3>3. API testen</h3>
                            <p>Teste die API direkt:</p>
                            <p><a href="http://localhost:8080/api/users" target="_blank">http://localhost:8080/api/users</a></p>
                            <p><a href="http://localhost:8080/h2-console" target="_blank">H2 Database Console</a></p>
                        </div>
                        
                        <div class="step">
                            <h3>4. Vollständige Anwendung</h3>
                            <p>Nach dem Start beider Server:</p>
                            <p><a href="http://localhost:3000" target="_blank" class="highlight">Frontend öffnen (localhost:3000)</a></p>
                        </div>
                        
                        <p><strong>Tipp:</strong> Stelle sicher, dass Java 17+ und Maven installiert sind!</p>
                    </div>
                </body>
                </html>
            `);
        } else {
            // For HTML projects, create live preview
            const htmlFile = Object.keys(project.files).find(fileName => 
                fileName.endsWith('.html') || fileName === 'index.html'
            );
            
            if (htmlFile) {
                let htmlContent = project.files[htmlFile];
                
                // Inject CSS if exists
                const cssFiles = Object.keys(project.files).filter(fileName => fileName.endsWith('.css'));
                cssFiles.forEach(cssFile => {
                    const cssContent = project.files[cssFile];
                    htmlContent = htmlContent.replace(
                        '</head>',
                        `<style>${cssContent}</style></head>`
                    );
                });
                
                // Inject JS if exists
                const jsFiles = Object.keys(project.files).filter(fileName => fileName.endsWith('.js'));
                jsFiles.forEach(jsFile => {
                    const jsContent = project.files[jsFile];
                    htmlContent = htmlContent.replace(
                        '</body>',
                        `<script>${jsContent}</script></body>`
                    );
                });
                
                previewWindow.document.write(htmlContent);
            }
        }
        
        previewWindow.document.close();
    }
    
    exportProject() {
        const currentProject = this.projectManager.getCurrentProject();
        if (!currentProject) {
            alert('Bitte öffne zuerst ein Projekt!');
            return;
        }
        
        // Create ZIP-like structure as JSON
        const exportData = {
            name: currentProject.name,
            type: currentProject.type,
            description: currentProject.description,
            files: currentProject.files,
            exportDate: new Date().toISOString(),
            version: '1.0.0'
        };
        
        // Create download
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
            type: 'application/json' 
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${currentProject.name}.intellij-project.json`;
        a.click();
        URL.revokeObjectURL(url);
        
        // Also create individual files
        this.exportIndividualFiles(currentProject);
        
        console.log(`Projekt "${currentProject.name}" wurde exportiert!`);
    }
    
    exportIndividualFiles(project) {
        // Create a delay between downloads to avoid browser blocking
        let delay = 0;
        
        Object.entries(project.files).forEach(([fileName, content]) => {
            setTimeout(() => {
                const blob = new Blob([content], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = fileName;
                a.click();
                URL.revokeObjectURL(url);
            }, delay);
            delay += 100; // 100ms delay between each file
        });
    }
    
    addFileToTree(fileName) {
        const fileTree = document.getElementById('file-tree');
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';
        fileItem.dataset.type = 'file';
        fileItem.dataset.name = fileName;
        
        const extension = fileName.split('.').pop().toLowerCase();
        let icon = '📄';
        
        switch (extension) {
            case 'js':
                icon = '📄';
                break;
            case 'html':
                icon = '🌐';
                break;
            case 'css':
                icon = '🎨';
                break;
            case 'json':
                icon = '📋';
                break;
            case 'md':
                icon = '📝';
                break;
        }
        
        fileItem.innerHTML = `
            <span class="file-icon">${icon}</span>
            <span class="file-name">${fileName}</span>
        `;
        
        fileTree.appendChild(fileItem);
    }
    
    openFile(fileName) {
        if (!this.openFiles.has(fileName)) {
            this.openFiles.set(fileName, true);
            this.createTab(fileName);
        }
        
        this.switchToFile(fileName);
    }
    
    createTab(fileName) {
        const tabBar = document.getElementById('tab-bar');
        const tab = document.createElement('div');
        tab.className = 'tab';
        tab.dataset.file = fileName;
        
        tab.innerHTML = `
            <span class="tab-name">${fileName}</span>
            <button class="tab-close">×</button>
        `;
        
        tabBar.appendChild(tab);
    }
    
    switchToFile(fileName) {
        // Save current file content
        if (this.currentFile) {
            const codeEditor = document.getElementById('code-editor');
            this.fileContents.set(this.currentFile, codeEditor.value);
        }
        
        // Switch to new file
        this.currentFile = fileName;
        this.loadFile(fileName);
        
        // Update UI
        this.updateActiveTab();
        this.updateActiveFileInTree();
        this.updateStatusBar();
    }
    
    loadFile(fileName) {
        const codeEditor = document.getElementById('code-editor');
        const content = this.fileContents.get(fileName) || '';
        codeEditor.value = content;
        this.updateLineNumbers();
        this.applySyntaxHighlighting();
    }
    
    closeTab(fileName) {
        this.openFiles.delete(fileName);
        
        // Remove tab from DOM
        const tab = document.querySelector(`[data-file="${fileName}"]`);
        if (tab) {
            tab.remove();
        }
        
        // If this was the current file, switch to another open file
        if (this.currentFile === fileName) {
            const remainingFiles = Array.from(this.openFiles.keys());
            if (remainingFiles.length > 0) {
                this.switchToFile(remainingFiles[0]);
            } else {
                this.currentFile = null;
                document.getElementById('code-editor').value = '';
                this.updateLineNumbers();
            }
        }
    }
    
    closeCurrentTab() {
        if (this.currentFile) {
            this.closeTab(this.currentFile);
        }
    }
    
    updateActiveTab() {
        document.querySelectorAll('.tab').forEach(tab => {
            tab.classList.remove('active');
        });
        
        const activeTab = document.querySelector(`[data-file="${this.currentFile}"]`);
        if (activeTab) {
            activeTab.classList.add('active');
        }
    }
    
    updateActiveFileInTree() {
        document.querySelectorAll('.file-item').forEach(item => {
            item.classList.remove('active');
        });
        
        const activeFile = document.querySelector(`[data-name="${this.currentFile}"]`);
        if (activeFile) {
            activeFile.classList.add('active');
        }
    }
    
    updateLineNumbers() {
        const codeEditor = document.getElementById('code-editor');
        const lineNumbers = document.getElementById('line-numbers');
        const lines = codeEditor.value.split('\n');
        
        lineNumbers.innerHTML = '';
        for (let i = 1; i <= lines.length; i++) {
            const lineNumber = document.createElement('div');
            lineNumber.className = 'line-number';
            lineNumber.textContent = i;
            lineNumbers.appendChild(lineNumber);
        }
    }
    
    updateStatusBar() {
        const codeEditor = document.getElementById('code-editor');
        const cursorPos = this.getCursorPosition(codeEditor);
        
        document.getElementById('cursor-position').textContent = 
            `Zeile ${cursorPos.line}, Spalte ${cursorPos.column}`;
        
        // Update file type based on extension
        if (this.currentFile) {
            const extension = this.currentFile.split('.').pop().toLowerCase();
            let fileType = 'Text';
            
            switch (extension) {
                case 'js':
                    fileType = 'JavaScript';
                    break;
                case 'html':
                    fileType = 'HTML';
                    break;
                case 'css':
                    fileType = 'CSS';
                    break;
                case 'json':
                    fileType = 'JSON';
                    break;
                case 'md':
                    fileType = 'Markdown';
                    break;
            }
            
            document.getElementById('file-type').textContent = fileType;
        }
    }
    
    getCursorPosition(textarea) {
        const text = textarea.value;
        const cursorPos = textarea.selectionStart;
        const textBeforeCursor = text.substring(0, cursorPos);
        const lines = textBeforeCursor.split('\n');
        
        return {
            line: lines.length,
            column: lines[lines.length - 1].length + 1
        };
    }
    
    applySyntaxHighlighting() {
        const editor = document.getElementById('code-editor');
        const content = editor.value;
        const fileType = this.getFileType(this.currentFile || 'untitled.txt');
        
        // Update file type in status bar
        const fileTypeElement = document.getElementById('file-type');
        if (fileTypeElement) {
            fileTypeElement.textContent = this.getFileTypeDisplayName(fileType);
        }
        
        // Simple syntax highlighting for better UX
        // Note: This is basic highlighting for demonstration
        // A full implementation would use a proper syntax highlighter
        this.updateEditorStyling(fileType);
    }
    
    getFileType(filename) {
        const extension = filename.split('.').pop().toLowerCase();
        const typeMap = {
            'java': 'java',
            'js': 'javascript',
            'javascript': 'javascript',
            'html': 'html',
            'htm': 'html',
            'css': 'css',
            'json': 'json',
            'md': 'markdown',
            'txt': 'text',
            'py': 'python',
            'cpp': 'cpp',
            'c': 'c',
            'h': 'c'
        };
        return typeMap[extension] || 'text';
    }
    
    getFileTypeDisplayName(fileType) {
        const displayNames = {
            'java': 'Java',
            'javascript': 'JavaScript',
            'html': 'HTML',
            'css': 'CSS',
            'json': 'JSON',
            'markdown': 'Markdown',
            'python': 'Python',
            'cpp': 'C++',
            'c': 'C',
            'text': 'Text'
        };
        return displayNames[fileType] || 'Text';
    }
    
    updateEditorStyling(fileType) {
        const editor = document.getElementById('code-editor');
        
        // Remove existing syntax classes
        editor.classList.remove('syntax-java', 'syntax-javascript', 'syntax-html', 'syntax-css');
        
        // Add appropriate syntax class
        if (fileType !== 'text') {
            editor.classList.add(`syntax-${fileType}`);
        }
        
        // Update tab icon based on file type
        this.updateTabIcon(fileType);
    }
    
    updateTabIcon(fileType) {
        const activeTab = document.querySelector('.tab.active');
        if (!activeTab) return;
        
        const iconElement = activeTab.querySelector('.tab-icon');
        if (!iconElement) return;
        
        const icons = {
            'java': '☕',
            'javascript': '🟨',
            'html': '🌐',
            'css': '🎨',
            'json': '📋',
            'markdown': '📝',
            'python': '🐍',
            'cpp': '⚙️',
            'c': '⚙️',
            'text': '📄'
        };
        
        iconElement.textContent = icons[fileType] || '📄';
    }
    
    handleCodeChange(e) {
        // Save to undo stack
        this.saveToUndoStack();
        
        // Update file content
        if (this.currentFile) {
            this.fileContents.set(this.currentFile, e.target.value);
            
            // Auto-save to project
            clearTimeout(this.autoSaveTimeout);
            this.autoSaveTimeout = setTimeout(() => {
                this.projectManager.updateProjectFile(this.currentFile, e.target.value);
            }, 1000);
        }
    }
    
    saveToUndoStack() {
        if (this.currentFile) {
            const currentContent = document.getElementById('code-editor').value;
            this.undoStack.push({
                file: this.currentFile,
                content: currentContent
            });
            
            // Limit undo stack size
            if (this.undoStack.length > 50) {
                this.undoStack.shift();
            }
            
            // Clear redo stack
            this.redoStack = [];
        }
    }
    
    undo() {
        if (this.undoStack.length > 0) {
            const current = {
                file: this.currentFile,
                content: document.getElementById('code-editor').value
            };
            
            this.redoStack.push(current);
            
            const previous = this.undoStack.pop();
            if (previous.file === this.currentFile) {
                document.getElementById('code-editor').value = previous.content;
                this.updateLineNumbers();
            }
        }
    }
    
    redo() {
        if (this.redoStack.length > 0) {
            const current = {
                file: this.currentFile,
                content: document.getElementById('code-editor').value
            };
            
            this.undoStack.push(current);
            
            const next = this.redoStack.pop();
            if (next.file === this.currentFile) {
                document.getElementById('code-editor').value = next.content;
                this.updateLineNumbers();
            }
        }
    }
    
    showSearch() {
        const searchBar = document.getElementById('search-bar');
        searchBar.style.display = 'flex';
        document.getElementById('search-input').focus();
    }
    
    closeSearch() {
        const searchBar = document.getElementById('search-bar');
        searchBar.style.display = 'none';
        this.searchMatches = [];
        this.currentSearchIndex = -1;
    }
    
    performSearch(query) {
        if (!query) {
            this.searchMatches = [];
            this.currentSearchIndex = -1;
            return;
        }
        
        const codeEditor = document.getElementById('code-editor');
        const text = codeEditor.value.toLowerCase();
        const searchText = query.toLowerCase();
        
        this.searchMatches = [];
        let index = text.indexOf(searchText);
        
        while (index !== -1) {
            this.searchMatches.push(index);
            index = text.indexOf(searchText, index + 1);
        }
        
        if (this.searchMatches.length > 0) {
            this.currentSearchIndex = 0;
            this.highlightSearchResult();
        }
    }
    
    nextSearchResult() {
        if (this.searchMatches.length > 0) {
            this.currentSearchIndex = (this.currentSearchIndex + 1) % this.searchMatches.length;
            this.highlightSearchResult();
        }
    }
    
    previousSearchResult() {
        if (this.searchMatches.length > 0) {
            this.currentSearchIndex = this.currentSearchIndex === 0 ? 
                this.searchMatches.length - 1 : this.currentSearchIndex - 1;
            this.highlightSearchResult();
        }
    }
    
    highlightSearchResult() {
        if (this.currentSearchIndex >= 0 && this.currentSearchIndex < this.searchMatches.length) {
            const codeEditor = document.getElementById('code-editor');
            const start = this.searchMatches[this.currentSearchIndex];
            const query = document.getElementById('search-input').value;
            const end = start + query.length;
            
            codeEditor.setSelectionRange(start, end);
            codeEditor.focus();
        }
    }
    
    saveCurrentFile() {
        if (this.currentFile && this.projectManager.currentProject) {
            const content = document.getElementById('code-editor').value;
            this.fileContents.set(this.currentFile, content);
            this.projectManager.updateProjectFile(this.currentFile, content);
            
            // Create download link
            const blob = new Blob([content], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = this.currentFile;
            a.click();
            URL.revokeObjectURL(url);
            
            console.log(`Datei "${this.currentFile}" wurde gespeichert!`);
        }
    }
    
    handleFileUpload(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const content = event.target.result;
                this.fileContents.set(file.name, content);
                this.addFileToTree(file.name);
                this.openFile(file.name);
            };
            reader.readAsText(file);
        }
    }
    
    toggleSidebar() {
        const sidebar = document.getElementById('sidebar');
        sidebar.classList.toggle('collapsed');
    }
    
    toggleTheme() {
        // Theme toggle functionality would go here
        alert('Theme-Wechsel wird in einer zukünftigen Version implementiert!');
    }
}

// Initialize the IDE when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new IntelliJClone();
});

// Add some utility functions
window.intellijClone = {
    version: '1.0.0',
    author: 'IntelliJ Clone Team',
    
    getInfo() {
        return {
            version: this.version,
            author: this.author,
            features: [
                'Datei Explorer',
                'Code Editor mit Tabs',
                'Syntax Highlighting (Basic)',
                'Suchen & Ersetzen',
                'Tastenkürzel',
                'Undo/Redo',
                'Datei Import/Export'
            ]
        };
    }
};
