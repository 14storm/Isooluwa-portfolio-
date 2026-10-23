/* Every image path below is resolved against the page's address at load time, so it still works after the address changes to /brands/<name> */
const ROOT = document.baseURI;
const abs = p => new URL(p, ROOT).href;

/* ===== EDIT ME: showcase images (local paths or full URLs, e.g. Unsplash links) ===== */
const GALLERY = [
  "images/ACQAD.jpg.jpeg",
  "images/AFFORDAVLE TYRES.jpg.jpeg",
  "images/ANSRD LABS 2.jpg.jpeg",
  "images/ANSRD LABS.jpg.jpeg",
  "images/FLEXIPAY.jpg.jpeg",
  "images/GRACE ABDUL.jpg.jpeg",
  "images/HAVES AGROFOOD.jpg.jpeg",
  "images/SHI.jpg.jpeg"
];

/* ===== EDIT ME: brands and their designs =====
   Clicking a matching row in Experience opens that brand's page.
   images = all design files for that brand, in the order they appear (files that don't exist yet are hidden).
   covers = optional: slider images that should open this brand but aren't repeated on its page. logo = shows in the brands carousel. */
const BRANDS = [
  { brand: "Affordable Tyres", info: "Social media campaign design", images: ["images/AFFORDAVLE TYRES.jpg.jpeg"], logo: "images/BRANDS LOGO/AFFORDABLE.png" },
  { brand: "Acqad", info: "Logo and brand identity", images: ["images/ACQAD.jpg.jpeg"], logo: "images/BRANDS LOGO/optimized/ACQAD.png" },
  { brand: "FlexiPay", info: "Social media campaign design", images: ["images/FLEXIPAY.jpg.jpeg"], logo: "images/BRANDS LOGO/FLEXIPAY.png" },
  {
    brand: "ANSRd Labs", info: "Brand identity, app icon and social content", covers: ["images/ANSRD LABS.jpg.jpeg", "images/ANSRD LABS 2.jpg.jpeg"],
    images: [
      "images/ANSRd Labs/ANSRD LABS.jpg",
      ...Array.from({ length: 31 }, (_, i) => "images/ANSRd Labs/Artboard " + (i + 1) + ".jpg"),
      "images/ANSRd Labs/Layer 13.png",
      "images/ANSRd Labs/LINKEDIN OPTIMISATION.png"
    ], logo: "images/BRANDS LOGO/optimized/ANSRD LABS .png"
  },
  { brand: "The Mint Circle", info: "Event and LinkedIn campaign flyers", images: ["images/GRACE ABDUL.jpg.jpeg"] },
  { brand: "Haves Agrofood and Fisheries", info: "Logo design", images: ["images/HAVES AGROFOOD.jpg.jpeg"], logo: "images/BRANDS LOGO/HAVESAGRO FOOD.png" },
  { brand: "Saint Hive International", info: "Logo design", images: ["images/SHI.jpg.jpeg"], logo: "images/BRANDS LOGO/SAINT HIVE.png" },
  { brand: "Dattego", info: "Brand design", images: [], logo: "images/BRANDS LOGO/DATTEGO.png" },
  { brand: "Seed of Mercy Foundation", info: "Brand design", images: [], logo: "images/BRANDS LOGO/SEED OF MERCY FOUNDATION.png" }
];
/* page address for each brand, e.g. brands/flexipay */
BRANDS.forEach(b => { b.slug = b.brand.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); });
(function () {
  const g = document.getElementById('gtrack');
  GALLERY.forEach((src, i) => {
    const t = document.createElement('div'); t.className = 'tile s' + (i % 3);
    const b = BRANDS.find(x => x.images.includes(src) || (x.covers || []).includes(src));
    const img = document.createElement('img');
    img.src = abs(src);
    img.alt = b ? b.brand + ' design' : 'Selected design work';
    img.loading = 'lazy';
    t.append(img);
    t.querySelector('img').onerror = function () { this.remove() };
    g.append(t);
  });
  [...g.children].forEach(tile => {
    const clone = tile.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    g.append(clone);
  });
})();
/* Scroll reveal */
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
}, { threshold: .15 });
document.querySelectorAll('.reveal').forEach((el, i) => { el.style.transitionDelay = (i % 4) * 70 + 'ms'; io.observe(el); });

/* Count-up stats */
const countIO = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target, end = +el.dataset.count, suf = el.dataset.suffix || '', t0 = performance.now(), dur = 1400;
    const tick = t => { const p = Math.min((t - t0) / dur, 1); el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))) + suf; if (p < 1) requestAnimationFrame(tick); };
    requestAnimationFrame(tick); countIO.unobserve(el);
  });
}, { threshold: .6 });
document.querySelectorAll('[data-count]').forEach(el => countIO.observe(el));

