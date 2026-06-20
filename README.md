# 产品发布页网站 · Product Release Site

一个使用 **Node.js + Express** 搭建的轻量级产品发布页网站，带有功能完整的可视化管理后台。支持 **12 种精心设计的主题** 一键切换。

---

## ✨ 功能总览

### 前台发布页
- Hero 主视觉区（标题 / 口号 / 描述 / CTA 按钮）
- 精选推荐区（按 `highlight` 字段筛选）
- 全部产品卡片列表
- 响应式布局（桌面 & 移动端）
- 主题动态切换，立即生效

### 管理后台 (`/admin`)
- 🎨 **主题配置**：12 种主题卡片化选择，一键保存
- 🏠 **站点信息**：站点名、口号、描述、页脚、邮箱
- 📦 **产品管理**：新增 / 编辑 / 删除产品，字段包括
  - 名称、副标题、版本号、分类、价格、发布日期
  - 描述、产品特色（支持多行）
  - 产品图片 URL、下载链接、官网链接
  - 是否标记为「精选」
- 👁️ **前台预览**：内置 iframe 预览

### 内置主题（12 种）
| 主题 ID | 名称 | 风格 |
|---------|------|------|
| `theme-neon` | Neon 霓虹 | 紫蓝渐变 · 暗色未来感（默认） |
| `theme-sunrise` | Sunrise 日出 | 橙红温暖 · 明亮积极 |
| `theme-forest` | Forest 森林 | 自然绿色 · 清新宁静 |
| `theme-ocean` | Ocean 深海 | 深蓝神秘 · 科技感 |
| `theme-sakura` | Sakura 樱花 | 粉色浪漫 · 温柔甜美 |
| `theme-mono` | Mono 极简 | 黑白灰 · 经典克制 |
| `theme-gold` | Gold 黑金 | 金色奢华 · 高质感 |
| `theme-lavender` | Lavender 薰衣草 | 淡紫色调 · 优雅 |
| `theme-sunset` | Sunset 黄昏 | 粉橙渐变 · 热情 |
| `theme-tech` | Tech 科技 | 青色代码风 · 专业 |
| `theme-mint` | Mint 薄荷 | 清新薄荷绿 · 凉爽 |
| `theme-royal` | Royal 皇家 | 靛蓝金 · 典雅尊贵 |

---

## 📁 项目结构

```
/workspace
├── package.json          # 项目依赖（express, body-parser）
├── server.js             # Express 服务器 & REST API
├── data/                 # 运行时数据（自动创建）
│   └── store.json        # 站点信息 + 当前主题 + 产品列表
└── public/               # 静态资源（前后台）
    ├── index.html        # 前台发布页
    ├── main.js           # 前台渲染逻辑
    ├── themes.css        # 12 种主题样式
    ├── admin.html        # 管理后台
    ├── admin.css         # 后台样式
    └── admin.js          # 后台逻辑
```

---

## 🚀 快速开始

### 1. 安装依赖
```bash
cd /workspace
npm install
```

### 2. 启动服务
```bash
npm start
```

启动后终端会显示：
```
========================================
  产品发布页网站已启动
  前台访问: http://localhost:3000/
  后台访问: http://localhost:3000/admin
========================================
```

### 3. 在浏览器中打开
- **前台**：http://localhost:3000/
- **后台**：http://localhost:3000/admin

---

## 🔧 API 接口

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/data` | 获取全部数据（站点 + 主题 + 产品） |
| GET | `/api/site` | 获取站点信息 |
| PUT | `/api/site` | 更新站点信息（JSON Body） |
| GET | `/api/theme` | 获取当前主题 |
| PUT | `/api/theme` | 更新主题 `{ "theme": "theme-gold" }` |
| GET | `/api/products` | 获取全部产品 |
| POST | `/api/products` | 新增产品（JSON Body） |
| PUT | `/api/products/:id` | 更新指定产品 |
| DELETE | `/api/products/:id` | 删除指定产品 |

---

## 💾 数据存储

所有数据保存在 `data/store.json`，为纯 JSON 文件，方便人工检查或迁移。首次启动会自动写入默认示例数据（3 个示例产品）。

示例结构：
```json
{
  "site": {
    "name": "MegaReleases",
    "slogan": "发现全球顶级的软件和产品",
    "description": "我们精心挑选每一款产品，只为给你最好的体验。",
    "footerText": "© 2026 MegaReleases - All Rights Reserved",
    "contactEmail": "hello@megareleases.com"
  },
  "theme": "theme-neon",
  "products": [
    {
      "id": "p_xxx",
      "name": "产品名",
      "subtitle": "副标题",
      "version": "v1.0",
      "category": "效率工具",
      "price": "¥199",
      "releaseDate": "2026-06-15",
      "description": "产品描述...",
      "features": ["特色A", "特色B"],
      "image": "https://.../cover.jpg",
      "downloadUrl": "https://...",
      "officialUrl": "https://...",
      "highlight": true
    }
  ]
}
```

---

## 🎨 如何新增自定义主题

1. 打开 `public/themes.css`，参考已有主题在底部新增一组
   `body.theme-xxx { ... }` 的 CSS 变量覆盖块
2. 在 `public/admin.js` 的 `THEMES` 数组中追加一条记录
3. 保存后访问后台即能选中新主题

---

## 📝 备注

- 当前实现为**单机演示版本**，无用户认证 / 数据库。
  如需部署到公网，请自行添加鉴权中间件和生产级存储。
- 所有产品图片通过 URL 配置，可使用任意图床或本地静态文件。
- 服务默认监听 **3000** 端口，可修改 `server.js` 顶部调整。
