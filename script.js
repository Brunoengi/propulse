const menuToggle = document.querySelector('[data-menu-toggle]');
const siteNav = document.querySelector('[data-nav]');
const siteHeader = document.querySelector('[data-header]');
const navLinks = document.querySelectorAll('[data-nav] a');
const yearElements = document.querySelectorAll('[data-year]');

function setMenu(open) {
  if (!menuToggle || !siteNav) return;
  menuToggle.setAttribute('aria-expanded', String(open));
  const label = menuToggle.querySelector('.sr-only');
  if (label) label.textContent = open ? 'Fechar menu' : 'Abrir menu';
  siteNav.classList.toggle('is-open', open);
  document.body.classList.toggle('menu-open', open);
}

function toggleMenu() {
  setMenu(menuToggle.getAttribute('aria-expanded') !== 'true');
}

function updateHeader() {
  if (siteHeader) siteHeader.classList.toggle('is-scrolled', window.scrollY > 24);
}

if (menuToggle) menuToggle.addEventListener('click', toggleMenu);
navLinks.forEach((link) => link.addEventListener('click', () => setMenu(false)));
window.addEventListener('scroll', updateHeader, { passive: true });
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') setMenu(false);
});
updateHeader();

yearElements.forEach((element) => {
  element.textContent = new Date().getFullYear();
});

if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.16 });

  document.querySelectorAll('.section-body, .training-body, .result-body, .meetup-body, .stories-body, .journey-body, .manifesto-body, .about-company-body, .method-flow-body, .method-orbit-body, .method-cards-body').forEach((element) => {
    element.dataset.reveal = '';
    revealObserver.observe(element);
  });
}
