const App = {
    async init() {
        await this.showSplash();
        Store.init();
        Router.init();
        this.initTheme();
        this.initAuth();
        this.initUI();
        this.initManagers();
        this.initEventBus();
        this.renderStatic();
        this.hideSplash();
    },

    showSplash() {
        return new Promise(resolve => {
            setTimeout(resolve, 800);
        });
    },

    hideSplash() {
        const splash = document.getElementById('splashScreen');
        if (splash) {
            splash.classList.add('fade-out');
            setTimeout(() => splash.remove(), 300);
        }
    },

    initTheme() {
        const theme = Store.state.theme || 'light';
        document.documentElement.setAttribute('data-theme', theme);
        this.updateThemeIcon(theme);

        document.getElementById('themeToggle')?.addEventListener('click', () => {
            const current = document.documentElement.getAttribute('data-theme');
            const next = current === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', next);
            Store.set(Store.KEYS.THEME, next);
            Store.state.theme = next;
            this.updateThemeIcon(next);
            EventBus.emit(Store.EVENTS.THEME_CHANGE, { theme: next });
        });
    },

    updateThemeIcon(theme) {
        const btn = document.getElementById('themeToggle');
        if (btn) btn.textContent = theme === 'dark' ? '☀️' : '🌙';
    },

    initAuth() {
        this.updateUserUI();

        document.querySelectorAll('.login-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                document.querySelectorAll('.login-tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                const isLogin = tab.dataset.tab === 'login';
                document.getElementById('loginForm').style.display = isLogin ? 'flex' : 'none';
                document.getElementById('registerForm').style.display = isLogin ? 'none' : 'flex';
            });
        });

        document.getElementById('loginForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('loginUsername').value.trim();
            const password = document.getElementById('loginPassword').value;

            if (!username || !password) {
                Toast.warning('请填写完整信息');
                return;
            }

            const avatars = ['👨‍🎓', '👩‍🎓', '👨‍🏫', '👩‍🏫', '🧑‍💻', '🧑‍🔬', '🧑‍🎓', '👨‍💼', '👩‍💼'];
            const user = {
                id: Utils.generateId(),
                username,
                avatar: avatars[Math.floor(Math.random() * avatars.length)],
                role: '学生',
                createdAt: Date.now()
            };

            Store.saveUser(user);
            this.updateUserUI();
            Modal.close('loginModal');
            Toast.success('登录成功！');
        });

        document.getElementById('registerForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('regUsername').value.trim();
            const email = document.getElementById('regEmail').value.trim();
            const password = document.getElementById('regPassword').value;
            const role = document.getElementById('regRole').value;

            if (!username || !email || !password) {
                Toast.warning('请填写完整信息');
                return;
            }

            const roleNames = { student: '学生', teacher: '教师', parent: '家长', volunteer: '志愿者' };
            const avatars = ['👨‍🎓', '👩‍🎓', '👨‍🏫', '👩‍🏫', '🧑‍💻', '🧑‍🔬', '🧑‍🎓', '👨‍💼', '👩‍💼'];

            const user = {
                id: Utils.generateId(),
                username,
                email,
                avatar: avatars[Math.floor(Math.random() * avatars.length)],
                role: roleNames[role] || '学生',
                createdAt: Date.now()
            };

            Store.saveUser(user);
            this.updateUserUI();
            Modal.close('loginModal');
            Toast.success('注册成功！');
        });
    },

    updateUserUI() {
        const user = Store.state.user;
        const loginBtn = document.getElementById('loginBtn');
        const userCard = document.getElementById('userCard');
        const editorAvatar = document.getElementById('editorAvatar');

        if (user) {
            if (loginBtn) {
                loginBtn.innerHTML = `<span class="user-avatar">${user.avatar}</span>${user.username}`;
                loginBtn.onclick = () => {
                    if (confirm('确定要退出登录吗？')) {
                        Store.clearUser();
                        this.updateUserUI();
                        Toast.info('已退出登录');
                    }
                };
            }

            if (userCard) {
                userCard.innerHTML = `
                    <div class="user-card-info">
                        <div class="user-card-avatar">${user.avatar}</div>
                        <div class="user-card-name">${user.username}</div>
                        <div class="user-card-role">${user.role}</div>
                    </div>
                `;
            }

            if (editorAvatar) {
                editorAvatar.textContent = user.avatar;
            }
        } else {
            if (loginBtn) {
                loginBtn.innerHTML = '登录';
                loginBtn.onclick = () => Modal.open('loginModal');
            }

            if (userCard) {
                userCard.innerHTML = `
                    <div class="user-card-guest">
                        <div class="guest-avatar">👤</div>
                        <p>登录后参与讨论</p>
                        <button class="btn-primary btn-full" onclick="Modal.open('loginModal')">登录/注册</button>
                    </div>
                `;
            }

            if (editorAvatar) {
                editorAvatar.textContent = '👤';
            }
        }
    },

    initUI() {
        document.getElementById('menuToggle')?.addEventListener('click', () => {
            document.getElementById('mobileNav')?.classList.toggle('active');
        });

        const backToTop = document.getElementById('backToTop');
        if (backToTop) {
            window.addEventListener('scroll', Utils.throttle(() => {
                backToTop.classList.toggle('visible', window.scrollY > 300);
            }, 100));

            backToTop.addEventListener('click', () => {
                Utils.scrollToTop();
            });
        }

        document.getElementById('notificationBtn')?.addEventListener('click', () => {
            Modal.open('notificationModal');
        });

        document.getElementById('volunteerBtn')?.addEventListener('click', () => {
            this.showVolunteerModal();
        });

        document.querySelectorAll('.quick-action-card').forEach(card => {
            card.addEventListener('click', () => {
                const page = card.dataset.page;
                if (page) Router.navigate(page);
            });
        });

        this.initPullToRefresh();
        this.initInfiniteScroll();
    },

    initPullToRefresh() {
        let startY = 0;
        let isPulling = false;
        const threshold = 80;

        document.addEventListener('touchstart', (e) => {
            if (window.scrollY === 0) {
                startY = e.touches[0].pageY;
                isPulling = true;
            }
        });

        document.addEventListener('touchmove', (e) => {
            if (!isPulling) return;
            const y = e.touches[0].pageY;
            const diff = y - startY;
            
            if (diff > 0 && diff < threshold * 2) {
                document.body.style.transform = `translateY(${Math.min(diff * 0.5, threshold)}px)`;
            }
        });

        document.addEventListener('touchend', () => {
            if (!isPulling) return;
            isPulling = false;
            
            const transform = document.body.style.transform;
            const match = transform.match(/translateY\((\d+(?:\.\d+)?)px\)/);
            
            if (match && parseFloat(match[1]) >= threshold) {
                this.refresh();
            }
            
            document.body.style.transform = '';
        });
    },

    async refresh() {
        Loader.show('刷新中...');
        await Utils.sleep(500);
        PostManager.render();
        AgentManager.render();
        ResourceManager.render();
        HomeManager.renderRecent();
        Loader.hide();
        Toast.success('刷新成功');
    },

    initInfiniteScroll() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.loadMore();
                }
            });
        }, { rootMargin: '100px' });

        const sentinel = document.querySelector('.scroll-sentinel');
        if (sentinel) {
            observer.observe(sentinel);
        }
    },

    loadMore() {
    },

    showVolunteerModal() {
        const content = `
            <div class="volunteer-info">
                <h3>🤝 成为志愿者</h3>
                <p>加入教育平权志愿者团队，帮助更多学子获得优质教育资源。</p>
                <ul>
                    <li>📚 分享学习资料和经验</li>
                    <li>👨‍🏫 在线辅导答疑</li>
                    <li>📢 传播教育公平理念</li>
                    <li>💻 参与平台建设</li>
                </ul>
                <p>志愿者报名功能即将上线，敬请期待！</p>
            </div>
        `;
        
        Toast.info('志愿者报名功能即将上线');
    },

    initManagers() {
        PostManager.init();
        AgentManager.init();
        ResourceManager.init();
        HomeManager.init();
        SearchManager.init();
        NotificationManager.init();
    },

    initEventBus() {
        EventBus.on(Store.EVENTS.USER_LOGIN, (user) => {
            this.updateUserUI();
            Store.addNotification({
                icon: '👋',
                title: '欢迎回来',
                message: `${user.username}，祝你学习愉快！`
            });
        });

        EventBus.on(Store.EVENTS.USER_LOGOUT, () => {
            this.updateUserUI();
        });

        EventBus.on(Store.EVENTS.POST_CREATE, (post) => {
            Store.addNotification({
                icon: '📝',
                title: '发布成功',
                message: `你的帖子「${Utils.truncate(post.title, 20)}」已发布`
            });
        });

        EventBus.on(Store.EVENTS.AGENT_CREATE, (agent) => {
            Store.addNotification({
                icon: '🤖',
                title: '智能体创建成功',
                message: `智能体「${agent.name}」已创建`
            });
        });

        EventBus.on('router:navigate', ({ page }) => {
            document.getElementById('mobileNav')?.classList.remove('active');
        });
    },

    renderStatic() {
        this.renderStories();
        this.renderEquityStats();
    },

    renderStories() {
        const container = document.getElementById('storiesContainer');
        if (!container) return;

        const stories = Store.state.stories;
        container.innerHTML = stories.map(story => Components.storyCard(story)).join('');
    },

    renderEquityStats() {
        const container = document.getElementById('equityStats');
        if (!container) return;

        const stats = [
            { icon: '🌍', number: '31', label: '覆盖省份' },
            { icon: '🏫', number: '1,200+', label: '合作学校' },
            { icon: '👨‍🏫', number: '5,000+', label: '志愿者老师' },
            { icon: '👨‍🎓', number: '100,000+', label: '受益学生' }
        ];

        container.innerHTML = stats.map(stat => `
            <div class="equity-stat-item">
                <div class="equity-stat-icon">${stat.icon}</div>
                <div class="equity-stat-number">${stat.number}</div>
                <div class="equity-stat-label">${stat.label}</div>
            </div>
        `).join('');
    }
};

