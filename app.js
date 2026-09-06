// ─── SmokeBag Portfolio App ──────────────────────────

// ─── Lightbox ────────────────────────────────────────
const lightbox      = document.getElementById('lightbox');
const lightboxImg   = document.getElementById('lightboxImg');
const lightboxBrand = document.getElementById('lightboxBrand');
const lightboxLink  = document.getElementById('lightboxLink');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxPrev  = document.getElementById('lightboxPrev');
const lightboxNext  = document.getElementById('lightboxNext');

let currentLightboxIndex = -1;
let lightboxBrands = [];

function openLightbox(brand) {
  currentLightboxIndex = lightboxBrands.indexOf(brand);
  lightboxImg.src = brand.rawUrl || brand.minUrl;
  lightboxImg.alt = brand.name;
  lightboxBrand.textContent = brand.name;
  lightboxLink.href = `https://drive.google.com/drive/folders/${brand.folderId}`;
  lightbox.classList.add('open');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  updateLightboxNav();
}

function updateLightboxNav() {
  if (lightboxPrev) lightboxPrev.style.display = currentLightboxIndex > 0 ? '' : 'none';
  if (lightboxNext) lightboxNext.style.display = currentLightboxIndex < lightboxBrands.length - 1 ? '' : 'none';
}

function lightboxGo(dir) {
  const next = currentLightboxIndex + dir;
  if (next < 0 || next >= lightboxBrands.length) return;
  lightboxImg.style.opacity = '0';
  setTimeout(() => {
    openLightbox(lightboxBrands[next]);
    lightboxImg.style.opacity = '1';
  }, 150);
}

function closeLightbox() {
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  lightboxImg.src = '';
  currentLightboxIndex = -1;
}

lightboxClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
if (lightboxPrev) lightboxPrev.addEventListener('click', e => { e.stopPropagation(); lightboxGo(-1); });
if (lightboxNext) lightboxNext.addEventListener('click', e => { e.stopPropagation(); lightboxGo(1); });
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeLightbox();
  if (lightbox.classList.contains('open')) {
    if (e.key === 'ArrowLeft') lightboxGo(-1);
    if (e.key === 'ArrowRight') lightboxGo(1);
  }
});

// ─── Scatter sizes ───────────────────────────────────
const SIZES = [
  { w: 68,  h: 85  },
  { w: 88,  h: 110 },
  { w: 112, h: 140 },
  { w: 140, h: 175 },
  { w: 172, h: 215 },
  { w: 205, h: 256 },
];

// ─── Build scatter hero (tall canvas — new images appear on scroll) ──
let _scatterRAF = 0;

