/* ================================================================
   管理后台逻辑 - 主题切换 + 产品管理 + 站点信息
   ================================================================ */

const THEMES = [
  { id: 'theme-neon', name: 'Neon 霓虹', desc: '紫蓝渐变 · 暗色未来感', colors: ['#a855f7', '#22d3ee'], bg: '#0f0f1e', text: '#f0f0ff' },
  { id: 'theme-sunrise', name: 'Sunrise 日出', desc: '橙红温暖 · 明亮积极', colors: ['#f97316', '#ef4444'], bg: '#fff7ed', text: '#1c1917' },
  { id: 'theme-forest', name: 'Forest 森林', desc: '自然绿色 · 清新宁静', colors: ['#16a34a', '#ca8a04'], bg: '#f0fdf4', text: '#14532d' },
  { id: 'theme-ocean', name: 'Ocean 深海', desc: '深蓝神秘 · 科技感', colors: ['#38bdf8', '#06b6d4'], bg: '#0c4a6e', text: '#e0f2fe' },
  { id: 'theme-sakura', name: 'Sakura 樱花', desc: '粉色浪漫 · 温柔甜美', colors: ['#ec4899', '#f9a8d4'], bg: '#fdf2f8', text: '#831843' },
  { id: 'theme-mono', name: 'Mono 极简', desc: '黑白灰 · 经典克制', colors: ['#18181b', '#52525b'], bg: '#ffffff', text: '#18181b' },
  { id: 'theme-gold', name: 'Gold 黑金', desc: '金色奢华 · 高质感', colors: ['#fbbf24', '#f59e0b'], bg: '#0a0a0a', text: '#fafafa' },
  { id: 'theme-lavender', name: 'Lavender 薰衣草', desc: '淡紫色调 · 优雅', colors: ['#8b5cf6', '#c084fc'], bg: '#f5f3ff', text: '#2e1065' },
  { id: 'theme-sunset', name: 'Sunset 黄昏', desc: '粉橙渐变 · 热情', colors: ['#f43f5e', '#f59e0b'], bg: '#fff1f2', text: '#4c0519' },
  { id: 'theme-tech', name: 'Tech 科技', desc: '青色代码风 · 专业', colors: ['#22d3ee', '#60a5fa'], bg: '#011627', text: '#e6edf3' },
  { id: 'theme-mint', name: 'Mint 薄荷', desc: '清新薄荷绿 · 凉爽', colors: ['#10b981', '#6ee7b7'], bg: '#ecfdf5', text: '#064e3b' },
  { id: 'theme-royal', name: 'Royal 皇家', desc: '靛蓝金 · 典雅尊贵', colors: ['#6366f1', '#fbbf24'], bg: '#1e1b4b', text: '#e0e7ff' }
];

let currentTheme = 'theme-neon';
let products = [];

/* ========== 标签切换 ========== */
document.querySelectorAll('.nav-item').forEach((a) => {
  a.addEventListener('click', (e) => {
    e.preventDefault();
    const tab = a.dataset.tab;
    document.querySelectorAll('.nav-item').forEach((n) => n.classList.remove('active'));
    document.querySelectorAll('.admin-panel').forEach((p) => p.classList.remove('active'));
    a.classList.add('active');
    const panel = document.querySelector(`.admin-panel[data-panel="${tab}"]`);
    if (panel) panel.classList.add('active');
  });
});

/* ========== 主题渲染 ========== */
function renderThemes() {
  const grid = document.getElementById('themes-grid');
  grid.innerHTML = THEMES.map((t) => {
    const [c1, c2] = t.colors;
    const selected = t.id === currentTheme ? 'selected' : '';
    return `
      <div class="theme-card ${selected}" data-theme="${t.id}">
        <div class="theme-preview" style="background:${t.bg};">
          <div class="tp-hero" style="background:linear-gradient(135deg, ${c1}, ${c2});"></div>
          <div class="tp-bar" style="background:${t.bg};">
            <div class="tp-dot" style="background:${c1};"></div>
            <div class="tp-line" style="background:${c2};"></div>
          </div>
        </div>
        <div class="theme-info">
          <div class="theme-name">${t.name}</div>
          <div class="theme-desc">${t.desc}</div>
        </div>
      </div>
    `;
  }).join('');
  grid.querySelectorAll('.theme-card').forEach((card) => {
    card.addEventListener('click', () => {
      currentTheme = card.dataset.theme;
      renderThemes();
      updateThemeText();
    });
  });
}

function updateThemeText() {
  const t = THEMES.find((x) => x.id === currentTheme);
  document.getElementById('current-theme-text').textContent = t ? t.name : currentTheme;
}

document.getElementById('save-theme').addEventListener('click', async () => {
  const btn = document.getElementById('save-theme');
  const old = btn.textContent;
  btn.textContent = '保存中...';
  btn.disabled = true;
  try {
    const res = await fetch('/api/theme', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ theme: currentTheme })
    });
    if (res.ok) {
      btn.textContent = '✅ 已保存';
      setTimeout(() => { btn.textContent = old; btn.disabled = false; }, 1500);
    }
  } catch (e) {
    btn.textContent = '❌ 失败';
    setTimeout(() => { btn.textContent = old; btn.disabled = false; }, 1500);
  }
});

