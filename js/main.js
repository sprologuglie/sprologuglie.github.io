// ── FADE IN ON SCROLL ──
// Runs first and independently — a missing element elsewhere never blocks this
const fadeEls = document.querySelectorAll('.fade-in');
if (fadeEls.length) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });

  fadeEls.forEach(el => observer.observe(el));
}

/// ── Menu mobile overlay ───────────────────────────────────────
const mobileMenu  = document.getElementById('mobile-menu');
const menuToggle  = document.getElementById('menu-toggle');
const menuClose   = document.getElementById('menu-close');
const menuLinks   = mobileMenu.querySelectorAll('.menu-link');
 
// Stagger delay sui link (0.06s per ogni voce)
menuLinks.forEach(link => {
  const i = parseInt(link.dataset.index, 10);
  link.style.transitionDelay = `${0.08 + i * 0.07}s`;
});
 
function openMenu() {
  mobileMenu.classList.add('open');
  mobileMenu.setAttribute('aria-hidden', 'false');
  menuToggle.setAttribute('aria-expanded', 'true');
  menuToggle.classList.add('active');
  document.body.classList.add('menu-open');
  menuClose.focus();
}
 
function closeMenu() {
  mobileMenu.classList.remove('open');
  mobileMenu.setAttribute('aria-hidden', 'true');
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.classList.remove('active');
  document.body.classList.remove('menu-open');
  menuToggle.focus();
}
 
menuToggle.addEventListener('click', openMenu);
menuClose.addEventListener('click',  closeMenu);
 
// Chiudi cliccando un link interno
menuLinks.forEach(link => {
  link.addEventListener('click', () => setTimeout(closeMenu, 80));
});
 
// Chiudi con ESC
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && mobileMenu.classList.contains('open')) closeMenu();
});
 