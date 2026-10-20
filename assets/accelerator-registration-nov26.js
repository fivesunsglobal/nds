(() => {
  'use strict';

  const form = document.querySelector('[data-registration-form]');
  if (!form) return;

  form.elements.form_started_at.value = String(Date.now());

  const steps = [...form.querySelectorAll('[data-step]')];
  const navButtons = [...document.querySelectorAll('[data-step-nav]')];
  const progressBar = document.querySelector('[data-progress-bar]');
  const progressLabel = document.querySelector('[data-progress-label]');
  const success = document.querySelector('[data-form-success]');
  const status = form.querySelector('[data-form-status]');
  let currentStep = 0;

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

  const aiTools = [...form.querySelectorAll('input[name="primary_ai_tools"]')];
  const aiToolOther = form.querySelector('[data-ai-tool-other]');
  const aiToolOtherInput = form.elements.primary_ai_tools_other;
  const updateAiTools = () => {
    const checked = aiTools.filter(input => input.checked);
    aiTools[0].required = checked.length === 0;
    aiTools[0].setCustomValidity(checked.length === 0 ? 'Choose at least one AI tool.' : '');
    const showOther = checked.some(input => input.value === 'Something else');
    aiToolOther.hidden = !showOther;
    aiToolOtherInput.required = showOther;
    if (!showOther) aiToolOtherInput.value = '';
  };
  aiTools.forEach(input => input.addEventListener('change', updateAiTools));
  updateAiTools();

  const coachingAvailability = form.querySelector('[data-coaching-availability]');
  const coachingAvailabilityInput = form.elements.coaching_availability;
  const updateCoachingAvailability = () => {
    const interest = form.elements.coaching_interest.value;
    const show = interest === 'yes' || interest === 'maybe';
    coachingAvailability.hidden = !show;
    if (!show) coachingAvailabilityInput.value = '';
  };
  [...form.elements.coaching_interest].forEach(input => input.addEventListener('change', updateCoachingAvailability));
  updateCoachingAvailability();

  document.querySelector('[data-tuition-display]').textContent = '$495 USD';

  const showStep = (index, focus = true) => {
    currentStep = Math.max(0, Math.min(index, steps.length - 1));
    steps.forEach((step, i) => { step.hidden = i !== currentStep; });
    navButtons.forEach((button, i) => {
      if (i === currentStep) button.setAttribute('aria-current', 'step');
      else button.removeAttribute('aria-current');
    });
    progressBar.style.width = `${((currentStep + 1) / steps.length) * 100}%`;
    progressLabel.textContent = `Step ${currentStep + 1} of ${steps.length}`;
    history.replaceState(null, '', `${location.pathname}${location.search}#step-${currentStep + 1}`);
    if (focus) {
      document.querySelector('.application-card').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
    }
  };

  const activeFields = step => [...step.querySelectorAll('input,select,textarea')].filter(field => !field.disabled && !field.closest('[hidden]'));
  const validateStep = step => {
    updateAiTools();
    for (const field of activeFields(step)) {
      if (!field.checkValidity()) {
        field.reportValidity();
        field.focus();
        return false;
      }
    }
    return true;
  };

  form.addEventListener('click', event => {
    if (event.target.closest('[data-next]') && validateStep(steps[currentStep])) showStep(currentStep + 1);
    if (event.target.closest('[data-back]')) showStep(currentStep - 1);
  });
  navButtons.forEach(button => button.addEventListener('click', () => {
    const target = Number(button.dataset.stepNav);
    if (target <= currentStep || validateStep(steps[currentStep])) showStep(target);
  }));

  form.addEventListener('submit', async event => {
    event.preventDefault();
    const invalid = steps.findIndex(step => activeFields(step).some(field => !field.checkValidity()));
    if (invalid !== -1) {
      showStep(invalid);
      validateStep(steps[invalid]);
      return;
    }

    const submit = form.querySelector('button[type="submit"]');
    submit.disabled = true;
    status.classList.remove('error');
    status.textContent = 'Submitting your registration…';

    try {
      // Apps Script web apps return through a Google-hosted redirect that does not
      // expose CORS response headers. An opaque response confirms that the browser
      // handed the form data to the public endpoint.
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        mode: 'no-cors'
      });
      if (response.type !== 'opaque' && !response.ok) throw new Error('Submission failed');

      form.hidden = true;
      document.querySelector('.form-progress').hidden = true;
      document.querySelector('.form-progress-copy').hidden = true;
      success.hidden = false;
      success.focus();
    } catch {
      status.classList.add('error');
      status.textContent = 'Your registration could not be sent. Please try again; your entries have been kept.';
    } finally {
      submit.disabled = false;
    }
  });

  const hashStep = Number((location.hash.match(/step-(\d+)/) || [])[1]) - 1;
  showStep(Number.isInteger(hashStep) && hashStep >= 0 ? hashStep : 0, false);
})();
