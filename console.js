// Console Management System for IntelliJ Clone
class ConsoleManager {
    constructor() {
        this.currentTab = 'output';
        this.isCollapsed = false;
        this.commandHistory = [];
        this.historyIndex = -1;
        this.javaSimulator = new JavaSimulator();
        this.initializeConsole();
        this.setupEventListeners();
    }

    initializeConsole() {
        // Console tab switching
        const consoleTabs = document.querySelectorAll('.console-tab');
        consoleTabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                this.switchTab(e.target.dataset.tab);
            });
        });

        // Console actions
        document.getElementById('run-code-btn').addEventListener('click', () => {
            this.runCode();
        });

        document.getElementById('clear-console-btn').addEventListener('click', () => {
            this.clearConsole();
        });

        document.getElementById('toggle-console-btn').addEventListener('click', () => {
            this.toggleConsole();
        });

        // Terminal input
        const terminalInput = document.getElementById('terminal-input');
        terminalInput.addEventListener('keydown', (e) => {
            this.handleTerminalInput(e);
        });

        // F5 key for running code
        document.addEventListener('keydown', (e) => {
            if (e.key === 'F5') {
                e.preventDefault();
                this.runCode();
            }
        });
    }

    setupEventListeners() {
        // Auto-scroll console output
        this.setupAutoScroll();
    }

    switchTab(tabName) {
        // Update active tab
        document.querySelectorAll('.console-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Update active content
        document.querySelectorAll('.console-tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`${tabName}-content`).classList.add('active');

        this.currentTab = tabName;
    }

    runCode() {
        const editor = document.getElementById('code-editor');
        const code = editor.value.trim();
        
        if (!code) {
            this.addOutput('⚠️ Kein Code zum Ausführen gefunden', 'warning');
            return;
        }

        // Get current file type
        const currentTab = document.querySelector('.tab.active');
        const fileName = currentTab ? currentTab.textContent.replace('×', '').trim() : 'untitled';
        const fileExtension = fileName.split('.').pop().toLowerCase();

        this.addOutput(`🚀 Code wird ausgeführt... (${fileName})`, 'info');
        
        // Simulate code execution based on file type
        setTimeout(() => {
            this.executeCode(code, fileExtension);
        }, 500);
    }

    executeCode(code, fileType) {
        try {
            switch (fileType) {
                case 'java':
                    this.executeJavaCode(code);
                    break;
                case 'js':
                case 'javascript':
                    this.executeJavaScriptCode(code);
                    break;
                case 'html':
                    this.executeHTMLCode(code);
                    break;
                case 'css':
                    this.executeCSSCode(code);
                    break;
                default:
                    this.addOutput(`📄 Dateitype "${fileType}" wird als Text behandelt`, 'info');
                    this.addOutput(code, 'output');
            }
        } catch (error) {
            this.addOutput(`❌ Fehler bei der Ausführung: ${error.message}`, 'error');
        }
    }

    executeJavaCode(code) {
        this.addOutput('☕ Java Code wird simuliert...', 'info');
        const result = this.javaSimulator.execute(code);
        
        result.output.forEach(line => {
            this.addOutput(line, 'output');
        });

        if (result.errors.length > 0) {
            result.errors.forEach(error => {
                this.addOutput(`❌ ${error}`, 'error');
                this.addProblem('error', error, 'Java Compilation Error');
            });
        } else {
            this.addOutput('✅ Java Code erfolgreich ausgeführt', 'success');
        }
    }

    executeJavaScriptCode(code) {
        this.addOutput('🟨 JavaScript Code wird ausgeführt...', 'info');
        
        // Capture console.log output
        const originalLog = console.log;
        const outputs = [];
        
        console.log = (...args) => {
            outputs.push(args.join(' '));
        };

        try {
            // Create a safe execution context
            const result = new Function(code)();
            
            // Restore console.log
            console.log = originalLog;
            
            // Display captured outputs
            outputs.forEach(output => {
                this.addOutput(output, 'output');
            });

            if (result !== undefined) {
                this.addOutput(`Rückgabewert: ${result}`, 'output');
            }

            this.addOutput('✅ JavaScript Code erfolgreich ausgeführt', 'success');
            
        } catch (error) {
            console.log = originalLog;
            this.addOutput(`❌ JavaScript Fehler: ${error.message}`, 'error');
            this.addProblem('error', error.message, 'JavaScript Runtime Error');
        }
    }

    executeHTMLCode(code) {
        this.addOutput('🌐 HTML Code wird analysiert...', 'info');
        
        // Simple HTML validation
        const parser = new DOMParser();
        const doc = parser.parseFromString(code, 'text/html');
        const errors = doc.querySelectorAll('parsererror');
        
        if (errors.length > 0) {
            errors.forEach(error => {
                this.addOutput(`❌ HTML Parse Error: ${error.textContent}`, 'error');
            });
        } else {
            this.addOutput('✅ HTML Syntax ist gültig', 'success');
            this.addOutput('💡 Tipp: Verwende Live Preview für die Vorschau', 'info');
        }
    }

    executeCSSCode(code) {
        this.addOutput('🎨 CSS Code wird validiert...', 'info');
        
        // Simple CSS validation
        try {
            // Create a temporary style element to test CSS
            const style = document.createElement('style');
            style.textContent = code;
            document.head.appendChild(style);
            document.head.removeChild(style);
            
            this.addOutput('✅ CSS Syntax ist gültig', 'success');
            this.addOutput('💡 Tipp: Verwende Live Preview für die Vorschau', 'info');
        } catch (error) {
            this.addOutput(`❌ CSS Fehler: ${error.message}`, 'error');
        }
    }

    addOutput(message, type = 'output') {
        const outputContainer = document.getElementById('console-output');
        const line = document.createElement('div');
        line.className = `console-line ${type}`;
        
        // Add timestamp for certain types
        if (type === 'info' || type === 'error' || type === 'success') {
            const timestamp = new Date().toLocaleTimeString();
            line.textContent = `[${timestamp}] ${message}`;
        } else {
            line.textContent = message;
        }
        
        outputContainer.appendChild(line);
        this.scrollToBottom(outputContainer);
    }

    addProblem(type, message, location) {
        const problemsList = document.getElementById('problems-list');
        
        // Remove "no problems" message if it exists
        const noProblems = problemsList.querySelector('.no-problems');
        if (noProblems) {
            noProblems.remove();
        }

        const problemItem = document.createElement('div');
        problemItem.className = 'problem-item';
        
        problemItem.innerHTML = `
            <div class="problem-icon ${type}">
                ${type === 'error' ? '🔴' : type === 'warning' ? '🟡' : '🔵'}
            </div>
            <div class="problem-details">
                <div class="problem-message">${message}</div>
                <div class="problem-location">${location}</div>
            </div>
        `;
        
        problemsList.appendChild(problemItem);
    }

    clearConsole() {
        const outputContainer = document.getElementById('console-output');
        outputContainer.innerHTML = `
            <div class="console-line welcome">🚀 Console geleert - Bereit für neue Ausgaben!</div>
        `;

        // Clear problems
        const problemsList = document.getElementById('problems-list');
        problemsList.innerHTML = `
            <div class="no-problems">✅ Keine Probleme gefunden</div>
        `;
    }

    toggleConsole() {
        const consolePanel = document.getElementById('console-panel');
        consolePanel.classList.toggle('collapsed');
        this.isCollapsed = !this.isCollapsed;
        
        const toggleBtn = document.getElementById('toggle-console-btn');
        toggleBtn.textContent = this.isCollapsed ? '📋 Expand' : '📋 Collapse';
    }

    handleTerminalInput(e) {
        const input = e.target;
        
        if (e.key === 'Enter') {
            const command = input.value.trim();
            if (command) {
                this.executeTerminalCommand(command);
                this.commandHistory.push(command);
                this.historyIndex = this.commandHistory.length;
                input.value = '';
            }
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (this.historyIndex > 0) {
                this.historyIndex--;
                input.value = this.commandHistory[this.historyIndex];
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (this.historyIndex < this.commandHistory.length - 1) {
                this.historyIndex++;
                input.value = this.commandHistory[this.historyIndex];
            } else {
                this.historyIndex = this.commandHistory.length;
                input.value = '';
            }
        }
    }

    executeTerminalCommand(command) {
        const terminalOutput = document.getElementById('terminal-output');
        
        // Add command to output
        const commandLine = document.createElement('div');
        commandLine.className = 'terminal-line';
        commandLine.textContent = `$ ${command}`;
        terminalOutput.appendChild(commandLine);

        // Process command
        const result = this.processTerminalCommand(command);
        
        // Add result to output
        const resultLine = document.createElement('div');
        resultLine.className = 'terminal-line';
        resultLine.textContent = result;
        terminalOutput.appendChild(resultLine);

        this.scrollToBottom(terminalOutput);
    }

    processTerminalCommand(command) {
        const args = command.split(' ');
        const cmd = args[0].toLowerCase();

        switch (cmd) {
            case 'help':
                return `Verfügbare Befehle:
help - Zeigt diese Hilfe an
clear - Leert das Terminal
echo [text] - Gibt Text aus
date - Zeigt aktuelles Datum an
version - Zeigt IDE Version an
javac [file] - Simuliert Java Kompilierung
java [class] - Simuliert Java Ausführung
ls - Listet Dateien auf
pwd - Zeigt aktuelles Verzeichnis`;

            case 'clear':
                document.getElementById('terminal-output').innerHTML = '';
                return '';

            case 'echo':
                return args.slice(1).join(' ');

            case 'date':
                return new Date().toLocaleString();

            case 'version':
                return 'IntelliJ Clone v2.0.0 - Vanilla JavaScript IDE';

            case 'javac':
                if (args[1]) {
                    return `Kompiliere ${args[1]}... ✅ Erfolgreich kompiliert`;
                }
                return 'Verwendung: javac <dateiname.java>';

            case 'java':
                if (args[1]) {
                    return `Führe ${args[1]} aus...\nHello World!\nProgramm beendet.`;
                }
                return 'Verwendung: java <klassenname>';

            case 'ls':
                return 'Main.java  Utils.java  README.md';

            case 'pwd':
                return '/workspace/current-project';

            default:
                return `Befehl nicht gefunden: ${cmd}. Gib 'help' für verfügbare Befehle ein.`;
        }
    }

    scrollToBottom(element) {
        element.scrollTop = element.scrollHeight;
    }

    setupAutoScroll() {
        // Auto-scroll when new content is added
        const observer = new MutationObserver(() => {
            if (this.currentTab === 'output') {
                const outputContainer = document.getElementById('console-output');
                this.scrollToBottom(outputContainer);
            }
        });

        const outputContainer = document.getElementById('console-output');
        if (outputContainer) {
            observer.observe(outputContainer, { childList: true });
        }
    }
}

// Java Code Simulator
class JavaSimulator {
    constructor() {
        this.output = [];
        this.errors = [];
    }

    execute(code) {
        this.output = [];
        this.errors = [];

        try {
            // Simple Java code simulation
            this.simulateJavaExecution(code);
        } catch (error) {
            this.errors.push(error.message);
        }

        return {
            output: this.output,
            errors: this.errors
        };
    }

    simulateJavaExecution(code) {
        // Extract System.out.println statements
        const printRegex = /System\.out\.println\s*\(\s*([^)]+)\s*\)/g;
        let match;

        while ((match = printRegex.exec(code)) !== null) {
            let content = match[1].trim();
            
            // Remove quotes if it's a string literal
            if ((content.startsWith('"') && content.endsWith('"')) ||
                (content.startsWith("'") && content.endsWith("'"))) {
                content = content.slice(1, -1);
            }
            
            // Simple variable substitution
            content = this.processJavaExpression(content, code);
            this.output.push(content);
        }

        // If no println found, simulate basic execution
        if (this.output.length === 0) {
            if (code.includes('public static void main')) {
                this.output.push('Java Programm ausgeführt (keine Ausgabe)');
            } else {
                this.output.push('Java Code kompiliert und ausgeführt');
            }
        }

        // Simulate some common Java patterns
        this.simulateJavaPatterns(code);
    }

    processJavaExpression(expression, fullCode) {
        // Simple string concatenation
        if (expression.includes('+')) {
            const parts = expression.split('+').map(p => p.trim());
            let result = '';
            
            for (let part of parts) {
                if (part.startsWith('"') && part.endsWith('"')) {
                    result += part.slice(1, -1);
                } else if (!isNaN(part)) {
                    result += part;
                } else {
                    // Try to find variable value
                    const varValue = this.findVariableValue(part, fullCode);
                    result += varValue || part;
                }
            }
            return result;
        }

        return expression;
    }

    findVariableValue(varName, code) {
        // Simple variable extraction
        const varRegex = new RegExp(`${varName}\\s*=\\s*([^;]+)`, 'g');
        const match = varRegex.exec(code);
        
        if (match) {
            let value = match[1].trim();
            if (value.startsWith('"') && value.endsWith('"')) {
                return value.slice(1, -1);
            }
            return value;
        }
        
        return varName;
    }

    simulateJavaPatterns(code) {
        // Simulate loops
        if (code.includes('for') && code.includes('System.out.println')) {
            // Already handled by println extraction
        }

        // Check for common errors
        if (!code.includes('public class') && code.includes('public static void main')) {
            this.errors.push('Klassen-Definition fehlt');
        }

        if (code.includes('System.out.println') && !code.includes(';')) {
            this.errors.push('Fehlende Semikolons gefunden');
        }
    }
}

// Initialize console when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.consoleManager = new ConsoleManager();
});
