# API 文档

## 目录

1. [核心API](#核心api)
2. [事件API](#事件api)
3. [存储API](#存储api)
4. [组件API](#组件api)
5. [工具API](#工具api)

---

## 核心API

### EventBus

事件总线，用于模块间通信。

#### on(event, callback)

订阅事件。

**参数：**
- `event` (string) - 事件名称
- `callback` (Function) - 回调函数

**返回：**
- `Function` - 取消订阅函数

**示例：**
```javascript
const unsubscribe = EventBus.on('user:login', (user) => {
    console.log('User logged in:', user);
});

// 取消订阅
unsubscribe();
```

---

#### off(event, callback)

取消订阅事件。

**参数：**
- `event` (string) - 事件名称
- `callback` (Function) - 回调函数

**示例：**
```javascript
const handler = (data) => console.log(data);
EventBus.on('event', handler);
EventBus.off('event', handler);
```

---

#### emit(event, data)

发布事件。

**参数：**
- `event` (string) - 事件名称
- `data` (any) - 事件数据

**示例：**
```javascript
EventBus.emit('post:create', { title: 'New Post' });
```

---

#### once(event, callback)

一次性订阅。

**参数：**
- `event` (string) - 事件名称
- `callback` (Function) - 回调函数

**示例：**
```javascript
EventBus.once('app:ready', () => {
    console.log('App is ready');
});
```

---

### Store

状态管理器。

#### init()

初始化状态管理。

**返回：**
- `Store` - Store实例

**示例：**
```javascript
Store.init();
```

---

#### get(key)

获取存储数据。

**参数：**
- `key` (string) - 存储键

**返回：**
- `any` - 存储值或null

**示例：**
```javascript
const theme = Store.get(Store.KEYS.THEME);
```

---

#### set(key, value)

设置存储数据。

**参数：**
- `key` (string) - 存储键
- `value` (any) - 存储值

**返回：**
- `boolean` - 是否成功

**示例：**
```javascript
Store.set(Store.KEYS.THEME, 'dark');
```

---

#### saveUser(user)

保存用户信息。

**参数：**
- `user` (Object) - 用户对象

**示例：**
```javascript
Store.saveUser({
    id: 'user123',
    username: '张三',
    avatar: '👨‍🎓',
    role: '学生'
});
```

---

#### addPost(post)

添加帖子。

**参数：**
- `post` (Object) - 帖子对象

**返回：**
- `Object` - 添加的帖子

**示例：**
```javascript
Store.addPost({
    id: Utils.generateId(),
    title: '标题',
    content: '内容',
    category: 'gaokao',
    tags: ['数学'],
    likes: 0,
    comments: 0
});
```

---

#### subscribe(callback)

订阅状态变化。

**参数：**
- `callback` (Function) - 回调函数

**返回：**
- `Function` - 取消订阅函数

**示例：**
```javascript
const unsub = Store.subscribe((state) => {
    console.log('State updated:', state);
});
```

---

### Router

路由管理器。

#### init()

初始化路由。

**示例：**
```javascript
Router.init();
```

---

#### navigate(page, pushState = true)

导航到指定页面。

**参数：**
- `page` (string) - 页面名称
- `pushState` (boolean) - 是否添加历史记录

**示例：**
```javascript
Router.navigate('community');
Router.navigate('profile', false);
```

---

#### back()

返回上一页。

**示例：**
```javascript
Router.back();
```

---

#### getParam(key)

获取路由参数。

**参数：**
- `key` (string) - 参数名

**返回：**
- `string` - 参数值

**示例：**
```javascript
const id = Router.getParam('id');
```

---

### Modal

弹窗管理器。

#### open(id)

打开弹窗。

**参数：**
- `id` (string) - 弹窗ID

**示例：**
```javascript
Modal.open('loginModal');
```

---

#### close(id)

关闭弹窗。

**参数：**
- `id` (string) - 弹窗ID

**示例：**
```javascript
Modal.close('loginModal');
```

---

#### closeAll()

关闭所有弹窗。

**示例：**
```javascript
Modal.closeAll();
```

---

### Toast

消息提示。

#### success(message, duration = 3000)

成功提示。

**参数：**
- `message` (string) - 消息内容
- `duration` (number) - 显示时长(ms)

**示例：**
```javascript
Toast.success('操作成功！');
```

---

#### error(message, duration = 3000)

错误提示。

**示例：**
```javascript
Toast.error('操作失败！');
```

---

#### warning(message, duration = 3000)

警告提示。

**示例：**
```javascript
Toast.warning('请注意！');
```

---

#### info(message, duration = 3000)

信息提示。

**示例：**
```javascript
Toast.info('提示信息');
```

---

## 事件API

### 用户事件

| 事件名 | 数据 | 说明 |
|-------|------|------|
| `user:login` | `{ user }` | 用户登录 |
| `user:logout` | `{}` | 用户登出 |

### 帖子事件

| 事件名 | 数据 | 说明 |
|-------|------|------|
| `post:create` | `{ post }` | 创建帖子 |
| `post:update` | `{ post }` | 更新帖子 |
| `post:delete` | `{ id }` | 删除帖子 |

### 智能体事件

| 事件名 | 数据 | 说明 |
|-------|------|------|
| `agent:create` | `{ agent }` | 创建智能体 |
| `agent:chat` | `{ agentId, message }` | 智能体对话 |

### 通知事件

| 事件名 | 数据 | 说明 |
|-------|------|------|
| `notification:new` | `{ notification }` | 新通知 |
| `notification:read` | `{ id }` | 通知已读 |

### 主题事件

| 事件名 | 数据 | 说明 |
|-------|------|------|
| `theme:change` | `{ theme }` | 主题切换 |

### 路由事件

| 事件名 | 数据 | 说明 |
|-------|------|------|
| `router:navigate` | `{ page, prevPage }` | 页面导航 |

---

## 存储API

### 存储键

```javascript
Store.KEYS = {
    USER: 'eduequity_user',
    POSTS: 'eduequity_posts',
    AGENTS: 'eduequity_agents',
    RESOURCES: 'eduequity_resources',
    COMMENTS: 'eduequity_comments',
    STORIES: 'eduequity_stories',
    FAVORITES: 'eduequity_favorites',
    NOTIFICATIONS: 'eduequity_notifications',
    THEME: 'eduequity_theme',
    SEARCH_HISTORY: 'eduequity_search_history',
    CHAT_HISTORY: 'eduequity_chat_history',
    SETTINGS: 'eduequity_settings'
};
```

### IndexedDB

#### add(storeName, data)

添加数据。

**参数：**
- `storeName` (string) - 存储名称
- `data` (Object) - 数据对象

**返回：**
- `Promise<string>` - 数据ID

**示例：**
```javascript
const id = await IndexedDBManager.add('posts', {
    title: '标题',
    content: '内容'
});
```

---

#### get(storeName, id)

获取数据。

**参数：**
- `storeName` (string) - 存储名称
- `id` (string) - 数据ID

**返回：**
- `Promise<Object>` - 数据对象

**示例：**
```javascript
const post = await IndexedDBManager.get('posts', 'post123');
```

---

#### getAll(storeName)

获取所有数据。

**参数：**
- `storeName` (string) - 存储名称

**返回：**
- `Promise<Array>` - 数据数组

**示例：**
```javascript
const posts = await IndexedDBManager.getAll('posts');
```

---

#### update(storeName, id, data)

更新数据。

**参数：**
- `storeName` (string) - 存储名称
- `id` (string) - 数据ID
- `data` (Object) - 更新数据

**返回：**
- `Promise<boolean>` - 是否成功

**示例：**
```javascript
await IndexedDBManager.update('posts', 'post123', {
    title: '新标题'
});
```

---

#### delete(storeName, id)

删除数据。

**参数：**
- `storeName` (string) - 存储名称
- `id` (string) - 数据ID

**返回：**
- `Promise<boolean>` - 是否成功

**示例：**
```javascript
await IndexedDBManager.delete('posts', 'post123');
```

---

## 组件API

### PostManager

#### init()

初始化帖子管理。

**示例：**
```javascript
PostManager.init();
```

---

#### renderPosts()

渲染帖子列表。

**示例：**
```javascript
PostManager.renderPosts();
```

---

#### publishPost(post)

发布帖子。

**参数：**
- `post` (Object) - 帖子对象

**返回：**
- `Object` - 发布的帖子

**示例：**
```javascript
PostManager.publishPost({
    title: '标题',
    content: '内容',
    category: 'gaokao',
    tags: ['数学']
});
```

---

#### filterByCategory(category)

按分类筛选。

**参数：**
- `category` (string) - 分类名称

**示例：**
```javascript
PostManager.filterByCategory('experience');
```

---

#### sortBy(type)

排序。

**参数：**
- `type` (string) - 排序类型 ('latest' | 'hot')

**示例：**
```javascript
PostManager.sortBy('hot');
```

---

### AgentManager

#### init()

初始化智能体管理。

---

#### renderAgents()

渲染智能体列表。

---

#### createAgent(agent)

创建智能体。

**参数：**
- `agent` (Object) - 智能体对象

**返回：**
- `Object` - 创建的智能体

**示例：**
```javascript
AgentManager.createAgent({
    name: '数学助手',
    type: 'tutor',
    description: '帮助学习数学',
    tags: ['数学']
});
```

---

#### startChat(agentId)

开始对话。

**参数：**
- `agentId` (string) - 智能体ID

**示例：**
```javascript
AgentManager.startChat('agent123');
```

---

#### sendMessage(message)

发送消息。

**参数：**
- `message` (string) - 消息内容

**示例：**
```javascript
AgentManager.sendMessage('如何学习数学？');
```

---

### SearchManager

#### init()

初始化搜索管理。

---

#### search(query)

搜索。

**参数：**
- `query` (string) - 搜索关键词

**返回：**
- `Object` - 搜索结果

**示例：**
```javascript
const results = SearchManager.search('高考数学');
```

---

#### setType(type)

设置搜索类型。

**参数：**
- `type` (string) - 类型 ('all' | 'posts' | 'agents' | 'resources')

**示例：**
```javascript
SearchManager.setType('agents');
```

---

## 工具API

### Utils

#### debounce(fn, delay)

防抖函数。

**参数：**
- `fn` (Function) - 目标函数
- `delay` (number) - 延迟时间(ms)

**返回：**
- `Function` - 防抖后的函数

**示例：**
```javascript
const debounced = Utils.debounce(() => {
    console.log('执行');
}, 300);
```

---

#### throttle(fn, delay)

节流函数。

**参数：**
- `fn` (Function) - 目标函数
- `delay` (number) - 间隔时间(ms)

**返回：**
- `Function` - 节流后的函数

**示例：**
```javascript
const throttled = Utils.throttle(() => {
    console.log('执行');
}, 100);
```

---

#### formatTime(timestamp)

格式化时间。

**参数：**
- `timestamp` (number) - 时间戳

**返回：**
- `string` - 格式化字符串

**示例：**
```javascript
Utils.formatTime(Date.now() - 60000); // "1分钟前"
```

---

#### generateId()

生成唯一ID。

**返回：**
- `string` - 唯一ID

**示例：**
```javascript
const id = Utils.generateId(); // "lq3x9k2m5n"
```

---

#### escapeHtml(text)

HTML转义。

**参数：**
- `text` (string) - 原始文本

**返回：**
- `string` - 转义后文本

**示例：**
```javascript
Utils.escapeHtml('<script>'); // "&lt;script&gt;"
```

---

#### copyToClipboard(text)

复制到剪贴板。

**参数：**
- `text` (string) - 文本内容

**返回：**
- `Promise<void>`

**示例：**
```javascript
await Utils.copyToClipboard('复制内容');
```

---

#### animateNumber(element, target, duration)

数字动画。

**参数：**
- `element` (HTMLElement) - 目标元素
- `target` (number) - 目标数字
- `duration` (number) - 动画时长(ms)

**示例：**
```javascript
Utils.animateNumber(element, 1000, 1500);
```

---

<div align="center">

**API Documentation Complete** ✅

</div>