const PWA = {
    init() {
        this.registerServiceWorker();
        this.checkUpdate();
        this.initInstallPrompt();
    },

    async registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            try {
                const registration = await navigator.serviceWorker.register('/sw.js');
                console.log('ServiceWorker registered:', registration.scope);
            } catch (error) {
                console.error('ServiceWorker registration failed:', error);
            }
        }
    },

    checkUpdate() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.addEventListener('controllerchange', () => {
                Toast.info('检测到新版本，刷新页面以更新');
            });
        }
    },

    initInstallPrompt() {
        let deferredPrompt;

        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;
            this.showInstallBanner(deferredPrompt);
        });

        window.addEventListener('appinstalled', () => {
            Toast.success('应用已安装到桌面');
            deferredPrompt = null;
        });
    },

    showInstallBanner(deferredPrompt) {
        const banner = document.createElement('div');
        banner.className = 'install-banner';
        banner.innerHTML = `
            <div class="install-content">
                <span>📱 将教育平权社区添加到桌面，随时访问</span>
                <div class="install-actions">
                    <button class="btn-sm btn-primary" id="installBtn">安装</button>
                    <button class="btn-sm btn-secondary" id="dismissInstall">稍后</button>
                </div>
            </div>
        `;

        document.body.appendChild(banner);

        document.getElementById('installBtn')?.addEventListener('click', async () => {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            if (outcome === 'accepted') {
                banner.remove();
            }
        });

        document.getElementById('dismissInstall')?.addEventListener('click', () => {
            banner.remove();
        });

        setTimeout(() => banner.remove(), 10000);
    }
};

const Performance = {
    metrics: {},

    init() {
        this.measurePageLoad();
        this.measureInteractions();
    },

    measurePageLoad() {
        window.addEventListener('load', () => {
            const timing = performance.timing;
            this.metrics.pageLoad = timing.loadEventEnd - timing.navigationStart;
            this.metrics.domReady = timing.domContentLoadedEventEnd - timing.navigationStart;
            this.metrics.firstPaint = timing.responseEnd - timing.navigationStart;
            
            console.log('Performance metrics:', this.metrics);
        });
    },

    measureInteractions() {
        const observer = new PerformanceObserver((list) => {
            list.getEntries().forEach(entry => {
                if (entry.entryType === 'measure') {
                    console.log(`${entry.name}: ${entry.duration}ms`);
                }
            });
        });
        
        observer.observe({ entryTypes: ['measure'] });
    },

    mark(name) {
        performance.mark(name);
    },

    measure(name, startMark, endMark) {
        try {
            performance.measure(name, startMark, endMark);
        } catch (e) {
            console.warn('Performance measure failed:', e);
        }
    }
};

const Accessibility = {
    init() {
        this.initKeyboardNav();
        this.initFocusManagement();
        this.initAriaLive();
    },

    initKeyboardNav() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-nav');
            }
        });

        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-nav');
        });
    },

    initFocusManagement() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('transitionend', () => {
                if (modal.classList.contains('active')) {
                    const firstFocusable = modal.querySelector('input, button, [tabindex]:not([tabindex="-1"])');
                    firstFocusable?.focus();
                }
            });
        });
    },

    initAriaLive() {
        const liveRegion = document.createElement('div');
        liveRegion.id = 'aria-live';
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.className = 'sr-only';
        document.body.appendChild(liveRegion);
    },

    announce(message) {
        const liveRegion = document.getElementById('aria-live');
        if (liveRegion) {
            liveRegion.textContent = message;
        }
    }
};

