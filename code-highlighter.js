/**
 * 代码高亮功能
 * 为代码块添加语法高亮，提升代码可读性
 */

class CodeHighlighter {
    constructor() {
        this.init();
    }

    init() {
        this.highlightCodeBlocks();
    }

    highlightCodeBlocks() {
        // 查找所有代码块
        const codeBlocks = document.querySelectorAll('.code-block code, .code-wrapper code, pre code');
        
        codeBlocks.forEach(codeElement => {
            // 获取语言类型
            const language = this.detectLanguage(codeElement);
            
            if (language) {
                // 应用语法高亮
                this.applySyntaxHighlighting(codeElement, language);
            }
        });
    }

    detectLanguage(codeElement) {
        // 从class属性中检测语言
        const classList = codeElement.className;
        if (classList) {
            const match = classList.match(/language-(\w+)/);
            if (match) return match[1];
        }
        
        // 从父元素class中检测语言
        const parentClass = codeElement.parentElement.className;
        if (parentClass) {
            const match = parentClass.match(/language-(\w+)/);
            if (match) return match[1];
        }
        
        // 简单的内容检测
        const content = codeElement.textContent.trim();
        
        // 检测JSON
        if (content.startsWith('{') || content.startsWith('[')) {
            try {
                JSON.parse(content);
                return 'json';
            } catch (e) {
                // 不是有效的JSON
            }
        }
        
        // 检测JavaScript/TypeScript
        if (content.includes('function') || content.includes('const ') || content.includes('let ') || 
            content.includes('var ') || content.includes('=>') || content.includes('import ')) {
            return content.includes(':') && content.includes('type ') ? 'typescript' : 'javascript';
        }
        
        // 检测Python
        if (content.includes('def ') || content.includes('import ') || content.includes('from ') || 
            content.includes('print(') || content.includes('self.')) {
            return 'python';
        }
        
        // 检测CSS
        if (content.includes('{') && content.includes('}') && content.includes(':') && 
            !content.includes('function') && !content.includes('=>')) {
            return 'css';
        }
        
        // 检测HTML
        if (content.includes('<') && content.includes('>') && content.includes('</')) {
            return 'html';
        }
        
        // 检测Shell/Bash
        if (content.includes('npm ') || content.includes('yarn ') || content.includes('git ') || 
            content.includes('curl ') || content.includes('echo ')) {
            return 'bash';
        }
        
        return null;
    }

    applySyntaxHighlighting(codeElement, language) {
        const code = codeElement.textContent;
        let highlightedCode = '';

        switch (language) {
            case 'javascript':
            case 'typescript':
                highlightedCode = this.highlightJavaScript(code);
                break;
            case 'json':
                highlightedCode = this.highlightJSON(code);
                break;
            case 'python':
                highlightedCode = this.highlightPython(code);
                break;
            case 'css':
                highlightedCode = this.highlightCSS(code);
                break;
            case 'html':
                highlightedCode = this.highlightHTML(code);
                break;
            case 'bash':
                highlightedCode = this.highlightBash(code);
                break;
            default:
                // 不支持的语言，返回原始代码
                return;
        }

        // 创建临时容器来解析HTML
        const tempContainer = document.createElement('div');
        tempContainer.innerHTML = highlightedCode;
        
        // 清空原始代码元素并添加高亮内容
        while (codeElement.firstChild) {
            codeElement.removeChild(codeElement.firstChild);
        }
        
        while (tempContainer.firstChild) {
            codeElement.appendChild(tempContainer.firstChild);
        }
    }

