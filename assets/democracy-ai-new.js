(() => {
  'use strict';
  // Funnel events contain no names, email addresses, form answers, or URL queries.
  // Set an approved GA4 measurement ID here when the draft is ready for analytics.
  const measurementId = '';
  const isPreview = document.body.dataset.page.endsWith('-draft');
  window.dataLayer = window.dataLayer || [];
  const track = (event, detail = {}) => {
    const payload = { event, program: 'democracy-ai', page_type: document.body.dataset.page, ...detail };
    window.dataLayer.push(payload);
    if (!isPreview && /^G-[A-Z0-9]+$/.test(measurementId) && typeof window.gtag === 'function') {
      const { event: eventName, ...parameters } = payload;
      window.gtag('event', eventName, parameters);
    }
  };
  if (!isPreview && /^G-[A-Z0-9]+$/.test(measurementId)) {
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', measurementId, { send_page_view: false, allow_google_signals: false, allow_ad_personalization_signals: false });
    const script = document.createElement('script');
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + measurementId;
    script.async = true;
    document.head.append(script);
  }
  track('page_view');
  document.querySelectorAll('[data-apply]').forEach(link => link.addEventListener('click', () => track('apply_click', { placement: link.dataset.apply })));

  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduced && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }), { threshold: 0.04, rootMargin: '0px 0px -12px 0px' });
    document.querySelectorAll('.reveal').forEach(item => observer.observe(item));
    document.documentElement.classList.add('reveal-ready');
  }

  const header = document.querySelector('.site-header');
  const links = [...document.querySelectorAll('[data-section]')];
  const sections = links.map(link => document.getElementById(link.dataset.section));
  const progress = document.querySelector('.reading-progress span');
  let queued = false;
  const update = () => {
    queued = false;
    const headerHeight = header.getBoundingClientRect().height;
    document.documentElement.style.setProperty('--header-height', headerHeight + 'px');
    const marker = headerHeight + Math.min(140, innerHeight * 0.2);
    let active = -1;
    sections.forEach((section, i) => { if (section.getBoundingClientRect().top <= marker) active = i; });
    links.forEach((link, i) => {
      link.classList.toggle('active', i === active);
      if (i === active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
    if (progress) progress.style.width = Math.min(100, Math.max(0, 100 * scrollY / Math.max(1, document.documentElement.scrollHeight - innerHeight))) + '%';
  };
  const requestUpdate = () => { if (!queued) { queued = true; requestAnimationFrame(update); } };
  addEventListener('scroll', requestUpdate, { passive: true });
  addEventListener('resize', requestUpdate);
  addEventListener('hashchange', requestUpdate);
  if ('ResizeObserver' in window) new ResizeObserver(requestUpdate).observe(header);
  update();

  const form = document.querySelector('[data-interest-form]');
  document.querySelectorAll('[data-interest]').forEach(link => link.addEventListener('click', () => {
    if (form) form.elements.interest.value = link.dataset.interest;
  }));
  if (form) {
    const status = form.querySelector('.form-status');
    const button = form.querySelector('button[type="submit"]');
    form.addEventListener('focusin', () => track('form_start', { form_kind: 'future_interest' }), { once: true });
    form.addEventListener('submit', async event => {
      event.preventDefault();
      if (!form.reportValidity() || button.disabled) return;
      button.disabled = true;
      status.classList.remove('error');
      status.textContent = 'Sending…';
      try {
        const response = await fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
        if (!response.ok) throw new Error('Submission failed');
        track('form_submit_success', { form_kind: 'future_interest' });
        status.textContent = 'Thank you. We will share relevant opportunities with you.';
        form.reset();
      } catch {
        track('form_submit_error', { form_kind: 'future_interest' });
        status.classList.add('error');
        status.textContent = 'Your message could not be sent. Please try again. Your entries have been kept.';
      } finally { button.disabled = false; }
    });
  }
  // The full application is deliberately disabled until Samhir's questions are ready.
  document.querySelector('[data-application-placeholder]')?.addEventListener('submit', event => event.preventDefault());
})();
