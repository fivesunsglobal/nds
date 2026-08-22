const modal = document.getElementById('requestModal');
const siteHeader = document.querySelector('.site-header');
const navToggle = document.querySelector('.nav-toggle');
const primaryNav = document.getElementById('primary-nav');

const closeMobileNav = () => {
  siteHeader?.classList.remove('nav-open');
  navToggle?.setAttribute('aria-expanded', 'false');
};

navToggle?.addEventListener('click', () => {
  const willOpen = navToggle.getAttribute('aria-expanded') !== 'true';
  siteHeader?.classList.toggle('nav-open', willOpen);
  navToggle.setAttribute('aria-expanded', String(willOpen));
});

primaryNav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMobileNav));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeMobileNav();
});

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

const progressBar = document.querySelector('.scroll-progress span');
let progressFrame = null;

const updateScrollProgress = () => {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? Math.min(Math.max(window.scrollY / scrollable, 0), 1) : 0;
  progressBar?.style.setProperty('transform', `scaleX(${progress})`);
  progressFrame = null;
};

const requestProgressUpdate = () => {
  if (progressFrame !== null) return;
  progressFrame = window.requestAnimationFrame(updateScrollProgress);
};

window.addEventListener('scroll', requestProgressUpdate, { passive: true });
window.addEventListener('resize', requestProgressUpdate);
updateScrollProgress();

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

const practiceRail = document.querySelector('[data-practice-rail]');
const scrollPracticeStories = (direction) => {
  if (!practiceRail) return;
  const story = practiceRail.querySelector('.practice-story');
  const gap = 18;
  const distance = story ? story.getBoundingClientRect().width + gap : practiceRail.clientWidth;
  practiceRail.scrollBy({ left: direction * distance, behavior: reducedMotion.matches ? 'auto' : 'smooth' });
};
document.querySelector('[data-practice-prev]')?.addEventListener('click', () => scrollPracticeStories(-1));
document.querySelector('[data-practice-next]')?.addEventListener('click', () => scrollPracticeStories(1));
