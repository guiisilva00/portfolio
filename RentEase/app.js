/* =============================================
   RENTEASE — APP JAVASCRIPT
   ============================================= */

   import { Auth, Items, Categories } from './supabase.js';

// ---- DATA ----
const ITEMS = [
  { id:1, name:'Canon EOS R5 + 24-70mm', category:'tech', emoji:'📷', bg:'linear-gradient(135deg,#e0e7ff 0%,#c7d2fe 100%)', price:'R$120', location:'Vila Madalena, SP', rating:4.9, reviews:47, badge:'hot', owner:'Rodrigo M.', ownerAv:'#3B82F6', desc:'Câmera full-frame 45MP, gravação 8K RAW, com lente L-series 24-70mm f/2.8. Carregadores e 2 baterias extras inclusas.' },
  { id:2, name:'Furadeira Impacto Bosch 800W', category:'tools', emoji:'🔩', bg:'linear-gradient(135deg,#fef3c7 0%,#fde68a 100%)', price:'R$35', location:'Pinheiros, SP', rating:4.7, reviews:23, badge:'', owner:'Carlos S.', ownerAv:'#F59E0B', desc:'Furadeira de impacto profissional com maleta, jogo de brocas completo e 2 discos de corte. Ideal para obras.' },
  { id:3, name:'Kit Camping Completo (4 pes.)', category:'outdoor', emoji:'⛺', bg:'linear-gradient(135deg,#d1fae5 0%,#a7f3d0 100%)', price:'R$80', location:'Moema, SP', rating:5.0, reviews:18, badge:'new', owner:'Ana L.', ownerAv:'#10B981', desc:'Barraca Coleman 4 pessoas, 2 colchões infláveis, 2 sacos de dormir -5°C e lanternas. Para trilhas e festivais.' },
  { id:4, name:'Bicicleta Trek Marlin 7', category:'sports', emoji:'🚴', bg:'linear-gradient(135deg,#e0f2fe 0%,#bae6fd 100%)', price:'R$55', location:'Jardins, SP', rating:4.8, reviews:31, badge:'', owner:'João F.', ownerAv:'#8B5CF6', desc:'Bike MTB 29", suspensão dianteira, freios hidráulicos Shimano. Capacete e luvas inclusos. Excelente para trilhas.' },
  { id:5, name:'Projetor Epson 4K 3000 lm', category:'events', emoji:'📽️', bg:'linear-gradient(135deg,#fce7f3 0%,#fbcfe8 100%)', price:'R$95', location:'Itaim Bibi, SP', rating:4.6, reviews:12, badge:'', owner:'Patricia M.', ownerAv:'#EC4899', desc:'Projetor laser 4K UHD, 3000 lúmens, conectividade HDMI/WiFi. Tela 100" e tripé incluso. Para eventos e home cinema.' },
  { id:6, name:'DJI Mini 4 Pro Drone', category:'tech', emoji:'🚁', bg:'linear-gradient(135deg,#f3e8ff 0%,#e9d5ff 100%)', price:'R$150', location:'Brooklin, SP', rating:4.9, reviews:56, badge:'hot', owner:'Marcos V.', ownerAv:'#8B5CF6', desc:'Drone dobrável com câmera 4K/60fps, autonomia 34min, sensor de obstáculos omnidirecional. Fly More Combo.' },
  { id:7, name:'Kit Churrasco Premium 8 peças', category:'events', emoji:'🍖', bg:'linear-gradient(135deg,#fef9c3 0%,#fef08a 100%)', price:'R$45', location:'Santana, SP', rating:4.5, reviews:9, badge:'new', owner:'Roberto A.', ownerAv:'#EF4444', desc:'Churrasqueira inox 80cm, grelhas, suporte de espeto motorizado, espátulas e pegadores profissionais.' },
  { id:8, name:'Kayak Inflável Intex 2L', category:'outdoor', emoji:'🛶', bg:'linear-gradient(135deg,#cffafe 0%,#a5f3fc 100%)', price:'R$65', location:'Morumbi, SP', rating:4.7, reviews:14, badge:'', owner:'Sandra P.', ownerAv:'#06B6D4', desc:'Kayak inflável para 2 pessoas, max 150kg, com remos de alumínio e bomba manual. Pronto para rios calmos e lago.' },
];

