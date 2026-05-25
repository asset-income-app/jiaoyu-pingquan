# 教育平权社区

<div align="center">

![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![PWA](https://img.shields.io/badge/PWA-Ready-orange.svg)
![Platform](https://img.shields.io/badge/platform-Web%20%7C%20iOS%20%7C%20Android-lightgrey.svg)

**打破教育资源壁垒，让每个学子都能获得公平的教育机会**

[在线演示](https://eduequity.netlify.app) | [快速开始](#快速开始) | [功能特性](#功能特性) | [部署指南](#部署指南)

</div>

---

## 📖 项目简介

教育平权社区是一个现代化的PWA（渐进式Web应用）平台，致力于：

- **教育公平** - 为欠发达地区学子提供优质教育资源
- **高考资源** - 汇集全国高考真题、模拟题、复习资料
- **智能体创建** - 创建个性化AI学习助手
- **社区互动** - 学习交流、经验分享、互帮互助

## ✨ 功能特性

### 🎓 核心功能

| 功能模块 | 描述 |
|---------|------|
| **社区广场** | 发布帖子、评论互动、话题分类、热门标签 |
| **智能体创建** | 5种类型智能体、Markdown渲染、流式响应 |
| **高考资源中心** | 按科目/类型/地区筛选、资源下载 |
| **教育平权** | 使命介绍、数据统计、志愿活动、真实故事 |
| **个人中心** | 用户资料、学习统计、收藏管理 |
| **设置系统** | 主题切换、通知控制、数据管理 |

### 🚀 技术特性

| 特性 | 说明 |
|-----|------|
| **PWA支持** | 可安装到桌面、离线使用、推送通知 |
| **响应式设计** | 完美适配手机、平板、桌面 |
| **深色模式** | 护眼深色主题、自动跟随系统 |
| **主题定制** | 5种预设主题、自定义颜色 |
| **国际化** | 中英文双语支持 |
| **性能优化** | 骨架屏、虚拟滚动、懒加载 |
| **手势操作** | 滑动、长按、双击、捏合缩放 |
| **快捷键** | 12个全局快捷键提升效率 |

## 🛠️ 技术栈

- **前端**: 原生 JavaScript (ES6+)
- **样式**: CSS3 + CSS变量 + 响应式设计
- **存储**: IndexedDB + LocalStorage
- **离线**: Service Worker
- **部署**: Netlify / 静态托管

## 📁 项目结构

```
教育平权社区/
├── index.html          # 主页面
├── manifest.json       # PWA配置
├── sw.js               # Service Worker
├── netlify.toml        # Netlify配置
├── css/
│   └── style.css       # 完整样式
├── js/
│   ├── core.js         # 核心模块 (EventBus, Store, Router, Utils)
│   ├── storage.js      # IndexedDB存储
│   ├── components.js   # UI组件
│   └── app.js          # 应用逻辑
└── icons/              # PWA图标
```

## 🚀 快速开始

### 本地运行

1. 克隆项目
```bash
git clone https://github.com/your-repo/eduequity.git
cd eduequity
```

2. 启动本地服务器
```bash
# Python
python -m http.server 8000

# Node.js
npx serve .

# PHP
php -S localhost:8000
```

3. 访问 `http://localhost:8000`

### 部署到 Netlify

#### 方法一：拖拽部署
1. 打开 [Netlify Drop](https://app.netlify.com/drop)
2. 将项目文件夹拖到页面上
3. 等待部署完成

#### 方法二：CLI部署
```bash
npm install -g netlify-cli
netlify deploy --prod
```

## 📱 PWA安装

部署后，在浏览器访问网站：

| 平台 | 操作 |
|-----|------|
| **iOS Safari** | 分享 → 添加到主屏幕 |
| **Android Chrome** | 菜单 → 添加到主屏幕 |
| **Desktop Chrome** | 地址栏安装图标 |

## ⌨️ 快捷键

| 快捷键 | 功能 |
|-------|------|
| `Ctrl/Cmd + K` | 打开搜索 |
| `Ctrl/Cmd + Enter` | 发布内容 |
| `Esc` | 关闭弹窗 |
| `?` | 显示快捷键帮助 |
| `G H` | 首页 |
| `G C` | 社区 |
| `G A` | 智能体 |
| `G R` | 资源 |
| `G P` | 个人中心 |

## 🎨 主题定制

### 预设主题
- 默认 (紫色)
- 海洋 (青色)
- 日落 (红色)
- 森林 (绿色)
- 午夜 (深紫)

### 自定义颜色
在设置页面可以自定义：
- 主色
- 辅助色
- 强调色

## 📊 性能指标

| 指标 | 目标 | 实际 |
|-----|------|------|
| 首屏加载 | < 3s | ✅ |
| LCP | < 2.5s | ✅ |
| FID | < 100ms | ✅ |
| CLS | < 0.1 | ✅ |

## 🔧 开发指南

### 核心模块

```javascript
// EventBus - 事件总线
EventBus.on('event', callback);
EventBus.emit('event', data);

// Store - 状态管理
Store.state.user;
Store.set('key', value);

// Router - 路由
Router.navigate('page');
Router.currentPage;

// Modal - 弹窗
Modal.open('modalId');
Modal.close('modalId');

// Toast - 提示
Toast.success('消息');
Toast.error('错误');
```

### 添加新页面

1. 在 `index.html` 添加页面section
2. 在 `Router.isValidPage()` 添加页面名
3. 在导航栏添加链接

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件

## 🙏 致谢

感谢所有为教育公平事业做出贡献的人们！

---

<div align="center">

**让教育更公平，让未来更美好** 💝

[⬆ 返回顶部](#教育平权社区)

</div>
