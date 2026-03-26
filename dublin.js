/* ════════════════════════════════════════════════════
   DUBLIN IRISH PUB — dublin.js
════════════════════════════════════════════════════ */

// ─── TAB NAVIGATION ───────────────────────────────
const tabs     = document.querySelectorAll('.tab');
const sections = document.querySelectorAll('.menu-section');
const nav      = document.getElementById('menuNav');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const target = tab.dataset.section;

    // Update tabs
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    // Update sections
    sections.forEach(s => {
      if (s.id === target) {
        s.classList.remove('hidden');
      } else {
        s.classList.add('hidden');
      }
    });

    // Scroll to just below the nav
    const navBottom = nav.getBoundingClientRect().bottom + window.scrollY;
    window.scrollTo({ top: navBottom - 1, behavior: 'smooth' });

    // Center active tab in nav
    centerTab(tab);
  });
});

function centerTab(tab) {
  const navRect = nav.getBoundingClientRect();
  const tabRect = tab.getBoundingClientRect();
  const scrollLeft = nav.scrollLeft + (tabRect.left - navRect.left) - (navRect.width / 2) + (tabRect.width / 2);
  nav.scrollTo({ left: scrollLeft, behavior: 'smooth' });
}

// ─── STICKY NAV — highlight on scroll ─────────────
const navObserver = new IntersectionObserver(
  ([entry]) => {
    nav.style.boxShadow = entry.isIntersecting
      ? 'none'
      : '0 4px 20px rgba(0,0,0,0.6)';
  },
  { rootMargin: '-62px 0px 0px 0px' }
);
const hero = document.querySelector('.hero');
if (hero) navObserver.observe(hero);

// ─── CARD ENTRANCE ANIMATION ON SCROLL ────────────
const cardObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      cardObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

function observeCards() {
  document.querySelectorAll('.drink-card, .food-card, .beer-row, .licor-row').forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = `opacity .4s ease ${i * 0.04}s, transform .4s ease ${i * 0.04}s`;
    cardObserver.observe(el);
  });
}
observeCards();

// Re-observe when tab changes
tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    setTimeout(observeCards, 50);
  });
});

// ─── TOUCH: swipe between tabs ────────────────────
let touchStartX = 0;
let touchStartY = 0;

document.addEventListener('touchstart', e => {
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
}, { passive: true });

document.addEventListener('touchend', e => {
  const dx = e.changedTouches[0].clientX - touchStartX;
  const dy = Math.abs(e.changedTouches[0].clientY - touchStartY);

  // Only horizontal swipes far enough, not vertical scrolls
  if (Math.abs(dx) > 60 && dy < 40) {
    const activeTab = document.querySelector('.tab.active');
    const tabArr    = Array.from(tabs);
    const idx       = tabArr.indexOf(activeTab);

    if (dx < 0 && idx < tabArr.length - 1) {
      tabArr[idx + 1].click(); // swipe left → next
    } else if (dx > 0 && idx > 0) {
      tabArr[idx - 1].click(); // swipe right → prev
    }
  }
}, { passive: true });