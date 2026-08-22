const modal = document.getElementById('requestModal');

document.querySelectorAll('[data-open-request]').forEach((button) => {
  button.addEventListener('click', (event) => {
    event.preventDefault();
    modal?.showModal();
  });
});

modal?.querySelector('.modal-close')?.addEventListener('click', () => modal.close());
modal?.addEventListener('click', (event) => {
  if (event.target === modal) modal.close();
});

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

if (!reducedMotion.matches && 'IntersectionObserver' in window) {
  const revealBlocks = document.querySelectorAll('main > section:not(.hero) > .wrap');
  document.documentElement.classList.add('reveal-enabled');

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -10% 0px'
  });

  revealBlocks.forEach((block) => {
    const siblings = [...block.parentElement.children].filter((item) => item.classList.contains('wrap'));
    const position = siblings.indexOf(block);
    block.classList.add('reveal-block');
    block.style.setProperty('--reveal-delay', `${Math.min(position * 70, 140)}ms`);
    revealObserver.observe(block);
  });
}
