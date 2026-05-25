const Components = {
    postCard(post) {
        const isFav = Store.isFavorite(post.id, 'post');
        return `
            <article class="post-card" data-post-id="${post.id}">
                <div class="post-header">
                    <div class="post-avatar">${post.author.avatar}</div>
                    <div class="post-author-info">
                        <div class="post-author">
                            ${post.author.name}
                            ${post.author.role ? `<span class="author-role">${post.author.role}</span>` : ''}
                        </div>
                        <div class="post-meta">
                            <span>${Utils.formatTime(post.createdAt)}</span>
                            <span>·</span>
                            <span>${post.views || 0} 浏览</span>
                        </div>
                    </div>
                    <span class="post-category ${post.category}">${this.getCategoryName(post.category)}</span>
                </div>
                <h3 class="post-title">${Utils.escapeHtml(post.title)}</h3>
                <p class="post-content">${Utils.escapeHtml(Utils.truncate(post.content, 150))}</p>
                <div class="post-tags">
                    ${post.tags.slice(0, 4).map(tag => `<span class="tag">#${tag}</span>`).join('')}
                </div>
                <div class="post-actions">
                    <button class="post-action" data-action="like" data-id="${post.id}">
                        <span class="action-icon">${isFav ? '❤️' : '🤍'}</span>
                        <span>${post.likes || 0}</span>
                    </button>
                    <button class="post-action" data-action="comment" data-id="${post.id}">
                        <span class="action-icon">💬</span>
                        <span>${post.comments || 0}</span>
                    </button>
                    <button class="post-action" data-action="favorite" data-id="${post.id}">
                        <span class="action-icon">${isFav ? '⭐' : '☆'}</span>
                        <span>${post.favorites || 0}</span>
                    </button>
                    <button class="post-action" data-action="share" data-id="${post.id}">
                        <span class="action-icon">🔗</span>
                    </button>
                </div>
            </article>
        `;
    },

    agentCard(agent) {
        const typeNames = {
            tutor: '学习辅导',
            qa: '问答助手',
            planner: '学习规划',
            motivator: '心理辅导',
            custom: '自定义'
        };
        
        return `
            <div class="agent-card ${agent.featured ? 'featured' : ''}" data-agent-id="${agent.id}">
                ${agent.featured ? '<div class="featured-badge">推荐</div>' : ''}
                <div class="agent-header">
                    <div class="agent-avatar">${agent.avatar}</div>
                    <div class="agent-info">
                        <h3>${Utils.escapeHtml(agent.name)}</h3>
                        <span class="agent-type">${typeNames[agent.type] || agent.type}</span>
                    </div>
                </div>
                <p class="agent-desc">${Utils.escapeHtml(agent.description)}</p>
                <div class="agent-tags">
                    ${agent.tags.slice(0, 3).map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
                <div class="agent-stats">
                    <div class="agent-stat">
                        <span class="stat-icon">💬</span>
                        <span>${agent.chats || 0} 对话</span>
                    </div>
                    <div class="agent-stat">
                        <span class="stat-icon">⭐</span>
                        <span>${agent.rating || 4.5}</span>
                    </div>
                </div>
                <button class="btn-primary btn-full agent-chat-btn" data-agent-id="${agent.id}">
                    开始对话
                </button>
            </div>
        `;
    },

    agentFeaturedCard(agent) {
        return `
            <div class="agent-featured-card" data-agent-id="${agent.id}">
                <div class="featured-agent-avatar">${agent.avatar}</div>
                <div class="featured-agent-info">
                    <h3>${Utils.escapeHtml(agent.name)}</h3>
                    <p>${Utils.escapeHtml(Utils.truncate(agent.description, 60))}</p>
                    <div class="featured-agent-stats">
                        <span>💬 ${agent.chats || 0}</span>
                        <span>⭐ ${agent.rating || 4.5}</span>
                    </div>
                </div>
            </div>
        `;
    },

    resourceCard(resource) {
        return `
            <div class="resource-card" data-resource-id="${resource.id}">
                <div class="resource-icon">${resource.icon}</div>
                <h3 class="resource-title">${Utils.escapeHtml(resource.title)}</h3>
                <div class="resource-meta">
                    <span>${this.getSubjectName(resource.subject)}</span>
                    <span>•</span>
                    <span>${this.getTypeName(resource.type)}</span>
                    ${resource.size ? `<span>•</span><span>${resource.size}</span>` : ''}
                </div>
                <p class="resource-desc">${Utils.escapeHtml(resource.description)}</p>
                <div class="resource-footer">
                    <span class="resource-downloads">📥 ${resource.downloads || 0}</span>
                    <div class="resource-actions">
                        <button class="btn-sm btn-primary" data-action="download" data-id="${resource.id}">获取</button>
                        <button class="btn-sm btn-secondary" data-action="share" data-id="${resource.id}">分享</button>
                    </div>
                </div>
            </div>
        `;
    },

    storyCard(story) {
        return `
            <div class="story-card">
                <div class="story-header">
                    <div class="story-avatar">${story.avatar}</div>
                    <div class="story-info">
                        <div class="story-author">${story.author}</div>
                        <div class="story-location">📍 ${story.location}</div>
                    </div>
                </div>
                <p class="story-content">${Utils.escapeHtml(story.content)}</p>
            </div>
        `;
    },

    commentItem(comment) {
        return `
            <div class="comment-item">
                <div class="comment-avatar">${comment.author.avatar}</div>
                <div class="comment-body">
                    <div class="comment-header">
                        <span class="comment-author">${comment.author.name}</span>
                        <span class="comment-time">${Utils.formatTime(comment.createdAt)}</span>
                    </div>
                    <p class="comment-text">${Utils.escapeHtml(comment.content)}</p>
                </div>
            </div>
        `;
    },

    messageBubble(content, type, avatar, time = null) {
        const timeStr = time ? Utils.formatTime(time) : '';
        return `
            <div class="message ${type}">
                <div class="message-avatar">${avatar}</div>
                <div class="message-body">
                    <div class="message-content">${Utils.escapeHtml(content).replace(/\n/g, '<br>')}</div>
                    ${timeStr ? `<div class="message-time">${timeStr}</div>` : ''}
                </div>
            </div>
        `;
    },

    typingIndicator(avatar) {
        return `
            <div class="message agent typing">
                <div class="message-avatar">${avatar}</div>
                <div class="message-body">
                    <div class="typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
            </div>
        `;
    },

    skeletonPost() {
        return `
            <div class="skeleton post-skeleton">
                <div class="skeleton-header">
                    <div class="skeleton-avatar"></div>
                    <div class="skeleton-meta">
                        <div class="skeleton-line short"></div>
                        <div class="skeleton-line tiny"></div>
                    </div>
                </div>
                <div class="skeleton-line"></div>
                <div class="skeleton-line long"></div>
                <div class="skeleton-actions">
                    <div class="skeleton-btn"></div>
                    <div class="skeleton-btn"></div>
                    <div class="skeleton-btn"></div>
                </div>
            </div>
        `;
    },

    skeletonAgent() {
        return `
            <div class="skeleton agent-skeleton">
                <div class="skeleton-header">
                    <div class="skeleton-avatar large"></div>
                    <div class="skeleton-meta">
                        <div class="skeleton-line"></div>
                        <div class="skeleton-line short"></div>
                    </div>
                </div>
                <div class="skeleton-line"></div>
                <div class="skeleton-line medium"></div>
                <div class="skeleton-tags">
                    <div class="skeleton-tag"></div>
                    <div class="skeleton-tag"></div>
                    <div class="skeleton-tag"></div>
                </div>
            </div>
        `;
    },

    skeletonResource() {
        return `
            <div class="skeleton resource-skeleton">
                <div class="skeleton-icon"></div>
                <div class="skeleton-line"></div>
                <div class="skeleton-line short"></div>
                <div class="skeleton-line medium"></div>
            </div>
        `;
    },

    skeletonList(count = 3, type = 'post') {
        const skeletonFn = type === 'agent' ? this.skeletonAgent : 
                          type === 'resource' ? this.skeletonResource : 
                          this.skeletonPost;
        return Array(count).fill(null).map(() => skeletonFn()).join('');
    },

    shareModal(postId) {
        const post = Store.state.posts.find(p => p.id === postId);
        const url = `${window.location.origin}${window.location.pathname}#post/${postId}`;
        
        return `
            <div class="share-modal-content">
                <h3>分享到</h3>
                <div class="share-platforms">
                    <button class="share-platform" data-platform="wechat" data-url="${url}" data-title="${post?.title || ''}">
                        <span class="share-icon">💬</span>
                        <span>微信</span>
                    </button>
                    <button class="share-platform" data-platform="weibo" data-url="${url}" data-title="${post?.title || ''}">
                        <span class="share-icon">📢</span>
                        <span>微博</span>
                    </button>
                    <button class="share-platform" data-platform="qq" data-url="${url}" data-title="${post?.title || ''}">
                        <span class="share-icon">🐧</span>
                        <span>QQ</span>
                    </button>
                    <button class="share-platform" data-platform="link" data-url="${url}">
                        <span class="share-icon">🔗</span>
                        <span>复制链接</span>
                    </button>
                </div>
                <div class="share-link-box">
                    <input type="text" class="share-link-input" value="${url}" readonly>
                    <button class="btn-primary btn-sm copy-link-btn">复制</button>
                </div>
            </div>
        `;
    },

    favoriteItem(item, type = 'post') {
        const isFav = Store.isFavorite(item.id, type);
        return `
            <div class="favorite-item" data-id="${item.id}" data-type="${type}">
                <div class="favorite-avatar">${item.avatar || item.icon || '📄'}</div>
                <div class="favorite-content">
                    <div class="favorite-title">${Utils.escapeHtml(item.title || item.name)}</div>
                    <div class="favorite-meta">
                        <span>${type === 'post' ? '帖子' : type === 'agent' ? '智能体' : '资源'}</span>
                        <span>·</span>
                        <span>${Utils.formatTime(item.createdAt || Date.now())}</span>
                    </div>
                </div>
                <button class="btn-icon unfavorite-btn" data-id="${item.id}" data-type="${type}">
                    ⭐
                </button>
            </div>
        `;
    },

    badge(text, type = 'default') {
        const classes = {
            default: 'badge-default',
            primary: 'badge-primary',
            success: 'badge-success',
            warning: 'badge-warning',
            danger: 'badge-danger'
        };
        return `<span class="badge ${classes[type] || classes.default}">${text}</span>`;
    },

    progressBar(progress, label = '') {
        return `
            <div class="progress-container">
                ${label ? `<div class="progress-label">${label}</div>` : ''}
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${Math.min(100, Math.max(0, progress))}%"></div>
                </div>
                <div class="progress-value">${Math.round(progress)}%</div>
            </div>
        `;
    },

    emptyState(message, icon = '📭') {
        return `
            <div class="empty-state">
                <div class="empty-icon">${icon}</div>
                <p>${message}</p>
            </div>
        `;
    },

    getCategoryName(category) {
        const names = {
            gaokao: '高考备考',
            experience: '学习经验',
            resources: '资源分享',
            questions: '问答求助',
            equity: '教育平权'
        };
        return names[category] || category;
    },

    getSubjectName(subject) {
        const names = {
            chinese: '语文', math: '数学', english: '英语',
            physics: '物理', chemistry: '化学', biology: '生物',
            politics: '政治', history: '历史', geography: '地理'
        };
        return names[subject] || subject;
    },

    getTypeName(type) {
        const names = {
            past: '真题', mock: '模拟', notes: '笔记',
            video: '视频', tips: '技巧'
        };
        return names[type] || type;
    }
};

const VirtualScroll = {
    container: null,
    items: [],
    itemHeight: 120,
    visibleCount: 10,
    startIndex: 0,
    endIndex: 0,
    scrollTop: 0,
    renderFn: null,
    observer: null,

    init(container, items, renderFn, itemHeight = 120) {
        this.container = typeof container === 'string' ? document.getElementById(container) : container;
        if (!this.container) return this;

        this.items = items;
        this.renderFn = renderFn;
        this.itemHeight = itemHeight;
        this.visibleCount = Math.ceil(window.innerHeight / itemHeight) + 2;
        
        this.setupContainer();
        this.bindEvents();
        this.render();
        
        return this;
    },

    setupContainer() {
        this.container.style.position = 'relative';
        this.container.style.minHeight = `${this.items.length * this.itemHeight}px`;
    },

    bindEvents() {
        const scrollHandler = Utils.throttle(() => this.onScroll(), 16);
        
        const parent = this.container.parentElement;
        if (parent) {
            parent.addEventListener('scroll', scrollHandler);
        }
        
        window.addEventListener('resize', Utils.debounce(() => {
            this.visibleCount = Math.ceil(window.innerHeight / this.itemHeight) + 2;
            this.render();
        }, 100));
    },

    onScroll() {
        const parent = this.container.parentElement;
        if (!parent) return;

        const newScrollTop = parent.scrollTop;
        if (Math.abs(newScrollTop - this.scrollTop) < this.itemHeight / 2) return;

        this.scrollTop = newScrollTop;
        this.render();
    },

    render() {
        this.startIndex = Math.max(0, Math.floor(this.scrollTop / this.itemHeight) - 1);
        this.endIndex = Math.min(this.items.length, this.startIndex + this.visibleCount);

        const visibleItems = this.items.slice(this.startIndex, this.endIndex);
        
        const fragment = document.createDocumentFragment();
        const wrapper = document.createElement('div');
        wrapper.style.position = 'absolute';
        wrapper.style.top = `${this.startIndex * this.itemHeight}px`;
        wrapper.style.width = '100%';
        
        visibleItems.forEach((item, i) => {
            const el = document.createElement('div');
            el.className = 'virtual-item';
            el.style.height = `${this.itemHeight}px`;
            el.innerHTML = this.renderFn(item, this.startIndex + i);
            wrapper.appendChild(el);
        });
        
        fragment.appendChild(wrapper);
        
        this.container.innerHTML = '';
        this.container.style.minHeight = `${this.items.length * this.itemHeight}px`;
        this.container.appendChild(fragment);
    },

    updateItems(newItems) {
        this.items = newItems;
        this.container.style.minHeight = `${this.items.length * this.itemHeight}px`;
        this.render();
    },

    scrollToIndex(index) {
        const parent = this.container.parentElement;
        if (parent) {
            parent.scrollTop = index * this.itemHeight;
        }
    },

    destroy() {
        this.container = null;
        this.items = [];
        this.renderFn = null;
    }
};

const SkeletonLoader = {
    containers: new Map(),

    show(containerId, type = 'post', count = 3) {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = Components.skeletonList(count, type);
        container.classList.add('skeleton-loading');
        this.containers.set(containerId, { type, count });
    },

    hide(containerId) {
        const container = document.getElementById(containerId);
        if (container) {
            container.classList.remove('skeleton-loading');
        }
        this.containers.delete(containerId);
    },

    async wrap(containerId, asyncFn, type = 'post', count = 3) {
        this.show(containerId, type, count);
        try {
            const result = await asyncFn();
            return result;
        } finally {
            this.hide(containerId);
        }
    }
};

const AIEngine = {
    knowledgeBase: {
        math: {
            keywords: ['数学', '函数', '方程', '几何', '概率', '数列', '导数', '积分', '向量', '三角', '圆锥曲线', '不等式', '排列组合'],
            responses: {
                concept: [
                    '这个概念的核心在于理解{topic}的本质。让我来详细解释...',
                    '{topic}是高中数学的重要内容，掌握它需要从以下几个方面入手：',
                    '关于{topic}，很多同学容易混淆的概念是...'
                ],
                problem: [
                    '这道题考查的是{topic}的应用。解题思路如下：\n\n第一步：分析题目条件，确定解题方向\n第二步：运用相关公式和定理\n第三步：逐步推导，得出结论',
                    '解决这类{topic}问题，关键在于：\n\n1. 理解题意，提取关键信息\n2. 选择合适的解题方法\n3. 规范书写解题过程',
                    '这道{topic}题的突破口在于...'
                ],
                method: [
                    '学习{topic}的有效方法是：\n\n1. 先掌握基本概念和公式\n2. 做典型例题，理解解题思路\n3. 总结规律，形成知识网络\n4. 定期复习，巩固提高',
                    '{topic}的学习建议：\n\n• 理解比记忆更重要\n• 多做归纳总结\n• 建立错题本，定期回顾'
                ]
            }
        },
        chinese: {
            keywords: ['语文', '作文', '阅读', '文言文', '古诗', '现代文', '论述类', '文学类', '实用类'],
            responses: {
                concept: [
                    '{topic}的理解需要从以下几个方面入手...',
                    '关于{topic}，关键在于把握文章的主旨和作者的情感...',
                    '{topic}的答题技巧主要包括...'
                ],
                problem: [
                    '这道{topic}题的解题思路：\n\n1. 通读全文，把握主旨\n2. 分析题目，确定答题方向\n3. 结合文本，组织答案',
                    '{topic}的答题要点：\n\n• 理解题目要求\n• 找准答题区间\n• 规范答题格式'
                ],
                method: [
                    '提高{topic}能力的方法：\n\n1. 多读多练，培养语感\n2. 掌握答题技巧\n3. 积累素材，丰富表达',
                    '{topic}的学习建议：\n\n• 每天坚持阅读\n• 做好读书笔记\n• 多写多练，提高表达能力'
                ]
            }
        },
        english: {
            keywords: ['英语', '单词', '语法', '阅读理解', '完形填空', '作文', '听力', '写作'],
            responses: {
                concept: [
                    '{topic}的学习要点：\n\n• 掌握基本规则\n• 多做练习巩固\n• 在语境中理解运用',
                    '关于{topic}，需要注意的是...',
                    '{topic}的核心在于...'
                ],
                problem: [
                    '这道{topic}题的解题技巧：\n\n1. 先看题目，带着问题阅读\n2. 找准关键信息\n3. 排除干扰项，确定答案',
                    '{topic}的答题策略：\n\n• 通读全文，了解大意\n• 分析选项，找出线索\n• 验证答案，确保正确'
                ],
                method: [
                    '提高{topic}的方法：\n\n1. 每天坚持练习\n2. 积累词汇和句型\n3. 模仿优秀范文\n4. 及时总结反思',
                    '{topic}学习建议：\n\n• 制定学习计划\n• 创造英语环境\n• 多听多说多读多写'
                ]
            }
        },
        physics: {
            keywords: ['物理', '力学', '电学', '光学', '热学', '原子物理', '实验', '牛顿', '能量', '动量'],
            responses: {
                concept: [
                    '{topic}是物理学的重要内容，理解它需要：\n\n1. 掌握基本概念\n2. 理解物理规律\n3. 学会建立物理模型',
                    '关于{topic}，核心在于理解其物理意义...',
                    '{topic}的学习要点...'
                ],
                problem: [
                    '这道{topic}题的解题步骤：\n\n1. 分析物理过程\n2. 画出示意图\n3. 选择物理规律\n4. 列方程求解\n5. 检验结果',
                    '解决{topic}问题的关键：\n\n• 正确分析物理过程\n• 合理选择物理规律\n• 规范书写解题过程'
                ],
                method: [
                    '学习{topic}的方法：\n\n1. 理解概念，建立物理图像\n2. 多做典型例题\n3. 总结解题方法\n4. 重视实验探究',
                    '{topic}学习建议：\n\n• 画图分析问题\n• 建立知识网络\n• 联系实际生活'
                ]
            }
        },
        chemistry: {
            keywords: ['化学', '有机', '无机', '反应', '方程式', '元素', '实验', '离子', '电化学', '平衡'],
            responses: {
                concept: [
                    '{topic}的核心概念：\n\n• 理解基本原理\n• 掌握反应规律\n• 联系实际应用',
                    '关于{topic}，需要掌握的知识点...',
                    '{topic}的学习重点...'
                ],
                problem: [
                    '这道{topic}题的解题思路：\n\n1. 分析反应原理\n2. 写出相关方程式\n3. 进行计算或判断',
                    '{topic}问题的解决方法：\n\n• 理解反应本质\n• 掌握解题技巧\n• 注意细节问题'
                ],
                method: [
                    '学习{topic}的建议：\n\n1. 理解化学原理\n2. 记忆重要方程式\n3. 多做实验观察\n4. 总结反应规律',
                    '{topic}学习技巧：\n\n• 建立知识网络\n• 对比记忆\n• 联系实际应用'
                ]
            }
        },
        biology: {
            keywords: ['生物', '细胞', '遗传', '进化', '生态', '代谢', '基因', 'DNA', 'RNA', '光合作用'],
            responses: {
                concept: [
                    '{topic}的核心内容：\n\n• 理解基本概念\n• 掌握生命活动规律\n• 联系实际应用',
                    '关于{topic}，需要理解的关键点...',
                    '{topic}的知识框架...'
                ],
                problem: [
                    '这道{topic}题的分析：\n\n1. 理解题意\n2. 调用相关知识\n3. 分析推理\n4. 得出结论',
                    '{topic}问题的解题技巧：\n\n• 抓住关键信息\n• 运用生物学原理\n• 规范答题语言'
                ],
                method: [
                    '学习{topic}的方法：\n\n1. 理解概念，建立知识网络\n2. 图表结合，加深理解\n3. 联系实际，学以致用',
                    '{topic}学习建议：\n\n• 注重概念理解\n• 多做图表分析\n• 关注生命现象'
                ]
            }
        },
        psychology: {
            keywords: ['压力', '焦虑', '紧张', '失眠', '情绪', '心态', '自信', '烦恼', '困扰', '迷茫'],
            responses: {
                support: [
                    '我理解你现在的感受，这很正常。很多同学在备考过程中都会遇到类似的情况。',
                    '你能说出这些，说明你已经在寻求改变了，这是很好的第一步。',
                    '你的感受是被理解的，让我们一起来看看如何应对。'
                ],
                advice: [
                    '针对你提到的情况，我有以下建议：\n\n1. 接纳自己的情绪，不要过度自责\n2. 尝试深呼吸或冥想，每天10分钟\n3. 保持规律作息，适度运动\n4. 和信任的人交流，不要独自承受',
                    '这里有一些实用的方法：\n\n• 制定合理的学习计划，避免过度压力\n• 学会劳逸结合，给自己放松的时间\n• 积极自我暗示，相信自己的能力\n• 必要时寻求专业帮助'
                ],
                encouragement: [
                    '记住，你比你想象的更强大。每一次困难都是成长的机会。',
                    '相信自己，你已经走了很远的路。继续前进，你会到达目的地。',
                    '困难是暂时的，只要不放弃，就一定会有收获。加油！'
                ]
            }
        },
        planning: {
            keywords: ['计划', '安排', '时间', '规划', '目标', '效率', '复习', '备考', '冲刺'],
            responses: {
                guide: [
                    '制定学习计划需要考虑以下因素：\n\n1. 当前水平和目标差距\n2. 可用时间和精力\n3. 各科目的重要性和难度\n4. 学习效率和最佳状态时间',
                    '高效的学习规划应该：\n\n• 目标明确，可量化\n• 计划具体，可执行\n• 时间合理，有弹性\n• 定期评估，及时调整'
                ],
                template: [
                    '建议的学习时间安排：\n\n早晨（6:30-8:00）：记忆类内容\n上午（8:30-11:30）：理科学习\n下午（14:00-17:00）：文科学习\n晚上（19:00-22:00）：复习巩固\n\n每45分钟休息10分钟，保证效率。',
                    '周计划模板：\n\n周一至周五：按课表学习+自习\n周六：重点突破弱项\n周日：复习总结+适当放松'
                ],
                tips: [
                    '提高学习效率的技巧：\n\n1. 创造良好的学习环境\n2. 使用番茄工作法\n3. 及时复习，避免遗忘\n4. 做好笔记，便于回顾\n5. 适当运动，保持精力',
                    '备考冲刺建议：\n\n• 回归课本，夯实基础\n• 研究真题，把握方向\n• 查漏补缺，重点突破\n• 调整心态，保持自信'
                ]
            }
        }
    },

    analyze(message) {
        const lowerMsg = message.toLowerCase();
        const result = {
            subject: null,
            type: 'general',
            keywords: [],
            sentiment: 'neutral'
        };

        for (const [subject, data] of Object.entries(this.knowledgeBase)) {
            const found = data.keywords.filter(kw => lowerMsg.includes(kw.toLowerCase()));
            if (found.length > 0) {
                result.subject = subject;
                result.keywords = found;
                break;
            }
        }

        if (/怎么|如何|方法|技巧|建议/.test(message)) {
            result.type = 'method';
        } else if (/题|解|答案|计算|求/.test(message)) {
            result.type = 'problem';
        } else if (/是什么|概念|含义|定义/.test(message)) {
            result.type = 'concept';
        } else if (/压力|焦虑|紧张|烦恼|困扰/.test(message)) {
            result.type = 'support';
            result.sentiment = 'negative';
        } else if (/计划|安排|规划|目标/.test(message)) {
            result.type = 'planning';
        }

        return result;
    },

    generate(agent, userMessage, context = []) {
        const analysis = this.analyze(userMessage);
        let response = '';

        const knowledge = this.knowledgeBase[analysis.subject] || this.knowledgeBase.psychology;
        const responses = knowledge.responses[analysis.type] || knowledge.responses.concept || knowledge.responses.support;

        if (responses && responses.length > 0) {
            let template = Utils.randomChoice(responses);
            const keyword = analysis.keywords[0] || agent.tags[0] || '这个问题';
            response = template.replace(/{topic}/g, keyword);
        }

        if (agent.type === 'tutor') {
            response = this.enhanceTutorResponse(response, userMessage, analysis);
        } else if (agent.type === 'motivator') {
            response = this.enhanceMotivatorResponse(response, userMessage);
        } else if (agent.type === 'planner') {
            response = this.enhancePlannerResponse(response, userMessage);
        } else if (agent.type === 'qa') {
            response = this.enhanceQAResponse(response, userMessage, analysis);
        }

        if (context.length > 0) {
            response = this.addContextualInfo(response, context);
        }

        return response;
    },

    enhanceTutorResponse(response, message, analysis) {
        const additions = [
            '\n\n💡 小贴士：学习这个知识点时，建议先理解概念，再做练习，最后总结规律。',
            '\n\n📚 相关知识点可以和之前学过的内容联系起来，形成知识网络。',
            '\n\n✏️ 建议把这个知识点的典型例题整理到错题本上，方便复习。'
        ];
        return response + Utils.randomChoice(additions);
    },

    enhanceMotivatorResponse(response, message) {
        const encouragements = [
            '\n\n💪 你能主动寻求帮助，这本身就是一种积极的态度。相信你一定能克服困难！',
            '\n\n🌟 每个人都有低谷期，重要的是不要放弃。你已经很棒了！',
            '\n\n🌈 阳光总在风雨后，坚持下去，你会看到不一样的风景。'
        ];
        return response + Utils.randomChoice(encouragements);
    },

    enhancePlannerResponse(response, message) {
        const tips = [
            '\n\n⏰ 记住：计划要具体可执行，每天完成后打个勾，会有成就感！',
            '\n\n📊 建议每周回顾一次计划执行情况，及时调整。',
            '\n\n🎯 目标要SMART：具体、可衡量、可实现、相关、有时限。'
        ];
        return response + Utils.randomChoice(tips);
    },

    enhanceQAResponse(response, message, analysis) {
        const additions = [
            '\n\n❓ 如果还有疑问，欢迎继续提问！',
            '\n\n🔍 这个问题还可以从其他角度思考，你想了解更多吗？',
            '\n\n📝 建议把这个问题记录下来，方便以后复习。'
        ];
        return response + Utils.randomChoice(additions);
    },

    addContextualInfo(response, context) {
        if (context.length >= 2) {
            const lastMsg = context[context.length - 2];
            if (lastMsg && lastMsg.role === 'user') {
                return response;
            }
        }
        return response;
    }
};

const PostManager = {
    currentCategory: 'all',
    currentFilter: 'latest',
    currentPostId: null,

    init() {
        this.bindEvents();
        this.render();
        this.updateCounts();
    },

    bindEvents() {
        document.querySelectorAll('.category-item').forEach(item => {
            item.addEventListener('click', () => {
                document.querySelectorAll('.category-item').forEach(i => i.classList.remove('active'));
                item.classList.add('active');
                this.currentCategory = item.dataset.category;
                this.render();
            });
        });

        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentFilter = btn.dataset.filter;
                this.render();
            });
        });

        document.getElementById('publishBtn')?.addEventListener('click', () => this.createPost());
        document.getElementById('submitComment')?.addEventListener('click', () => this.addComment());

        document.getElementById('postsList')?.addEventListener('click', (e) => {
            const action = e.target.closest('[data-action]');
            if (!action) {
                const card = e.target.closest('.post-card');
                if (card) this.showDetail(card.dataset.postId);
                return;
            }

            const { action: type, id } = action.dataset;
            switch (type) {
                case 'like': this.likePost(id); break;
                case 'comment': this.showDetail(id); break;
                case 'favorite': this.toggleFavorite(id); break;
                case 'share': this.sharePost(id); break;
            }
        });
    },

    render() {
        const container = document.getElementById('postsList');
        if (!container) return;

        let posts = [...Store.state.posts];

        if (this.currentCategory !== 'all') {
            posts = posts.filter(p => p.category === this.currentCategory);
        }

        if (this.currentFilter === 'hot') {
            posts.sort((a, b) => (b.likes + b.comments) - (a.likes + a.comments));
        } else {
            posts.sort((a, b) => b.createdAt - a.createdAt);
        }

        if (posts.length === 0) {
            container.innerHTML = Components.emptyState('暂无帖子，快来发布第一个吧！', '✍️');
            return;
        }

        container.innerHTML = posts.map(post => Components.postCard(post)).join('');
    },

    updateCounts() {
        const posts = Store.state.posts;
        document.getElementById('countAll').textContent = posts.length;
        document.getElementById('countGaokao').textContent = posts.filter(p => p.category === 'gaokao').length;
        document.getElementById('countExperience').textContent = posts.filter(p => p.category === 'experience').length;
        document.getElementById('countResources').textContent = posts.filter(p => p.category === 'resources').length;
        document.getElementById('countQuestions').textContent = posts.filter(p => p.category === 'questions').length;
        document.getElementById('countEquity').textContent = posts.filter(p => p.category === 'equity').length;
    },

    createPost() {
        const user = Store.state.user;
        if (!user) {
            Toast.warning('请先登录');
            Modal.open('loginModal');
            return;
        }

        const input = document.getElementById('postInput');
        const category = document.getElementById('postCategory').value;
        const content = input.value.trim();

        if (!content) {
            Toast.warning('请输入内容');
            return;
        }

        const post = {
            id: Utils.generateId(),
            author: {
                name: user.username,
                avatar: user.avatar,
                role: user.role,
                bio: user.bio || ''
            },
            title: content.split('\n')[0].substring(0, 50),
            content: content,
            category: category,
            tags: ['分享'],
            likes: 0,
            comments: 0,
            views: 0,
            favorites: 0,
            createdAt: Date.now()
        };

        Store.addPost(post);
        input.value = '';
        this.render();
        this.updateCounts();
        Toast.success('发布成功！');
    },

    showDetail(postId) {
        const post = Store.state.posts.find(p => p.id === postId);
        if (!post) return;

        this.currentPostId = postId;
        Store.updatePost(postId, { views: (post.views || 0) + 1 });

        const container = document.getElementById('postDetail');
        if (container) {
            container.innerHTML = `
                <div class="post-header">
                    <div class="post-avatar large">${post.author.avatar}</div>
                    <div class="post-author-info">
                        <div class="post-author">${post.author.name}</div>
                        <div class="post-meta">
                            <span>${post.author.role || ''}</span>
                            <span>·</span>
                            <span>${Utils.formatTime(post.createdAt)}</span>
                        </div>
                    </div>
                </div>
                <h2 class="post-detail-title">${Utils.escapeHtml(post.title)}</h2>
                <div class="post-detail-content">${Utils.escapeHtml(post.content).replace(/\n/g, '<br>')}</div>
                <div class="post-tags">${post.tags.map(tag => `<span class="tag">#${tag}</span>`).join('')}</div>
                <div class="post-detail-actions">
                    <button class="post-action" data-action="like" data-id="${post.id}">
                        <span>🤍</span> ${post.likes || 0}
                    </button>
                    <button class="post-action">
                        <span>💬</span> ${post.comments || 0}
                    </button>
                    <button class="post-action" data-action="favorite" data-id="${post.id}">
                        <span>☆</span> ${post.favorites || 0}
                    </button>
                </div>
            `;
        }

        this.renderComments(postId);
        Modal.open('postDetailModal');
    },

    renderComments(postId) {
        const comments = Store.getComments(postId);
        const container = document.getElementById('commentsList');
        const countEl = document.getElementById('commentCount');

        if (countEl) countEl.textContent = `(${comments.length})`;

        if (!container) return;

        if (comments.length === 0) {
            container.innerHTML = Components.emptyState('暂无评论', '💭');
            return;
        }

        container.innerHTML = comments.map(c => Components.commentItem(c)).join('');
    },

    addComment() {
        const user = Store.state.user;
        if (!user) {
            Toast.warning('请先登录');
            Modal.open('loginModal');
            return;
        }

        const input = document.getElementById('commentInput');
        const content = input.value.trim();

        if (!content) {
            Toast.warning('请输入评论内容');
            return;
        }

        const comment = {
            id: Utils.generateId(),
            author: { name: user.username, avatar: user.avatar },
            content: content,
            createdAt: Date.now()
        };

        Store.addComment(this.currentPostId, comment);

        const post = Store.state.posts.find(p => p.id === this.currentPostId);
        if (post) {
            Store.updatePost(this.currentPostId, { comments: (post.comments || 0) + 1 });
        }

        input.value = '';
        this.renderComments(this.currentPostId);
        this.render();
        Toast.success('评论成功');
    },

    likePost(postId) {
        const post = Store.state.posts.find(p => p.id === postId);
        if (post) {
            Store.updatePost(postId, { likes: (post.likes || 0) + 1 });
            this.render();
            Toast.success('点赞成功');
        }
    },

    toggleFavorite(postId) {
        const isFav = Store.toggleFavorite(postId, 'post');
        Toast.success(isFav ? '已收藏' : '已取消收藏');
        this.render();
    },

    sharePost(postId) {
        const url = `${window.location.origin}#post/${postId}`;
        Utils.copyToClipboard(url);
        Toast.success('链接已复制');
    }
};

