// KAT-Coder 网站增强版 JavaScript - 现代化交互体验

// 全局配置
const CONFIG = {
    smoothScrollDuration: 500,
    scrollActivationDelay: 300,
    tooltipDelay: 300,
    navbarScrollThreshold: 50,
    animationDelayStep: 150,
    backToTopThreshold: 300,
    debounceDelay: 100,
    transitionMedium: '0.3s ease-in-out',
    transitionSlow: '0.5s ease-in-out'
};

class KATCoderUI {
    constructor() {
        this.isAnimating = false;
        this.theme = 'dark'; // 默认暗黑模式
        this.init();
    }

    init() {
        try {
            this.initializeDarkMode();
            this.setupEventListeners();
            this.initializeBackToTop();
            this.setupSmoothScrolling();
            this.setupAnimations();
            console.log('✅ KATCoderUI 初始化成功');
        } catch (error) {
            console.error('❌ KATCoderUI 初始化过程中出错:', error);
        }
    }

    setupEventListeners() {
        // 处理滚动事件
        window.addEventListener('scroll', () => this.handleScroll());
        
        // 视觉变化监控
        document.addEventListener('visibilitychange', () => this.handleVisibilityChange());
    }

    handleScroll = () => {
        // 防抖处理
        if (this.scrollTimeout) {
            clearTimeout(this.scrollTimeout);
        }

        this.scrollTimeout = setTimeout(() => {
            this.updateNavbarState();
            this.updateBackToTopButton();
        }, CONFIG.debounceDelay);
    }

    handleVisibilityChange = () => {
        if (document.hidden) {
            this.pauseAnimations();
        } else {
            this.resumeAnimations();
        }
    }

    // 暗黑模式初始化
    initializeDarkMode() {
        // 强制设置为暗黑模式
        document.body.setAttribute('data-theme', 'dark');
        this.theme = 'dark';
        console.log('🌙 暗黑模式已启用');
    }

    initializeBackToTop() {
        this.backToTopButton = document.createElement('button');
        this.backToTopButton.id = 'backToTop';
        this.backToTopButton.innerHTML = '<i class="fas fa-arrow-up"></i>';
        this.backToTopButton.title = '返回顶部';
        this.backToTopButton.setAttribute('aria-label', '返回顶部');
        this.backToTopButton.style.cssText = `
            position: fixed;
            right: 1.5rem;
            bottom: 1.5rem;
            background: linear-gradient(45deg, #4CAF50, #2196F3);
            color: #ffffff;
            border: none;
            border-radius: 50%;
            width: 48px;
            height: 48px;
            font-size: 1.25rem;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            cursor: pointer;
            transition: all ${CONFIG.transitionMedium};
            z-index: 9999;
            display: none;
        `;

        document.body.appendChild(this.backToTopButton);

        // 点击处理
        this.backToTopButton.addEventListener('click', (e) => {
            e.preventDefault();
            this.scrollToTop();
        });

        // 初始状态
        this.updateBackToTopButton();
    }

    updateBackToTopButton() {
        if (window.pageYOffset > CONFIG.backToTopThreshold) {
            this.backToTopButton.style.display = 'block';
        } else {
            this.backToTopButton.style.opacity = '0';
            setTimeout(() => {
                this.backToTopButton.style.display = 'none';
            }, 200);
        }
    }

    scrollToTop() {
        this.isAnimating = true;
        let currentScroll = window.pageYOffset;

        const scrollStep = () => {
            if (!this.isAnimating) return;

            if (currentScroll <= 5) {
                this.isAnimating = false;
                currentScroll = 0;
                return;
            }

            currentScroll -= Math.ceil(currentScroll / 20);
            window.scrollTo(0, currentScroll);
            requestAnimationFrame(scrollStep);
        };

        this.closeMobileNav();
        requestAnimationFrame(scrollStep);
    }

    closeMobileNav() {
        const navbarCollapse = document.querySelector('.navbar-collapse');
        if (navbarCollapse && navbarCollapse.classList.contains('show')) {
            const bsCollapse = new bootstrap.Collapse(navbarCollapse, { toggle: false });
            bsCollapse.hide();
        }
    }

