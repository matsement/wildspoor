/* ═══════════════════════════════════════
   NATUURBUUR — shared app.js
═══════════════════════════════════════ */

/* ── Language toggle ─────────────────── */
function initLang() {
  const saved = localStorage.getItem('nb-lang') || 'nl';
  setLang(saved);
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => setLang(btn.dataset.lang));
  });
}

function setLang(lang) {
  document.body.className = document.body.className
    .replace(/lang-\w+/, '') + ' lang-' + lang;
  localStorage.setItem('nb-lang', lang);
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });
}

/* ── Celebration overlay ─────────────── */
function initCelebration(insect) {
  const overlay = document.getElementById('celebration');
  if (!overlay) return;

  // Mark this insect as found
  if (insect) {
    const now = new Date();
    const dateStr = now.toLocaleDateString('nl-NL', {day:'numeric', month:'short', year:'numeric'});
    localStorage.setItem('nb-found-' + insect, dateStr);
  }

  // Fire confetti
  createConfetti();

  // Dismiss handlers
  document.getElementById('btn-discover')?.addEventListener('click', dismissCelebration);
  document.getElementById('btn-discover-en')?.addEventListener('click', dismissCelebration);

  // Auto-dismiss after 6s
  setTimeout(() => {
    if (overlay && !overlay.classList.contains('hidden')) dismissCelebration();
  }, 6000);
}

function dismissCelebration() {
  const overlay = document.getElementById('celebration');
  if (!overlay) return;
  overlay.classList.add('hiding');
  setTimeout(() => overlay.classList.add('hidden'), 700);
}

function createConfetti() {
  const container = document.getElementById('confetti-container');
  if (!container) return;
  const colors = ['#5a9e2a','#7cc43a','#c4900c','#e5b84a','#d2e8c2','#2a4a14','#fff'];
  for (let i = 0; i < 70; i++) {
    const p = document.createElement('div');
    const size = Math.random() * 10 + 5;
    const delay = Math.random() * 1.5;
    const dur   = Math.random() * 2.5 + 2.5;
    p.className = 'confetti-piece';
    p.style.cssText = `
      width:${size}px; height:${size}px;
      background:${colors[Math.floor(Math.random() * colors.length)]};
      left:${Math.random() * 100}%;
      border-radius:${Math.random() > 0.5 ? '50%' : '2px'};
      animation-duration:${dur}s;
      animation-delay:${delay}s;
      opacity:0;
    `;
    container.appendChild(p);
    // Small hack: set opacity after paint to trigger animation
    requestAnimationFrame(() => { p.style.opacity = '1'; });
  }
}

/* ── Collection tracker ──────────────── */
const INSECTS = [
  { key: 'kever',             label: 'Loopkever',       labelEn: 'Ground Beetle', img: 'images/kever.png',            page: 'kever.html' },
  { key: 'vlinder',           label: 'Citroenvlinder',  labelEn: 'Brimstone',     img: 'images/vlinder.png',          page: 'vlinder.html' },
  { key: 'lieveheersbeestje', label: 'Lieveheersbeestje', labelEn: 'Ladybug',     img: 'images/lieveheersbeestje.png', page: 'lieveheersbeestje.html' },
];

function renderCollection(currentInsect) {
  const grid = document.getElementById('collection-grid');
  if (!grid) return;

  let foundCount = 0;
  grid.innerHTML = '';

  INSECTS.forEach(ins => {
    const foundDate = localStorage.getItem('nb-found-' + ins.key);
    const isCurrent = ins.key === currentInsect;
    const isFound   = !!foundDate || isCurrent;
    if (isFound) foundCount++;

    const item = document.createElement('div');
    item.className = 'collection-item' +
      (isCurrent ? ' current' : isFound ? ' found' : '');

    item.innerHTML = `
      ${isFound ? '<div class="found-badge">✓</div>' : ''}
      <img class="collection-insect-img"
           src="${ins.img}"
           alt="${ins.label}"
           onerror="this.style.opacity=0.15">
      <div class="collection-item-name nl-text">${ins.label}</div>
      <div class="collection-item-name en-text">${ins.labelEn}</div>
      <div class="collection-item-date">
        ${isCurrent
          ? '<span class="nl-text">Zojuist gevonden!</span><span class="en-text">Just found!</span>'
          : isFound
            ? foundDate
            : '<span class="nl-text">Nog niet gevonden</span><span class="en-text">Not found yet</span>'
        }
      </div>
    `;
    grid.appendChild(item);
  });

  // Progress
  const fill = document.getElementById('progress-fill');
  const label = document.getElementById('collection-count');
  if (fill)  fill.style.width = (foundCount / INSECTS.length * 100) + '%';
  if (label) {
    label.querySelector('.nl-text').textContent = foundCount + ' van ' + INSECTS.length + ' gevonden';
    label.querySelector('.en-text').textContent = foundCount + ' of ' + INSECTS.length + ' found';
  }
}

/* ── Explore accordion cards ─────────── */
function initAccordion() {
  document.querySelectorAll('.explore-card').forEach(card => {
    card.addEventListener('click', () => {
      const isOpen = card.classList.contains('open');
      document.querySelectorAll('.explore-card').forEach(c => c.classList.remove('open'));
      if (!isOpen) card.classList.add('open');
    });
  });
}