/* Footer marquee: duplicate the name so the loop never shows a gap on wide screens */
const track = document.getElementById('track');
const first = track.firstElementChild;
let guard = 0;
while (track.scrollWidth < window.innerWidth * 2 && guard++ < 6) {
  track.append(first.cloneNode(true));
}
if (track.children.length % 2) track.append(first.cloneNode(true));
document.querySelectorAll('.fill .track').forEach(t => t.innerHTML = track.innerHTML); /* glass copies stay in sync */

/* Figma-style cursor: wanders over the photo, follows the mouse on hover */
(function () {
  const stage = document.getElementById('stage'), cur = document.getElementById('cursor');
  if (!stage || !cur) return;
  let w = stage.clientWidth, h = stage.clientHeight;
  addEventListener('resize', () => { w = stage.clientWidth; h = stage.clientHeight });
  let x = w * .6, y = h * .4, tx = x, ty = y, hover = false;
  const place = () => { cur.style.transform = 'translate(' + x + 'px,' + y + 'px)' };
  place();
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const wander = () => { if (hover) return; const a = Math.random() * Math.PI * 2, r = Math.sqrt(Math.random()) * w * .26; tx = w / 2 + Math.cos(a) * r; ty = h / 2 + Math.sin(a) * r; };
  setInterval(wander, 2300); wander();
  stage.addEventListener('pointermove', e => { if (e.pointerType === 'touch') return; const b = stage.getBoundingClientRect(); hover = true; tx = e.clientX - b.left; ty = e.clientY - b.top; });
  stage.addEventListener('pointerleave', () => { hover = false; wander(); });
  (function loop() { const k = hover ? .2 : .03; x += (tx - x) * k; y += (ty - y) * k; place(); requestAnimationFrame(loop); })();
})();

/* Footer name: shadow follows the cursor (name keeps scrolling) */
(function () {
  const m = document.querySelector('.marquee'), sh = m;
  if (!m || !sh) return;
  let x = 0, y = 0, tx = 0, ty = 0;
  m.addEventListener('pointerenter', e => { const b = m.getBoundingClientRect(); x = tx = e.clientX - b.left; y = ty = e.clientY - b.top; });
  m.addEventListener('pointermove', e => { const b = m.getBoundingClientRect(); tx = e.clientX - b.left; ty = e.clientY - b.top; });
  (function loop() { x += (tx - x) * .15; y += (ty - y) * .15; sh.style.setProperty('--mx', x + 'px'); sh.style.setProperty('--my', y + 'px'); sh.style.setProperty('--dx', ((x / (m.clientWidth || 1)) - .5) * 8 + 'px'); requestAnimationFrame(loop); })();
})();

/* Hamburger menu: opens on hover (desktop mouse), tap/click or keyboard (everywhere); closes on Esc, outside click or link click */
(function () {
  const m = document.getElementById('menu'); if (!m) return;
  const b = m.querySelector('.burger');
  const hoverMode = matchMedia('(hover: hover) and (min-width: 761px)');
  const set = o => { m.classList.toggle('open', o); b.setAttribute('aria-expanded', o); document.documentElement.classList.toggle('menu-open', o); };
  m.addEventListener('pointerenter', e => { if (hoverMode.matches && e.pointerType === 'mouse') set(true); });
  m.addEventListener('pointerleave', e => { if (hoverMode.matches && e.pointerType === 'mouse') set(false); });
  b.addEventListener('click', e => { e.stopPropagation(); if (hoverMode.matches && e.detail > 0) return; set(!m.classList.contains('open')); });
  m.querySelectorAll('a').forEach(a => a.addEventListener('click', () => set(false)));
  document.addEventListener('click', e => { if (!m.contains(e.target)) set(false); });
  addEventListener('keydown', e => { if (e.key === 'Escape') set(false); });
})();