const ShareManager = {
    platforms: {
        wechat: {
            name: '微信',
            share: (url, title) => {
                Toast.info('请截图分享到微信');
            }
        },
        weibo: {
            name: '微博',
            share: (url, title) => {
                window.open(`https://service.weibo.com/share/share.php?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`, '_blank');
            }
        },
        qq: {
            name: 'QQ',
            share: (url, title) => {
                window.open(`https://connect.qq.com/widget/shareqq/index.html?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`, '_blank');
            }
        },
        link: {
            name: '复制链接',
            share: async (url, title) => {
                await Utils.copyToClipboard(url);
                Toast.success('链接已复制');
            }
        }
    },

    init() {
        this.bindEvents();
    },

    bindEvents() {
        document.body.addEventListener('click', (e) => {
            const platform = e.target.closest('[data-platform]');
            if (platform) {
                const { platform: name, url, title } = platform.dataset;
                this.share(name, url, title);
            }

            const copyBtn = e.target.closest('.copy-link-btn');
            if (copyBtn) {
                const input = copyBtn.previousElementSibling;
                if (input) {
                    Utils.copyToClipboard(input.value);
                    Toast.success('链接已复制');
                }
            }
        });
    },

    share(platform, url, title = '') {
        const handler = this.platforms[platform];
        if (handler) {
            handler.share(url, title);
            EventBus.emit('share:complete', { platform, url, title });
        }
    },

    showShareModal(postId) {
        const content = Components.shareModal(postId);
        const modal = document.createElement('div');
        modal.className = 'modal active';
        modal.id = 'shareModal';
        modal.innerHTML = `
            <div class="modal-content modal-sm">
                <button class="modal-close" onclick="Modal.close('shareModal')">×</button>
                ${content}
            </div>
        `;
        document.body.appendChild(modal);
        requestAnimationFrame(() => modal.classList.add('show'));
    }
};

const FavoriteManager = {
    init() {
        this.bindEvents();
        EventBus.on('favorite:toggle', ({ id, type }) => {
            this.handleToggle(id, type);
        });
    },

    bindEvents() {
        document.body.addEventListener('click', (e) => {
            const favBtn = e.target.closest('[data-action="favorite"]');
            if (favBtn) {
                const { id } = favBtn.dataset;
                this.toggleFavorite(id, 'post');
            }

            const unfavBtn = e.target.closest('.unfavorite-btn');
            if (unfavBtn) {
                const { id, type } = unfavBtn.dataset;
                Store.toggleFavorite(id, type);
                Toast.success('已取消收藏');
                this.renderFavoritesList();
            }
        });
    },

    toggleFavorite(id, type = 'post') {
        const isFav = Store.toggleFavorite(id, type);
        Toast.success(isFav ? '已收藏' : '已取消收藏');
        EventBus.emit('favorite:changed', { id, type, isFav });
        return isFav;
    },

    handleToggle(id, type) {
        this.toggleFavorite(id, type);
    },

    getFavorites(type = null) {
        return Store.getFavorites(type);
    },

    renderFavoritesList(containerId = 'favoritesList') {
        const container = document.getElementById(containerId);
        if (!container) return;

        const favorites = this.getFavorites();
        
        if (favorites.length === 0) {
            container.innerHTML = Components.emptyState('暂无收藏内容', '⭐');
            return;
        }

        container.innerHTML = favorites.map(item => {
            const type = item.id ? 'post' : item.name ? 'agent' : 'resource';
            return Components.favoriteItem(item, type);
        }).join('');
    },

    isFavorite(id, type = 'post') {
        return Store.isFavorite(id, type);
    }
};

const ImagePreview = {
    init() {
        this.createModal();
        this.bindEvents();
    },

    createModal() {
        const modal = document.createElement('div');
        modal.id = 'imagePreviewModal';
        modal.className = 'image-preview-modal';
        modal.innerHTML = `
            <div class="image-preview-overlay"></div>
            <div class="image-preview-content">
                <img class="image-preview-img" src="" alt="预览图片">
                <button class="image-preview-close">×</button>
            </div>
        `;
        document.body.appendChild(modal);
    },

    bindEvents() {
        const modal = document.getElementById('imagePreviewModal');
        
        modal?.querySelector('.image-preview-overlay')?.addEventListener('click', () => this.close());
        modal?.querySelector('.image-preview-close')?.addEventListener('click', () => this.close());
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.close();
        });

        document.body.addEventListener('click', (e) => {
            const img = e.target.closest('img[data-preview]');
            if (img) {
                this.open(img.src);
            }
        });
    },

    open(src) {
        const modal = document.getElementById('imagePreviewModal');
        const img = modal?.querySelector('.image-preview-img');
        if (img) img.src = src;
        modal?.classList.add('active');
        document.body.style.overflow = 'hidden';
    },

    close() {
        const modal = document.getElementById('imagePreviewModal');
        modal?.classList.remove('active');
        document.body.style.overflow = '';
    }
};

const PullToRefresh = {
    threshold: 80,
    isPulling: false,
    startY: 0,

    init() {
        this.bindEvents();
    },

    bindEvents() {
        const container = document.querySelector('.main-content');
        if (!container) return;

        container.addEventListener('touchstart', (e) => {
            if (window.scrollY === 0) {
                this.startY = e.touches[0].pageY;
                this.isPulling = true;
            }
        });

        container.addEventListener('touchmove', (e) => {
            if (!this.isPulling) return;
            
            const y = e.touches[0].pageY;
            const diff = y - this.startY;
            
            if (diff > 0 && diff < this.threshold * 2) {
                container.style.transform = `translateY(${Math.min(diff * 0.3, this.threshold)}px)`;
            }
        });

        container.addEventListener('touchend', () => {
            if (!this.isPulling) return;
            this.isPulling = false;
            
            const transform = container.style.transform;
            const match = transform.match(/translateY\((\d+(?:\.\d+)?)px\)/);
            
            if (match && parseFloat(match[1]) >= this.threshold * 0.5) {
                App.refresh();
            }
            
            container.style.transform = '';
        });
    }
};

document.addEventListener('DOMContentLoaded', () => {
    App.init();
    PWA.init();
    Performance.init();
    Accessibility.init();
    ShareManager.init();
    FavoriteManager.init();
    ImagePreview.init();
    PullToRefresh.init();
    GestureManager.init();
    DataVisualization.init();
    DataSync.init();
    ProfileManager.init();
    SettingsManager.init();
    AnimationManager.init();
    RecommendationEngine.init();
    PerformanceMonitor.init();
    OnboardingManager.init();
    LayoutManager.init();
});

