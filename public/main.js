(async function () {
  try {
    const data = await fetch('/api/data').then((r) => r.json());
    applyTheme(data.theme);
    renderSite(data.site);
    renderProducts(data.products || []);
  } catch (e) {
    console.error(e);
    document.body.innerHTML =
      '<div style="padding:40px;text-align:center;">加载数据失败，请确保服务已启动。</div>';
  }
})();

function applyTheme(theme) {
  document.body.className = theme || 'theme-neon';
}

function renderSite(site) {
  document.title = site.name;
  document.getElementById('nav-logo').textContent = site.name;
  document.getElementById('hero-title').textContent = site.name;
  document.getElementById('hero-slogan').textContent = site.slogan;
  document.getElementById('hero-desc').textContent = site.description;
  document.getElementById('footer-text').textContent = site.footerText;
  if (site.contactEmail) {
    const link = document.getElementById('nav-contact');
    if (link) link.href = 'mailto:' + site.contactEmail;
  }
}

function productCard(p) {
  const features = (p.features || [])
    .filter((f) => f && f.trim())
    .slice(0, 4)
    .map((f) => `<li>${escapeHtml(f)}</li>`)
    .join('');
  const highlight = p.highlight ? `<span class="highlight-badge">🔥 精选</span>` : '';
  const image = p.image
    ? `<img class="product-img" src="${escapeHtml(p.image)}" alt="${escapeHtml(p.name)}" onerror="this.style.display='none'" />`
    : `<div class="product-img" style="display:flex;align-items:center;justify-content:center;background:var(--grad);color:#fff;font-weight:700;font-size:22px;">${escapeHtml(p.name || 'Product')}</div>`;
  return `
    <div class="product-card">
      ${highlight}
      ${image}
      <div class="product-body">
        <div class="product-top">
          <span class="product-cat">${escapeHtml(p.category || '其他')}</span>
          <span class="product-price">${escapeHtml(p.price || '')}</span>
        </div>
        <div class="product-name">${escapeHtml(p.name || '未命名')}</div>
        <div class="product-subtitle">${escapeHtml(p.subtitle || '')}</div>
        <div class="product-version">${escapeHtml(p.version || '')}</div>
        <div class="product-desc">${escapeHtml(p.description || '')}</div>
        <ul class="product-features">${features}</ul>
        <div class="product-date">📅 发布时间：${escapeHtml(p.releaseDate || '')}</div>
        <div class="product-actions">
          ${p.downloadUrl ? `<a href="${escapeHtml(p.downloadUrl)}" target="_blank" class="btn">下载</a>` : ''}
          ${p.officialUrl ? `<a href="${escapeHtml(p.officialUrl)}" target="_blank" class="btn btn-outline">官网</a>` : ''}
        </div>
      </div>
    </div>
  `;
}

function renderProducts(list) {
  const allGrid = document.getElementById('products-grid');
  const featuredGrid = document.getElementById('featured-grid');
  const htmlAll = list.map(productCard).join('');
  allGrid.innerHTML = htmlAll || '<p style="text-align:center;color:var(--text-muted);">暂无产品</p>';
  const featured = list.filter((p) => p.highlight);
  featuredGrid.innerHTML =
    featured.length > 0
      ? featured.map(productCard).join('')
      : '<p style="text-align:center;color:var(--text-muted);grid-column:1/-1;">暂无精选产品</p>';
  if (featured.length === 0) {
    document.getElementById('featured').style.display = 'none';
  }
}

function escapeHtml(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