let visibleCount = 8;
let currentFilter = 'all';
let currentSlide = 0;
let toastTimeout;

// ---- LOADER ----
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('hidden');
    startCounters();
  }, 1900);
});

// ---- NAVBAR SCROLL ----
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
});

// ---- HAMBURGER ----
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
});
function closeMobileMenu() {
  hamburger.classList.remove('open');
  mobileMenu.classList.remove('open');
}

// ---- HERO CANVAS — FLOATING PARTICLES ----
(function initCanvas() {
  const canvas = document.getElementById('heroCanvas');
  const ctx = canvas.getContext('2d');
  const emojis = ['📷','🔧','⛺','🚴','🎉','🏡','🔩','🚁','🛶','📽️','🎸','⚽'];
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
  { icon:'📷', text:'Câmera fotográfica profissional' },
  { icon:'🔧', text:'Furadeira de impacto' },
  { icon:'⛺', text:'Barraca de camping' },
  { icon:'🚴', text:'Bicicleta mountain bike' },
  { icon:'🎉', text:'Churrasqueira para festas' },
  { icon:'🚁', text:'Drone com câmera' },
  { icon:'📽️', text:'Projetor 4K para eventos' },
  { icon:'🛶', text:'Kayak inflável' },
  { icon:'🎸', text:'Guitarra elétrica' },
  { icon:'📻', text:'Caixa de som bluetooth' },
];

const searchInput = document.getElementById('heroSearch');
const suggestionsBox = document.getElementById('searchSuggestions');

searchInput.addEventListener('input', () => {
  const val = searchInput.value.toLowerCase();
  if (!val) { suggestionsBox.classList.remove('open'); return; }
  const filtered = suggestions.filter(s => s.text.toLowerCase().includes(val));
  if (!filtered.length) { suggestionsBox.classList.remove('open'); return; }
  suggestionsBox.innerHTML = filtered.slice(0,5).map(s =>
    `<div class="suggestion-item" onclick="selectSuggestion('${s.text}')">
      <span>${s.icon}</span><span>${s.text}</span>
    </div>`
  ).join('');
  suggestionsBox.classList.add('open');
});

document.addEventListener('click', (e) => {
  if (!e.target.closest('.hero-search')) suggestionsBox.classList.remove('open');
});

function selectSuggestion(text) {
  searchInput.value = text;
  suggestionsBox.classList.remove('open');
}

function handleSearch() {
  const val = searchInput.value.trim();
  if (val) {
    showToast(`Buscando por "${val}"... 🔍`);
    document.getElementById('featured').scrollIntoView({ behavior: 'smooth' });
  }
}

searchInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') handleSearch(); });

// ---- FILTER PILLS ----
document.querySelectorAll('.filter-pill').forEach(pill => {
  pill.addEventListener('click', () => {
    document.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
    pill.classList.add('active');
    const f = pill.dataset.filter;
    filterItems(f);
  });
});

function filterItems(filter) {
  currentFilter = filter;
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === filter);
  });
  renderItems();
  document.getElementById('featured').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ---- TAB BTNS ----
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.tab;
    renderItems();
  });
});

