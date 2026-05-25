# 部署指南

## 目录

1. [Netlify部署](#netlify部署)
2. [Vercel部署](#vercel部署)
3. [GitHub Pages部署](#github-pages部署)
4. [自有服务器部署](#自有服务器部署)
5. [PWA配置](#pwa配置)
6. [域名配置](#域名配置)
7. [HTTPS配置](#https配置)

---

## Netlify部署

### 方法一：拖拽部署（推荐）

最简单的部署方式，适合快速上线。

1. **准备文件**
   - 确保项目文件完整
   - 检查 `netlify.toml` 配置

2. **访问Netlify Drop**
   ```
   https://app.netlify.com/drop
   ```

3. **拖拽部署**
   - 将项目文件夹拖到页面
   - 等待上传完成
   - 获得临时域名

4. **配置域名**（可选）
   - Site settings → Domain management
   - Add custom domain

### 方法二：Git集成

适合持续部署。

1. **推送代码到Git**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/username/repo.git
   git push -u origin main
   ```

2. **连接Netlify**
   - 访问 https://app.netlify.com
   - 点击 "New site from Git"
   - 选择 Git 提供商
   - 选择仓库

3. **配置构建**
   - Build command: 留空（静态站点）
   - Publish directory: `/` 或 `.`

4. **部署**
   - 点击 "Deploy site"
   - 等待构建完成

### 方法三：CLI部署

适合命令行操作。

1. **安装CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **登录**
   ```bash
   netlify login
   ```

3. **部署**
   ```bash
   # 预览部署
   netlify deploy

   # 生产部署
   netlify deploy --prod
   ```

### Netlify配置文件

`netlify.toml`:
```toml
[build]
  publish = "."

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"

[[headers]]
  for = "/sw.js"
  [headers.values]
    Cache-Control = "no-cache"

[[headers]]
  for = "/*.js"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/*.css"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

---

## Vercel部署

### 方法一：Git集成

1. **推送代码到Git**

2. **导入项目**
   - 访问 https://vercel.com
   - 点击 "New Project"
   - 选择仓库

3. **配置**
   - Framework Preset: Other
   - Root Directory: ./
   - Build Command: 留空

4. **部署**
   - 点击 "Deploy"

### 方法二：CLI部署

1. **安装CLI**
   ```bash
   npm install -g vercel
   ```

2. **登录**
   ```bash
   vercel login
   ```

3. **部署**
   ```bash
   vercel --prod
   ```

---

## GitHub Pages部署

### 方法一：直接部署

1. **创建仓库**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. **推送到GitHub**
   ```bash
   git remote add origin https://github.com/username/repo.git
   git branch -M main
   git push -u origin main
   ```

3. **启用Pages**
   - 仓库 Settings → Pages
   - Source: Deploy from a branch
   - Branch: main, / (root)
   - Save

4. **访问站点**
   ```
   https://username.github.io/repo
   ```

### 方法二：GitHub Actions

创建 `.github/workflows/deploy.yml`:
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./
```

---

## 自有服务器部署

### Nginx配置

1. **上传文件**
   ```bash
   scp -r ./教育平权社区 user@server:/var/www/html/
   ```

2. **Nginx配置**
   ```nginx
   server {
       listen 80;
       server_name example.com;
       root /var/www/html/教育平权社区;
       index index.html;

       # SPA路由
       location / {
           try_files $uri $uri/ /index.html;
       }

       # 静态资源缓存
       location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
           expires 1y;
           add_header Cache-Control "public, immutable";
       }

       # Service Worker不缓存
       location /sw.js {
           add_header Cache-Control "no-cache";
       }

       # 安全头
       add_header X-Frame-Options "DENY";
       add_header X-XSS-Protection "1; mode=block";
       add_header X-Content-Type-Options "nosniff";
   }
   ```

3. **重启Nginx**
   ```bash
   sudo nginx -t
   sudo systemctl restart nginx
   ```

### Apache配置

1. **上传文件**

2. **.htaccess配置**
   ```apache
   # SPA路由
   RewriteEngine On
   RewriteBase /
   RewriteRule ^index\.html$ - [L]
   RewriteCond %{REQUEST_FILENAME} !-f
   RewriteCond %{REQUEST_FILENAME} !-d
   RewriteRule . /index.html [L]

   # 缓存
   <IfModule mod_expires.c>
       ExpiresActive On
       ExpiresByType text/css "access plus 1 year"
       ExpiresByType application/javascript "access plus 1 year"
       ExpiresByType image/png "access plus 1 year"
       ExpiresByType image/svg+xml "access plus 1 year"
   </IfModule>

   # 压缩
   <IfModule mod_deflate.c>
       AddOutputFilterByType DEFLATE text/html text/css application/javascript
   </IfModule>
   ```

---

## PWA配置

### manifest.json

```json
{
    "name": "教育平权社区",
    "short_name": "教育平权",
    "description": "让每个人都能公平获得优质教育资源",
    "start_url": "/",
    "display": "standalone",
    "background_color": "#FFFFFF",
    "theme_color": "#4F46E5",
    "orientation": "portrait-primary",
    "icons": [
        {
            "src": "icons/icon-192.png",
            "sizes": "192x192",
            "type": "image/png"
        },
        {
            "src": "icons/icon-512.png",
            "sizes": "512x512",
            "type": "image/png"
        }
    ]
}
```

### Service Worker

确保 `sw.js` 正确配置：

```javascript
const CACHE_NAME = 'eduequity-v2.0.0';
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/css/style.css',
    '/js/core.js',
    '/js/storage.js',
    '/js/components.js',
    '/js/app.js',
    '/manifest.json'
];

// 安装事件
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(STATIC_ASSETS))
    );
});

// 激活事件
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys.filter(key => key !== CACHE_NAME)
                    .map(key => caches.delete(key))
            );
        })
    );
});

// 请求事件
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then(response => response || fetch(event.request))
    );
});
```

---

## 域名配置

### 自定义域名

1. **添加域名**
   - Netlify: Domain management → Add custom domain
   - Vercel: Settings → Domains → Add

2. **DNS配置**

   **方式一：A记录**
   ```
   类型: A
   名称: @
   值: [平台提供的IP]
   ```

   **方式二：CNAME**
   ```
   类型: CNAME
   名称: www
   值: [平台提供的域名]
   ```

3. **等待DNS生效**
   - 通常需要几分钟到几小时

### 子域名配置

```
类型: CNAME
名称: edu
值: your-site.netlify.app
```

访问：`edu.example.com`

---

## HTTPS配置

### Netlify/Vercel

自动配置HTTPS，无需额外操作。

### 自有服务器

#### Let's Encrypt

1. **安装Certbot**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   ```

2. **获取证书**
   ```bash
   sudo certbot --nginx -d example.com -d www.example.com
   ```

3. **自动续期**
   ```bash
   sudo certbot renew --dry-run
   ```

#### Nginx配置

```nginx
server {
    listen 443 ssl http2;
    server_name example.com;

    ssl_certificate /etc/letsencrypt/live/example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;

    # SSL优化
    ssl_session_timeout 1d;
    ssl_session_cache shared:SSL:50m;
    ssl_session_tickets off;

    # 现代SSL配置
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256;
    ssl_prefer_server_ciphers off;

    # HSTS
    add_header Strict-Transport-Security "max-age=63043200" always;
}

# HTTP重定向
server {
    listen 80;
    server_name example.com;
    return 301 https://$server_name$request_uri;
}
```

---

## 部署检查清单

### 部署前

- [ ] 代码无错误
- [ ] 所有文件已提交
- [ ] `manifest.json` 配置正确
- [ ] `sw.js` 缓存列表完整
- [ ] 图标文件存在
- [ ] `netlify.toml` 配置正确

### 部署后

- [ ] 网站可访问
- [ ] PWA可安装
- [ ] 离线功能正常
- [ ] HTTPS已启用
- [ ] 路由正常工作
- [ ] 静态资源加载
- [ ] Service Worker注册

### 性能检查

- [ ] Lighthouse评分 > 90
- [ ] 首屏加载 < 3秒
- [ ] LCP < 2.5秒
- [ ] FID < 100ms
- [ ] CLS < 0.1

---

<div align="center">

**部署成功！** 🎉

</div>