const AgentManager = {
    currentAgent: null,
    messages: [],
    selectedAvatar: '🤖',
    agentTags: [],
    currentType: 'all',
    isTyping: false,

    init() {
        this.bindEvents();
        this.render();
        this.renderFeatured();
    },

    bindEvents() {
        document.getElementById('createAgentBtn')?.addEventListener('click', () => {
            if (!Store.state.user) {
                Toast.warning('请先登录');
                Modal.open('loginModal');
                return;
            }
            Modal.open('agentModal');
        });

        document.querySelectorAll('.avatar-option').forEach(opt => {
            opt.addEventListener('click', () => {
                document.querySelectorAll('.avatar-option').forEach(o => o.classList.remove('selected'));
                opt.classList.add('selected');
                this.selectedAvatar = opt.dataset.avatar;
            });
        });

        const tagInput = document.getElementById('agentTagInput');
        tagInput?.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                const tag = tagInput.value.trim();
                if (tag && !this.agentTags.includes(tag) && this.agentTags.length < 5) {
                    this.agentTags.push(tag);
                    this.renderAgentTags();
                    tagInput.value = '';
                }
            }
        });

        document.getElementById('agentForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.createAgent();
        });

        document.querySelectorAll('.agent-cat-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.agent-cat-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentType = btn.dataset.type;
                this.render();
            });
        });

        document.getElementById('agentsGrid')?.addEventListener('click', (e) => {
            const card = e.target.closest('[data-agent-id]');
            if (card && !e.target.closest('.agent-chat-btn')) return;
            
            const chatBtn = e.target.closest('.agent-chat-btn');
            if (chatBtn) {
                this.openChat(chatBtn.dataset.agentId);
            }
        });

        document.getElementById('featuredAgents')?.addEventListener('click', (e) => {
            const card = e.target.closest('[data-agent-id]');
            if (card) this.openChat(card.dataset.agentId);
        });

        document.getElementById('sendChatBtn')?.addEventListener('click', () => this.sendMessage());
        document.getElementById('chatInput')?.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        const searchInput = document.getElementById('agentSearch');
        searchInput?.addEventListener('input', Utils.debounce(() => {
            this.render(searchInput.value);
        }, 300));
    },

    render(search = '') {
        const container = document.getElementById('agentsGrid');
        if (!container) return;

        let agents = [...Store.state.agents];

        if (this.currentType !== 'all') {
            agents = agents.filter(a => a.type === this.currentType);
        }

        if (search) {
            const s = search.toLowerCase();
            agents = agents.filter(a => 
                a.name.toLowerCase().includes(s) || 
                a.description.toLowerCase().includes(s) ||
                a.tags.some(t => t.toLowerCase().includes(s))
            );
        }

        if (agents.length === 0) {
            container.innerHTML = Components.emptyState('暂无智能体', '🤖');
            return;
        }

        container.innerHTML = agents.map(agent => Components.agentCard(agent)).join('');
    },

    renderFeatured() {
        const container = document.getElementById('featuredAgents');
        if (!container) return;

        const featured = Store.state.agents.filter(a => a.featured).slice(0, 4);
        container.innerHTML = featured.map(agent => Components.agentFeaturedCard(agent)).join('');
    },

    renderAgentTags() {
        const container = document.getElementById('agentTags');
        if (!container) return;

        container.innerHTML = this.agentTags.map((tag, i) => `
            <span class="tag-item">
                ${tag}
                <span class="tag-remove" data-index="${i}">×</span>
            </span>
        `).join('');

        container.querySelectorAll('.tag-remove').forEach(btn => {
            btn.addEventListener('click', () => {
                this.agentTags.splice(parseInt(btn.dataset.index), 1);
                this.renderAgentTags();
            });
        });
    },

    createAgent() {
        const user = Store.state.user;
        if (!user) {
            Toast.warning('请先登录');
            return;
        }

        const name = document.getElementById('agentName').value.trim();
        const type = document.getElementById('agentType').value;
        const desc = document.getElementById('agentDesc').value.trim();
        const prompt = document.getElementById('agentPrompt').value.trim();
        const greeting = document.getElementById('agentGreeting').value.trim();

        if (!name) {
            Toast.warning('请输入智能体名称');
            return;
        }

        const agent = {
            id: Utils.generateId(),
            name,
            avatar: this.selectedAvatar,
            type,
            description: desc || '这是一个智能助手',
            tags: this.agentTags.length > 0 ? this.agentTags : ['智能体'],
            prompt: prompt || '你是一个有帮助的AI助手。',
            greeting: greeting || '你好！有什么我可以帮助你的吗？',
            chats: 0,
            likes: 0,
            rating: 5.0,
            author: user.username,
            featured: false,
            createdAt: Date.now()
        };

        Store.addAgent(agent);
        
        document.getElementById('agentForm').reset();
        this.agentTags = [];
        this.renderAgentTags();
        this.selectedAvatar = '🤖';
        document.querySelectorAll('.avatar-option').forEach(o => o.classList.remove('selected'));
        document.querySelector('.avatar-option')?.classList.add('selected');

        Modal.close('agentModal');
        this.render();
        Toast.success('智能体创建成功！');
    },

    openChat(agentId) {
        const agent = Store.state.agents.find(a => a.id === agentId);
        if (!agent) return;

        this.currentAgent = agent;
        this.messages = Store.getChatHistory(agentId) || [];

        document.getElementById('chatAvatar').textContent = agent.avatar;
        document.getElementById('chatAgentName').textContent = agent.name;

        const container = document.getElementById('chatMessages');
        container.innerHTML = '';

        if (this.messages.length === 0) {
            this.addMessage(agent.greeting, 'agent');
        } else {
            this.messages.forEach(msg => {
                const avatar = msg.role === 'user' 
                    ? (Store.state.user?.avatar || '👤')
                    : agent.avatar;
                container.insertAdjacentHTML('beforeend', Components.messageBubble(msg.content, msg.role, avatar, msg.timestamp));
            });
        }

        Store.updateAgent(agentId, { chats: (agent.chats || 0) + 1 });
        Modal.open('chatModal');
        
        setTimeout(() => {
            container.scrollTop = container.scrollHeight;
        }, 100);
    },

    sendMessage() {
        const input = document.getElementById('chatInput');
        const content = input.value.trim();

        if (!content || !this.currentAgent || this.isTyping) return;

        this.addMessage(content, 'user');
        input.value = '';

        this.showTyping();

        const delay = 500 + Math.random() * 1000 + content.length * 20;
        
        setTimeout(() => {
            this.hideTyping();
            const response = AIEngine.generate(this.currentAgent, content, this.messages);
            this.addMessage(response, 'agent');
        }, delay);
    },

    addMessage(content, type) {
        const container = document.getElementById('chatMessages');
        const avatar = type === 'user' 
            ? (Store.state.user?.avatar || '👤')
            : this.currentAgent.avatar;

        const message = {
            role: type,
            content: content,
            timestamp: Date.now()
        };

        this.messages.push(message);
        Store.saveChatHistory(this.currentAgent.id, this.messages);

        container.insertAdjacentHTML('beforeend', Components.messageBubble(content, type, avatar, message.timestamp));
        container.scrollTop = container.scrollHeight;
    },

    showTyping() {
        this.isTyping = true;
        const container = document.getElementById('chatMessages');
        container.insertAdjacentHTML('beforeend', Components.typingIndicator(this.currentAgent.avatar));
        container.scrollTop = container.scrollHeight;
    },

    hideTyping() {
        this.isTyping = false;
        const typing = document.querySelector('.typing');
        if (typing) typing.remove();
    },

    generateResponse(userMessage) {
        return AIEngine.generate(this.currentAgent, userMessage, this.messages);
    }
};