// ---- RENDER ITEMS ----
async function renderItems() {
  const container = document.getElementById('featured-grid');
  if (!container) return;

  try {
    // 1. Busca os itens reais da View do Supabase (que já junta dados do item, dono e categoria)
    const items = await Items.browse({});

    // Se a base de dados estiver vazia, mostra uma mensagem amigável
    if (!items || items.length === 0) {
      container.innerHTML = `
        <p class="no-items" style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 3rem 0;">
          No items available for rent yet. Be the first to list one! 🚀
        </p>`;
      return;
    }

    container.innerHTML = '';

    const categoryStyles = {
      'technology': { emoji: '📷', bg: 'linear-gradient(135deg,#e0e7ff 0%,#c7d2fe 100%)' },
      'tools':      { emoji: '🔩', bg: 'linear-gradient(135deg,#fef3c7 0%,#fde68a 100%)' },
      'adventure':  { emoji: '⛺', bg: 'linear-gradient(135deg,#d1fae5 0%,#a7f3d0 100%)' },
      'sports':     { emoji: '⚽', bg: 'linear-gradient(135deg,#fee2e2 0%,#fca5a5 100%)' },
      'events':     { emoji: '🎈', bg: 'linear-gradient(135deg,#fae8ff 0%,#f5d0fe 100%)' },
      'home-garden':{ emoji: '🏡', bg: 'linear-gradient(135deg,#ffedf5 0%,#fbcfe8 100%)' }
    };

    items.forEach(item => {
      const style = categoryStyles[item.category_slug] || { emoji: '📦', bg: 'linear-gradient(135deg,#f3f4f6 0%,#e5e7eb 100%)' };
      
      const hasPhoto = item.photos && item.photos.length > 0 && item.photos[0] !== '';
      const imgContent = hasPhoto 
        ? `<img src="${item.photos[0]}" alt="${item.title}" style="width:100%; height:100%; object-fit:cover;" />`
        : `<span class="item-emoji">${style.emoji}</span>`;

      const card = document.createElement('div');
      card.className = 'item-card reveal';
      
      card.innerHTML = `
        <div class="item-img-container" style="background: ${style.bg}">
          ${imgContent}
          ${item.owner_top_host ? '<span class="card-badge">TOP HOST</span>' : ''}
        </div>
        <div class="item-body">
          <div class="item-meta">
            <span class="item-cat">${item.category_name || 'Item'}</span>
            <span class="item-rating">★ ${Number(item.owner_rating || 5.0).toFixed(1)}</span>
          </div>
          <h3 class="item-title">${item.title}</h3>
          <p class="item-loc">📍 ${item.location || 'Community'}</p>
          <div class="item-footer">
            <span class="item-price"><strong>R$ ${item.daily_price}</strong> / day</span>
            <button class="btn-rent" onclick="window.location.href='pages/item.html?id=${item.id}'">Rent</button>
          </div>
        </div>
      `;
      
      container.appendChild(card);
    });

    initCard3DEffect();

  } catch (error) {
    console.error('Error rendering items from Supabase:', error);
  }
}

function getCatLabel(cat) {
  const labels = { tech:'Tecnologia', tools:'Ferramentas', outdoor:'Aventura', sports:'Esporte', events:'Eventos' };
  return labels[cat] || cat;
}

function loadMore() {
  visibleCount += 4;
  renderItems();
  showToast('Mais itens carregados! 📦');
}

function toggleFav(e, btn) {
  e.stopPropagation();
  const isFav = btn.textContent === '❤️';
  btn.textContent = isFav ? '🤍' : '❤️';
  showToast(isFav ? 'Removido dos favoritos' : 'Adicionado aos favoritos ❤️');
}

// ---- ITEM MODAL ----
function openItemModal(id) {
  const item = ITEMS.find(i => i.id === id);
  if (!item) return;
  document.getElementById('itemModalTitle').textContent = item.name;
  document.getElementById('itemModalBody').innerHTML = `
    <div class="item-modal-grid">
      <div class="item-modal-img" style="--bg:${item.bg}">${item.emoji}</div>
      <div class="item-modal-info">
        <p class="item-category">${getCatLabel(item.category)}</p>
        <p class="item-modal-price">${item.price}<span>/dia</span></p>
        <p class="item-rating" style="font-size:1rem">
          <span class="star">★</span> ${item.rating} <span class="reviews">(${item.reviews} avaliações)</span>
        </p>
        <p class="item-location" style="font-size:.9rem">📍 ${item.location}</p>
        <p class="item-modal-desc">${item.desc}</p>
        <div class="item-modal-owner">
          <div class="owner-avatar" style="--av:${item.ownerAv}">${item.owner.split(' ').map(n=>n[0]).join('')}</div>
          <div class="owner-info">
            <strong>${item.owner}</strong>
            <span>✓ Identidade verificada · Top Anfitrião</span>
          </div>
        </div>
        <button class="btn-primary full" style="margin-top:4px" onclick="closeModal();openModal('register')">
          Solicitar reserva
        </button>
        <button class="btn-outline full" onclick="showToast('Chat disponível após criar sua conta 💬')">
          💬 Contatar dono
        </button>
      </div>
    </div>
  `;
  openModal('item');
}

