# 贡献指南

感谢您考虑为教育平权社区项目做出贡献！

## 目录

1. [行为准则](#行为准则)
2. [如何贡献](#如何贡献)
3. [开发流程](#开发流程)
4. [代码规范](#代码规范)
5. [提交规范](#提交规范)
6. [Pull Request](#pull-request)
7. [问题反馈](#问题反馈)

---

## 行为准则

### 我们的承诺

为了营造开放和友好的环境，我们承诺：

- 使用包容性语言
- 尊重不同观点和经验
- 优雅接受建设性批评
- 关注对社区最有利的事情
- 对其他社区成员表示同理心

### 不可接受的行为

- 使用性化语言或图像
- 侮辱性/贬损性评论
- 公开或私下的骚扰
- 未经许可发布他人私人信息
- 其他不道德或不专业行为

---

## 如何贡献

### 报告Bug

1. 检查Issue列表，避免重复
2. 使用Bug报告模板
3. 详细描述问题
4. 提供复现步骤

### 建议新功能

1. 检查是否已有类似建议
2. 使用功能建议模板
3. 详细描述功能
4. 说明使用场景

### 提交代码

1. Fork项目
2. 创建功能分支
3. 编写代码
4. 提交Pull Request

---

## 开发流程

### 1. Fork项目

点击GitHub页面右上角"Fork"按钮。

### 2. 克隆仓库

```bash
git clone https://github.com/YOUR_USERNAME/eduequity.git
cd eduequity
```

### 3. 创建分支

```bash
git checkout -b feature/your-feature-name
```

分支命名规范：
- `feature/xxx` - 新功能
- `fix/xxx` - Bug修复
- `docs/xxx` - 文档更新
- `refactor/xxx` - 代码重构
- `style/xxx` - 代码格式
- `perf/xxx` - 性能优化

### 4. 安装依赖

本项目为纯前端项目，无需安装依赖。

### 5. 本地开发

```bash
# Python
python -m http.server 8000

# Node.js
npx serve .

# PHP
php -S localhost:8000
```

访问 `http://localhost:8000`

### 6. 进行开发

- 编写代码
- 测试功能
- 检查代码规范

### 7. 提交更改

```bash
git add .
git commit -m "feat: 添加新功能"
```

### 8. 推送分支

```bash
git push origin feature/your-feature-name
```

### 9. 创建Pull Request

在GitHub页面创建PR，填写PR模板。

---

## 代码规范

### HTML

```html
<!-- 使用语义化标签 -->
<header></header>
<nav></nav>
<main></main>
<article></article>
<aside></aside>
<footer></footer>

<!-- 属性顺序 -->
<!-- id → class → data-* → 其他 -->
<div id="example" class="container" data-value="1">

<!-- 自闭合标签 -->
<img src="image.png" alt="描述">
<input type="text">

<!-- 嵌套缩进 -->
<div>
    <p>内容</p>
</div>
```

### CSS

```css
/* CSS变量命名 */
--primary-color: #6366F1;
--bg-primary: #FFFFFF;
--text-primary: #0F172A;

/* 选择器命名 */
.page { }           /* 页面 */
.card { }           /* 组件 */
.card-title { }     /* 组件元素 */
.is-active { }      /* 状态 */
[data-theme="dark"] /* 属性选择器 */

/* 属性顺序 */
.element {
    /* 定位 */
    position: relative;
    top: 0;
    left: 0;
    
    /* 盒模型 */
    display: flex;
    width: 100%;
    height: 100%;
    padding: 16px;
    margin: 0;
    
    /* 视觉 */
    background: #FFF;
    border: 1px solid #EEE;
    color: #333;
    
    /* 其他 */
    cursor: pointer;
    transition: all 0.3s;
}
```

### JavaScript

```javascript
// 变量命名
const userName = '张三';        // 小驼峰
const MAX_COUNT = 100;          // 大驼峰常量
const postManager = { };        // 小驼峰对象

// 函数命名
function getUserInfo() { }      // 小驼峰
const handleClick = () => { };  // 事件处理

// 模块定义
const ModuleName = {
    init() {
        // 初始化
    },
    
    method() {
        // 方法
    }
};

// 事件处理
element.addEventListener('click', (e) => {
    // 处理逻辑
});

// 异步处理
async function fetchData() {
    try {
        const data = await api.get();
        return data;
    } catch (error) {
        console.error(error);
    }
}

// 条件判断
if (condition) {
    // 代码
}

// 循环
items.forEach(item => {
    // 处理
});

for (let i = 0; i < length; i++) {
    // 处理
}
```

---

## 提交规范

### 提交消息格式

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type类型

| 类型 | 说明 |
|-----|------|
| `feat` | 新功能 |
| `fix` | Bug修复 |
| `docs` | 文档更新 |
| `style` | 代码格式（不影响功能） |
| `refactor` | 重构（不是新功能也不是修复） |
| `perf` | 性能优化 |
| `test` | 测试相关 |
| `chore` | 构建/工具相关 |

### Scope范围

| 范围 | 说明 |
|-----|------|
| `core` | 核心模块 |
| `ui` | UI组件 |
| `store` | 状态管理 |
| `router` | 路由 |
| `pwa` | PWA相关 |
| `style` | 样式 |

### 示例

```
feat(ui): 添加深色模式切换按钮

- 添加主题切换按钮
- 实现深色模式样式
- 保存用户偏好

Closes #123
```

```
fix(router): 修复页面导航不显示问题

修复首次访问时页面不显示的问题，
确保默认导航到首页。

Fixes #456
```

```
docs: 更新部署文档

添加Vercel和GitHub Pages部署说明。
```

---

## Pull Request

### PR标题

使用提交规范格式：
```
feat: 添加新功能
fix: 修复问题
docs: 更新文档
```

### PR描述模板

```markdown
## 变更类型
- [ ] 新功能
- [ ] Bug修复
- [ ] 文档更新
- [ ] 代码重构
- [ ] 性能优化

## 变更说明
<!-- 描述本次变更的内容 -->

## 相关Issue
<!-- 关联的Issue编号 -->

## 测试情况
<!-- 描述测试过程和结果 -->

## 截图
<!-- 如有UI变更，提供截图 -->

## 检查清单
- [ ] 代码遵循规范
- [ ] 自测通过
- [ ] 文档已更新
- [ ] 无新增警告
```

### PR流程

1. **创建PR**
   - 填写标题和描述
   - 关联Issue
   - 添加标签

2. **代码审查**
   - 等待审查
   - 回复评论
   - 按需修改

3. **合并**
   - 通过审查后合并
   - 删除功能分支

---

## 问题反馈

### Bug报告模板

```markdown
## Bug描述
<!-- 清晰简洁地描述bug -->

## 复现步骤
1. 进入 '...'
2. 点击 '...'
3. 滚动到 '...'
4. 看到错误

## 期望行为
<!-- 描述期望发生什么 -->

## 实际行为
<!-- 描述实际发生了什么 -->

## 截图
<!-- 如适用，添加截图 -->

## 环境
- 设备: [如: iPhone 12]
- 系统: [如: iOS 15]
- 浏览器: [如: Chrome 100]
- 版本: [如: 2.0.0]

## 其他信息
<!-- 其他相关信息 -->
```

### 功能建议模板

```markdown
## 功能描述
<!-- 清晰描述建议的功能 -->

## 使用场景
<!-- 描述什么场景下需要此功能 -->

## 期望方案
<!-- 描述期望的实现方式 -->

## 替代方案
<!-- 描述其他可行的方案 -->

## 其他信息
<!-- 其他相关信息 -->
```

---

## 开发提示

### 调试技巧

```javascript
// 控制台调试
console.log('变量:', variable);
console.table(array);
console.time('计时');
console.timeEnd('计时');

// 断点调试
debugger;

// 性能分析
console.profile('性能');
console.profileEnd('性能');
```

### 常用命令

```bash
# 查看状态
git status

# 查看差异
git diff

# 撤销更改
git checkout -- file

# 更新分支
git fetch origin
git merge origin/main

# 清理分支
git branch -d branch-name
```

---

<div align="center">

**感谢您的贡献！** ❤️

</div>