const ResourceManager = {
    init() {
        this.bindEvents();
        this.render();
    },

    bindEvents() {
        ['subjectFilter', 'typeFilter', 'provinceFilter'].forEach(id => {
            document.getElementById(id)?.addEventListener('change', () => this.render());
        });

        document.getElementById('resourcesGrid')?.addEventListener('click', (e) => {
            const action = e.target.closest('[data-action]');
            if (!action) return;

            const { action: type, id } = action.dataset;
            if (type === 'download') {
                Toast.success('资源获取中...');
            } else if (type === 'share') {
                Utils.copyToClipboard(window.location.href);
                Toast.success('链接已复制');
            }
        });
    },

    render() {
        const container = document.getElementById('resourcesGrid');
        if (!container) return;

        const subject = document.getElementById('subjectFilter')?.value || 'all';
        const type = document.getElementById('typeFilter')?.value || 'all';
        const province = document.getElementById('provinceFilter')?.value || 'all';

        let resources = [...Store.state.resources];

        if (subject !== 'all') resources = resources.filter(r => r.subject === subject);
        if (type !== 'all') resources = resources.filter(r => r.type === type);
        if (province !== 'all') resources = resources.filter(r => r.province === province || r.province === 'all');

        container.innerHTML = resources.map(r => Components.resourceCard(r)).join('');
    }
};

