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
if (sections.length && 'IntersectionObserver' in window) {
  const sectionObserver = new IntersectionObserver(entries => {
    const visible = entries.filter(entry => entry.isIntersecting).sort((a,b) => b.intersectionRatio-a.intersectionRatio)[0];
    if (!visible) return;
    sectionLinks.forEach(link => link.classList.toggle('active', link.dataset.section === visible.target.id));
    sectionLinks.find(link => link.classList.contains('active'))?.scrollIntoView({behavior: reducedMotion ? 'auto' : 'smooth', inline:'center', block:'nearest'});
  }, { rootMargin: '-28% 0px -60% 0px', threshold: [0,.1,.25] });
  sections.forEach(section => sectionObserver.observe(section));
}

