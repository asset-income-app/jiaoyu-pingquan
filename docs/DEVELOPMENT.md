# 开发文档

## 目录

1. [架构设计](#架构设计)
2. [核心模块](#核心模块)
3. [组件系统](#组件系统)
4. [状态管理](#状态管理)
5. [路由系统](#路由系统)
6. [存储系统](#存储系统)
7. [样式系统](#样式系统)
8. [性能优化](#性能优化)
9. [扩展开发](#扩展开发)

---

## 架构设计

### 整体架构

```
┌─────────────────────────────────────────────────────────┐
│                      index.html                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │                   App Layer                      │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐        │   │
│  │  │   App    │ │   PWA    │ │Performance│        │   │
│  │  └──────────┘ └──────────┘ └──────────┘        │   │
│  └─────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────┐   │
│  │               Component Layer                    │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐        │   │
│  │  │PostMgr   │ │AgentMgr  │ │ResourceMgr│        │   │
│  │  └──────────┘ └──────────┘ └──────────┘        │   │
│  └─────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────┐   │
│  │                 Core Layer                       │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐        │   │
│  │  │EventBus  │ │  Store   │ │  Router  │        │   │
│  │  └──────────┘ └──────────┘ └──────────┘        │   │
│  └─────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────┐   │
│  │               Storage Layer                      │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐        │   │
│  │  │IndexedDB │ │LocalStore│ │ServiceWorker│      │   │
│  │  └──────────┘ └──────────┘ └──────────┘        │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

### 设计原则

1. **模块化** - 功能独立、职责单一
2. **事件驱动** - 模块解耦、响应式更新
3. **渐进增强** - 基础功能优先、逐步增强
4. **性能优先** - 懒加载、虚拟滚动、缓存策略

---

## 核心模块

### EventBus（事件总线）

发布-订阅模式的事件管理器。

```javascript
// 订阅事件
const unsubscribe = EventBus.on('event:name', (data) => {
    console.log('Received:', data);
});

// 发布事件
EventBus.emit('event:name', { message: 'Hello' });

// 取消订阅
unsubscribe();

// 或
EventBus.off('event:name', callback);

// 一次性订阅
EventBus.once('event:name', (data) => {
    // 只执行一次
});
```

### Utils（工具函数）

```javascript
// 防抖
const debouncedFn = Utils.debounce(fn, 300);

// 节流
const throttledFn = Utils.throttle(fn, 100);

// 格式化时间
Utils.formatTime(timestamp); // "3分钟前"

// 格式化日期
Utils.formatDate(timestamp); // "2024-01-15"

// 生成ID
Utils.generateId(); // "lq3x9k2m5n"

// HTML转义
Utils.escapeHtml('<script>'); // "&lt;script&gt;"

// 文本截断
Utils.truncate('Long text...', 50);

// 复制到剪贴板
Utils.copyToClipboard('text');

// 滚动到顶部
Utils.scrollToTop();

// 数字动画
Utils.animateNumber(element, 1000, 1500);

// 检测移动端
Utils.isMobile(); // true/false
```

### Store（状态管理）

集中式状态管理。

```javascript
// 状态结构
Store.state = {
    user: null,
    posts: [],
    agents: [],
    resources: [],
    comments: {},
    stories: [],
    favorites: [],
    notifications: [],
    theme: 'light',
    searchHistory: [],
    chatHistory: {},
    settings: {}
};

// 初始化
Store.init();

// 获取数据
const posts = Store.state.posts;

// 设置数据
Store.set(Store.KEYS.POSTS, posts);

// 保存用户
Store.saveUser(user);

// 添加帖子
Store.addPost(post);

// 监听变化
Store.subscribe((state) => {
    console.log('State changed:', state);
});
```

### Router（路由）

单页应用路由管理。

```javascript
// 初始化
Router.init();

// 导航
Router.navigate('community');
Router.navigate('profile');

// 当前页面
Router.currentPage; // 'home'

// 返回
Router.back();

// 获取参数
Router.getParam('id');
```

### Modal（弹窗）

弹窗管理器。

```javascript
// 打开弹窗
Modal.open('loginModal');

// 关闭弹窗
Modal.close('loginModal');

// 关闭所有
Modal.closeAll();

// 当前弹窗栈
Modal.stack; // ['modal1', 'modal2']
```

### Toast（提示）

消息提示组件。

```javascript
// 成功提示
Toast.success('操作成功！');

// 错误提示
Toast.error('操作失败！');

// 警告提示
Toast.warning('请注意！');

// 信息提示
Toast.info('提示信息');

// 自定义时长
Toast.success('消息', 5000);
```

---

## 组件系统

### PostManager（帖子管理）

```javascript
// 初始化
PostManager.init();

// 渲染帖子列表
PostManager.renderPosts();

// 发布帖子
PostManager.publishPost({
    title: '标题',
    content: '内容',
    category: 'gaokao',
    tags: ['数学', '高考']
});

// 切换分类
PostManager.filterByCategory('experience');

// 排序
PostManager.sortBy('hot');
```

### AgentManager（智能体管理）

```javascript
// 初始化
AgentManager.init();

// 渲染智能体列表
AgentManager.renderAgents();

// 创建智能体
AgentManager.createAgent({
    name: '数学助手',
    type: 'tutor',
    description: '帮助学习数学',
    tags: ['数学', '辅导']
});

// 开始对话
AgentManager.startChat(agentId);

// 发送消息
AgentManager.sendMessage(message);
```

### ResourceManager（资源管理）

```javascript
// 初始化
ResourceManager.init();

// 渲染资源列表
ResourceManager.renderResources();

// 筛选
ResourceManager.filter({
    subject: 'math',
    type: 'exam',
    province: 'beijing'
});
```

### SearchManager（搜索管理）

```javascript
// 初始化
SearchManager.init();

// 搜索
SearchManager.search('高考数学');

// 切换搜索类型
SearchManager.setType('agents');

// 获取建议
SearchManager.getSuggestions('gk');
```

---

## 状态管理

### 状态结构

```javascript
const state = {
    // 用户信息
    user: {
        id: string,
        username: string,
        avatar: string,
        role: string,
        bio: string,
        createdAt: number
    },

    // 帖子列表
    posts: [{
        id: string,
        author: Object,
        title: string,
        content: string,
        category: string,
        tags: string[],
        likes: number,
        comments: number,
        views: number,
        favorites: number,
        createdAt: number
    }],

    // 智能体列表
    agents: [{
        id: string,
        name: string,
        type: string,
        avatar: string,
        description: string,
        tags: string[],
        chats: number,
        rating: number,
        createdAt: number
    }],

    // 资源列表
    resources: [{
        id: string,
        title: string,
        subject: string,
        type: string,
        province: string,
        year: number,
        downloads: number,
        icon: string,
        createdAt: number
    }]
};
```

### 事件类型

```javascript
Store.EVENTS = {
    USER_LOGIN: 'user:login',
    USER_LOGOUT: 'user:logout',
    POST_CREATE: 'post:create',
    POST_UPDATE: 'post:update',
    AGENT_CREATE: 'agent:create',
    NOTIFICATION_NEW: 'notification:new',
    THEME_CHANGE: 'theme:change',
    STATE_CHANGE: 'state:change'
};
```

---

## 路由系统

### 页面配置

```javascript
const validPages = [
    'home',      // 首页
    'community', // 社区
    'agents',    // 智能体
    'gaokao',    // 高考资源
    'equity',    // 教育平权
    'profile',   // 个人中心
    'settings'   // 设置
];
```

### 导航流程

```
用户点击导航
    ↓
Router.navigate(page)
    ↓
验证页面有效性
    ↓
移除所有页面active类
    ↓
目标页面添加active类
    ↓
更新URL hash
    ↓
触发事件 router:navigate
```

---

## 存储系统

### LocalStorage

```javascript
// 存储键
Store.KEYS = {
    USER: 'eduequity_user',
    POSTS: 'eduequity_posts',
    AGENTS: 'eduequity_agents',
    RESOURCES: 'eduequity_resources',
    THEME: 'eduequity_theme',
    SETTINGS: 'eduequity_settings'
};

// 存取方法
Store.set(key, value);
Store.get(key);
```

### IndexedDB

```javascript
// 数据库结构
const DB_NAME = 'EduEquityDB';
const DB_VERSION = 1;

const stores = [
    'posts',
    'agents',
    'resources',
    'chatHistory',
    'favorites',
    'notifications'
];

// 操作方法
await IndexedDBManager.add('posts', post);
await IndexedDBManager.get('posts', id);
await IndexedDBManager.getAll('posts');
await IndexedDBManager.update('posts', id, data);
await IndexedDBManager.delete('posts', id);
```

### Service Worker

```javascript
// 缓存策略
const CACHE_STRATEGIES = {
    static: 'cache-first',      // 静态资源
    api: 'network-first',       // API请求
    images: 'stale-while-revalidate' // 图片
};

// 缓存版本
const CACHE_NAME = 'eduequity-v2.0.0';
```

---

## 样式系统

### CSS变量

```css
:root {
    /* 颜色 */
    --primary: #6366F1;
    --secondary: #10B981;
    --accent: #F59E0B;
    --danger: #EF4444;

    /* 背景 */
    --bg-primary: #FFFFFF;
    --bg-secondary: #F8FAFC;
    --bg-card: #FFFFFF;

    /* 文字 */
    --text-primary: #0F172A;
    --text-secondary: #475569;
    --text-muted: #94A3B8;

    /* 边框 */
    --border: #E2E8F0;

    /* 阴影 */
    --shadow-sm: 0 1px 3px rgba(0,0,0,0.06);
    --shadow-md: 0 4px 6px rgba(0,0,0,0.08);
    --shadow-lg: 0 10px 15px rgba(0,0,0,0.08);

    /* 圆角 */
    --radius-sm: 8px;
    --radius-md: 12px;
    --radius-lg: 16px;

    /* 过渡 */
    --transition-fast: 150ms ease;
    --transition-base: 200ms ease;
}
```

### 响应式断点

```css
/* 移动优先 */
/* 默认: < 640px */

/* 平板 */
@media (min-width: 640px) { }

/* 小桌面 */
@media (min-width: 768px) { }

/* 大桌面 */
@media (min-width: 1024px) { }

/* 超大桌面 */
@media (min-width: 1280px) { }
```

### 深色模式

```css
[data-theme="dark"] {
    --bg-primary: #0F172A;
    --bg-secondary: #1E293B;
    --text-primary: #F8FAFC;
    --text-secondary: #CBD5E1;
    --border: #334155;
}
```

---

## 性能优化

### 骨架屏

```javascript
// 显示骨架屏
SkeletonLoader.show('posts', container);

// 隐藏骨架屏
SkeletonLoader.hide(container);
```

### 虚拟滚动

```javascript
// 创建虚拟滚动
const vs = new VirtualScroll({
    container: document.getElementById('list'),
    items: largeArray,
    itemHeight: 80,
    renderItem: (item) => `<div>${item.title}</div>`
});
```

### 懒加载

```javascript
// 图片懒加载
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            observer.unobserve(img);
        }
    });
});

document.querySelectorAll('img[data-src]').forEach(img => {
    observer.observe(img);
});
```

---

## 扩展开发

### 添加新页面

1. **HTML结构**
```html
<section id="page-newpage" class="page">
    <div class="page-header">
        <h1>新页面</h1>
    </div>
    <div class="page-content">
        <!-- 内容 -->
    </div>
</section>
```

2. **路由配置**
```javascript
// core.js - Router.isValidPage()
const validPages = [
    'home', 'community', 'agents', 'gaokao',
    'equity', 'profile', 'settings', 'newpage'
];
```

3. **导航链接**
```html
<a href="#" class="nav-link" data-page="newpage">新页面</a>
```

### 添加新组件

1. **创建组件**
```javascript
// components.js
const NewComponent = {
    init() {
        this.bindEvents();
        this.render();
    },

    bindEvents() {
        // 事件绑定
    },

    render() {
        // 渲染逻辑
    }
};
```

2. **初始化**
```javascript
// app.js - DOMContentLoaded
NewComponent.init();
```

### 添加新事件

```javascript
// 定义事件
Store.EVENTS.NEW_EVENT = 'new:event';

// 发布事件
EventBus.emit(Store.EVENTS.NEW_EVENT, data);

// 订阅事件
EventBus.on(Store.EVENTS.NEW_EVENT, (data) => {
    // 处理逻辑
});
```

### 添加新样式

```css
/* style.css */

/* 组件样式 */
.new-component {
    /* 样式定义 */
}

/* 响应式 */
@media (min-width: 768px) {
    .new-component {
        /* 桌面样式 */
    }
}

/* 深色模式 */
[data-theme="dark"] .new-component {
    /* 深色样式 */
}
```

---

<div align="center">

**Happy Coding!** 🚀

</div>