const HomeManager = {
    currentTab: 'posts',

    init() {
        this.bindEvents();
        this.renderRecent();
        this.animateStats();
    },

    bindEvents() {
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentTab = btn.dataset.tab;
                this.renderRecent();
            });
        });
    },

    renderRecent() {
        const container = document.getElementById('recentContent');
        if (!container) return;

        let items = [];

        if (this.currentTab === 'posts') {
            items = Store.state.posts.slice(0, 5);
            container.innerHTML = items.map(post => `
                <div class="recent-item" data-post-id="${post.id}">
                    <div class="recent-avatar">${post.author.avatar}</div>
                    <div class="recent-content">
                        <div class="recent-title">${Utils.escapeHtml(post.title)}</div>
                        <div class="recent-meta">
                            <span>${post.author.name}</span>
                            <span>·</span>
                            <span>👍 ${post.likes}</span>
                            <span>💬 ${post.comments}</span>
                        </div>
                    </div>
                </div>
            `).join('');
        } else if (this.currentTab === 'agents') {
            items = Store.state.agents.slice(0, 5);
            container.innerHTML = items.map(agent => `
                <div class="recent-item" data-agent-id="${agent.id}">
                    <div class="recent-avatar">${agent.avatar}</div>
                    <div class="recent-content">
                        <div class="recent-title">${Utils.escapeHtml(agent.name)}</div>
                        <div class="recent-meta">
                            <span>${agent.type}</span>
                            <span>·</span>
                            <span>💬 ${agent.chats}</span>
                        </div>
                    </div>
                </div>
            `).join('');
        } else if (this.currentTab === 'resources') {
            items = Store.state.resources.slice(0, 5);
            container.innerHTML = items.map(resource => `
                <div class="recent-item">
                    <div class="recent-avatar">${resource.icon}</div>
                    <div class="recent-content">
                        <div class="recent-title">${Utils.escapeHtml(resource.title)}</div>
                        <div class="recent-meta">
                            <span>${Components.getSubjectName(resource.subject)}</span>
                            <span>·</span>
                            <span>📥 ${resource.downloads}</span>
                        </div>
                    </div>
                </div>
            `).join('');
        }
    },

    animateStats() {
        document.querySelectorAll('.stat-number[data-target]').forEach(el => {
            Utils.animateNumber(el, parseInt(el.dataset.target), 1500);
        });
    }
};