const GestureManager = {
    swipeThreshold: 50,
    tapThreshold: 200,
    longPressThreshold: 500,
    doubleTapThreshold: 300,
    touchStart: null,
    touchStartTime: null,
    lastTapTime: null,
    lastTapTarget: null,
    longPressTimer: null,
    doubleTapTimer: null,
    pinchStartDistance: null,
    pinchCenter: null,

    init() {
        this.bindGlobalGestures();
        this.bindSwipeNavigation();
        this.bindPullActions();
        this.bindPinchZoom();
        this.bindDoubleTap();
    },

    bindGlobalGestures() {
        document.addEventListener('touchstart', (e) => this.onTouchStart(e), { passive: true });
        document.addEventListener('touchmove', (e) => this.onTouchMove(e), { passive: true });
        document.addEventListener('touchend', (e) => this.onTouchEnd(e), { passive: true });
        document.addEventListener('touchcancel', (e) => this.onTouchCancel(e), { passive: true });
    },

    onTouchStart(e) {
        if (e.touches.length === 2) {
            this.handlePinchStart(e);
            return;
        }

        this.touchStart = {
            x: e.touches[0].clientX,
            y: e.touches[0].clientY
        };
        this.touchStartTime = Date.now();

        this.longPressTimer = setTimeout(() => {
            const target = e.target.closest('[data-longpress]');
            if (target) {
                this.triggerLongPress(target, e);
            }
        }, this.longPressThreshold);
    },

    onTouchMove(e) {
        if (e.touches.length === 2) {
            this.handlePinchMove(e);
            return;
        }

        if (!this.touchStart) return;

        const deltaX = e.touches[0].clientX - this.touchStart.x;
        const deltaY = e.touches[0].clientY - this.touchStart.y;

        if (Math.abs(deltaX) > 10 || Math.abs(deltaY) > 10) {
            clearTimeout(this.longPressTimer);
        }
    },

    onTouchEnd(e) {
        clearTimeout(this.longPressTimer);

        if (!this.touchStart || !this.touchStartTime) return;

        const touchEnd = {
            x: e.changedTouches[0].clientX,
            y: e.changedTouches[0].clientY
        };

        const deltaTime = Date.now() - this.touchStartTime;
        const deltaX = touchEnd.x - this.touchStart.x;
        const deltaY = touchEnd.y - this.touchStart.y;

        if (deltaTime < this.tapThreshold && Math.abs(deltaX) < 10 && Math.abs(deltaY) < 10) {
            this.handleTap(e);
        }

        if (Math.abs(deltaX) > this.swipeThreshold && Math.abs(deltaX) > Math.abs(deltaY)) {
            this.triggerSwipe(deltaX > 0 ? 'right' : 'left', e);
        }

        if (Math.abs(deltaY) > this.swipeThreshold && Math.abs(deltaY) > Math.abs(deltaX)) {
            this.triggerSwipe(deltaY > 0 ? 'down' : 'up', e);
        }

        this.touchStart = null;
        this.touchStartTime = null;
    },

    onTouchCancel(e) {
        clearTimeout(this.longPressTimer);
        clearTimeout(this.doubleTapTimer);
        this.touchStart = null;
        this.touchStartTime = null;
    },

    handleTap(e) {
        const now = Date.now();
        const target = e.target.closest('[data-tap]');

        if (this.lastTapTime && (now - this.lastTapTime) < this.doubleTapThreshold) {
            if (this.lastTapTarget === target) {
                this.triggerDoubleTap(e, target);
                this.lastTapTime = null;
                this.lastTapTarget = null;
                return;
            }
        }

        this.lastTapTime = now;
        this.lastTapTarget = target;

        if (target) {
            const action = target.dataset.tap;
            EventBus.emit('gesture:tap', { action, target });
        }

        clearTimeout(this.doubleTapTimer);
        this.doubleTapTimer = setTimeout(() => {
            this.lastTapTime = null;
            this.lastTapTarget = null;
        }, this.doubleTapThreshold);
    },

    bindDoubleTap() {
        EventBus.on('gesture:doubletap', ({ target, element }) => {
            if (navigator.vibrate) {
                navigator.vibrate([30, 50, 30]);
            }

            if (element) {
                element.classList.add('double-tap-active');
                setTimeout(() => {
                    element.classList.remove('double-tap-active');
                }, 300);
            }
        });
    },

    triggerDoubleTap(e, target) {
        const element = e.target.closest('[data-doubletap]') || target;
        const action = element?.dataset.doubletap;
        
        EventBus.emit('gesture:doubletap', { action, target, element });

        if (action === 'like') {
            const likeBtn = e.target.closest('.like-btn');
            if (likeBtn) {
                likeBtn.click();
            }
        }

        if (action === 'favorite') {
            const favBtn = e.target.closest('.favorite-btn');
            if (favBtn) {
                favBtn.click();
            }
        }
    },

    handlePinchStart(e) {
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        
        this.pinchStartDistance = Math.hypot(
            touch2.clientX - touch1.clientX,
            touch2.clientY - touch1.clientY
        );
        
        this.pinchCenter = {
            x: (touch1.clientX + touch2.clientX) / 2,
            y: (touch1.clientY + touch2.clientY) / 2
        };
    },

    handlePinchMove(e) {
        if (!this.pinchStartDistance) return;

        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        
        const currentDistance = Math.hypot(
            touch2.clientX - touch1.clientX,
            touch2.clientY - touch1.clientY
        );
        
        const scale = currentDistance / this.pinchStartDistance;
        
        EventBus.emit('gesture:pinch', { scale, center: this.pinchCenter });

        if (scale > 1.5) {
            this.triggerPinch('zoom-in', scale);
        } else if (scale < 0.7) {
            this.triggerPinch('zoom-out', scale);
        }
    },

    bindPinchZoom() {
        EventBus.on('gesture:pinch', ({ scale }) => {
            const target = document.querySelector('[data-pinch]');
            if (target) {
                target.style.transform = `scale(${Math.min(Math.max(scale, 0.5), 2)})`;
            }
        });
    },

    triggerPinch(action, scale) {
        EventBus.emit('gesture:pinch:' + action, { scale });
        
        if (navigator.vibrate) {
            navigator.vibrate(20);
        }
    },

    triggerSwipe(direction, e) {
        const target = e.target.closest('[data-swipe]');
        if (target) {
            const action = target.dataset.swipe;
            EventBus.emit('gesture:swipe', { direction, action, target });
        }

        if (direction === 'right' && !e.target.closest('.modal, .drawer')) {
            const activeModal = document.querySelector('.modal.active');
            if (activeModal) {
                Modal.close(activeModal.id);
            }
        }
    },

    triggerLongPress(target, e) {
        const action = target.dataset.longpress;
        EventBus.emit('gesture:longpress', { action, target });

        if (navigator.vibrate) {
            navigator.vibrate(50);
        }
    },

    bindSwipeNavigation() {
        let startX = 0;
        let isSwiping = false;

        document.addEventListener('touchstart', (e) => {
            if (e.touches.length === 1) {
                startX = e.touches[0].clientX;
                isSwiping = startX < 30;
            }
        }, { passive: true });

        document.addEventListener('touchend', (e) => {
            if (!isSwiping) return;

            const endX = e.changedTouches[0].clientX;
            const diff = endX - startX;

            if (diff > 100) {
                this.showDrawer();
            }

            isSwiping = false;
        }, { passive: true });
    },

    showDrawer() {
        const drawer = document.querySelector('.nav-drawer');
        if (drawer) {
            drawer.classList.add('active');
        }
    },

    hideDrawer() {
        const drawer = document.querySelector('.nav-drawer');
        if (drawer) {
            drawer.classList.remove('active');
        }
    },

    bindPullActions() {
        let startY = 0;
        let isPulling = false;

        document.addEventListener('touchstart', (e) => {
            if (window.scrollY === 0 && e.touches.length === 1) {
                startY = e.touches[0].clientY;
                isPulling = true;
            }
        }, { passive: true });

        document.addEventListener('touchmove', (e) => {
            if (!isPulling) return;

            const currentY = e.touches[0].clientY;
            const diff = currentY - startY;

            if (diff > 80) {
                this.showPullHint('下拉刷新');
            }
        }, { passive: true });

        document.addEventListener('touchend', () => {
            isPulling = false;
            this.hidePullHint();
        }, { passive: true });
    },

    showPullHint(text) {
        let hint = document.querySelector('.gesture-hint');
        if (!hint) {
            hint = document.createElement('div');
            hint.className = 'gesture-hint';
            document.body.appendChild(hint);
        }
        hint.textContent = text;
        hint.classList.add('show');
    },

    hidePullHint() {
        const hint = document.querySelector('.gesture-hint');
        if (hint) {
            hint.classList.remove('show');
        }
    }
};

