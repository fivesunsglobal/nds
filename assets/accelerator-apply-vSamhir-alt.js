(() => {
  'use strict';

  const form = document.querySelector('[data-application-form]');
  if (!form) return;

  const steps = [...form.querySelectorAll('[data-step]')];
  const navButtons = [...document.querySelectorAll('[data-step-nav]')];
  const progressBar = document.querySelector('[data-progress-bar]');
  const progressLabel = document.querySelector('[data-progress-label]');
  const success = document.querySelector('[data-form-success]');
  let currentStep = 0;

  const familiarity = [
    ['none', 'No experience'],
    ['heard', 'Heard about'],
    ['rarely', 'Use rarely'],
    ['regularly', 'Use regularly'],
    ['heavily', 'Use heavily']
  ];
  document.querySelectorAll('[data-familiarity]').forEach(select => {
    familiarity.forEach(([value, label]) => select.add(new Option(label, value)));
  });

  const words = value => value.trim() ? value.trim().split(/\s+/).length : 0;
  form.querySelectorAll('[data-word-limit]').forEach(field => {
    const counter = field.parentElement.querySelector('[data-word-count]');
    const updateCount = () => {
      const count = words(field.value);
      const limit = Number(field.dataset.wordLimit);
      counter.textContent = `${count} / ${limit}`;
      counter.classList.toggle('over-limit', count > limit);
      field.setCustomValidity(count > limit ? `Please keep your response to ${limit} words or fewer.` : '');
    };
    field.addEventListener('input', updateCount);
    updateCount();
  });

  const toolPolicy = form.querySelector('[data-tool-policy]');
  const toolDetail = toolPolicy.querySelector('[data-tool-detail]');
  const requiredTools = toolDetail.querySelector('input');
  toolPolicy.addEventListener('change', () => {
    const show = form.elements.tool_policy.value === 'yes';
    toolDetail.hidden = !show;
    requiredTools.required = show;
    if (!show) requiredTools.value = '';
  });

  const showStep = (index, focus = true) => {
    currentStep = Math.max(0, Math.min(index, steps.length - 1));
    steps.forEach((step, i) => { step.hidden = i !== currentStep; });
    navButtons.forEach((button, i) => {
      if (i === currentStep) button.setAttribute('aria-current', 'step');
      else button.removeAttribute('aria-current');
    });
    progressBar.style.width = `${((currentStep + 1) / steps.length) * 100}%`;
    progressLabel.textContent = `Step ${currentStep + 1} of ${steps.length}`;
    history.replaceState(null, '', `#step-${currentStep + 1}`);
    if (focus) {
      steps[currentStep].querySelector('legend strong').focus?.();
      document.querySelector('.application-card').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
    }
  };

  const validateStep = step => {
    const fields = [...step.querySelectorAll('input,select,textarea')].filter(field => !field.disabled && !field.closest('[hidden]'));
    for (const field of fields) {
      if (!field.checkValidity()) {
        field.reportValidity();
        field.focus();
        return false;
      }
    }
    return true;
  };

  form.addEventListener('click', event => {
    if (event.target.closest('[data-next]')) {
      if (validateStep(steps[currentStep])) showStep(currentStep + 1);
    }
    if (event.target.closest('[data-back]')) showStep(currentStep - 1);
  });
  navButtons.forEach(button => button.addEventListener('click', () => showStep(Number(button.dataset.stepNav))));

  form.addEventListener('submit', async event => {
    event.preventDefault();
    const invalid = steps.findIndex(step => ![...step.querySelectorAll('input,select,textarea')].every(field => field.disabled || field.closest('[hidden]') || field.checkValidity()));
    if (invalid !== -1) {
      showStep(invalid);
      validateStep(steps[invalid]);
      return;
    }
    const submit = form.querySelector('button[type="submit"]');
    const status = form.querySelector('[data-form-status]');
    submit.disabled = true;
    status.classList.remove('error');
    status.textContent = 'Submitting your application…';
    try {
      const response = await fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
      if (!response.ok) throw new Error('Submission failed');
      form.hidden = true;
      document.querySelector('.form-progress').hidden = true;
      document.querySelector('.form-progress-copy').hidden = true;
      success.hidden = false;
      success.focus();
    } catch {
      status.classList.add('error');
      status.textContent = 'Your application could not be sent. Please try again; your entries have been kept.';
    } finally {
      submit.disabled = false;
    }
  });

  const hashStep = Number((location.hash.match(/step-(\d+)/) || [])[1]) - 1;
  showStep(Number.isInteger(hashStep) && hashStep >= 0 ? hashStep : 0, false);
})();