    updateNavbarState() {
        const navbar = document.querySelector('.navbar');
        if (!navbar) return;

        // 添加滚动样式
        if (window.scrollY > CONFIG.navbarScrollThreshold) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    setupSmoothScrolling() {
        // 平滑滚动到锚点
        document.body.addEventListener('click', (e) => {
            if (e.target.matches('a[href^="#"]')) {
                e.preventDefault();
                this.smoothScrollTo(e.target);
            }
        });
    }

    smoothScrollTo(element) {
        const targetId = element.getAttribute('href');
        const target = document.querySelector(targetId);

        if (target) {
            this.closeMobileNav();

            // 平滑滚动到目标位置
            const offsetTop = target.offsetTop - 70; // 减去导航栏高度
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth',
                block: 'start'
            });
        }
    }

    setupAnimations() {
        // 内容观察器，用于滚动动画
        let elementObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('animate-complete')) {
                    this.applyScrollAnimation(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        // 观察所有需要动画的元素
        document.querySelectorAll('.animate-on-scroll').forEach(element => {
            elementObserver.observe(element);
        });
    }

    applyScrollAnimation(element) {
        if (!element.classList.contains('animate-on-scroll')) {
            element.classList.add('animate-on-scroll', 'visible');
        }
    }

    pauseAnimations() {
        document.documentElement.style.animationPlayState = 'paused';
        document.body.style.animationPlayState = 'paused';
        this.isAnimating = false;
    }

    resumeAnimations() {
        document.documentElement.style.animationPlayState = 'running';
        document.body.style.animationPlayState = 'running';
        this.isAnimating = true;
    }
}

class SpecialFeatures {
    constructor() {
        this.init();
    }

    init() {
        this.addCodeCopyFunctionality();
        this.addTableEnhancement();
        this.addMicroInteractions();
        this.setupImageInteractions();
        
        // 初始化代码高亮功能
        if (typeof CodeHighlighter !== 'undefined') {
            new CodeHighlighter();
        }
    }
    
    // 添加代码复制功能
    addCodeCopyFunctionality() {
        try {
            console.log('🔄 开始初始化代码复制功能...');
            
            // 查找所有代码块
            const codeBlocks = document.querySelectorAll('.code-block, .code-wrapper');
            console.log(`📝 找到 ${codeBlocks.length} 个代码块`);
            
            codeBlocks.forEach((block, index) => {
                try {
                    const codeElement = block.querySelector('code');
                    if (!codeElement) {
                        console.log(`代码块 ${index + 1} 没有code元素，跳过`);
                        return;
                    }
                    
                    // 检查是否已经有复制按钮
                    let copyBtn = block.querySelector('.copy-btn');
                    
                    if (!copyBtn) {
                        // 创建复制按钮
                        copyBtn = document.createElement('button');
                        copyBtn.className = 'copy-btn';
                        copyBtn.setAttribute('aria-label', '复制代码');
                        copyBtn.innerHTML = `
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 1 2 2h9a2 2 0 0 1 2 2v1"></path>
                            </svg>
                            <span>复制</span>
                        `;
                        
                        block.appendChild(copyBtn);
                    }
                    
                    // 添加点击事件
                    copyBtn.addEventListener('click', (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        this.copyCodeToClipboard(codeElement.textContent, copyBtn);
                    });
                    
                    console.log(`✅ 代码块 ${index + 1} 复制按钮处理成功`);
                } catch (blockError) {
                    console.error(`❌ 处理代码块 ${index + 1} 时出错:`, blockError);
                }
            });
            
            console.log('✅ 代码复制功能初始化完成');
        } catch (error) {
            console.error('❌ 代码复制功能初始化失败:', error);
            throw error;
        }
    }
    
