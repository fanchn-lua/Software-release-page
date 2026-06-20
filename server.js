const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data', 'store.json');

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'public')));

function ensureDataFile() {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(DATA_FILE)) {
    const defaults = {
      site: {
        name: 'MegaReleases',
        slogan: '发现全球顶级的软件和产品',
        description: '我们精心挑选每一款产品，只为给你最好的体验。',
        footerText: '© 2026 MegaReleases - All Rights Reserved',
        contactEmail: 'hello@megareleases.com'
      },
      theme: 'theme-neon',
      products: [
        {
          id: 'p1',
          name: 'CloudSync Pro',
          subtitle: '云同步软件',
          version: 'v3.2.1',
          category: '效率工具',
          price: '¥199',
          releaseDate: '2026-06-15',
          description: '跨平台的云端文件同步工具，支持端到端加密，让您的数据在多设备间无缝流动。',
          features: ['端到端加密', '多端同步', '版本历史', '离线访问'],
          image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format',
          downloadUrl: 'https://example.com/download/cloudsync',
          officialUrl: 'https://example.com/cloudsync',
          highlight: true
        },
        {
          id: 'p2',
          name: 'PixelCraft Studio',
          subtitle: '图像处理软件',
          version: 'v8.0',
          category: '创意设计',
          price: '¥499',
          releaseDate: '2026-06-10',
          description: '专业级图像处理软件，AI 辅助修图，适合设计师和摄影爱好者。',
          features: ['AI 智能修图', '图层管理', '批量处理', '滤镜库'],
          image: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800&auto=format',
          downloadUrl: 'https://example.com/download/pixelcraft',
          officialUrl: 'https://example.com/pixelcraft',
          highlight: true
        },
        {
          id: 'p3',
          name: 'CodeFlow IDE',
          subtitle: '集成开发环境',
          version: 'v2026.2',
          category: '开发工具',
          price: '免费',
          releaseDate: '2026-06-01',
          description: '新一代轻量级 IDE，支持 100+ 编程语言，智能代码补全。',
          features: ['多语言支持', '智能补全', '插件生态', 'Git 集成'],
          image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format',
          downloadUrl: 'https://example.com/download/codeflow',
          officialUrl: 'https://example.com/codeflow',
          highlight: false
        }
      ]
    };
    fs.writeFileSync(DATA_FILE, JSON.stringify(defaults, null, 2));
  }
}

function readData() {
  ensureDataFile();
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
}

function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

app.get('/api/data', (req, res) => {
  res.json(readData());
});

app.get('/api/site', (req, res) => {
  const d = readData();
  res.json(d.site);
});

app.put('/api/site', (req, res) => {
  const d = readData();
  d.site = { ...d.site, ...req.body };
  writeData(d);
  res.json({ ok: true, site: d.site });
});

app.get('/api/theme', (req, res) => {
  res.json({ theme: readData().theme });
});

app.put('/api/theme', (req, res) => {
  const d = readData();
  d.theme = req.body.theme || d.theme;
  writeData(d);
  res.json({ ok: true, theme: d.theme });
});

app.get('/api/products', (req, res) => {
  res.json(readData().products);
});

app.post('/api/products', (req, res) => {
  const d = readData();
  const product = {
    id: 'p_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7),
    ...req.body
  };
  d.products.push(product);
  writeData(d);
  res.json({ ok: true, product });
});

app.put('/api/products/:id', (req, res) => {
  const d = readData();
  const idx = d.products.findIndex((p) => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Product not found' });
  d.products[idx] = { ...d.products[idx], ...req.body, id: req.params.id };
  writeData(d);
  res.json({ ok: true, product: d.products[idx] });
});

app.delete('/api/products/:id', (req, res) => {
  const d = readData();
  d.products = d.products.filter((p) => p.id !== req.params.id);
  writeData(d);
  res.json({ ok: true });
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

app.listen(PORT, () => {
  console.log(`\n========================================`);
  console.log(`  产品发布页网站已启动`);
  console.log(`  前台访问: http://localhost:${PORT}/`);
  console.log(`  后台访问: http://localhost:${PORT}/admin`);
  console.log(`========================================\n`);
});
