const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const revealItems = document.querySelectorAll('.reveal-item');
if (!reducedMotion && 'IntersectionObserver' in window) {
  const reveal = new IntersectionObserver(entries => entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('is-visible');
    reveal.unobserve(entry.target);
  }), { threshold: .1, rootMargin: '0px 0px -7% 0px' });
  revealItems.forEach(item => reveal.observe(item));
} else revealItems.forEach(item => item.classList.add('is-visible'));

const sectionLinks = [...document.querySelectorAll('[data-section]')];
const sections = sectionLinks.map(link => document.getElementById(link.dataset.section)).filter(Boolean);
if (sections.length) {
  let scheduled = false;
  const updateActiveSection = () => {
    scheduled = false;
    const marker = window.scrollY + Math.min(260, window.innerHeight * .34);
    let active = null;
    sections.forEach(section => {
      if (section.offsetTop <= marker) active = section;
    });
    if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 8) active = sections[sections.length - 1];
    sectionLinks.forEach(link => link.classList.toggle('active', Boolean(active) && link.dataset.section === active.id));
  };
  const requestUpdate = () => {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(updateActiveSection);
  };
  addEventListener('scroll', requestUpdate, { passive: true });
  addEventListener('resize', requestUpdate);
  addEventListener('hashchange', requestUpdate);
  updateActiveSection();
}

const interestSelect = document.querySelector('select[name="interest"]');
if (interestSelect) {
  const isSpanish = document.documentElement.lang === 'es';
  const interestCopy = isSpanish ? {
    'democracy-ai-cohort': ['¿Te interesa la próxima cohorte de Democracy+AI?', 'Cuéntanos sobre tu función y qué esperas poder hacer con IA.'],
    'democracy-ai-salon': ['¿Te interesa el AI for Democracy Salon?', 'Cuéntanos qué te gustaría aprender en una próxima sesión abierta.'],
    'organizational-ai': ['¿Buscas un programa de IA para tu organización?', 'Cuéntanos sobre tu equipo, sus prioridades y las capacidades que quieren desarrollar.'],
    'sponsored-cohort': ['¿Te interesa patrocinar una cohorte?', 'Cuéntanos sobre la red o los beneficiarios a quienes te gustaría apoyar.'],
    'ideas-convening': ['¿Tienes una idea que valga la pena desarrollar juntos?', 'Cuéntanos sobre la pregunta, el desafío o la conversación que quieres impulsar.'],
    'partnership': ['¿Listos para explorar una alianza?', 'Cuéntanos qué estás intentando cambiar y dónde el Studio podría aportar valor.']
  } : {
    'democracy-ai-cohort': ['Interested in the next Democracy+AI cohort?', 'Tell us about your role and what you hope to do with AI.'],
    'democracy-ai-salon': ['Interested in the AI for Democracy Salon?', 'Tell us what you would most like to learn in an upcoming open session.'],
    'organizational-ai': ['Looking for an organizational AI program?', 'Tell us about your team, its priorities, and the capabilities you want to build.'],
    'sponsored-cohort': ['Interested in sponsoring a cohort?', 'Tell us about the network or grantees you would like to support.'],
    'ideas-convening': ['Have an idea worth developing together?', 'Tell us about the question, challenge, or conversation you want to move forward.'],
    'partnership': ['Ready to explore a partnership?', 'Tell us what you are trying to change and where the Studio might add value.']
  };
  const setInterest = value => {
    const option = [...interestSelect.options].find(item => item.value === value);
    if (!option) return;
    interestSelect.value = value;
    interestSelect.classList.add('is-contextual');
    const contextual = interestCopy[value];
    const heading = document.querySelector('[data-contact-heading]');
    const copy = document.querySelector('[data-contact-copy]');
    if (contextual && heading) heading.textContent = contextual[0];
    if (contextual && copy) copy.textContent = contextual[1];
  };
  const requestedInterest = new URLSearchParams(location.search).get('interest');
  if (requestedInterest) setInterest(requestedInterest);
  document.querySelectorAll('[data-interest-target]').forEach(link => link.addEventListener('click', () => setInterest(link.dataset.interestTarget)));
  const form = interestSelect.closest('form');
  if (form) form.addEventListener('submit', () => {
    const formType = form.querySelector('input[name="form_type"]');
    if (!formType) return;
    const base = formType.dataset.baseValue || formType.value;
    formType.dataset.baseValue = base;
    formType.value = `${base} | Interest: ${interestSelect.options[interestSelect.selectedIndex].text}`;
  });
}