    highlightJavaScript(code) {
        return code
            // 字符串
            .replace(/(["'`])((?:\\.|(?!\1)[^\\])*?)\1/g, '<span class="code-string">$1$2$1</span>')
            // 注释
            .replace(/\/\/.*$/gm, '<span class="code-comment">$&</span>')
            .replace(/\/\*[\s\S]*?\*\//g, '<span class="code-comment">$&</span>')
            // 关键字
            .replace(/\b(function|const|let|var|if|else|for|while|do|break|continue|switch|case|default|return|try|catch|finally|throw|new|class|extends|import|export|from|as|async|await|typeof|instanceof|in|of|void|delete|this|super)\b/g, '<span class="code-keyword">$1</span>')
            // 布尔值和null
            .replace(/\b(true|false|null|undefined)\b/g, '<span class="code-boolean">$1</span>')
            // 数字
            .replace(/\b(\d+)\b/g, '<span class="code-number">$1</span>')
            // 函数调用
            .replace(/\b([a-zA-Z_$][\w$]*)\s*\(/g, '<span class="code-function">$1</span>(');
    }

    highlightJSON(code) {
        return code
            // 字符串
            .replace(/"((?:\\.|[^"\\])*)"/g, '<span class="code-string">"$1"</span>')
            // 数字
            .replace(/\b(\d+)\b/g, '<span class="code-number">$1</span>')
            // 布尔值和null
            .replace(/\b(true|false|null)\b/g, '<span class="code-boolean">$1</span>');
    }

    highlightPython(code) {
        return code
            // 字符串
            .replace(/(["'])((?:\\.|(?!\1)[^\\])*?)\1/g, '<span class="code-string">$1$2$1</span>')
            // 注释
            .replace(/#.*$/gm, '<span class="code-comment">$&</span>')
            // 关键字
            .replace(/\b(def|class|if|elif|else|for|while|try|except|finally|with|as|import|from|return|yield|lambda|and|or|not|in|is|None|True|False|pass|break|continue|global|nonlocal)\b/g, '<span class="code-keyword">$1</span>')
            // 数字
            .replace(/\b(\d+)\b/g, '<span class="code-number">$1</span>')
            // 函数调用
            .replace(/\b([a-zA-Z_][\w]*)\s*\(/g, '<span class="code-function">$1</span>(');
    }

    highlightCSS(code) {
        return code
            // 选择器
            .replace(/([.#]?[a-zA-Z][\w-]*)\s*{/g, '<span class="code-selector">$1</span> {')
            // 属性
            .replace(/([a-zA-Z-]+)\s*:/g, '<span class="code-property">$1</span>:')
            // 属性值
            .replace(/:\s*([^;]+);/g, ': <span class="code-value">$1</span>;')
            // 注释
            .replace(/\/\*[\s\S]*?\*\//g, '<span class="code-comment">$&</span>')
            // 数字和单位
            .replace(/(\d+)(px|em|rem|%|vh|vw|pt|pc|in|cm|mm|ex|ch|vmin|vmax)/g, '<span class="code-number">$1$2</span>');
    }

    highlightHTML(code) {
        return code
            // 标签
            .replace(/(&lt;\/?)([a-zA-Z][a-zA-Z0-9]*)(.*?)(&gt;)/g, '<span class="code-tag">$1</span><span class="code-tag-name">$2</span><span class="code-attribute">$3</span><span class="code-tag">$4</span>')
            // 属性值
            .replace(/([a-zA-Z-]+)(=)(["'])((?:\\.|(?!\3)[^\\])*?)\3/g, '<span class="code-attribute-name">$1</span><span class="code-operator">$2</span><span class="code-string">$3$4$3</span>')
            // 注释
            .replace(/(&lt;!--[\s\S]*?--&gt;)/g, '<span class="code-comment">$1</span>');
    }

    highlightBash(code) {
        return code
            // 注释
            .replace(/#.*$/gm, '<span class="code-comment">$&</span>')
            // 命令
            .replace(/\b(npm|yarn|git|curl|wget|echo|cd|ls|mkdir|rm|cp|mv|cat|grep|awk|sed|sort|uniq|head|tail|chmod|chown|ps|kill|top|df|du|mount|umount|tar|zip|unzip|ssh|scp|rsync)\b/g, '<span class="code-command">$1</span>')
            // 选项
            .replace(/(\s)--?[a-zA-Z-]+/g, '$1<span class="code-option">$&</span>')
            // 字符串
            .replace(/(["'])((?:\\.|(?!\1)[^\\])*?)\1/g, '<span class="code-string">$1$2$1</span>');
    }
}

// 添加代码高亮样式
const highlightStyles = document.createElement('style');
highlightStyles.textContent = `
/* VSCode 暗黑主题代码高亮样式 */
.code-string {
    color: var(--vscode-editor-token-string);
}

.code-comment {
    color: var(--vscode-editor-token-comment);
    font-style: italic;
}

.code-keyword {
    color: var(--vscode-editor-token-keyword);
    font-weight: bold;
}

.code-boolean {
    color: var(--vscode-editor-token-number);
}

.code-number {
    color: var(--vscode-editor-token-number);
}

.code-function {
    color: var(--vscode-editor-token-function);
}

.code-selector {
    color: var(--vscode-editor-token-keyword);
}

.code-property {
    color: var(--vscode-editor-token-property);
}

.code-value {
    color: var(--vscode-editor-token-string);
}

.code-tag {
    color: var(--vscode-editor-token-tag);
}

.code-tag-name {
    color: var(--vscode-editor-token-tag);
}

.code-attribute {
    color: var(--vscode-editor-token-string);
}

.code-attribute-name {
    color: var(--vscode-editor-token-property);
}

.code-operator {
    color: var(--vscode-editor-token-operator);
}

.code-command {
    color: var(--vscode-editor-token-function);
    font-weight: bold;
}

.code-option {
    color: var(--vscode-editor-token-function);
}

/* 深色主题下的代码高亮 */
[data-theme="dark"] .code-string {
    color: var(--vscode-editor-token-string);
}

[data-theme="dark"] .code-comment {
    color: var(--vscode-editor-token-comment);
}

[data-theme="dark"] .code-keyword {
    color: var(--vscode-editor-token-keyword);
}

[data-theme="dark"] .code-boolean {
    color: var(--vscode-editor-token-number);
}

[data-theme="dark"] .code-number {
    color: var(--vscode-editor-token-number);
}

[data-theme="dark"] .code-function {
    color: var(--vscode-editor-token-function);
}

[data-theme="dark"] .code-selector {
    color: var(--vscode-editor-token-keyword);
}

[data-theme="dark"] .code-property {
    color: var(--vscode-editor-token-property);
}

[data-theme="dark"] .code-value {
    color: var(--vscode-editor-token-string);
}

[data-theme="dark"] .code-tag {
    color: var(--vscode-editor-token-tag);
}

[data-theme="dark"] .code-tag-name {
    color: var(--vscode-editor-token-tag);
}

[data-theme="dark"] .code-attribute {
    color: var(--vscode-editor-token-string);
}

[data-theme="dark"] .code-attribute-name {
    color: var(--vscode-editor-token-property);
}

[data-theme="dark"] .code-operator {
    color: var(--vscode-editor-token-operator);
}

[data-theme="dark"] .code-command {
    color: var(--vscode-editor-token-function);
}

[data-theme="dark"] .code-option {
    color: var(--vscode-editor-token-function);
}
`;

document.head.appendChild(highlightStyles);

// 初始化代码高亮
document.addEventListener('DOMContentLoaded', () => {
    try {
        console.log('🎨 代码高亮功能启动');
        
        // 初始化代码高亮器
        const codeHighlighter = new CodeHighlighter();
        
        // 将实例暴露到全局作用域，以便其他脚本访问
        window.codeHighlighter = codeHighlighter;
        
        console.log('✅ 代码高亮功能已加载');
    } catch (error) {
        console.error('❌ 代码高亮初始化失败:', error);
    }
});

// 导出类
window.CodeHighlighter = CodeHighlighter;