const DataVisualization = {
    studyData: {
        daily: [],
        weekly: [],
        monthly: []
    },

    init() {
        this.loadStudyData();
        this.bindEvents();
    },

    loadStudyData() {
        const saved = localStorage.getItem('eduequity_study_data');
        if (saved) {
            this.studyData = JSON.parse(saved);
        } else {
            this.generateSampleData();
        }
    },

    generateSampleData() {
        const days = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
        this.studyData.weekly = days.map(day => ({
            day,
            hours: Math.floor(Math.random() * 6) + 2,
            subjects: {
                math: Math.floor(Math.random() * 2) + 0.5,
                chinese: Math.floor(Math.random() * 2) + 0.5,
                english: Math.floor(Math.random() * 2) + 0.5,
                others: Math.floor(Math.random() * 2)
            }
        }));

        this.saveStudyData();
    },

    saveStudyData() {
        localStorage.setItem('eduequity_study_data', JSON.stringify(this.studyData));
    },

    bindEvents() {
        EventBus.on('study:record', (data) => this.recordStudy(data));
    },

    recordStudy(data) {
        const today = new Date().toLocaleDateString('zh-CN', { weekday: 'short' });
        const weekData = this.studyData.weekly.find(d => d.day === today);

        if (weekData) {
            weekData.hours += data.hours || 0.5;
            if (data.subject && weekData.subjects[data.subject]) {
                weekData.subjects[data.subject] += data.hours || 0.5;
            }
            this.saveStudyData();
            this.updateCharts();
        }
    },

    renderWeeklyChart(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const maxHours = Math.max(...this.studyData.weekly.map(d => d.hours));

        container.innerHTML = `
            <div class="chart-bar">
                ${this.studyData.weekly.map(d => `
                    <div class="bar-item">
                        <div class="bar" style="height: ${(d.hours / maxHours) * 150}px"></div>
                        <span class="bar-label">${d.day}</span>
                    </div>
                `).join('')}
            </div>
        `;
    },

    renderSubjectProgress(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const subjects = [
            { name: '数学', key: 'math', color: '#6366F1' },
            { name: '语文', key: 'chinese', color: '#10B981' },
            { name: '英语', key: 'english', color: '#F59E0B' },
            { name: '其他', key: 'others', color: '#EF4444' }
        ];

        const totalHours = this.studyData.weekly.reduce((sum, d) => sum + d.hours, 0);

        container.innerHTML = subjects.map(s => {
            const subjectHours = this.studyData.weekly.reduce((sum, d) => sum + (d.subjects[s.key] || 0), 0);
            const progress = totalHours > 0 ? (subjectHours / totalHours) * 100 : 0;

            return `
                <div class="progress-item">
                    <div class="progress-header">
                        <span class="progress-label">${s.name}</span>
                        <span class="progress-value">${subjectHours.toFixed(1)}h</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${progress}%; background: ${s.color}"></div>
                    </div>
                </div>
            `;
        }).join('');
    },

    renderStatsCards(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const totalHours = this.studyData.weekly.reduce((sum, d) => sum + d.hours, 0);
        const avgHours = totalHours / 7;
        const streak = this.calculateStreak();
        const goalProgress = Math.min(100, (totalHours / 35) * 100);

        container.innerHTML = `
            <div class="stat-grid">
                <div class="stat-item">
                    <div class="stat-value">${totalHours.toFixed(1)}</div>
                    <div class="stat-label">本周学习(小时)</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${avgHours.toFixed(1)}</div>
                    <div class="stat-label">日均学习(小时)</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${streak}</div>
                    <div class="stat-label">连续学习(天)</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${goalProgress.toFixed(0)}%</div>
                    <div class="stat-label">周目标进度</div>
                </div>
            </div>
        `;
    },

    calculateStreak() {
        let streak = 0;
        const today = new Date();

        for (let i = 0; i < 30; i++) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dayName = date.toLocaleDateString('zh-CN', { weekday: 'short' });

            const dayData = this.studyData.weekly.find(d => d.day === dayName);
            if (dayData && dayData.hours > 0) {
                streak++;
            } else {
                break;
            }
        }

        return streak;
    },

    updateCharts() {
        this.renderWeeklyChart('weeklyChart');
        this.renderSubjectProgress('subjectProgress');
        this.renderStatsCards('statsCards');
    },

    renderDashboard() {
        return `
            <div class="data-viz-card">
                <div class="data-viz-header">
                    <h3 class="data-viz-title">学习统计</h3>
                    <span class="data-viz-period">本周</span>
                </div>
                <div id="statsCards"></div>
            </div>
            <div class="data-viz-card">
                <div class="data-viz-header">
                    <h3 class="data-viz-title">学习时间分布</h3>
                </div>
                <div class="chart-container" id="weeklyChart"></div>
            </div>
            <div class="data-viz-card">
                <div class="data-viz-header">
                    <h3 class="data-viz-title">科目进度</h3>
                </div>
                <div id="subjectProgress"></div>
            </div>
        `;
    }
};