// ---- MODALS ----
function openModal(type) {
  document.getElementById('modalBackdrop').classList.add('open');
  document.body.classList.add('modal-open');
  const map = { login:'loginModal', register:'registerModal', list:'listModal', item:'itemModal' };
  if (map[type]) {
    document.getElementById(map[type]).classList.add('open');
  }
}
function closeModal() {
  document.getElementById('modalBackdrop').classList.remove('open');
  document.body.classList.remove('modal-open');
  document.querySelectorAll('.modal.open').forEach(m => m.classList.remove('open'));
}
function switchModal(type) {
  document.querySelectorAll('.modal.open').forEach(m => m.classList.remove('open'));
  openModal(type);
}
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

// ---- TOAST ----
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toast.classList.remove('show'), 3500);
}

// ---- COUNTER ANIMATION ----
function animateCounter(el, target, suffix='') {
  let start = 0;
  const duration = 1800;
  const startTime = performance.now();
  const ease = t => t < 0.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1;

  function update(now) {
    const elapsed = now - startTime;
    const t = Math.min(elapsed / duration, 1);
    const value = Math.floor(ease(t) * target);
    el.textContent = value >= 1000 ? (value/1000).toFixed(1)+'k' : value;
    if (t < 1) requestAnimationFrame(update);
    else el.textContent = target >= 1000 ? (target/1000).toFixed(1)+'k' : target;
  }
  requestAnimationFrame(update);
}

function startCounters() {
  document.querySelectorAll('[data-target]').forEach(el => {
    animateCounter(el, parseInt(el.dataset.target));
  });
}

// CTA counter (triggered on scroll)
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

function initSlider() {
  const cards = track.querySelectorAll('.testimonial-card');
  totalSlides = cards.length;
  dotsContainer.innerHTML = '';
  for (let i = 0; i < totalSlides; i++) {
    const dot = document.createElement('button');
    dot.className = 'track-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Slide ${i+1}`);
    dot.addEventListener('click', () => goToSlide(i));
    dotsContainer.appendChild(dot);
  }
  updateSlider();
}

function getSlideWidth() {
  const card = track.querySelector('.testimonial-card');
  if (!card) return 0;
  return card.offsetWidth + 20;
}

function updateSlider() {
  track.style.transform = `translateX(-${currentSlide * getSlideWidth()}px)`;
  document.querySelectorAll('.track-dot').forEach((d,i) => d.classList.toggle('active', i === currentSlide));
}

function goToSlide(n) {
  currentSlide = Math.max(0, Math.min(n, totalSlides - 1));
  updateSlider();
}

document.getElementById('trackPrev').addEventListener('click', () => goToSlide(currentSlide - 1));
document.getElementById('trackNext').addEventListener('click', () => goToSlide(currentSlide + 1));

// Touch/swipe
let touchStartX = 0;
track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
track.addEventListener('touchend', e => {
  const diff = touchStartX - e.changedTouches[0].clientX;
  if (Math.abs(diff) > 50) goToSlide(diff > 0 ? currentSlide + 1 : currentSlide - 1);
});

// Auto-play
setInterval(() => {
  if (currentSlide < totalSlides - 1) goToSlide(currentSlide + 1);
  else goToSlide(0);
}, 5000);

window.addEventListener('resize', updateSlider);

// ---- INTERSECTION OBSERVER — REVEAL ----
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

function observeRevealEls() {
  document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right').forEach(el => {
    revealObserver.observe(el);
  });
}

// CTA counter observer
const ctaObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) startCtaCounter(); });
}, { threshold: 0.3 });
const ctaSection = document.getElementById('cta-section');
if (ctaSection) ctaObserver.observe(ctaSection);

// ---- TILT EFFECT ON ITEM CARDS ----
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

// ---- MAP PIN ANIMATION ----
document.querySelectorAll('.map-pin').forEach(pin => {
  pin.addEventListener('mouseenter', () => {
    document.querySelectorAll('.map-pin').forEach(p => p.classList.remove('active'));
    pin.classList.add('active');
  });
});

// ---- SMOOTH SCROLL FOR NAV LINKS ----
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ---- INIT ----
document.addEventListener('DOMContentLoaded', () => {
  renderItems();
  initSlider();
  observeRevealEls();
  // Re-observe after render
  setTimeout(() => { observeRevealEls(); initTilt(); }, 200);
});

// Re-run tilt after tab switch
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => { setTimeout(initTilt, 100); });
});