const SearchManager = {
    currentType: 'all',
    hotSearches: ['高考数学', '英语作文', '物理公式', '化学方程式', '历史时间线', '地理知识点', '政治热点', '生物实验'],
    suggestions: [],
    pinyinMap: {
        '高考': ['gaokao', 'gk'],
        '数学': ['shuxue', 'sx'],
        '英语': ['yingyu', 'yy'],
        '语文': ['yuwen', 'yw'],
        '物理': ['wuli', 'wl'],
        '化学': ['huaxue', 'hx'],
        '生物': ['shengwu', 'sw'],
        '历史': ['lishi', 'ls'],
        '地理': ['dili', 'dl'],
        '政治': ['zhengzhi', 'zz'],
        '作文': ['zuowen', 'zw'],
        '真题': ['zhenti', 'zt'],
        '模拟': ['moni', 'mn']
    },

    init() {
        this.bindEvents();
        this.loadSuggestions();
    },

    bindEvents() {
        document.getElementById('searchBtn')?.addEventListener('click', () => this.open());
        document.getElementById('searchInput')?.addEventListener('focus', () => this.open());
        document.getElementById('searchClose')?.addEventListener('click', () => this.close());

        document.querySelectorAll('.search-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                document.querySelectorAll('.search-tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                this.currentType = tab.dataset.search;
                this.search(document.getElementById('searchInputLarge')?.value);
            });
        });

        const searchInput = document.getElementById('searchInputLarge');
        searchInput?.addEventListener('input', Utils.debounce(() => {
            this.search(searchInput.value);
        }, 300));

        document.addEventListener('keydown', (e) => {
            if (e.key === '/' && !e.target.matches('input, textarea')) {
                e.preventDefault();
                this.open();
            }
            if (e.key === 'Escape') {
                this.close();
            }
        });
    },

    loadSuggestions() {
        const saved = localStorage.getItem('eduequity_search_suggestions');
        if (saved) {
            this.suggestions = JSON.parse(saved);
        }
    },

    saveSuggestions() {
        localStorage.setItem('eduequity_search_suggestions', JSON.stringify(this.suggestions));
    },

    open() {
        document.getElementById('searchOverlay')?.classList.add('active');
        document.getElementById('searchInputLarge')?.focus();
        this.renderHistory();
    },

    close() {
        document.getElementById('searchOverlay')?.classList.remove('active');
    },

    renderHistory() {
        const container = document.getElementById('searchResults');
        if (!container) return;

        const history = Store.state.searchHistory;
        const hotHtml = this.hotSearches.slice(0, 6).map(q => `
            <div class="hot-search-item" data-query="${Utils.escapeHtml(q)}">
                <span class="hot-search-rank">${this.hotSearches.indexOf(q) + 1}</span>
                <span class="hot-search-text">${Utils.escapeHtml(q)}</span>
                ${this.hotSearches.indexOf(q) < 3 ? '<span class="hot-search-badge">热</span>' : ''}
            </div>
        `).join('');

        const historyHtml = history.length > 0 ? `
            <div class="search-history">
                <div class="search-history-header">
                    <span>搜索历史</span>
                    <button class="clear-history" onclick="Store.clearSearchHistory(); SearchManager.renderHistory();">清除</button>
                </div>
                <div class="search-history-tags">
                    ${history.slice(0, 8).map(q => `
                        <span class="history-tag" data-query="${Utils.escapeHtml(q)}">${Utils.escapeHtml(q)}</span>
                    `).join('')}
                </div>
            </div>
        ` : '';

        container.innerHTML = `
            <div class="search-panel">
                ${historyHtml}
                <div class="hot-searches">
                    <div class="hot-searches-header">
                        <span>🔥 热门搜索</span>
                    </div>
                    <div class="hot-searches-list">${hotHtml}</div>
                </div>
            </div>
        `;

        container.querySelectorAll('.hot-search-item, .history-tag').forEach(item => {
            item.addEventListener('click', () => {
                const query = item.dataset.query;
                document.getElementById('searchInputLarge').value = query;
                this.search(query);
            });
        });
    },

    search(query) {
        const container = document.getElementById('searchResults');
        if (!container) return;

        if (!query.trim()) {
            this.renderHistory();
            return;
        }

        Store.addSearchHistory(query);
        EventBus.emit('search:performed', query);

        const q = query.toLowerCase();
        const pinyinMatches = this.getPinyinMatches(q);
        let results = [];

        if (this.currentType === 'all' || this.currentType === 'posts') {
            const posts = Store.state.posts.filter(p => 
                this.fuzzyMatch(p.title, q) || 
                this.fuzzyMatch(p.content, q) ||
                this.pinyinMatch(p.title, pinyinMatches) ||
                this.pinyinMatch(p.content, pinyinMatches)
            ).slice(0, 5);
            results.push(...posts.map(p => ({ type: 'post', item: p })));
        }

        if (this.currentType === 'all' || this.currentType === 'agents') {
            const agents = Store.state.agents.filter(a => 
                this.fuzzyMatch(a.name, q) || 
                this.fuzzyMatch(a.description, q) ||
                this.pinyinMatch(a.name, pinyinMatches) ||
                this.pinyinMatch(a.description, pinyinMatches)
            ).slice(0, 5);
            results.push(...agents.map(a => ({ type: 'agent', item: a })));
        }

        if (this.currentType === 'all' || this.currentType === 'resources') {
            const resources = Store.state.resources.filter(r => 
                this.fuzzyMatch(r.title, q) || 
                this.fuzzyMatch(r.description, q) ||
                this.pinyinMatch(r.title, pinyinMatches) ||
                this.pinyinMatch(r.description, pinyinMatches)
            ).slice(0, 5);
            results.push(...resources.map(r => ({ type: 'resource', item: r })));
        }

        if (results.length === 0) {
            container.innerHTML = `
                <div class="search-empty">
                    <div class="search-empty-icon">🔍</div>
                    <div class="search-empty-text">未找到"${Utils.escapeHtml(query)}"相关内容</div>
                    <div class="search-empty-tips">
                        <p>试试以下建议：</p>
                        <div class="search-suggestions">
                            ${this.getSuggestions(query).map(s => `
                                <span class="suggestion-tag" data-query="${Utils.escapeHtml(s)}">${Utils.escapeHtml(s)}</span>
                            `).join('')}
                        </div>
                    </div>
                </div>
            `;
            container.querySelectorAll('.suggestion-tag').forEach(tag => {
                tag.addEventListener('click', () => {
                    const q = tag.dataset.query;
                    document.getElementById('searchInputLarge').value = q;
                    this.search(q);
                });
            });
            return;
        }

        const grouped = this.groupResults(results);
        
        container.innerHTML = Object.entries(grouped).map(([type, items]) => `
            <div class="search-result-group">
                <div class="search-result-group-header">
                    <span>${this.getTypeLabel(type)}</span>
                    <span class="result-count">${items.length}条结果</span>
                </div>
                <div class="search-result-list">
                    ${items.map(({ item }) => this.renderResultItem(type, item, query)).join('')}
                </div>
            </div>
        `).join('');

        container.querySelectorAll('.search-result-item').forEach(item => {
            item.addEventListener('click', () => {
                const type = item.dataset.type;
                const id = item.dataset.id;
                this.close();
                
                if (type === 'post') {
                    Router.navigate('community');
                    setTimeout(() => PostManager.showDetail(id), 100);
                } else if (type === 'agent') {
                    Router.navigate('agents');
                    setTimeout(() => AgentManager.openChat(id), 100);
                } else {
                    Router.navigate('gaokao');
                }
            });
        });
    },

    groupResults(results) {
        return results.reduce((acc, { type, item }) => {
            if (!acc[type]) acc[type] = [];
            acc[type].push({ item });
            return acc;
        }, {});
    },

    getTypeLabel(type) {
        const labels = { post: '📝 帖子', agent: '🤖 智能体', resource: '📚 资源' };
        return labels[type] || type;
    },

    renderResultItem(type, item, query) {
        if (type === 'post') {
            return `
                <div class="search-result-item" data-type="post" data-id="${item.id}">
                    <div class="result-icon">📝</div>
                    <div class="result-content">
                        <div class="result-title">${Utils.highlightText(item.title, query)}</div>
                        <div class="result-meta">${item.author?.name || '匿名'} · ${Utils.formatTime(item.createdAt)}</div>
                    </div>
                </div>
            `;
        } else if (type === 'agent') {
            return `
                <div class="search-result-item" data-type="agent" data-id="${item.id}">
                    <div class="result-icon">${item.avatar}</div>
                    <div class="result-content">
                        <div class="result-title">${Utils.highlightText(item.name, query)}</div>
                        <div class="result-meta">${item.chats || 0}次对话 · ${item.type || '学习助手'}</div>
                    </div>
                </div>
            `;
        } else {
            return `
                <div class="search-result-item" data-type="resource" data-id="${item.id}">
                    <div class="result-icon">${item.icon || '📄'}</div>
                    <div class="result-content">
                        <div class="result-title">${Utils.highlightText(item.title, query)}</div>
                        <div class="result-meta">${item.subject || '综合'} · ${item.downloads || 0}次下载</div>
                    </div>
                </div>
            `;
        }
    },

    getSuggestions(query) {
        const allTerms = [...this.hotSearches, ...Store.state.searchHistory];
        const q = query.toLowerCase();
        return allTerms.filter(t => t.toLowerCase().includes(q) && t !== query).slice(0, 5);
    },

    fuzzyMatch(text, query) {
        if (!text || !query) return false;
        const t = text.toLowerCase();
        const q = query.toLowerCase();
        
        if (t.includes(q)) return true;
        
        if (q.length <= 2) return false;
        
        const tChars = t.split('');
        const qChars = q.split('');
        let matchCount = 0;
        
        for (const qc of qChars) {
            if (tChars.includes(qc)) {
                matchCount++;
            }
        }
        
        return matchCount >= qChars.length * 0.6;
    },

    getPinyinMatches(query) {
        const matches = [];
        for (const [chinese, pinyins] of Object.entries(this.pinyinMap)) {
            for (const py of pinyins) {
                if (query.includes(py) || query.includes(chinese)) {
                    matches.push(chinese);
                }
            }
        }
        return [...new Set(matches)];
    },

    pinyinMatch(text, pinyinMatches) {
        if (!text || !pinyinMatches || pinyinMatches.length === 0) return false;
        return pinyinMatches.some(match => text.includes(match));
    }
};

