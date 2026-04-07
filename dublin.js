/* ════════════════════════════════════════════════════
   DUBLIN IRISH PUB — dublin.js  v2.0
════════════════════════════════════════════════════ */

const WA_NUMBER = "573015307754";

// ─── TAB NAVIGATION ───────────────────────────────
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

    const navBottom = nav.getBoundingClientRect().bottom + window.scrollY;
    window.scrollTo({ top: navBottom - 1, behavior: 'smooth' });

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
document.getElementById('scrollCta')?.addEventListener('click', () => {
  const navEl = document.getElementById('menuNav');
  if (navEl) {
    const y = navEl.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: y, behavior: 'smooth' });
  }
});

// ─── CARD ENTRANCE ANIMATION ──────────────────────
const cardObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      cardObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

function observeCards() {
  document.querySelectorAll('.drink-card, .food-card, .beer-row, .licor-row').forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(18px)';
    el.style.transition = `opacity .4s ease ${i * 0.03}s, transform .4s ease ${i * 0.03}s`;
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

// ─── STICKY NAV SHADOW ────────────────────────────
const heroEl = document.querySelector('.hero');
if (heroEl) {
  new IntersectionObserver(([e]) => {
    nav.style.boxShadow = e.isIntersecting ? 'none' : '0 4px 24px rgba(0,0,0,0.6)';
  }).observe(heroEl);
}

// ════════════════════════════════════════════════════
// PRODUCT MODAL
// ════════════════════════════════════════════════════
let pendingWaMsg = '';

function openProduct(card) {
  // Prevent double-firing from nested onclick
  if (card.closest('.food-grid, .cards-grid') === card) return;

  const icon  = card.querySelector('.card-icon, .food-emoji')?.textContent?.trim() || '🍽️';
  const name  = card.querySelector('.card-name, .food-name')?.textContent?.trim() || '';
  const desc  = card.querySelector('.card-desc, .food-desc')?.textContent?.trim() || '';
  const badge = card.querySelector('.card-ribbon, .food-badge')?.textContent?.trim() || '';

  // Price
  let price = '';
  const priceTag = card.querySelector('.card-price-tag');
  if (priceTag) {
    const amt = priceTag.querySelector('.amount')?.textContent?.trim() || '';
    price = `$${amt}`;
  } else {
    price = card.querySelector('.food-price')?.textContent?.trim() || '';
  }

  // Flavors
  const flavorsEls = card.querySelectorAll('.card-flavors span');
  const flavors = Array.from(flavorsEls).map(s => s.textContent.trim());

  // Populate modal
  document.getElementById('pmIcon').textContent  = icon;
  document.getElementById('pmName').textContent  = name;
  document.getElementById('pmDesc').textContent  = desc;
  document.getElementById('pmBadge').textContent = badge;
  document.getElementById('pmPrice').textContent = price;

  const flavorsDiv = document.getElementById('pmFlavors');
  flavorsDiv.innerHTML = flavors.map(f => `<span>${f}</span>`).join('');

  // WA message
  pendingWaMsg = buildProductMsg(name, price, desc);

  document.getElementById('pmWaBtn').onclick = () => {
    closeProductDirect();
    openWaModal(`Pedido: ${name} ${price}`);
  };

  document.getElementById('productOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function buildProductMsg(name, price, desc) {
  return [
    `¡Hola! 🍀 Estoy en *Dublin Irish Pub* y me interesa:`,
    ``,
    `🍹 *${name}*`,
    `💰 Precio: *${price}*`,
    ``,
    `📋 _${desc}_`,
    ``,
    `¿Está disponible? ¡Los espero esta noche! ☘️`,
  ].join('\n');
}

function closeProduct(e) {
  if (e.target === document.getElementById('productOverlay')) closeProductDirect();
}
function closeProductDirect() {
  document.getElementById('productOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

// ════════════════════════════════════════════════════
// WA NAME MODAL
// ════════════════════════════════════════════════════
function openWaModal(contextTitle) {
  document.getElementById('waMsgTitle').textContent = contextTitle || 'Hacer reserva';
  document.getElementById('waNameInput').value = '';
  document.getElementById('waOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
  setTimeout(() => document.getElementById('waNameInput').focus(), 120);
}

function confirmWaName(skip) {
  const rawName = document.getElementById('waNameInput').value.trim();
  const name    = (!skip && rawName) ? rawName : null;

  let msg = pendingWaMsg;
  if (name) {
    msg = msg
      .replace('¡Hola! 🍀', `¡Hola! 🍀 Soy *${name}*`)
      .replace('¡Hola! Quiero hacer una reserva', `¡Hola! Soy *${name}* y quiero hacer una reserva`);
    if (!msg.includes(name)) msg = `Mi nombre es *${name}*.\n\n` + msg;
  }

  closeWaModalDirect();
  window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
  pendingWaMsg = '';
}

function closeWaModal(e) {
  if (e.target === document.getElementById('waOverlay')) closeWaModalDirect();
}
function closeWaModalDirect() {
  document.getElementById('waOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

// ─── FAB + RESERVA BUTTONS ─────────────────────────
document.getElementById('fabWa')?.addEventListener('click', e => {
  e.preventDefault();
  pendingWaMsg = buildReservaMsg();
  openWaModal('Hacer una reserva ☘️');
});

document.querySelector('.reserva-btn')?.addEventListener('click', e => {
  e.preventDefault();
  pendingWaMsg = buildReservaMsg();
  openWaModal('Hacer una reserva ☘️');
});

document.querySelectorAll('.footer-link.wa-link').forEach(btn => {
  btn.addEventListener('click', e => {
    e.preventDefault();
    pendingWaMsg = buildReservaMsg();
    openWaModal('Hacer una reserva ☘️');
  });
});

function buildReservaMsg() {
  return [
    `¡Hola! Quiero hacer una reserva en *Dublin Irish Pub* 🍀`,
    ``,
    `📍 Calle 5 # 23-58 · Esquina B/Miraflores · Cali`,
    ``,
    `Por favor confirmarme:`,
    `• Disponibilidad de mesa`,
    `• Fecha y hora que necesito`,
    `• Número de personas`,
    ``,
    `¡Los espero esta noche! ☘️🥃`,
  ].join('\n');
}

// ─── ESC KEY ──────────────────────────────────────
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    closeProductDirect();
    closeWaModalDirect();
  }
});