const ProfileManager = {
    currentTab: 'favorites-posts',

    init() {
        this.bindEvents();
        this.render();
    },

    bindEvents() {
        document.getElementById('profileBtn')?.addEventListener('click', () => {
            Router.navigate('profile');
        });

        document.getElementById('editProfileBtn')?.addEventListener('click', () => {
            this.showEditModal();
        });

        document.querySelectorAll('.profile-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                document.querySelectorAll('.profile-tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                this.currentTab = tab.dataset.tab;
                this.renderFavorites();
            });
        });
    },

    render() {
        const user = Store.state.user;
        
        if (user) {
            document.getElementById('profileAvatar').textContent = user.avatar || '👤';
            document.getElementById('profileName').textContent = user.username;
            document.getElementById('profileRole').textContent = this.getRoleName(user.role);
            
            const userPosts = Store.state.posts.filter(p => p.author?.name === user.username);
            const userAgents = Store.state.agents.filter(a => a.author === user.username);
            const userFavorites = Store.state.favorites;
            const totalLikes = userPosts.reduce((sum, p) => sum + (p.likes || 0), 0);

            document.getElementById('profilePosts').textContent = userPosts.length;
            document.getElementById('profileAgents').textContent = userAgents.length;
            document.getElementById('profileFavorites').textContent = userFavorites.length;
            document.getElementById('profileLikes').textContent = totalLikes;
        }

        this.renderStudyStats();
        this.renderFavorites();
        this.renderMyPosts();
        this.renderMyAgents();
    },

    getRoleName(role) {
        const roles = {
            student: '学生',
            teacher: '教师',
            parent: '家长',
            volunteer: '志愿者'
        };
        return roles[role] || '学生';
    },

    renderStudyStats() {
        const container = document.getElementById('profileStudyStats');
        if (!container) return;

        container.innerHTML = DataVisualization.renderDashboard();
        
        setTimeout(() => {
            DataVisualization.updateCharts();
        }, 100);
    },

    renderFavorites() {
        const container = document.getElementById('profileFavorites');
        if (!container) return;

        const favorites = Store.state.favorites;
        let items = [];

        if (this.currentTab === 'favorites-posts') {
            items = favorites.filter(f => f.type === 'post').map(f => {
                const post = Store.state.posts.find(p => p.id === f.id);
                return post ? { ...post, type: 'post' } : null;
            }).filter(Boolean);
        } else if (this.currentTab === 'favorites-agents') {
            items = favorites.filter(f => f.type === 'agent').map(f => {
                const agent = Store.state.agents.find(a => a.id === f.id);
                return agent ? { ...agent, type: 'agent' } : null;
            }).filter(Boolean);
        } else {
            items = favorites.filter(f => f.type === 'resource').map(f => {
                const resource = Store.state.resources.find(r => r.id === f.id);
                return resource ? { ...resource, type: 'resource' } : null;
            }).filter(Boolean);
        }

        if (items.length === 0) {
            container.innerHTML = Components.emptyState('暂无收藏', '⭐');
            return;
        }

        container.innerHTML = items.map(item => `
            <div class="profile-item" data-type="${item.type}" data-id="${item.id}">
                <div class="profile-item-icon">${item.type === 'post' ? '📝' : item.type === 'agent' ? '🤖' : '📚'}</div>
                <div class="profile-item-content">
                    <div class="profile-item-title">${Utils.escapeHtml(item.title || item.name)}</div>
                    <div class="profile-item-meta">${Utils.formatTime(item.createdAt)}</div>
                </div>
            </div>
        `).join('');
    },

    renderMyPosts() {
        const container = document.getElementById('profileMyPosts');
        if (!container) return;

        const user = Store.state.user;
        if (!user) {
            container.innerHTML = Components.emptyState('登录后查看', '🔒');
            return;
        }

        const myPosts = Store.state.posts.filter(p => p.author?.name === user.username);

        if (myPosts.length === 0) {
            container.innerHTML = Components.emptyState('暂无帖子', '📝');
            return;
        }

        container.innerHTML = myPosts.slice(0, 5).map(post => `
            <div class="profile-item" data-type="post" data-id="${post.id}">
                <div class="profile-item-icon">📝</div>
                <div class="profile-item-content">
                    <div class="profile-item-title">${Utils.escapeHtml(post.title)}</div>
                    <div class="profile-item-meta">👍 ${post.likes || 0} · 💬 ${post.comments || 0}</div>
                </div>
            </div>
        `).join('');
    },

    renderMyAgents() {
        const container = document.getElementById('profileMyAgents');
        if (!container) return;

        const user = Store.state.user;
        if (!user) {
            container.innerHTML = Components.emptyState('登录后查看', '🔒');
            return;
        }

        const myAgents = Store.state.agents.filter(a => a.author === user.username);

        if (myAgents.length === 0) {
            container.innerHTML = Components.emptyState('暂无智能体', '🤖');
            return;
        }

        container.innerHTML = myAgents.slice(0, 5).map(agent => `
            <div class="profile-item" data-type="agent" data-id="${agent.id}">
                <div class="profile-item-icon">${agent.avatar}</div>
                <div class="profile-item-content">
                    <div class="profile-item-title">${Utils.escapeHtml(agent.name)}</div>
                    <div class="profile-item-meta">💬 ${agent.chats || 0} 次对话</div>
                </div>
            </div>
        `).join('');
    },

    showEditModal() {
        const user = Store.state.user;
        if (!user) {
            Modal.open('loginModal');
            return;
        }

        const content = `
            <form id="editProfileForm">
                <div class="form-group">
                    <label>用户名</label>
                    <input type="text" id="editUsername" value="${user.username}" required>
                </div>
                <div class="form-group">
                    <label>邮箱</label>
                    <input type="email" id="editEmail" value="${user.email || ''}">
                </div>
                <div class="form-group">
                    <label>身份</label>
                    <select id="editRole">
                        <option value="student" ${user.role === 'student' ? 'selected' : ''}>学生</option>
                        <option value="teacher" ${user.role === 'teacher' ? 'selected' : ''}>教师</option>
                        <option value="parent" ${user.role === 'parent' ? 'selected' : ''}>家长</option>
                        <option value="volunteer" ${user.role === 'volunteer' ? 'selected' : ''}>志愿者</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>头像</label>
                    <div class="avatar-selector">
                        ${['👤', '👨‍🎓', '👩‍🎓', '🧑‍💻', '👨‍🏫', '👩‍🏫', '🧑‍🔬', '🦸', '🧙', '🤖'].map(a => `
                            <div class="avatar-option ${a === (user.avatar || '👤') ? 'selected' : ''}" data-avatar="${a}">${a}</div>
                        `).join('')}
                    </div>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn-secondary" onclick="Modal.close('editProfileModal')">取消</button>
                    <button type="submit" class="btn-primary">保存</button>
                </div>
            </form>
        `;

        const modal = document.createElement('div');
        modal.className = 'modal active';
        modal.id = 'editProfileModal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>编辑资料</h2>
                    <button class="modal-close" onclick="Modal.close('editProfileModal')">&times;</button>
                </div>
                <div class="modal-body">${content}</div>
            </div>
        `;
        document.body.appendChild(modal);

        modal.querySelectorAll('.avatar-option').forEach(opt => {
            opt.addEventListener('click', () => {
                modal.querySelectorAll('.avatar-option').forEach(o => o.classList.remove('selected'));
                opt.classList.add('selected');
            });
        });

        modal.querySelector('#editProfileForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveProfile(modal);
        });
    },

    saveProfile(modal) {
        const user = Store.state.user;
        if (!user) return;

        const selectedAvatar = modal.querySelector('.avatar-option.selected');
        
        const updates = {
            username: document.getElementById('editUsername').value.trim(),
            email: document.getElementById('editEmail').value.trim(),
            role: document.getElementById('editRole').value,
            avatar: selectedAvatar ? selectedAvatar.dataset.avatar : user.avatar
        };

        if (!updates.username) {
            Toast.error('用户名不能为空');
            return;
        }

        Object.assign(user, updates);
        Store.setUser(user);
        
        Modal.close('editProfileModal');
        this.render();
        Toast.success('资料已更新');
    }
};

const SettingsManager = {
    settings: {
        theme: 'light',
        fontSize: 'medium',
        pushNotifications: true,
        soundNotifications: true,
        emailNotifications: false,
        publicProfile: true,
        showStudyData: true,
        customColors: null
    },

    presetThemes: {
        default: {
            primary: '#4F46E5',
            primaryLight: '#818CF8',
            primaryDark: '#3730A3',
            secondary: '#10B981',
            accent: '#F59E0B',
            danger: '#EF4444',
            warning: '#F59E0B',
            success: '#10B981'
        },
        ocean: {
            primary: '#0891B2',
            primaryLight: '#22D3EE',
            primaryDark: '#164E63',
            secondary: '#06B6D4',
            accent: '#F472B6',
            danger: '#DC2626',
            warning: '#EA580C',
            success: '#059669'
        },
        sunset: {
            primary: '#DC2626',
            primaryLight: '#F87171',
            primaryDark: '#991B1B',
            secondary: '#EA580C',
            accent: '#D97706',
            danger: '#B91C1C',
            warning: '#C2410C',
            success: '#16A34A'
        },
        forest: {
            primary: '#059669',
            primaryLight: '#34D399',
            primaryDark: '#064E3B',
            secondary: '#10B981',
            accent: '#8B5CF6',
            danger: '#DC2626',
            warning: '#D97706',
            success: '#047857'
        },
        midnight: {
            primary: '#6366F1',
            primaryLight: '#818CF8',
            primaryDark: '#4338CA',
            secondary: '#8B5CF6',
            accent: '#EC4899',
            danger: '#EF4444',
            warning: '#F59E0B',
            success: '#10B981'
        }
    },

    init() {
        this.loadSettings();
        this.bindEvents();
        this.applySettings();
    },

    loadSettings() {
        const saved = localStorage.getItem('eduequity_settings');
        if (saved) {
            this.settings = { ...this.settings, ...JSON.parse(saved) };
        }
    },

    saveSettings() {
        localStorage.setItem('eduequity_settings', JSON.stringify(this.settings));
    },

    bindEvents() {
        document.querySelectorAll('.theme-option').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.theme-option').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.settings.theme = btn.dataset.theme;
                this.applyTheme();
                this.saveSettings();
            });
        });

        document.getElementById('fontSizeSelect')?.addEventListener('change', (e) => {
            this.settings.fontSize = e.target.value;
            this.applyFontSize();
            this.saveSettings();
        });

        document.getElementById('pushNotifications')?.addEventListener('change', (e) => {
            this.settings.pushNotifications = e.target.checked;
            this.saveSettings();
        });

        document.getElementById('soundNotifications')?.addEventListener('change', (e) => {
            this.settings.soundNotifications = e.target.checked;
            this.saveSettings();
        });

        document.getElementById('emailNotifications')?.addEventListener('change', (e) => {
            this.settings.emailNotifications = e.target.checked;
            this.saveSettings();
        });

        document.getElementById('publicProfile')?.addEventListener('change', (e) => {
            this.settings.publicProfile = e.target.checked;
            this.saveSettings();
        });

        document.getElementById('showStudyData')?.addEventListener('change', (e) => {
            this.settings.showStudyData = e.target.checked;
            this.saveSettings();
        });

        document.querySelectorAll('.theme-preset-btn')?.forEach(btn => {
            btn.addEventListener('click', () => {
                const preset = btn.dataset.preset;
                if (this.presetThemes[preset]) {
                    this.applyPresetTheme(preset);
                    this.settings.customColors = preset;
                    this.saveSettings();
                    Toast.success(`已应用${this.getPresetName(preset)}主题`);
                }
            });
        });

        document.getElementById('customColorPrimary')?.addEventListener('input', (e) => {
            this.updateCustomColor('primary', e.target.value);
        });

        document.getElementById('customColorSecondary')?.addEventListener('input', (e) => {
            this.updateCustomColor('secondary', e.target.value);
        });

        document.getElementById('customColorAccent')?.addEventListener('input', (e) => {
            this.updateCustomColor('accent', e.target.value);
        });

        document.getElementById('exportDataBtn')?.addEventListener('click', () => this.exportData());
        document.getElementById('importDataBtn')?.addEventListener('click', () => {
            document.getElementById('importDataFile')?.click();
        });
        document.getElementById('importDataFile')?.addEventListener('change', (e) => this.importData(e));
        document.getElementById('clearCacheBtn')?.addEventListener('click', () => this.clearCache());
        document.getElementById('deleteAccountBtn')?.addEventListener('click', () => this.deleteAccount());
    },

    getPresetName(preset) {
        const names = {
            default: '默认',
            ocean: '海洋',
            sunset: '日落',
            forest: '森林',
            midnight: '午夜'
        };
        return names[preset] || preset;
    },

    applyPresetTheme(preset) {
        const colors = this.presetThemes[preset];
        if (colors) {
            this.applyCustomColors(colors);
        }
    },

    updateCustomColor(key, value) {
        if (!this.settings.customColors) {
            this.settings.customColors = { ...this.presetThemes.default };
        }
        this.settings.customColors[key] = value;
        this.applyCustomColors(this.settings.customColors);
        this.saveSettings();
    },

    applyCustomColors(colors) {
        const root = document.documentElement;
        root.style.setProperty('--primary', colors.primary);
        root.style.setProperty('--primary-light', colors.primaryLight);
        root.style.setProperty('--primary-dark', colors.primaryDark);
        root.style.setProperty('--secondary', colors.secondary);
        root.style.setProperty('--accent', colors.accent);
        root.style.setProperty('--danger', colors.danger);
        root.style.setProperty('--warning', colors.warning);
        root.style.setProperty('--success', colors.success);
    },

    applySettings() {
        this.applyTheme();
        this.applyFontSize();

        document.getElementById('fontSizeSelect').value = this.settings.fontSize;
        document.getElementById('pushNotifications').checked = this.settings.pushNotifications;
        document.getElementById('soundNotifications').checked = this.settings.soundNotifications;
        document.getElementById('emailNotifications').checked = this.settings.emailNotifications;
        document.getElementById('publicProfile').checked = this.settings.publicProfile;
        document.getElementById('showStudyData').checked = this.settings.showStudyData;

        document.querySelectorAll('.theme-option').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.theme === this.settings.theme);
        });
    },

    applyTheme() {
        let theme = this.settings.theme;
        
        if (theme === 'auto') {
            theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        
        document.documentElement.setAttribute('data-theme', theme);
        
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
        }
    },

    applyFontSize() {
        const sizes = { small: '14px', medium: '16px', large: '18px' };
        document.documentElement.style.fontSize = sizes[this.settings.fontSize] || '16px';
    },

    async exportData() {
        try {
            const data = await DataSync.exportData();
            const blob = new Blob([data], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `eduequity_backup_${new Date().toISOString().slice(0, 10)}.json`;
            a.click();
            URL.revokeObjectURL(url);
            Toast.success('数据导出成功');
        } catch (error) {
            Toast.error('导出失败');
        }
    },

    async importData(event) {
        const file = event.target.files[0];
        if (!file) return;

        try {
            const text = await file.text();
            const success = await DataSync.importData(text);
            
            if (success) {
                Toast.success('数据导入成功');
                location.reload();
            } else {
                Toast.error('数据格式错误');
            }
        } catch (error) {
            Toast.error('导入失败');
        }
    },

    async clearCache() {
        if (!confirm('确定要清除所有缓存吗？')) return;

        try {
            if ('caches' in window) {
                const names = await caches.keys();
                await Promise.all(names.map(name => caches.delete(name)));
            }
            
            localStorage.clear();
            sessionStorage.clear();
            
            if (window.IDB && IDB.db) {
                const stores = Object.keys(IDB.stores);
                for (const store of stores) {
                    await IDB.clear(store);
                }
            }
            
            Toast.success('缓存已清除');
            setTimeout(() => location.reload(), 1000);
        } catch (error) {
            Toast.error('清除失败');
        }
    },

    deleteAccount() {
        if (!confirm('确定要删除账户吗？此操作不可恢复！')) return;
        if (!confirm('再次确认：删除所有数据？')) return;

        Store.clearUser();
        localStorage.clear();
        
        Toast.success('账户已删除');
        setTimeout(() => location.reload(), 1000);
    }
};

window.Modal = Modal;
window.Toast = Toast;
window.Store = Store;
window.Router = Router;
window.EventBus = EventBus;
window.App = App;
window.ShareManager = ShareManager;
window.FavoriteManager = FavoriteManager;
window.GestureManager = GestureManager;
window.DataVisualization = DataVisualization;
window.ProfileManager = ProfileManager;
window.SettingsManager = SettingsManager;

const RecommendationEngine = {
    userBehavior: {
        views: [],
        searches: [],
        likes: [],
        favorites: [],
        timeSpent: {}
    },
    maxHistorySize: 100,

    init() {
        this.loadBehaviorData();
        this.trackBehavior();
    },

    loadBehaviorData() {
        const saved = localStorage.getItem('eduequity_behavior');
        if (saved) {
            this.userBehavior = JSON.parse(saved);
        }
    },

    saveBehaviorData() {
        localStorage.setItem('eduequity_behavior', JSON.stringify(this.userBehavior));
    },

    trackBehavior() {
        EventBus.on('post:viewed', (postId) => {
            this.recordView('post', postId);
        });

        EventBus.on('agent:opened', (agentId) => {
            this.recordView('agent', agentId);
        });

        EventBus.on('search:performed', (query) => {
            this.recordSearch(query);
        });

        EventBus.on('post:liked', (postId) => {
            this.recordLike(postId);
        });

        EventBus.on('item:favorited', (type, id) => {
            this.recordFavorite(type, id);
        });
    },

    recordView(type, id) {
        const view = {
            type,
            id,
            timestamp: Date.now()
        };
        this.userBehavior.views.push(view);
        this.updateTimeSpent(type, id);
        this.trimHistory();
        this.saveBehaviorData();
    },

    recordSearch(query) {
        const search = {
            query,
            timestamp: Date.now()
        };
        this.userBehavior.searches.push(search);
        this.trimHistory();
        this.saveBehaviorData();
    },

    recordLike(postId) {
        if (!this.userBehavior.likes.includes(postId)) {
            this.userBehavior.likes.push(postId);
            this.saveBehaviorData();
        }
    },

    recordFavorite(type, id) {
        const key = `${type}:${id}`;
        if (!this.userBehavior.favorites.includes(key)) {
            this.userBehavior.favorites.push(key);
            this.saveBehaviorData();
        }
    },

    updateTimeSpent(type, id) {
        const key = `${type}:${id}`;
        if (!this.userBehavior.timeSpent[key]) {
            this.userBehavior.timeSpent[key] = 0;
        }
        this.userBehavior.timeSpent[key] += 1;
    },

    trimHistory() {
        if (this.userBehavior.views.length > this.maxHistorySize) {
            this.userBehavior.views = this.userBehavior.views.slice(-this.maxHistorySize);
        }
        if (this.userBehavior.searches.length > this.maxHistorySize) {
            this.userBehavior.searches = this.userBehavior.searches.slice(-this.maxHistorySize);
        }
    },

    getRecommendedPosts(limit = 5) {
        const scored = Store.state.posts.map(post => {
            const score = this.calculatePostScore(post);
            return { post, score };
        });

        scored.sort((a, b) => b.score - a.score);
        return scored.slice(0, limit).map(item => item.post);
    },

    calculatePostScore(post) {
        let score = 0;

        const viewKey = `post:${post.id}`;
        if (this.userBehavior.timeSpent[viewKey]) {
            score += this.userBehavior.timeSpent[viewKey] * 0.1;
        }

        if (this.userBehavior.likes.includes(post.id)) {
            score += 5;
        }

        const favoriteKey = `post:${post.id}`;
        if (this.userBehavior.favorites.includes(favoriteKey)) {
            score += 3;
        }

        const recentViews = this.userBehavior.views.filter(v => 
            v.type === 'post' && Date.now() - v.timestamp < 7 * 24 * 60 * 60 * 1000
        );
        const viewedCategories = new Set();
        recentViews.forEach(v => {
            const viewedPost = Store.state.posts.find(p => p.id === v.id);
            if (viewedPost && viewedPost.category === post.category) {
                viewedCategories.add(post.category);
            }
        });
        if (viewedCategories.has(post.category)) {
            score += 2;
        }

        if (post.likes > 10) {
            score += Math.log(post.likes) * 0.5;
        }

        const daysSinceCreated = (Date.now() - post.createdAt) / (24 * 60 * 60 * 1000);
        score -= daysSinceCreated * 0.1;

        return score;
    },

    getRecommendedAgents(limit = 5) {
        const scored = Store.state.agents.map(agent => {
            const score = this.calculateAgentScore(agent);
            return { agent, score };
        });

        scored.sort((a, b) => b.score - a.score);
        return scored.slice(0, limit).map(item => item.agent);
    },

    calculateAgentScore(agent) {
        let score = 0;

        const viewKey = `agent:${agent.id}`;
        if (this.userBehavior.timeSpent[viewKey]) {
            score += this.userBehavior.timeSpent[viewKey] * 0.15;
        }

        const favoriteKey = `agent:${agent.id}`;
        if (this.userBehavior.favorites.includes(favoriteKey)) {
            score += 4;
        }

        if (agent.chats > 5) {
            score += Math.log(agent.chats) * 0.3;
        }

        const daysSinceCreated = (Date.now() - agent.createdAt) / (24 * 60 * 60 * 1000);
        score -= daysSinceCreated * 0.05;

        return score;
    },

    getTrendingTopics(limit = 5) {
        const topicCounts = {};

        this.userBehavior.searches.forEach(search => {
            const topics = this.extractTopics(search.query);
            topics.forEach(topic => {
                topicCounts[topic] = (topicCounts[topic] || 0) + 1;
            });
        });

        const sorted = Object.entries(topicCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, limit);

        return sorted.map(([topic, count]) => ({ topic, count }));
    },

    extractTopics(text) {
        const topics = [];
        const keywords = ['高考', '数学', '英语', '语文', '物理', '化学', '生物', '历史', '地理', '政治', '作文', '阅读', '听力', '真题', '模拟'];
        
        keywords.forEach(keyword => {
            if (text.includes(keyword)) {
                topics.push(keyword);
            }
        });

        return topics;
    },

    clearBehavior() {
        this.userBehavior = {
            views: [],
            searches: [],
            likes: [],
            favorites: [],
            timeSpent: {}
        };
        this.saveBehaviorData();
    }
};

window.RecommendationEngine = RecommendationEngine;
