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