const NotificationManager = {
    init() {
        this.bindEvents();
        this.updateBadge();
        this.render();

        EventBus.on(Store.EVENTS.NOTIFICATION_NEW, () => {
            this.updateBadge();
            this.render();
        });
    },

    bindEvents() {
        document.getElementById('notificationBtn')?.addEventListener('click', () => {
            Modal.open('notificationModal');
        });

        document.getElementById('markAllRead')?.addEventListener('click', () => {
            Store.markAllNotificationsRead();
            this.updateBadge();
            this.render();
            Toast.success('已全部标记为已读');
        });
    },

    updateBadge() {
        const badge = document.getElementById('notificationBadge');
        const count = Store.getUnreadCount();
        if (badge) {
            badge.textContent = count;
            badge.style.display = count > 0 ? 'block' : 'none';
        }
    },

    render() {
        const container = document.getElementById('notificationList');
        if (!container) return;

        const notifications = Store.state.notifications;

        if (notifications.length === 0) {
            container.innerHTML = Components.emptyState('暂无通知', '🔔');
            return;
        }

        container.innerHTML = notifications.map(n => `
            <div class="notification-item ${n.read ? 'read' : ''}" data-id="${n.id}">
                <div class="notification-icon">${n.icon || '📢'}</div>
                <div class="notification-content">
                    <div class="notification-title">${Utils.escapeHtml(n.title)}</div>
                    <div class="notification-text">${Utils.escapeHtml(n.message)}</div>
                    <div class="notification-time">${Utils.formatTime(n.createdAt)}</div>
                </div>
            </div>
        `).join('');

        container.querySelectorAll('.notification-item').forEach(item => {
            item.addEventListener('click', () => {
                Store.markNotificationRead(item.dataset.id);
                this.updateBadge();
                this.render();
            });
        });
    }
};