/* Brand view: thumbnails of every design for a brand, each opens large in a viewer with next / previous */
(function () {
  const wv = document.getElementById('wv'), grid = document.getElementById('wv-grid');
  const lb = document.getElementById('lb');
  if (!wv || !grid || !lb) return;
  const title = document.getElementById('wv-title'), info = document.getElementById('wv-info');
  const lbImg = lb.querySelector('img'), root = document.documentElement;
  let opener = null, set = [], idx = 0;

  const showLB = i => { idx = (i + set.length) % set.length; lbImg.src = set[idx]; };
  const openLB = (thumbs, btn) => {
    set = thumbs.map(t => t.querySelector('img').src);
    lb.classList.toggle('single', set.length < 2);
    showLB(thumbs.indexOf(btn));
    lb.classList.add('open'); lb.setAttribute('aria-hidden', 'false'); root.classList.add('lb-open');
    lb.querySelector('.lb-close').focus();
  };
  const closeLB = () => {
    lb.classList.remove('open'); lb.setAttribute('aria-hidden', 'true'); root.classList.remove('lb-open');
  };
  const siteTitle = document.title;
  const slugFromPath = () => { const m = location.pathname.match(/\/brands\/([^\/]+)\/?$/); return m ? decodeURIComponent(m[1]) : null; };
  const hideWV = () => {
    wv.classList.remove('open'); wv.setAttribute('aria-hidden', 'true'); root.classList.remove('wv-open');
    document.title = siteTitle;
    if (opener) opener.focus({ preventScroll: true });
  };
  /* closing = going back one step in history, so the address and the back button stay in sync */
  const closeWV = () => {
    if (history.state && history.state.wv) { history.back(); return; }
    hideWV();
    if (slugFromPath()) { try { history.replaceState({}, '', './'); } catch (e) { } }
  };

  window.openWork = (key, push = true) => {
    const k = String(key).toLowerCase();
    const b = BRANDS.find(x => x.brand.toLowerCase() === k) || BRANDS.find(x => x.images.includes(key) || (x.covers || []).includes(key));
    if (!b) return false;
    opener = document.activeElement;
    title.textContent = b.brand; info.textContent = b.info || '';
    grid.innerHTML = '';
    b.images.forEach((src, i) => {
      const btn = document.createElement('button'); btn.type = 'button'; btn.className = 'wv-thumb'; btn.hidden = true;
      btn.setAttribute('aria-label', 'View ' + b.brand + ' design ' + (i + 1));
      btn.style.animationDelay = (i * 70) + 'ms';
      const img = new Image(); img.alt = b.brand + ' design'; img.decoding = 'async';
      img.onload = () => { btn.hidden = false; };
      img.onerror = () => { console.warn('Design not found (404). The browser looked for:', abs(src)); btn.remove(); };
      img.src = abs(src);
      btn.append(img);
      btn.addEventListener('click', () => openLB([...grid.querySelectorAll('.wv-thumb')], btn));
      grid.append(btn);
    });
    if (!b.images.length) { const p = document.createElement('p'); p.className = 'wv-empty'; p.textContent = 'Designs for this brand are coming soon.'; grid.append(p); }
    wv.scrollTop = 0;
    wv.classList.add('open'); wv.setAttribute('aria-hidden', 'false'); root.classList.add('wv-open');
    wv.querySelector('.wv-close').focus({ preventScroll: true });
    document.title = b.brand + ' \u2014 ' + siteTitle;
    if (push) { try { history.pushState({ wv: 1, slug: b.slug }, '', 'brands/' + b.slug); } catch (e) { } }
    return true;
  };

  wv.querySelector('.wv-close').addEventListener('click', closeWV);
  lb.querySelector('.lb-close').addEventListener('click', closeLB);
  lb.querySelector('.lb-prev').addEventListener('click', () => showLB(idx - 1));
  lb.querySelector('.lb-next').addEventListener('click', () => showLB(idx + 1));
  lb.addEventListener('click', e => { if (e.target === lb) closeLB(); });
  addEventListener('keydown', e => {
    if (lb.classList.contains('open')) {
      if (e.key === 'Escape') closeLB();
      else if (e.key === 'ArrowLeft') showLB(idx - 1);
      else if (e.key === 'ArrowRight') showLB(idx + 1);
    } else if (wv.classList.contains('open') && e.key === 'Escape') closeWV();
  });

  /* routing: back / forward buttons and direct links like /brands/flexipay */
  const openBySlug = s => { const b = BRANDS.find(x => x.slug === s); return b ? window.openWork(b.brand, false) : false; };
  addEventListener('popstate', () => {
    closeLB();
    const s = slugFromPath();
    if (s) openBySlug(s); else if (wv.classList.contains('open')) hideWV();
  });
  openBySlug(slugFromPath());

  /* Experience rows for brands that have designs become clickable too */
  document.querySelectorAll('.exp .co').forEach(co => {
    const name = co.textContent.trim().toLowerCase();
    if (!BRANDS.some(b => b.brand.toLowerCase() === name)) return;
    const li = co.closest('li'); li.classList.add('has-work');
    li.tabIndex = 0; li.setAttribute('role', 'button'); li.setAttribute('aria-label', 'View ' + co.textContent.trim() + ' designs');
    const go = () => window.openWork(co.textContent.trim());
    li.addEventListener('click', go);
    li.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); } });
  });
})();

/* Brands I've worked with: monochrome logo carousel */
(function () {
  const g = document.getElementById('brand-track'); if (!g) return;
  BRANDS.filter(b => b.logo).forEach(b => {
    const item = document.createElement('div'); item.className = 'bcell';
    if (b.slug === 'flexipay' || b.slug === 'ansrd-labs') item.classList.add('light-logo');
    const img = new Image(); img.alt = b.brand; img.loading = 'lazy'; img.decoding = 'async'; img.fetchPriority = 'low';
    img.onerror = () => { console.warn('Brand logo not found (404). The browser looked for:', abs(b.logo)); item.remove(); };
    img.src = abs(b.logo);
    item.append(img);
    g.append(item);
  });
  [...g.children].forEach(item => {
    const clone = item.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    const img = clone.querySelector('img');
    img.alt = '';
    img.onerror = () => { console.warn('Brand logo not found (404). The browser looked for:', img.src); clone.remove(); };
    g.append(clone);
  });
})();