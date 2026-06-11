/* =============================================
   RENTEASE — APP JAVASCRIPT (TOTALMENTE INTEGRADO)
   ============================================= */

import { Auth, Items } from './supabase.js';
// Variável global para armazenar os itens vindos do banco de dados (ajuda os filtros e modais)
let cachedItems = [];
let visibleCount = 8;
let currentFilter = 'all';
let currentSlide = 0;
let toastTimeout;

// ---- LOADER ----
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) loader.classList.add('hidden');
    startCounters();
  }, 1900);
});

// ---- NAVBAR SCROLL ----
const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  });
}

// ---- HAMBURGER ----
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
  });
}

function closeMobileMenu() {
  if (hamburger && mobileMenu) {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
  }
}

// ---- HERO CANVAS — FLOATING PARTICLES ----
(function initCanvas() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const emojis = ['📷', '🔧', '⛺', '🚴', '🎉', '🏡', '🔩', '🚁', '🛶', '📽️', '🎸', '⚽'];
  let W, H, particles = [];

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', () => { resize(); });

  class Particle {
    constructor() { this.reset(true); }
    reset(init) {
      this.x = Math.random() * W;
      this.y = init ? Math.random() * H : H + 40;
      this.emoji = emojis[Math.floor(Math.random() * emojis.length)];
      this.size = 16 + Math.random() * 20;
      this.speedY = 0.2 + Math.random() * 0.5;
      this.speedX = (Math.random() - 0.5) * 0.4;
      this.alpha = 0.06 + Math.random() * 0.12;
      this.rot = Math.random() * Math.PI * 2;
      this.rotSpeed = (Math.random() - 0.5) * 0.01;
    }
    update() {
      this.y -= this.speedY;
      this.x += this.speedX;
      this.rot += this.rotSpeed;
      if (this.y < -40) this.reset(false);
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = this.alpha;
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rot);
      ctx.font = `${this.size}px serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(this.emoji, 0, 0);
      ctx.restore();
    }
  }

  for (let i = 0; i < 30; i++) particles.push(new Particle());

  function animate() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animate);
  }
  animate();
})();

// ---- SEARCH SUGGESTIONS ----
const suggestions = [
  { icon: '📷', text: 'Câmera fotográfica profissional' },
  { icon: '🔧', text: 'Furadeira de impacto' },
  { icon: '⛺', text: 'Barraca de camping' },
  { icon: '🚴', text: 'Bicicleta mountain bike' },
  { icon: '🎉', text: 'Churrasqueira para festas' },
  { icon: '🚁', text: 'Drone com câmera' },
  { icon: '📽️', text: 'Projetor 4K para eventos' },
  { icon: '🛶', text: 'Kayak inflável' },
  { icon: '🎸', text: 'Guitarra elétrica' },
  { icon: '📻', text: 'Caixa de som bluetooth' },
];

const searchInput = document.getElementById('heroSearch');
const suggestionsBox = document.getElementById('searchSuggestions');

if (searchInput && suggestionsBox) {
  searchInput.addEventListener('input', () => {
    const val = searchInput.value.toLowerCase();
    if (!val) { suggestionsBox.classList.remove('open'); return; }
    const filtered = suggestions.filter(s => s.text.toLowerCase().includes(val));
    if (!filtered.length) { suggestionsBox.classList.remove('open'); return; }
    suggestionsBox.innerHTML = filtered.slice(0, 5).map(s =>
      `<div class="suggestion-item" onclick="selectSuggestion('${s.text}')">
        <span>${s.icon}</span><span>${s.text}</span>
      </div>`
    ).join('');
    suggestionsBox.add('open');
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.hero-search')) suggestionsBox.classList.remove('open');
  });
}

window.selectSuggestion = function (text) {
  if (searchInput) searchInput.value = text;
  if (suggestionsBox) suggestionsBox.classList.remove('open');
};

window.handleSearch = function () {
  const val = searchInput ? searchInput.value.trim() : '';
  if (val) {
    showToast(`Searching for "${val}"... 🔍`);
    const featuredSec = document.getElementById('featured');
    if (featuredSec) featuredSec.scrollIntoView({ behavior: 'smooth' });
  }
};

if (searchInput) {
  searchInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') window.handleSearch(); });
}

// ---- FILTER PILLS & TABS ----
document.querySelectorAll('.filter-pill').forEach(pill => {
  pill.addEventListener('click', () => {
    document.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
    pill.classList.add('active');
    filterItems(pill.dataset.filter);
  });
});

document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    filterItems(btn.dataset.tab);
  });
});

function filterItems(filter) {
  currentFilter = filter;
  // Sincroniza estados visuais entre Abas e Pills se necessário
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === filter);
  });
  renderItems();
}

// ---- RENDER ITEMS (INTEGRADO COM SUPABASE E FILTROS) ----
async function renderItems() {
  const container = document.getElementById('featured-grid');
  if (!container) return;

  try {
    // Busca dados se a cache estiver vazia (evita requisições repetidas pesadas)
    if (cachedItems.length === 0) {
      cachedItems = await Items.browse({});
    }

    // Aplica o filtro de categoria selecionado na UI
    let filteredItems = cachedItems;
    if (currentFilter !== 'all') {
      filteredItems = cachedItems.filter(item => item.category_slug === currentFilter);
    }

    // Corta a lista com base no botão "Load More"
    const displayedItems = filteredItems.slice(0, visibleCount);

    if (displayedItems.length === 0) {
      container.innerHTML = `
        <p class="no-items" style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 3rem 0;">
          No items found for this category. 🚀
        </p>`;
      return;
    }

    container.innerHTML = '';

    const categoryStyles = {
      'technology': { emoji: '📷', bg: 'linear-gradient(135deg,#e0e7ff 0%,#c7d2fe 100%)' },
      'tools': { emoji: '🔩', bg: 'linear-gradient(135deg,#fef3c7 0%,#fde68a 100%)' },
      'adventure': { emoji: '⛺', bg: 'linear-gradient(135deg,#d1fae5 0%,#a7f3d0 100%)' },
      'sports': { emoji: '⚽', bg: 'linear-gradient(135deg,#fee2e2 0%,#fca5a5 100%)' },
      'events': { emoji: '🎈', bg: 'linear-gradient(135deg,#fae8ff 0%,#f5d0fe 100%)' },
      'home-garden': { emoji: '🏡', bg: 'linear-gradient(135deg,#ffedf5 0%,#fbcfe8 100%)' }
    };

    displayedItems.forEach(item => {
      const style = categoryStyles[item.category_slug] || { emoji: '📦', bg: 'linear-gradient(135deg,#f3f4f6 0%,#e5e7eb 100%)' };

      const hasPhoto = item.photos && item.photos.length > 0 && item.photos[0] !== '';
      const imgContent = hasPhoto
        ? `<img src="${item.photos[0]}" alt="${item.title}" style="width:100%; height:100%; object-fit:cover;" />`
        : `<span class="item-emoji">${style.emoji}</span>`;

      const card = document.createElement('div');
      card.className = 'item-card reveal-up'; // Aplica o teu efeito de Scroll Reveal

      card.innerHTML = `
        <div class="item-img-container" style="background: ${style.bg}">
          ${imgContent}
          ${item.owner_top_host ? '<span class="card-badge">TOP HOST</span>' : ''}
          <button class="btn-fav" onclick="window.toggleFav(event, this)">🤍</button>
        </div>
        <div class="item-body" onclick="window.openItemModal('${item.id}')">
          <div class="item-meta">
            <span class="item-cat">${item.category_name || 'Item'}</span>
            <span class="item-rating">★ ${Number(item.owner_rating || 5.0).toFixed(1)}</span>
          </div>
          <h3 class="item-title">${item.title}</h3>
          <p class="item-loc">📍 ${item.location || 'Community'}</p>
          <div class="item-footer">
            <span class="item-price"><strong>$${item.daily_price}</strong> / day</span>
            <button class="btn-rent" onclick="event.stopPropagation(); window.location.href='pages/item.html?id=${item.id}'">Rent</button>
          </div>
        </div>
      `;

      container.appendChild(card);
    });

    // Re-ativa listeners visuais nos cards criados dinamicamente
    initTilt();
    observeRevealEls();

  } catch (error) {
    console.error('Error rendering items from Supabase:', error);
  }
}

window.loadMore = function () {
  visibleCount += 4;
  renderItems();
  showToast('More products loaded! 📦');
};

window.toggleFav = function (e, btn) {
  e.stopPropagation();
  const isFav = btn.textContent === '❤️';
  btn.textContent = isFav ? '🤍' : '❤️';
  showToast(isFav ? 'Removed from favorites' : 'Added to favorites! ❤️');
};

// ---- ITEM DETAILS MODAL (INTEGRADO COM DADOS DINÂMICOS) ----
window.openItemModal = function (id) {
  const item = cachedItems.find(i => i.id === id || String(i.id) === String(id));
  if (!item) return;

  const categoryStyles = {
    'technology': { emoji: '📷', bg: 'linear-gradient(135deg,#e0e7ff 0%,#c7d2fe 100%)' },
    'tools': { emoji: '🔩', bg: 'linear-gradient(135deg,#fef3c7 0%,#fde68a 100%)' },
    'adventure': { emoji: '⛺', bg: 'linear-gradient(135deg,#d1fae5 0%,#a7f3d0 100%)' },
    'sports': { emoji: '⚽', bg: 'linear-gradient(135deg,#fee2e2 0%,#fca5a5 100%)' },
    'events': { emoji: '🎈', bg: 'linear-gradient(135deg,#fae8ff 0%,#f5d0fe 100%)' },
    'home-garden': { emoji: '🏡', bg: 'linear-gradient(135deg,#ffedf5 0%,#fbcfe8 100%)' }
  };
  const style = categoryStyles[item.category_slug] || { emoji: '📦', bg: '#f3f4f6' };

  document.getElementById('itemModalTitle').textContent = item.title;
  document.getElementById('itemModalBody').innerHTML = `
    <div class="item-modal-grid">
      <div class="item-modal-img" style="background:${style.bg}; display:flex; align-items:center; justify-content:center; font-size:4rem;">
        ${item.photos && item.photos[0] ? `<img src="${item.photos[0]}" style="width:100%; height:100%; object-fit:cover;" />` : style.emoji}
      </div>
      <div class="item-modal-info">
        <p class="item-category">${item.category_name}</p>
        <p class="item-modal-price">$${item.daily_price}<span> / day</span></p>
        <p class="item-rating" style="font-size:1rem">
          <span class="star">★</span> ${Number(item.owner_rating || 5.0).toFixed(1)}
        </p>
        <p class="item-location" style="font-size:.9rem">📍 ${item.location || 'Community'}</p>
        <p class="item-modal-desc">${item.description || 'No description provided.'}</p>
        <div class="item-modal-owner">
          <div class="owner-avatar" style="background: var(--primary); color: white; display:flex; align-items:center; justify-content:center; font-weight:bold;">
            ${item.owner_name ? item.owner_name.substring(0, 2).toUpperCase() : 'US'}
          </div>
          <div class="owner-info">
            <strong>${item.owner_name || 'Community Member'}</strong>
            <span>✓ Verified Owner ${item.owner_top_host ? '· Top Host' : ''}</span>
          </div>
        </div>
        <button class="btn-primary full" style="margin-top:12px" onclick="window.closeModal(); window.openModal('register')">
          Request Booking
        </button>
        <button class="btn-outline full" onclick="window.showToast('Chat will be available after creating an account 💬')">
          💬 Contact Owner
        </button>
      </div>
    </div>
  `;
  window.openModal('item');
};

// ---- GLOBAL MODAL CONTROLLERS ----
window.openModal = function (type) {
  const backdrop = document.getElementById('modalBackdrop');
  if (backdrop) backdrop.classList.add('open');
  document.body.classList.add('modal-open');

  const map = { login: 'loginModal', register: 'registerModal', list: 'listModal', item: 'itemModal' };
  if (map[type]) {
    const m = document.getElementById(map[type]);
    if (m) m.classList.add('open');
  }
};

window.closeModal = function () {
  const backdrop = document.getElementById('modalBackdrop');
  if (backdrop) backdrop.classList.remove('open');
  document.body.classList.remove('modal-open');
  document.querySelectorAll('.modal.open').forEach(m => m.classList.remove('open'));
};

window.switchModal = function (type) {
  document.querySelectorAll('.modal.open').forEach(m => m.classList.remove('open'));
  window.openModal(type);
};

document.addEventListener('keydown', (e) => { if (e.key === 'Escape') window.closeModal(); });

// ---- TOAST NOTIFICATION ----
window.showToast = function (msg) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toast.classList.remove('show'), 3500);
};

// ---- COUNTER ANIMATION ----
function animateCounter(el, target) {
  let start = 0;
  const duration = 1800;
  const startTime = performance.now();
  const ease = t => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;

  function update(now) {
    const elapsed = now - startTime;
    const t = Math.min(elapsed / duration, 1);
    const value = Math.floor(ease(t) * target);
    el.textContent = value >= 1000 ? (value / 1000).toFixed(1) + 'k' : value;
    if (t < 1) requestAnimationFrame(update);
    else el.textContent = target >= 1000 ? (target / 1000).toFixed(1) + 'k' : target;
  }
  requestAnimationFrame(update);
}

function startCounters() {
  document.querySelectorAll('[data-target]:not(.counter-cta)').forEach(el => {
    animateCounter(el, parseInt(el.dataset.target));
  });
}

let ctaCounterDone = false;
function startCtaCounter() {
  if (ctaCounterDone) return;
  ctaCounterDone = true;
  document.querySelectorAll('.counter-cta[data-target]').forEach(el => {
    animateCounter(el, parseInt(el.dataset.target));
  });
}

// ---- TESTIMONIALS SLIDER ----
const track = document.getElementById('testimonialsTrack');
const dotsContainer = document.getElementById('trackDots');
let totalSlides = 0;

function initTestimonialSlider() {
  if (!track || !dotsContainer) return;
  const cards = track.querySelectorAll('.testimonial-card');
  totalSlides = cards.length;
  dotsContainer.innerHTML = '';
  for (let i = 0; i < totalSlides; i++) {
    const dot = document.createElement('button');
    dot.className = 'track-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Slide ${i + 1}`);
    dot.addEventListener('click', () => goToSlide(i));
    dotsContainer.appendChild(dot);
  }
}