    // 复制代码到剪贴板
    async copyCodeToClipboard(text, button) {
        try {
            console.log('🔄 开始复制代码到剪贴板...');
            
            // 尝试使用现代剪贴板API
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(text);
                console.log('✅ 使用现代剪贴板API复制成功');
                this.showToast('代码已复制到剪贴板', 'success');
            } else {
                console.log('🔄 使用降级复制方法...');
                this.fallbackCopyToClipboard(text, button);
            }
            
            // 更新按钮状态
            this.updateCopyButton(button, 'copied');
            
            // 重置按钮状态
            setTimeout(() => {
                this.updateCopyButton(button, 'reset');
            }, 2000);
            
        } catch (err) {
            console.error('❌ 复制失败:', err);
            this.updateCopyButton(button, 'error');
            setTimeout(() => {
                this.updateCopyButton(button, 'reset');
            }, 2000);
            this.showToast('复制失败，请手动复制', 'error');
        }
    }
    
    // 更新复制按钮状态
    updateCopyButton(button, state) {
        // 如果是第一次调用，保存原始HTML
        if (!button.hasAttribute('data-original-html')) {
            button.setAttribute('data-original-html', button.innerHTML);
        }
        
        const originalHTML = button.getAttribute('data-original-html');
        
        switch (state) {
            case 'copied':
                button.classList.add('copied');
                button.classList.remove('btn-outline-primary');
                button.classList.add('btn-success');
                button.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    <span>已复制</span>
                `;
                break;
                
            case 'error':
                button.classList.add('error');
                button.classList.remove('btn-outline-primary');
                button.classList.add('btn-danger');
                button.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="15" y1="9" x2="9" y2="15"></line>
                        <line x1="9" y1="9" x2="15" y2="15"></line>
                    </svg>
                    <span>失败</span>
                `;
                break;
                
            case 'reset':
                button.classList.remove('copied', 'error', 'btn-success', 'btn-danger');
                button.classList.add('btn-outline-primary');
                button.innerHTML = originalHTML;
                button.style.opacity = '0.8';
                break;
        }
    }
    
    // 降级复制方法
    fallbackCopyToClipboard(text, button) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.top = '0';
        textArea.style.left = '0';
        textArea.style.position = 'fixed';
        
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            const successful = document.execCommand('copy');
            if (!successful) {
                throw new Error('复制命令执行失败');
            }
            this.showToast('代码已复制到剪贴板', 'success');
        } catch (err) {
            console.error('降级复制方法也失败了:', err);
            this.showToast('复制失败，请手动复制', 'error');
            throw err;
        } finally {
            document.body.removeChild(textArea);
        }
    }
    
    // 显示提示消息
    showToast(message, type = 'info') {
        try {
            console.log(`🔔 显示提示消息: ${message} (${type})`);
            
            // 检查是否已有提示容器
            let toastContainer = document.querySelector('.toast-container');
            if (!toastContainer) {
                toastContainer = document.createElement('div');
                toastContainer.className = 'toast-container';
                document.body.appendChild(toastContainer);
                
                // 添加样式
                const style = document.createElement('style');
                style.textContent = `
                    .toast-container {
                        position: fixed;
                        top: 20px;
                        right: 20px;
                        z-index: 1000;
                    }
                    
                    .toast {
                        background-color: var(--background-primary);
                        border: 1px solid var(--border-color);
                        border-radius: var(--border-radius-md);
                        padding: 12px 16px;
                        margin-bottom: 10px;
                        box-shadow: var(--shadow-lg);
                        display: flex;
                        align-items: center;
                        gap: 8px;
                        min-width: 250px;
                        max-width: 350px;
                        animation: slideIn 0.3s ease-out;
                    }
                    
                    .toast.success {
                        border-left: 4px solid var(--success-color);
                    }
                    
                    .toast.error {
                        border-left: 4px solid var(--error-color);
                    }
                    
                    .toast.info {
                        border-left: 4px solid var(--primary-color);
                    }
                    
                    @keyframes slideIn {
                        from {
                            transform: translateX(100%);
                            opacity: 0;
                        }
                        to {
                            transform: translateX(0);
                            opacity: 1;
                        }
                    }
                `;
                document.head.appendChild(style);
            }
            
            // 创建提示
            const toast = document.createElement('div');
            toast.className = `toast ${type}`;
            
            // 添加图标
            let icon = '';
            switch (type) {
                case 'success':
                    icon = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';
                    break;
                case 'error':
                    icon = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>';
                    break;
                default:
                    icon = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>';
            }
            
            toast.innerHTML = `${icon} <span>${message}</span>`;
            toastContainer.appendChild(toast);
            
            // 自动移除
            setTimeout(() => {
                toast.style.animation = 'slideIn 0.3s ease-out reverse';
                setTimeout(() => {
                    if (toast.parentNode) {
                        toast.parentNode.removeChild(toast);
                    }
                }, 300);
            }, 3000);
            
            console.log('✅ 提示消息显示成功');
        } catch (error) {
            console.error('❌ 显示提示消息失败:', error);
            alert(message);
        }
    }

    addTableEnhancement() {
        const tables = document.querySelectorAll('table');
        tables.forEach(table => {
            // 添加响应式表格容器
            const container = document.createElement('div');
            container.className = 'table-responsive';
            container.style.cssText = `
                overflow-x: auto;
                -webkit-overflow-scrolling: touch;
                scrollbar-width: thin;
                scrollbar-color: var(--primary-color) var(--background-secondary);
            `;

            // 添加表格边框和圆角
            table.style.cssText = `
                width: 100%;
                border-collapse: separate;
                border-spacing: 0;
                border-radius: var(--border-radius-md);
                overflow: hidden;
                box-shadow: var(--shadow-md);
                border: 1px solid var(--border-color);
                font-size: 0.9rem;
            `;

            // 添加表格头部样式
            table.querySelectorAll('th').forEach(th => {
                th.style.cssText = `
                    background: var(--background-secondary);
                    border-bottom: 2px solid var(--primary-color);
                    padding: 1rem;
                    text-align: left;
                `;
            });

            // 添加单元格间距和边框
            table.querySelectorAll('td').forEach(td => {
                td.style.cssText = `
                    padding: 1rem;
                    text-align: left;
                    border-bottom: 1px solid var(--background-secondary);
                `;
            });

            // 添加表格容器
            if (!table.parentElement.classList.contains('table-responsive')) {
                table.parentNode.insertBefore(container, table);
                container.appendChild(table);
            }
        });
    }

    setupImageInteractions() {
        // 图片点击放大功能
        document.querySelectorAll('img:not(.no-zoom)').forEach(img => {
            if (!img.closest('.image-wrapper')) {
                // 如果图片没有包裹在容器中，自动创建
                const wrapper = document.createElement('div');
                wrapper.className = 'image-wrapper';
                img.parentNode.insertBefore(wrapper, img);
                wrapper.appendChild(img);
            }

            // 添加点击事件
            img.addEventListener('click', (e) => {
                this.toggleImageZoom(img);
                e.preventDefault();
                e.stopPropagation();
            });
        });
    }

    toggleImageZoom(img) {
        let enlargeImage = document.querySelector('.enlarge-image');

        if (!enlargeImage) {
            // 创建图片放大容器
            enlargeImage = document.createElement('div');
            enlargeImage.className = 'enlarge-image';

            const closeButton = document.createElement('button');
            closeButton.className = 'close-btn';
            closeButton.innerHTML = '<i class="fas fa-times"></i>';
            closeButton.addEventListener('click', () => {
                this.closeImageZoom();
            });

            const enlargedImage = document.createElement('img');
            enlargedImage.className = 'enlarged-img';
            enlargedImage.src = img.src;
            enlargedImage.alt = img.alt || '';

            enlargeImage.appendChild(enlargedImage);
            enlargeImage.appendChild(closeButton);
            document.body.appendChild(enlargeImage);
        } else {
            // 更新现有容器的图片
            const enlargedImage = enlargeImage.querySelector('.enlarged-img');
            enlargedImage.src = img.src;
            enlargedImage.alt = img.alt || '';
        }

        enlargeImage.classList.add('active');

        // 添加点击背景关闭
        enlargeImage.addEventListener('click', (e) => {
            if (e.target === enlargeImage) {
                this.closeImageZoom();
            }
        });
    }

    closeImageZoom() {
        const enlargeImage = document.querySelector('.enlarge-image');
        if (enlargeImage) {
            enlargeImage.style.animation = 'scaleOut 0.3s ease-in-out forwards';
            setTimeout(() => {
                document.body.removeChild(enlargeImage);
            }, 300);
        }
    }

    addMicroInteractions() {
        // 添加按钮点击反馈
        document.querySelectorAll('.btn').forEach(btn => {
            btn.addEventListener('mousedown', (e) => {
                btn.style.transform = 'scale(0.98)';
            });

            btn.addEventListener('mouseup', (e) => {
                btn.style.transform = 'scale(1)';
            });

            btn.addEventListener('mouseleave', (e) => {
                if (!btn.classList.contains('active')) {
                    btn.style.transform = 'scale(1)';
                }
            });
        });

        // 添加链接悬停效果
        document.querySelectorAll('a').forEach(link => {
            link.addEventListener('mouseenter', (e) => {
                link.style.textDecoration = 'underline';
            });

            link.addEventListener('mouseleave', (e) => {
                setTimeout(() => {
                    if (!link.matches(':hover')) {
                        link.style.textDecoration = 'none';
                    }
                }, 200);
            });
        });
    }
}

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
    try {
        console.log('🚀 KAT-Coder 网站增强启动');

        // 初始化主要UI组件
        const ui = new KATCoderUI();
        
        // 将实例暴露到全局作用域
        window.katCoderUI = ui;
        
        // 添加特殊功能
        const specialFeatures = new SpecialFeatures();
        
        // 将SpecialFeatures实例暴露到全局作用域
        window.specialFeatures = specialFeatures;

        console.log('🎉 所有增强功能已成功加载！');

    } catch (error) {
        console.error('❌ KAT-Coder 初始化失败:', error);
        
        // 尝试创建一个简化版本
        try {
            console.log('🔄 尝试创建简化版本...');
            const ui = new KATCoderUI();
            window.katCoderUI = ui;
            console.log('✅ 简化版本创建成功');
        } catch (fallbackError) {
            console.error('❌ 简化版本也创建失败:', fallbackError);
        }
    }
});

// 页面即将卸载时的清理
window.addEventListener('beforeunload', () => {
    console.log('👋 KAT-Coder 网站增强已销毁');
});