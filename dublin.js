/* ════════════════════════════════════════════════════
   DUBLIN IRISH PUB — dublin.js  v3.0 (ShadCN UI)
════════════════════════════════════════════════════ */

const WA_NUMBER = "573015307754";

// ─── TAB NAVIGATION & AUTO-SCROLL ─────────────────
const tabs     = document.querySelectorAll('.tab');
const sections = document.querySelectorAll('.menu-section');
const nav      = document.getElementById('menuNav');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const target = tab.dataset.section;

    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    sections.forEach(s => {
      s.classList.toggle('hidden', s.id !== target);
    });

    // Auto-scroll perfecto compensando la altura del sticky nav
    const targetSection = document.getElementById(target);
    if (targetSection) {
      const navHeight = nav.offsetHeight;
      // Get the top position of the section relative to the document
      const sectionTop = targetSection.getBoundingClientRect().top + window.pageYOffset;
      // Scroll exactly to the top of the section minus the nav height and a little padding
      window.scrollTo({ top: sectionTop - navHeight - 16, behavior: 'smooth' });
    }

    centerTab(tab);
    setTimeout(observeCards, 60);
  });
});

function centerTab(tab) {
  const inner = nav.querySelector('.nav-inner');
  const tabRect = tab.getBoundingClientRect();
  const navRect = inner.getBoundingClientRect();
  inner.scrollTo({
    left: inner.scrollLeft + (tabRect.left - navRect.left) - (navRect.width / 2) + (tabRect.width / 2),
    behavior: 'smooth'
  });
}

// ─── SCROLL CTA ──────────────────────────────────
const scrollCta = document.getElementById('scrollCta');
if (scrollCta) {
  scrollCta.addEventListener('click', () => {
    const navEl = document.getElementById('menuNav');
    if (navEl) {
      const y = navEl.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  });
}

// ─── CARD ENTRANCE ANIMATION (SHADCN SPRING) ──────
const cardObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('card-visible');
      cardObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.05, rootMargin: '0px 0px 40px 0px' });

function observeCards() {
  const cards = document.querySelectorAll('.drink-card, .food-card, .beer-row, .licor-row');
  cards.forEach((el, i) => {
    el.classList.remove('card-visible');
    const delay = Math.min(i, 12) * 0.05;
    el.style.transitionDelay = `${delay}s`;
    cardObserver.observe(el);
  });
}
observeCards();

// ─── SWIPE BETWEEN TABS ───────────────────────────
let touchStartX = 0, touchStartY = 0;
document.addEventListener('touchstart', e => {
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
}, { passive: true });
document.addEventListener('touchend', e => {
  const dx = e.changedTouches[0].clientX - touchStartX;
  const dy = Math.abs(e.changedTouches[0].clientY - touchStartY);
  if (Math.abs(dx) > 55 && dy < 45) {
    const arr = Array.from(tabs);
    const idx = arr.indexOf(document.querySelector('.tab.active'));
    if (dx < 0 && idx < arr.length - 1) arr[idx + 1].click();
    else if (dx > 0 && idx > 0)         arr[idx - 1].click();
  }
}, { passive: true });

// ════════════════════════════════════════════════════
// CENTERED PRODUCT MODAL
// ════════════════════════════════════════════════════
let currentProduct = null;

window.openProduct = function(card) {
  currentProduct = {
    name:  card.querySelector('.card-name, .food-name')?.textContent || '',
    desc:  card.querySelector('.card-desc, .food-desc')?.textContent || '',
    price: card.querySelector('.card-price-tag, .food-price')?.textContent || '',
    badge: card.querySelector('.card-ribbon, .food-badge')?.textContent || '',
    icon:  card.querySelector('.card-icon, .card-icon-wrap, .food-emoji')?.innerHTML || ''
  };

  document.getElementById('pmName').textContent  = currentProduct.name;
  document.getElementById('pmDesc').textContent  = currentProduct.desc;
  document.getElementById('pmPrice').textContent = currentProduct.price;
  document.getElementById('pmBadge').textContent = currentProduct.badge;
  
  // Usar innerHTML para pasar el icono de FontAwesome <i class="...">
  const iconContainer = document.getElementById('pmIcon');
  iconContainer.innerHTML = currentProduct.icon;

  document.getElementById('productOverlay').classList.add('active');
  document.body.style.overflow = 'hidden';
};

window.closeProductDirect = function() {
  document.getElementById('productOverlay').classList.remove('active');
  document.body.style.overflow = '';
};

window.closeProduct = function(e) {
  if (e.target.id === 'productOverlay') closeProductDirect();
};

document.getElementById('pmWaBtn')?.addEventListener('click', () => {
  const text = `Hola, quiero pedir/reservar: *${currentProduct.name}* (${currentProduct.price})`;
  const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;
  window.open(url, '_blank');
});