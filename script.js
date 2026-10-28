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

function renderResultCard(card) {
  const { distance, before, after, image, name } = card.dataset;
  const isPrototype75 = Boolean(card.closest('.prototype-company-seventyfive'));
  const requiredValues = [distance, before, after, image, name];

  if (requiredValues.some((value) => !value)) {
    console.warn('Card de resultado incompleto:', card);
    return;
  }

  const imageContainer = document.createElement('div');
  imageContainer.className = 'results-athlete-image';

  const athleteImage = document.createElement('img');
  athleteImage.src = image;
  athleteImage.alt = `${name} após evolução na corrida`;
  athleteImage.style.setProperty('--result-image-position', card.dataset.position || '50% center');
  athleteImage.style.setProperty('--result-image-scale', card.dataset.scale || '1');

  const header = document.createElement('header');
  header.className = 'results-athlete-header';

  const distanceElement = document.createElement('div');
  distanceElement.className = 'results-athlete-distance compact-distance';
  const distanceClass = `distance-${distance.toLowerCase().replace(/\s+/g, '-')}`;
  distanceElement.classList.add(distanceClass);
  const distanceValue = document.createElement('strong');
  distanceValue.textContent = distance;
  distanceElement.append(distanceValue);

  const timeElement = document.createElement('div');
  timeElement.className = 'results-athlete-time compact-time';
  timeElement.classList.add(distanceClass);
  const timeValues = document.createElement('strong');
  const beforeValue = document.createElement('span');
  beforeValue.textContent = before;
  const arrow = document.createElement('i');
  arrow.setAttribute('aria-hidden', 'true');
  arrow.textContent = '↓';
  const afterValue = document.createElement('span');
  afterValue.textContent = after;
  timeValues.append(beforeValue, arrow, afterValue);
  timeElement.append(timeValues);

  if (isPrototype75) {
    header.append(timeElement);
  } else {
    header.append(distanceElement, timeElement);
  }

  const caption = document.createElement('figcaption');
  const nameValue = document.createElement('strong');
  nameValue.textContent = name;
  caption.append(nameValue);
  if (isPrototype75) caption.append(distanceElement);

  imageContainer.append(athleteImage, header, caption);
  card.replaceChildren(imageContainer);
}

document.querySelectorAll('[data-result-card]').forEach(renderResultCard);

const leadForm = document.querySelector('[data-lead-form]');

if (leadForm) {
  const leadStatus = leadForm.querySelector('[data-lead-status]');
  const leadSubmit = leadForm.querySelector('button[type="submit"]');
  const leadPhone = leadForm.querySelector('input[name="phone"]');

  leadPhone.addEventListener('input', () => {
    const digits = leadPhone.value.replace(/\D/g, '').slice(0, 11);
    if (digits.length <= 10) {
      leadPhone.value = digits.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3').replace(/-$/, '');
      return;
    }
    leadPhone.value = digits.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3').replace(/-$/, '');
  });

  leadForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const endpoint = leadForm.getAttribute('action');

    if (!endpoint || endpoint.includes('SEU_FORM_ID')) {
      leadStatus.textContent = 'O formulário está pronto. Falta configurar o endpoint do Formspree.';
      return;
    }

    leadSubmit.disabled = true;
    leadStatus.textContent = 'Enviando seus dados...';

    try {
      const response = await fetch(endpoint, { method: 'POST', body: new FormData(leadForm), headers: { Accept: 'application/json' } });
      if (!response.ok) throw new Error('Falha no envio');
      leadForm.reset();
      leadStatus.textContent = 'Recebemos seus dados. Em breve um treinador fala com você.';
    } catch (error) {
      leadStatus.textContent = 'Não foi possível enviar agora. Tente novamente em instantes.';
    } finally {
      leadSubmit.disabled = false;
    }
  });
}

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
