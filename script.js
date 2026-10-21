/* ===== EDIT ME: showcase images (local paths or full URLs, e.g. Unsplash links) ===== */
const GALLERY = [
  "images/work-1.jpg", "images/work-2.jpg", "images/work-3.jpg", "images/work-4.jpg",
  "images/work-5.jpg", "images/work-6.jpg", "images/work-7.jpg", "images/work-8.jpg"
];
(function () {
  const g = document.getElementById('gtrack');
  for (let r = 0; r < 2; r++) GALLERY.forEach((src, i) => {
    const t = document.createElement('div'); t.className = 'tile s' + (i % 3);
    if (r) t.setAttribute('aria-hidden', 'true');
    t.innerHTML = '<img src="' + src + '" alt="" loading="lazy">';
    t.querySelector('img').onerror = function () { this.remove() };
    g.append(t);
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
  const m = document.querySelector('.marquee'), sh = document.getElementById('shadow');
  if (!m || !sh) return;
  let x = 0, y = 0, tx = 0, ty = 0;
  m.addEventListener('pointerenter', e => { const b = m.getBoundingClientRect(); x = tx = e.clientX - b.left; y = ty = e.clientY - b.top; });
  m.addEventListener('pointermove', e => { const b = m.getBoundingClientRect(); tx = e.clientX - b.left; ty = e.clientY - b.top; });
  (function loop() { x += (tx - x) * .15; y += (ty - y) * .15; sh.style.setProperty('--mx', x + 'px'); sh.style.setProperty('--my', y + 'px'); requestAnimationFrame(loop); })();
})();

/* ===== EDIT ME: brands you've worked with =====
   slug = icon name from simpleicons.org (loaded from their free CDN)
   logo = path to your own file instead (use a light/white logo, e.g. "images/brands/client.svg") */
const BRANDS = [
  { name: "Spotify", slug: "spotify" },
  { name: "Airbnb", slug: "airbnb" },
  { name: "Notion", slug: "notion" },
  { name: "Shopify", slug: "shopify" },
  { name: "Stripe", slug: "stripe" },
  { name: "Dropbox", slug: "dropbox" },
  { name: "Figma", slug: "figma" },
  { name: "GitHub", slug: "github" }
];
(function () {
  const t = document.getElementById('btrack'); if (!t) return;
  for (let r = 0; r < 4; r++) BRANDS.forEach(b => {
    const d = document.createElement('div'); d.className = 'brand'; if (r) d.setAttribute('aria-hidden', 'true');
    const src = b.logo || ('https://cdn.simpleicons.org/' + b.slug + '/f2f2f2');
    d.innerHTML = '<img src="' + src + '" alt="" loading="lazy"><span></span>';
    d.querySelector('span').textContent = b.name;
    d.querySelector('img').onerror = function () { this.remove() };
    t.append(d);
  });
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