function getSlideWidth() {
  const card = track ? track.querySelector('.testimonial-card') : null;
  if (!card) return 0;
  return card.offsetWidth + 20;
}

function goToSlide(n) {
  if (!track) return;
  currentSlide = Math.max(0, Math.min(n, totalSlides - 1));
  track.style.transform = `translateX(-${currentSlide * getSlideWidth()}px)`;
  document.querySelectorAll('.track-dot').forEach((d, i) => d.classList.toggle('active', i === currentSlide));
}

if (track) {
  document.getElementById('trackPrev')?.addEventListener('click', () => goToSlide(currentSlide - 1));
  document.getElementById('trackNext')?.addEventListener('click', () => goToSlide(currentSlide + 1));

  let touchStartX = 0;
  track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) goToSlide(diff > 0 ? currentSlide + 1 : currentSlide - 1);
  });

  setInterval(() => {
    if (totalSlides > 0) {
      if (currentSlide < totalSlides - 1) goToSlide(currentSlide + 1);
      else goToSlide(0);
    }
  }, 5000);

  window.addEventListener('resize', () => goToSlide(currentSlide));
}

// ---- INTERSECTION OBSERVER — VISUAL REVEAL ----
const visualObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      visualObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

function observeRevealEls() {
  document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right').forEach(el => {
    visualObserver.observe(el);
  });
}

const ctaObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) startCtaCounter(); });
}, { threshold: 0.3 });
const ctaSection = document.getElementById('cta-section');
if (ctaSection) ctaObserver.observe(ctaSection);

// ---- 3D TILT EFFECT ----
function initTilt() {
  document.querySelectorAll('.item-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const rotX = (y - cy) / cy * -6;
      const rotY = (x - cx) / cx * 6;
      card.style.transform = `translateY(-6px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

// ---- MAP PINS ----
document.querySelectorAll('.map-pin').forEach(pin => {
  pin.addEventListener('mouseenter', () => {
    document.querySelectorAll('.map-pin').forEach(p => p.classList.remove('active'));
    pin.classList.add('active');
  });
});

// ---- SMOOTH SCROLL ----
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ---- TESTIMONIAL SLIDER ----
function initSlider() {
  const slider = document.querySelector('.testimonial-slider');
  const cards = document.querySelectorAll('.testimonial-card');
  if (!slider || cards.length === 0) return;
  
  let currentIndex = 0;
  setInterval(() => {
    currentIndex = (currentIndex + 1) % cards.length;
    slider.scrollTo({
      left: cards[currentIndex].offsetLeft,
      behavior: 'smooth'
    });
  }, 4000);
}

// ---- DOM READY & CREATION LISTENERS ----
document.addEventListener('DOMContentLoaded', () => {
  renderItems();
  initSlider(); // CORRIGIDO: Voltando ao nome original do teu arquivo!
  observeRevealEls();

  setTimeout(() => {
    observeRevealEls();
    initTilt();
  }, 400);

  // ========================================================
  // 1. ESCUTADOR DO FORMULÁRIO DE REGISTRO (SIGN UP)
  // ========================================================
  const registerSubmitBtn = document.getElementById('registerSubmitBtn');
  if (registerSubmitBtn) {
    registerSubmitBtn.addEventListener('click', async (e) => {
      e.preventDefault();

      const firstName = document.getElementById('registerFirstName').value.trim();
      const lastName = document.getElementById('registerLastName').value.trim();
      const email = document.getElementById('registerEmail').value.trim();
      const password = document.getElementById('registerPassword').value;
      const termsCheck = document.getElementById('termsCheck').checked;

      if (!firstName || !lastName || !email || !password) {
        window.showToast('Por favor, preencha todos os campos! ⚠️');
        return;
      }
      if (!termsCheck) {
        window.showToast('Você precisa aceitar os Termos de Uso e Privacidade! 📜');
        return;
      }

      try {
        registerSubmitBtn.innerText = 'Criando conta... ⏳';
        registerSubmitBtn.disabled = true;

        const fullName = `${firstName} ${lastName}`;
        await Auth.signUp(email, password, fullName);

        window.showToast('Conta criada! Verifique seu e-mail para confirmar. 🚀');
        window.closeModal();
      } catch (error) {
        window.showToast(`Erro no cadastro: ${error.message} ❌`);
      } finally {
        registerSubmitBtn.innerText = 'Criar conta';
        registerSubmitBtn.disabled = false;
      }
    });
  }

  // ========================================================
  // 2. ESCUTADOR DO FORMULÁRIO DE LOGIN (SIGN IN)
  // ========================================================
  const loginSubmitBtn = document.getElementById('loginSubmitBtn');
  if (loginSubmitBtn) {
    loginSubmitBtn.addEventListener('click', async (e) => {
      e.preventDefault();

      const email = document.getElementById('loginEmail').value.trim();
      const password = document.getElementById('loginPassword').value;

      if (!email || !password) {
        window.showToast('Por favor, insira o e-mail e a senha! ⚠️');
        return;
      }

      try {
        loginSubmitBtn.innerText = 'Entrando... ⏳';
        loginSubmitBtn.disabled = true;

        await Auth.signIn(email, password);

        window.showToast('Bem-vindo de volta! 👋');
        window.closeModal();

        cachedItems = [];
        if (typeof renderItems === 'function') renderItems();
      } catch (error) {
        window.showToast(`Falha no login: ${error.message} ❌`);
      } finally {
        loginSubmitBtn.innerText = 'Entrar';
        loginSubmitBtn.disabled = false;
      }
    });
  }

  // ========================================================
  // 3. ESCUTADOR DA CRIAÇÃO DE ANÚNCIOS (LIST ITEM)
  // ========================================================
  const itemSubmitBtn = document.getElementById('itemSubmitBtn');
  if (itemSubmitBtn) {
    itemSubmitBtn.addEventListener('click', async (e) => {
      e.preventDefault();

      const title = document.getElementById('itemTitle').value.trim();
      const categoryValue = document.getElementById('itemCategory').value;
      const description = document.getElementById('itemDescription').value.trim();
      const price = parseFloat(document.getElementById('itemPrice').value);

      if (!title || !categoryValue || !description || isNaN(price)) {
        window.showToast('Por favor, preencha todos os dados do item! ⚠️');
        return;
      }

      const categoryMapping = {
        'tech': 1,
        'tools': 2,
        'outdoor': 3,
        'sports': 4,
        'events': 5,
        'home': 6
      };

      const categoryId = categoryMapping[categoryValue] || 1;

      try {
        itemSubmitBtn.innerText = 'Publicando item... ⏳';
        itemSubmitBtn.disabled = true;

        await Items.create({
          title: title,
          description: description,
          daily_price: price,
          category_id: categoryId,
          location: 'São Paulo, SP',
          photos: ['']
        });

        window.showToast('Item publicado com sucesso! 💎');
        window.closeModal();

        document.getElementById('itemTitle').value = '';
        document.getElementById('itemDescription').value = '';
        document.getElementById('itemPrice').value = '';

        cachedItems = [];
        if (typeof renderItems === 'function') renderItems();
      } catch (error) {
        window.showToast(`Erro ao publicar: ${error.message} ❌`);
      } finally {
        itemSubmitBtn.innerText = 'Publicar item';
        itemSubmitBtn.disabled = false;
      }
    });
  }
});