window.Components = Components;
window.AIEngine = AIEngine;
window.VirtualScroll = VirtualScroll;
window.SkeletonLoader = SkeletonLoader;
window.PostManager = PostManager;
window.AgentManager = AgentManager;
window.ResourceManager = ResourceManager;
window.HomeManager = HomeManager;
window.SearchManager = SearchManager;
window.NotificationManager = NotificationManager;

const MarkdownRenderer = {
    rules: [
        { pattern: /^### (.*$)/gm, replace: '<h3>$1</h3>' },
        { pattern: /^## (.*$)/gm, replace: '<h2>$1</h2>' },
        { pattern: /^# (.*$)/gm, replace: '<h1>$1</h1>' },
        { pattern: /\*\*\*(.*?)\*\*\*/g, replace: '<strong><em>$1</em></strong>' },
        { pattern: /\*\*(.*?)\*\*/g, replace: '<strong>$1</strong>' },
        { pattern: /\*(.*?)\*/g, replace: '<em>$1</em>' },
        { pattern: /~~(.*?)~~/g, replace: '<del>$1</del>' },
        { pattern: /`([^`]+)`/g, replace: '<code class="inline-code">$1</code>' },
        { pattern: /^> (.*$)/gm, replace: '<blockquote>$1</blockquote>' },
        { pattern: /^- (.*$)/gm, replace: '<li>$1</li>' },
        { pattern: /^\d+\. (.*$)/gm, replace: '<li>$1</li>' },
        { pattern: /\[([^\]]+)\]\(([^)]+)\)/g, replace: '<a href="$2" target="_blank" rel="noopener">$1</a>' },
        { pattern: /!\[([^\]]*)\]\(([^)]+)\)/g, replace: '<img src="$2" alt="$1" loading="lazy">' }
    ],

    render(text) {
        if (!text) return '';
        
        let html = Utils.escapeHtml(text);
        
        this.rules.forEach(rule => {
            html = html.replace(rule.pattern, rule.replace);
        });
        
        html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');
        html = html.replace(/\n\n/g, '</p><p>');
        html = html.replace(/\n/g, '<br>');
        
        html = `<p>${html}</p>`;
        html = html.replace(/<p><\/p>/g, '');
        html = html.replace(/<p>(<h[1-6]>)/g, '$1');
        html = html.replace(/(<\/h[1-6]>)<\/p>/g, '$1');
        html = html.replace(/<p>(<ul>)/g, '$1');
        html = html.replace(/(<\/ul>)<\/p>/g, '$1');
        html = html.replace(/<p>(<blockquote>)/g, '$1');
        html = html.replace(/(<\/blockquote>)<\/p>/g, '$1');
        
        return html;
    },

    renderCodeBlock(text) {
        return text.replace(/```(\w*)\n([\s\S]*?)```/g, (match, lang, code) => {
            const language = lang || 'plaintext';
            const highlighted = this.highlightCode(code.trim(), language);
            return `<div class="code-block"><div class="code-header"><span class="code-lang">${language}</span><button class="copy-code-btn" onclick="MarkdownRenderer.copyCode(this)">复制</button></div><pre class="code-content"><code class="language-${language}">${highlighted}</code></pre></div>`;
        });
    },

    highlightCode(code, language) {
        const escaped = Utils.escapeHtml(code);
        
        if (['javascript', 'js', 'typescript', 'ts'].includes(language)) {
            return escaped
                .replace(/\b(const|let|var|function|return|if|else|for|while|class|import|export|from|async|await|new|this)\b/g, '<span class="keyword">$1</span>')
                .replace(/\b(true|false|null|undefined)\b/g, '<span class="literal">$1</span>')
                .replace(/(['"`])(.*?)\1/g, '<span class="string">$1$2$1</span>')
                .replace(/\b(\d+)\b/g, '<span class="number">$1</span>')
                .replace(/(\/\/.*$)/gm, '<span class="comment">$1</span>');
        }
        
        if (['python', 'py'].includes(language)) {
            return escaped
                .replace(/\b(def|class|if|else|elif|for|while|return|import|from|as|with|try|except|finally|raise|pass|break|continue)\b/g, '<span class="keyword">$1</span>')
                .replace(/\b(True|False|None)\b/g, '<span class="literal">$1</span>')
                .replace(/(['"]{3}[\s\S]*?['"]{3}|['"].*?['"])/g, '<span class="string">$1</span>')
                .replace(/\b(\d+)\b/g, '<span class="number">$1</span>')
                .replace(/(#.*$)/gm, '<span class="comment">$1</span>');
        }
        
        return escaped;
    },

    copyCode(button) {
        const codeBlock = button.closest('.code-block');
        const code = codeBlock.querySelector('code').textContent;
        
        Utils.copyToClipboard(code).then(() => {
            const originalText = button.textContent;
            button.textContent = '已复制!';
            setTimeout(() => {
                button.textContent = originalText;
            }, 2000);
        });
    },

    renderFull(text) {
        let result = this.renderCodeBlock(text);
        result = this.render(result);
        return result;
    }
};

const StreamResponse = {
    isStreaming: false,
    currentElement: null,
    fullText: '',
    speed: 30,

    async start(element, text, options = {}) {
        if (this.isStreaming) return;
        
        this.isStreaming = true;
        this.currentElement = element;
        this.fullText = '';
        this.speed = options.speed || 30;
        
        element.innerHTML = '';
        element.classList.add('streaming');
        
        const chars = text.split('');
        
        for (let i = 0; i < chars.length; i++) {
            if (!this.isStreaming) break;
            
            this.fullText += chars[i];
            
            if (options.markdown) {
                element.innerHTML = MarkdownRenderer.renderFull(this.fullText);
            } else {
                element.innerHTML = this.fullText.replace(/\n/g, '<br>');
            }
            
            element.scrollTop = element.scrollHeight;
            
            await this.delay(this.getDelay(chars[i]));
        }
        
        this.isStreaming = false;
        element.classList.remove('streaming');
        
        if (options.onComplete) {
            options.onComplete(this.fullText);
        }
    },

    getDelay(char) {
        if (char === '\n') return this.speed * 3;
        if (char === '。' || char === '！' || char === '？') return this.speed * 4;
        if (char === '，' || char === '、') return this.speed * 2;
        return this.speed;
    },

    stop() {
        this.isStreaming = false;
        if (this.currentElement) {
            this.currentElement.classList.remove('streaming');
        }
    },

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },

    async typeWriter(element, text, speed = 50) {
        return this.start(element, text, { speed, markdown: true });
    }
};

const ChatEnhancer = {
    typingIndicator: null,

    showTyping(container) {
        if (this.typingIndicator) return;
        
        this.typingIndicator = document.createElement('div');
        this.typingIndicator.className = 'chat-message assistant typing';
        this.typingIndicator.innerHTML = `
            <div class="message-avatar">🤖</div>
            <div class="message-content">
                <div class="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        `;
        
        container.appendChild(this.typingIndicator);
        container.scrollTop = container.scrollHeight;
    },

    hideTyping() {
        if (this.typingIndicator) {
            this.typingIndicator.remove();
            this.typingIndicator = null;
        }
    },

    async addMessage(container, message, isUser = false, options = {}) {
        this.hideTyping();
        
        const msgEl = document.createElement('div');
        msgEl.className = `chat-message ${isUser ? 'user' : 'assistant'}`;
        
        const avatar = isUser ? (Store.state.user?.avatar || '👤') : (options.avatar || '🤖');
        
        msgEl.innerHTML = `
            <div class="message-avatar">${avatar}</div>
            <div class="message-content">
                ${isUser ? Utils.escapeHtml(message) : ''}
            </div>
            <div class="message-time">${Utils.formatTime(Date.now())}</div>
        `;
        
        container.appendChild(msgEl);
        
        if (!isUser && options.stream !== false) {
            const contentEl = msgEl.querySelector('.message-content');
            await StreamResponse.start(contentEl, message, { 
                markdown: true,
                speed: options.speed || 20
            });
        } else if (!isUser) {
            msgEl.querySelector('.message-content').innerHTML = MarkdownRenderer.renderFull(message);
        }
        
        container.scrollTop = container.scrollHeight;
        
        return msgEl;
    },

    async saveChatHistory(agentId, messages) {
        const history = {
            id: Utils.generateId(),
            agentId,
            messages,
            timestamp: Date.now()
        };
        
        if (window.IDB) {
            await IDB.put('chatHistory', history);
        }
        
        return history;
    },

    async loadChatHistory(agentId) {
        if (window.IDB) {
            return IDB.getByIndex('chatHistory', 'agentId', agentId);
        }
        return [];
    }
};

window.MarkdownRenderer = MarkdownRenderer;
window.StreamResponse = StreamResponse;
window.ChatEnhancer = ChatEnhancer;