function buildScatter() {
  const hero   = document.getElementById('hero');
  const canvas = document.getElementById('scatterCanvas');
  if (!canvas || !hero) return;

  const vw = window.innerWidth  || document.documentElement.clientWidth  || 1280;
  const vh = window.innerHeight || document.documentElement.clientHeight || 720;

  if (_scatterRAF) cancelAnimationFrame(_scatterRAF);
  canvas.innerHTML = '';

  const MULT    = 3.5;
  const canvasH = vh * MULT;
  hero.style.height   = canvasH + 'px';
  canvas.style.height = canvasH + 'px';

  const brandsWithImages = brands.filter(b => b.minUrl);
  lightboxBrands = brandsWithImages;

  const cols = 7;
  const rows = Math.ceil(brandsWithImages.length / cols);
  const sizeWeights = [0.18, 0.24, 0.22, 0.18, 0.12, 0.06];

  const imageObjects = [];

  brandsWithImages.forEach((brand, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);

    const gx = (col / (cols - 1)) * (vw * 1.15) - vw * 0.075;
    const gy = (row / (rows - 1)) * (canvasH * 1.1) - canvasH * 0.05;

    const rx = (Math.random() - 0.5) * vw * 0.18;
    const ry = (Math.random() - 0.5) * canvasH / rows * 0.7;
    const bx = gx + rx;
    const by = gy + ry;

    let roll = Math.random(), sizeIdx = 0, acc = 0;
    for (let j = 0; j < sizeWeights.length; j++) {
      acc += sizeWeights[j];
      if (roll < acc) { sizeIdx = j; break; }
    }
    const size = SIZES[sizeIdx];

    const oscAmpX  = 7 + Math.random() * 11;
    const oscAmpY  = 5 + Math.random() * 9;
    const oscFreq  = 0.00045 + Math.random() * 0.00055;
    const oscPhase = Math.random() * Math.PI * 2;
    const depth    = 0.015 + Math.random() * 0.135;

    // Wrapper for hover tooltip
    const wrap = document.createElement('div');
    wrap.className = 'scatter-wrap';
    wrap.style.width  = size.w + 'px';
    wrap.style.height = size.h + 'px';

    const img = document.createElement('img');
    img.className = 'scatter-item';
    img.src = brand.minUrl;
    img.alt = brand.name;
    img.loading = 'eager';
    img.style.width  = size.w + 'px';
    img.style.height = size.h + 'px';

    const tooltip = document.createElement('span');
    tooltip.className = 'scatter-tooltip';
    tooltip.textContent = brand.name;

    wrap.appendChild(img);
    wrap.appendChild(tooltip);
    wrap.addEventListener('click', () => openLightbox(brand));
    canvas.appendChild(wrap);

    imageObjects.push({
      el: wrap, img,
      bx, by, depth,
      oscAmpX, oscAmpY, oscFreq, oscPhase,
      w: size.w, h: size.h,
    });
  });

  // ─── Set initial positions immediately ────────────
  for (const obj of imageObjects) {
    const fx = obj.bx - obj.w / 2;
    const fy = obj.by - obj.h / 2;
    obj.el.style.transform = `translate(${fx}px, ${fy}px)`;
  }

  // ─── Staggered reveal ─────────────────────────────
  imageObjects.forEach((obj, i) => {
    const delay = 80 + Math.random() * 600;
    setTimeout(() => obj.el.classList.add('scatter-wrap--visible'), delay);
  });

  // ─── Scroll-reveal for off-screen items ───────────
  if ('IntersectionObserver' in window && vh > 0) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target._revealed) {
          entry.target._revealed = true;
          const delay = Math.random() * 300;
          setTimeout(() => entry.target.classList.add('scatter-wrap--visible'), delay);
        }
      });
    }, { rootMargin: '100px', threshold: 0.01 });

    imageObjects.forEach(obj => {
      if (!obj.el.classList.contains('scatter-wrap--visible')) {
        revealObserver.observe(obj.el);
      }
    });
  }

  // ─── Respect reduced motion ────────────────────────
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  // ─── Mouse parallax state ─────────────────────────
  let mouseX = 0, mouseY = 0;
  let targetX = 0, targetY = 0;

  window.addEventListener('mousemove', e => {
    const w = window.innerWidth || 1;
    const h = window.innerHeight || 1;
    targetX = (e.clientX / w - 0.5);
    targetY = (e.clientY / h - 0.5);
  });

  // ─── Animation loop (rAF with setInterval fallback) ──
  const t0 = performance.now();

  function tick(now) {
    if (typeof now !== 'number') now = performance.now();
    const elapsed = now - t0;

    mouseX += (targetX - mouseX) * 0.055;
    mouseY += (targetY - mouseY) * 0.055;

    for (const obj of imageObjects) {
      const ox = Math.sin(elapsed * obj.oscFreq + obj.oscPhase)        * obj.oscAmpX;
      const oy = Math.cos(elapsed * obj.oscFreq * 0.71 + obj.oscPhase) * obj.oscAmpY;

      const px = mouseX * obj.depth * 110;
      const py = mouseY * obj.depth * 110;

      const fx = obj.bx - obj.w / 2 + ox + px;
      const fy = obj.by - obj.h / 2 + oy + py;

      obj.el.style.transform = `translate(${fx}px, ${fy}px)`;
    }

    _scatterRAF = requestAnimationFrame(tick);
  }

  _scatterRAF = requestAnimationFrame(tick);

  // Fallback: if rAF doesn't fire (zero-viewport), use setInterval
  setTimeout(() => {
    if (imageObjects[0] && !imageObjects[0].el.style.transform.includes(',')) {
      setInterval(() => tick(performance.now()), 32);
    }
  }, 500);
}

// ─── Entrance animation for title ────────────────────
function animateEntrance() {
  const title = document.querySelector('.scatter-title');
  if (title) {
    setTimeout(() => title.classList.add('scatter-title--visible'), 200);
  }
}

// ─── Fixed title: fade out near end of hero ──────────
const scatterCenter = document.querySelector('.scatter-center');
const heroEl = document.getElementById('hero');

if (scatterCenter && heroEl) {
  window.addEventListener('scroll', () => {
    const heroH = heroEl.offsetHeight || heroEl.clientHeight;
    const vh = window.innerHeight || 720;
    const fadeStart = heroH - vh * 1.5;
    const fadeEnd = heroH - vh;
    if (fadeEnd <= fadeStart) return;
    const progress = Math.max(0, Math.min(1, (window.scrollY - fadeStart) / (fadeEnd - fadeStart)));
    scatterCenter.style.opacity = 1 - progress;
  }, { passive: true });
}

// ─── Init ────────────────────────────────────────────
function init() {
  buildScatter();
  animateEntrance();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Rebuild on resize (debounced)
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(buildScatter, 300);
});