/* ── Community counter ───────────────── */
function initCounter(insectKey, baseCount) {
  const additions = parseInt(localStorage.getItem('nb-count-additions-' + insectKey) || '0');
  const minCount  = parseInt(localStorage.getItem('nb-count-min-' + insectKey) || baseCount);
  let   current   = Math.max(minCount, baseCount + additions);

  const display   = document.getElementById('counter-number');
  const personal  = document.getElementById('personal-count');
  const saveBtn   = document.getElementById('save-count-btn');
  const saveMsg   = document.getElementById('save-confirm');
  let   sessionAdded = 0;

  function updateDisplay() {
    if (display) {
      display.textContent = current;
      display.classList.remove('bump');
      void display.offsetWidth; // reflow
      display.classList.add('bump');
    }
    if (personal) {
      personal.querySelector('.count-num').textContent = sessionAdded;
    }
  }

  updateDisplay();

  document.getElementById('counter-add')?.addEventListener('click', () => {
    if (sessionAdded < 5) {
      sessionAdded++;
      current++;
      updateDisplay();
    }
  });

  document.getElementById('counter-sub')?.addEventListener('click', () => {
    if (current > minCount) {
      current--;
      if (sessionAdded > 0) sessionAdded--;
      updateDisplay();
    }
  });

  saveBtn?.addEventListener('click', () => {
    const newAdditions = additions + sessionAdded;
    localStorage.setItem('nb-count-additions-' + insectKey, newAdditions);
    localStorage.setItem('nb-count-min-' + insectKey, current);
    sessionAdded = 0;
    if (saveMsg) {
      saveMsg.textContent = document.body.classList.contains('lang-en')
        ? 'Saved! Thank you.' : 'Opgeslagen! Dankjewel.';
      setTimeout(() => { saveMsg.textContent = ''; }, 2500);
    }
  });
}

/* ── Photo timeline ──────────────────── */
function initPhotos(insectKey) {
  const addBtn      = document.getElementById('add-photo-btn');
  const uploadArea  = document.getElementById('photo-upload-area');
  const fileInput   = document.getElementById('photo-file-input');
  const preview     = document.getElementById('photo-preview-img');
  const nameInput   = document.getElementById('photo-name-input');
  const postBtn     = document.getElementById('photo-post-btn');
  const cancelBtn   = document.getElementById('photo-cancel-btn');
  const grid        = document.getElementById('photo-grid');

  let pendingB64 = null;

  // Load saved photos
  try {
    const saved = JSON.parse(localStorage.getItem('nb-photos-' + insectKey) || '[]');
    saved.forEach(p => prependPhoto(grid, p.src, p.name, p.date));
  } catch(e) {}

  addBtn?.addEventListener('click', () => {
    uploadArea.style.display = uploadArea.style.display === 'block' ? 'none' : 'block';
    if (!fileInput.files.length) fileInput.click();
  });

  fileInput?.addEventListener('change', () => {
    const file = fileInput.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => compressImage(e.target.result, b64 => {
      pendingB64 = b64;
      preview.src = b64;
      preview.style.display = 'block';
    });
    reader.readAsDataURL(file);
  });

  postBtn?.addEventListener('click', () => {
    if (!pendingB64) return;
    const name = nameInput.value.trim() || 'Anoniem';
    const date = new Date().toLocaleDateString('nl-NL', {day:'numeric', month:'short', year:'numeric'});
    prependPhoto(grid, pendingB64, name, date);
    try {
      const saved = JSON.parse(localStorage.getItem('nb-photos-' + insectKey) || '[]');
      saved.unshift({src: pendingB64, name, date});
      localStorage.setItem('nb-photos-' + insectKey, JSON.stringify(saved));
    } catch(e) {}
    uploadArea.style.display = 'none';
    preview.style.display = 'none';
    nameInput.value = '';
    pendingB64 = null;
    fileInput.value = '';
  });

  cancelBtn?.addEventListener('click', () => {
    uploadArea.style.display = 'none';
    preview.style.display = 'none';
    pendingB64 = null;
  });
}

function prependPhoto(grid, src, name, date) {
  if (!grid) return;
  const card = document.createElement('div');
  card.className = 'photo-card';
  card.innerHTML = `
    <img src="${src}" alt="foto">
    <div class="photo-card-meta">
      <div class="photo-card-name">${name}</div>
      <div class="photo-card-date">${date}</div>
    </div>
  `;
  grid.prepend(card);
}

function compressImage(base64, cb) {
  const img = new Image();
  img.onload = () => {
    const canvas = document.createElement('canvas');
    const scale  = Math.min(1, 600 / img.width);
    canvas.width  = img.width  * scale;
    canvas.height = img.height * scale;
    canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
    cb(canvas.toDataURL('image/jpeg', 0.6));
  };
  img.src = base64;
}

/* ── Sticky feedback toast ───────────── */
function initFeedbackToast() {
  const toast    = document.getElementById('feedback-toast');
  const dismissBtn = document.getElementById('toast-dismiss');
  const goBtn    = document.getElementById('toast-go');
  if (!toast) return;

  let shown = false;
  const dismissed = sessionStorage.getItem('nb-toast-dismissed');
  if (dismissed) return;

  window.addEventListener('scroll', () => {
    if (shown) return;
    const scrollPct = window.scrollY / (document.body.scrollHeight - window.innerHeight);
    if (scrollPct > 0.55) {
      shown = true;
      toast.classList.add('visible');
    }
  });

  dismissBtn?.addEventListener('click', () => {
    toast.classList.remove('visible');
    sessionStorage.setItem('nb-toast-dismissed', '1');
  });

  goBtn?.addEventListener('click', () => {
    toast.classList.remove('visible');
    document.getElementById('feedback-english')?.scrollIntoView({behavior:'smooth'});
    document.querySelector('.feedback-section')?.scrollIntoView({behavior:'smooth'});
  });
}

/* ── Init all ────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initLang();
  initAccordion();
  initFeedbackToast();
});
