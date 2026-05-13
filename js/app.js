/* =====================================================
   WILDSPOOR — app.js
   Taal-toggle, bos-scatter, tellers, en interacties
   ===================================================== */

(function () {
  'use strict';

  /* ── Taal toggle ─────────────────────────────────── */
  const DEFAULT_LANG = 'nl';

  function setLang(lang) {
    document.body.classList.remove('lang-nl', 'lang-en');
    document.body.classList.add('lang-' + lang);
    const btn = document.querySelector('.lang-toggle');
    if (btn) btn.textContent = lang === 'nl' ? 'EN' : 'NL';
    localStorage.setItem('wildspoor-lang', lang);
  }

  function initLang() {
    const saved = localStorage.getItem('wildspoor-lang') || DEFAULT_LANG;
    setLang(saved);
    const btn = document.querySelector('.lang-toggle');
    if (btn) {
      btn.addEventListener('click', function () {
        const current = document.body.classList.contains('lang-nl') ? 'nl' : 'en';
        setLang(current === 'nl' ? 'en' : 'nl');
      });
    }
  }

  /* ── Bos-scatter: bladeren en bomen over de pagina ─ */
  // Transparante natuur-afbeeldingen van Wikimedia Commons
  const FOREST_IMAGES = [
    {
      src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Sweet_Fern_(PSF).png',
      minSize: 90,  maxSize: 220,  baseOpacity: 0.12
    },
    {
      src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Sonchus_oleraceus_leaf.png',
      minSize: 60,  maxSize: 160,  baseOpacity: 0.10
    },
    {
      src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Tree-256x256.png',
      minSize: 100, maxSize: 280,  baseOpacity: 0.07
    },
    {
      src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Tree.svg',
      minSize: 80,  maxSize: 200,  baseOpacity: 0.06
    },
    {
      // Witte klaver - transparante plant-PNG uit Wikimedia
      src: 'https://commons.wikimedia.org/wiki/Special:FilePath/White_clover_-_paramecij%27s_vegetation_base_texture_pack.png',
      minSize: 50,  maxSize: 140,  baseOpacity: 0.09
    }
  ];

  // Extra SVG-bladeren als data-URI (volledig transparant, altijd beschikbaar)
  const LEAF_SVGS = [
    // Eikenblad
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 120'%3E%3Cpath d='M50 10 C30 20 10 35 15 55 C20 75 35 90 50 110 C65 90 80 75 85 55 C90 35 70 20 50 10Z' fill='%234a7c28' opacity='0.7'/%3E%3Cline x1='50' y1='10' x2='50' y2='110' stroke='%233a5c18' stroke-width='1.5' opacity='0.5'/%3E%3Cline x1='50' y1='40' x2='30' y2='30' stroke='%233a5c18' stroke-width='1' opacity='0.4'/%3E%3Cline x1='50' y1='55' x2='25' y2='50' stroke='%233a5c18' stroke-width='1' opacity='0.4'/%3E%3Cline x1='50' y1='40' x2='70' y2='30' stroke='%233a5c18' stroke-width='1' opacity='0.4'/%3E%3Cline x1='50' y1='55' x2='75' y2='50' stroke='%233a5c18' stroke-width='1' opacity='0.4'/%3E%3C/svg%3E",
    // Esdoornblad
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'%3E%3Cpath d='M60 5 L70 35 L100 25 L80 50 L115 55 L85 70 L95 100 L60 80 L25 100 L35 70 L5 55 L40 50 L20 25 L50 35 Z' fill='%235a8a2c' opacity='0.65'/%3E%3Cline x1='60' y1='5' x2='60' y2='80' stroke='%233a5c18' stroke-width='1.5' opacity='0.4'/%3E%3C/svg%3E",
    // Lang smal blad
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 60 160'%3E%3Cellipse cx='30' cy='80' rx='25' ry='70' fill='%233a6020' opacity='0.6'/%3E%3Cline x1='30' y1='10' x2='30' y2='150' stroke='%232a4c14' stroke-width='1.5' opacity='0.5'/%3E%3Cline x1='30' y1='50' x2='10' y2='45' stroke='%232a4c14' stroke-width='1' opacity='0.35'/%3E%3Cline x1='30' y1='70' x2='8' y2='68' stroke='%232a4c14' stroke-width='1' opacity='0.35'/%3E%3Cline x1='30' y1='50' x2='50' y2='45' stroke='%232a4c14' stroke-width='1' opacity='0.35'/%3E%3Cline x1='30' y1='70' x2='52' y2='68' stroke='%232a4c14' stroke-width='1' opacity='0.35'/%3E%3C/svg%3E",
    // Klimop-achtig blad
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M50 5 C25 5 5 25 10 50 C15 70 30 88 50 95 C70 88 85 70 90 50 C95 25 75 5 50 5Z M50 5 C55 20 65 30 80 35 M50 5 C45 20 35 30 20 35' fill='%23486820' opacity='0.65' stroke='%23304c10' stroke-width='1' fill-rule='evenodd'/%3E%3C/svg%3E",
    // Takje met blaadjes
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 200'%3E%3Cline x1='60' y1='190' x2='60' y2='10' stroke='%233a2810' stroke-width='3' opacity='0.6'/%3E%3Cellipse cx='35' cy='50' rx='28' ry='18' fill='%234a7020' opacity='0.6' transform='rotate(-30 35 50)'/%3E%3Cellipse cx='85' cy='70' rx='28' ry='18' fill='%235a8030' opacity='0.6' transform='rotate(25 85 70)'/%3E%3Cellipse cx='30' cy='100' rx='26' ry='16' fill='%23406018' opacity='0.55' transform='rotate(-25 30 100)'/%3E%3Cellipse cx='88' cy='120' rx='26' ry='16' fill='%234a7020' opacity='0.55' transform='rotate(30 88 120)'/%3E%3Cellipse cx='40' cy='150' rx='24' ry='15' fill='%233a6018' opacity='0.5' transform='rotate(-20 40 150)'/%3E%3C/svg%3E",
    // Varenblaad
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 80 200'%3E%3Cline x1='40' y1='195' x2='40' y2='5' stroke='%23304010' stroke-width='2.5' opacity='0.6'/%3E%3Cpath d='M40 30 C25 22 10 25 8 35 C6 45 20 50 40 45' fill='%23507828' opacity='0.55'/%3E%3Cpath d='M40 30 C55 22 70 25 72 35 C74 45 60 50 40 45' fill='%23507828' opacity='0.55'/%3E%3Cpath d='M40 60 C22 50 5 54 3 65 C1 76 17 80 40 74' fill='%23487020' opacity='0.55'/%3E%3Cpath d='M40 60 C58 50 75 54 77 65 C79 76 63 80 40 74' fill='%23487020' opacity='0.55'/%3E%3Cpath d='M40 90 C20 78 2 83 1 95 C0 107 18 110 40 103' fill='%23406818' opacity='0.5'/%3E%3Cpath d='M40 90 C60 78 78 83 79 95 C80 107 62 110 40 103' fill='%23406818' opacity='0.5'/%3E%3Cpath d='M40 120 C22 107 5 112 4 124 C3 136 20 138 40 131' fill='%23386010' opacity='0.45'/%3E%3Cpath d='M40 120 C58 107 75 112 76 124 C77 136 60 138 40 131' fill='%23386010' opacity='0.45'/%3E%3C/svg%3E"
  ];

  function rnd(min, max) { return min + Math.random() * (max - min); }

  function createForestScatter() {
    const container = document.getElementById('forest-scatter');
    if (!container) return;

    // Zet body op position:relative zodat absolute positionering werkt
    document.body.style.position = 'relative';

    const totalH = Math.max(document.body.scrollHeight, window.innerHeight * 4);
    container.style.height = totalH + 'px';

    const COUNT_WIKI = 15;  // Wikimedia transparante afbeeldingen
    const COUNT_SVG  = 20;  // SVG-bladeren

    // Wikimedia-afbeeldingen
    for (let i = 0; i < COUNT_WIKI; i++) {
      const spec = FOREST_IMAGES[i % FOREST_IMAGES.length];
      const img  = new Image();
      img.src = spec.src;
      const size = rnd(spec.minSize, spec.maxSize);
      const opacity = spec.baseOpacity * rnd(0.5, 1.3);
      const x    = rnd(-5, 95);
      const y    = rnd(0, totalH - size);
      const rot  = rnd(0, 360);

      img.style.cssText = [
        'position:absolute',
        `left:${x}%`,
        `top:${y}px`,
        `width:${size}px`,
        `opacity:${Math.min(opacity, 0.22)}`,
        `transform:rotate(${rot}deg)`,
        'pointer-events:none',
        'user-select:none',
        'z-index:1',
        'filter:drop-shadow(0 3px 8px rgba(0,0,0,0.3))',
        'transition:none'
      ].join(';');

      img.alt = '';
      img.setAttribute('aria-hidden', 'true');
      container.appendChild(img);
    }

    // SVG-bladeren
    for (let i = 0; i < COUNT_SVG; i++) {
      const img  = new Image();
      img.src = LEAF_SVGS[i % LEAF_SVGS.length];
      const size = rnd(50, 180);
      const opacity = rnd(0.08, 0.22);
      const x    = rnd(-3, 97);
      const y    = rnd(0, totalH - size);
      const rot  = rnd(0, 360);

      img.style.cssText = [
        'position:absolute',
        `left:${x}%`,
        `top:${y}px`,
        `width:${size}px`,
        `opacity:${opacity}`,
        `transform:rotate(${rot}deg)`,
        'pointer-events:none',
        'user-select:none',
        'z-index:1'
      ].join(';');

      img.alt = '';
      img.setAttribute('aria-hidden', 'true');
      container.appendChild(img);
    }
  }

  // Vaste bomensilhouetten in de canopy-laag
  function createCanopy() {
    const canopy = document.getElementById('forest-canopy');
    if (!canopy) return;

    const treePositions = [
      { x: -3, y: -5, size: 180, opacity: 0.12, src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Tree-256x256.png' },
      { x: 88, y: -8, size: 220, opacity: 0.1,  src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Tree.svg' },
      { x: 45, y: -2, size: 150, opacity: 0.07, src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Tree-256x256.png' },
    ];

    treePositions.forEach(function(t) {
      const img = new Image();
      img.src = t.src;
      img.style.cssText = [
        'position:absolute',
        `left:${t.x}%`,
        `top:${t.y}%`,
        `width:${t.size}px`,
        `opacity:${t.opacity}`,
        'pointer-events:none',
        'user-select:none',
        'filter:drop-shadow(0 0 20px rgba(46,82,24,0.3))'
      ].join(';');
      img.alt = '';
      img.setAttribute('aria-hidden', 'true');
      canopy.appendChild(img);
    });
  }

  // Vallende bladeren animatie
  function createFallingLeaves() {
    const LEAF_COUNT = 8;
    for (let i = 0; i < LEAF_COUNT; i++) {
      const leaf = document.createElement('div');
      leaf.className = 'leaf-fall';
      const size    = rnd(18, 38);
      const svgIdx  = Math.floor(Math.random() * 4); // gebruik de eerste 4 bladvormen
      leaf.innerHTML = `<img src="${LEAF_SVGS[svgIdx]}" style="width:${size}px" alt="" aria-hidden="true">`;
      leaf.style.cssText = [
        `left:${rnd(0, 100)}vw`,
        `animation-duration:${rnd(8, 18)}s`,
        `animation-delay:${rnd(0, 12)}s`,
        `opacity:${rnd(0.3, 0.7)}`
      ].join(';');
      document.body.appendChild(leaf);
    }
  }

  /* ── Info cards interactie ───────────────────────── */
  function initInfoCards() {
    document.querySelectorAll('.info-card').forEach(function(card) {
      card.addEventListener('click', function(e) {
        if (e.target.classList.contains('info-card-close')) {
          card.classList.remove('open');
          return;
        }
        const wasOpen = card.classList.contains('open');
        // Sluit alle andere kaarten
        document.querySelectorAll('.info-card.open').forEach(function(c) {
          c.classList.remove('open');
        });
        if (!wasOpen) {
          card.classList.add('open');
          card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      });
    });
  }

  /* ── Teller ──────────────────────────────────────── */
  function initCounter() {
    const pageKey = window.location.pathname.split('/').pop().replace('.html', '') || 'index';
    const storageKey = 'wildspoor-personal-' + pageKey;
    const globalKey  = 'wildspoor-global-' + pageKey;

    const globalEl   = document.getElementById('global-count');
    const personalEl = document.getElementById('personal-count');
    const valEl      = document.getElementById('counter-val');
    const minBtn     = document.getElementById('counter-min');
    const plusBtn    = document.getElementById('counter-plus');
    const addBtn     = document.getElementById('counter-add');

    if (!globalEl && !valEl) return;

    let personal = parseInt(localStorage.getItem(storageKey) || '0', 10);
    let session  = 0;
    let global   = parseInt(localStorage.getItem(globalKey) || (globalEl ? globalEl.textContent : '0'), 10);

    function render() {
      if (personalEl) {
        personalEl.textContent = personal;
      }
      if (valEl) valEl.textContent = session;
    }

    if (minBtn) minBtn.addEventListener('click', function() { if (session > 0) { session--; render(); } });
    if (plusBtn) plusBtn.addEventListener('click', function() { session++; render(); });

    if (addBtn) addBtn.addEventListener('click', function() {
      if (session > 0) {
        personal += session;
        global   += session;
        localStorage.setItem(storageKey, personal);
        localStorage.setItem(globalKey, global);
        if (globalEl) globalEl.textContent = global;
        render();
        session = 0;
        render();
        addBtn.textContent = '✓ Toegevoegd!';
        setTimeout(function() { addBtn.textContent = addBtn.getAttribute('data-orig') || 'Toevoegen'; }, 2000);
      }
    });

    // Laad opgeslagen globale teller
    if (globalEl) {
      const stored = parseInt(localStorage.getItem(globalKey), 10);
      if (!isNaN(stored)) globalEl.textContent = stored;
    }

    render();
  }

  /* ── Foto upload ─────────────────────────────────── */
  function initPhotoUpload() {
    document.querySelectorAll('.photo-drop').forEach(function(drop) {
      const input = drop.querySelector('input[type="file"]');
      if (!input) return;
      drop.addEventListener('click', function() { input.click(); });
      drop.addEventListener('dragover', function(e) {
        e.preventDefault();
        drop.style.borderColor = 'var(--leaf)';
      });
      drop.addEventListener('dragleave', function() {
        drop.style.borderColor = '';
      });
      drop.addEventListener('drop', function(e) {
        e.preventDefault();
        drop.style.borderColor = '';
        const file = e.dataTransfer.files[0];
        if (file) showPhotoPreview(drop, file);
      });
      input.addEventListener('change', function() {
        if (input.files[0]) showPhotoPreview(drop, input.files[0]);
      });
    });
  }

  function showPhotoPreview(drop, file) {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = function(e) {
      drop.innerHTML = '<img src="' + e.target.result + '" style="width:100%;height:180px;object-fit:cover;border-radius:var(--radius)" alt="Jouw foto">';
    };
    reader.readAsDataURL(file);
  }

  /* ── Feedback popup ──────────────────────────────── */
  function initFeedbackPopup() {
    const popup = document.querySelector('.feedback-popup');
    if (!popup) return;
    const dismissed = localStorage.getItem('wildspoor-feedback-dismissed');
    if (!dismissed) {
      setTimeout(function() { popup.classList.add('visible'); }, 4000);
    }
    const closeBtn = popup.querySelector('.close-popup');
    if (closeBtn) closeBtn.addEventListener('click', function() {
      popup.classList.remove('visible');
      localStorage.setItem('wildspoor-feedback-dismissed', '1');
    });
  }

  /* ── Init ────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', function() {
    initLang();
    initInfoCards();
    initCounter();
    initPhotoUpload();
    initFeedbackPopup();

    // Forest effects - kort wachten tot de DOM volledig geladen is
    setTimeout(function() {
      createForestScatter();
      createCanopy();
      createFallingLeaves();
    }, 100);
  });

})();