/* ========== 站点信息 ========== */
const siteForm = document.getElementById('site-form');
siteForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const msg = document.getElementById('site-msg');
  const data = Object.fromEntries(new FormData(siteForm));
  const btn = siteForm.querySelector('button[type="submit"]');
  btn.disabled = true; btn.textContent = '保存中...';
  try {
    const res = await fetch('/api/site', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (res.ok) {
      msg.textContent = '✅ 保存成功';
      msg.className = 'msg';
    } else {
      msg.textContent = '❌ 保存失败';
      msg.className = 'msg err';
    }
  } catch (err) {
    msg.textContent = '❌ ' + err.message;
    msg.className = 'msg err';
  } finally {
    btn.disabled = false; btn.textContent = '保存站点信息';
  }
});

/* ========== 产品管理 ========== */
function renderProductsTable() {
  const table = document.getElementById('products-table');
  const head = `
    <div class="p-row head">
      <div>图片</div>
      <div>名称</div>
      <div class="hide-m">分类</div>
      <div class="hide-m">价格</div>
      <div>精选</div>
      <div>操作</div>
    </div>
  `;
  const rows = products.map((p) => `
    <div class="p-row">
      <div>
        ${p.image
          ? `<img class="p-img" src="${escapeAttr(p.image)}" />`
          : `<div class="p-img" style="display:flex;align-items:center;justify-content:center;font-size:18px;">📦</div>`
        }
      </div>
      <div>
        <div class="p-name">${escapeHtml(p.name || '未命名')}</div>
        <div class="p-meta">${escapeHtml(p.subtitle || '')} · ${escapeHtml(p.version || '')}</div>
      </div>
      <div class="hide-m">${escapeHtml(p.category || '—')}</div>
      <div class="hide-m">${escapeHtml(p.price || '—')}</div>
      <div>${p.highlight ? '<span class="p-badge hot">🔥 精选</span>' : '<span class="p-badge">普通</span>'}</div>
      <div style="display:flex;gap:6px;">
        <button class="p-btn" data-action="edit" data-id="${p.id}">编辑</button>
        <button class="p-btn danger" data-action="del" data-id="${p.id}">删除</button>
      </div>
    </div>
  `).join('');
  table.innerHTML = head + (products.length ? rows : '<div style="padding:40px;text-align:center;color:#6b7280;">暂无产品，点击右上角「+ 新增产品」开始添加。</div>');

  table.querySelectorAll('button[data-action]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      const action = btn.dataset.action;
      if (action === 'edit') openProductModal(id);
      else if (action === 'del') deleteProduct(id);
    });
  });
}

/* ========== 产品弹窗 ========== */
const modal = document.getElementById('product-modal');
const modalForm = document.getElementById('product-form');

document.getElementById('btn-new-product').addEventListener('click', () => openProductModal(null));
document.getElementById('modal-close').addEventListener('click', closeModal);
document.getElementById('modal-cancel').addEventListener('click', closeModal);
modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

function openProductModal(id) {
  modalForm.reset();
  modalForm.querySelector('[name="id"]').value = '';
  document.getElementById('modal-title').textContent = id ? '编辑产品' : '新增产品';
  if (id) {
    const p = products.find((x) => x.id === id);
    if (p) {
      modalForm.querySelector('[name="id"]').value = p.id;
      ['name', 'subtitle', 'version', 'category', 'price', 'releaseDate',
       'description', 'image', 'downloadUrl', 'officialUrl'].forEach((k) => {
        const el = modalForm.querySelector(`[name="${k}"]`);
        if (el) el.value = p[k] || '';
      });
      modalForm.querySelector('[name="features"]').value = (p.features || []).join('\n');
      modalForm.querySelector('[name="highlight"]').checked = !!p.highlight;
    }
  }
  modal.classList.add('open');
}
function closeModal() { modal.classList.remove('open'); }

modalForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const msg = document.getElementById('product-msg');
  const data = Object.fromEntries(new FormData(modalForm));
  const id = data.id;
  delete data.id;
  data.highlight = modalForm.querySelector('[name="highlight"]').checked;
  data.features = (data.features || '').split(/\r?\n/).map((s) => s.trim()).filter(Boolean);

  const btn = modalForm.querySelector('button[type="submit"]');
  btn.disabled = true;
  try {
    const url = id ? `/api/products/${id}` : '/api/products';
    const method = id ? 'PUT' : 'POST';
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (res.ok) {
      msg.textContent = '✅ 保存成功';
      msg.className = 'msg';
      await loadData();
      setTimeout(closeModal, 600);
    } else {
      msg.textContent = '❌ 保存失败';
      msg.className = 'msg err';
    }
  } catch (err) {
    msg.textContent = '❌ ' + err.message;
    msg.className = 'msg err';
  } finally {
    btn.disabled = false;
  }
});

async function deleteProduct(id) {
  if (!confirm('确定删除该产品吗？此操作不可撤销。')) return;
  try {
    const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
    if (res.ok) {
      products = products.filter((p) => p.id !== id);
      renderProductsTable();
    }
  } catch (err) {
    alert('删除失败：' + err.message);
  }
}

/* ========== 初始化 ========== */
async function loadData() {
  try {
    const data = await fetch('/api/data').then((r) => r.json());
    currentTheme = data.theme || 'theme-neon';
    products = data.products || [];

    const sf = document.getElementById('site-form');
    ['name', 'slogan', 'description', 'footerText', 'contactEmail'].forEach((k) => {
      const el = sf.querySelector(`[name="${k}"]`);
      if (el) el.value = data.site?.[k] || '';
    });

    renderThemes();
    updateThemeText();
    renderProductsTable();
  } catch (e) {
    alert('加载数据失败：' + e.message);
  }
}
loadData();

function escapeHtml(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}
function escapeAttr(s) { return escapeHtml(s); }
