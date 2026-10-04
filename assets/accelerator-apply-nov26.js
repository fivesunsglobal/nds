(() => {
  'use strict';

  const form = document.querySelector('[data-application-form]');
  if (!form) return;

  form.elements.form_started_at.value = String(Date.now());

  const steps = [...form.querySelectorAll('[data-step]')];
  const navButtons = [...document.querySelectorAll('[data-step-nav]')];
  const progressBar = document.querySelector('[data-progress-bar]');
  const progressLabel = document.querySelector('[data-progress-label]');
  const success = document.querySelector('[data-form-success]');
  let currentStep = 0;
  let applicationStarted = false;
  const applicationEventParams = {
    form_id: 'accelerator_nov26',
    page_language: 'en'
  };
  const markApplicationStarted = () => {
    if (applicationStarted) return;
    applicationStarted = true;
    window.ndsTrack?.('application_start', applicationEventParams);
  };
  form.addEventListener('input', markApplicationStarted);
  form.addEventListener('change', markApplicationStarted);

  const familiarity = [
    ['1', '1 · Not at all familiar', '1 · Not at all'],
    ['2', '2', '2'],
    ['3', '3', '3'],
    ['4', '4', '4'],
    ['5', '5 · Very familiar', '5 · Very familiar']
  ];
  document.querySelectorAll('.matrix-block table').forEach(table => {
    const heading = table.querySelector('thead tr');
    const firstHeading = heading.querySelector('th');
    heading.innerHTML = '';
    heading.append(firstHeading);
    familiarity.forEach(([, label]) => {
      const th = document.createElement('th');
      th.scope = 'col';
      th.textContent = label;
      heading.append(th);
    });
  });
  document.querySelectorAll('[data-familiarity]').forEach(select => {
    const row = select.closest('tr');
    const question = row.querySelector('th').textContent.trim();
    const cell = select.closest('td');
    familiarity.forEach(([value, label, shortLabel], index) => {
      const choiceCell = document.createElement('td');
      const choice = document.createElement('label');
      choice.className = 'matrix-radio';
      const input = document.createElement('input');
      input.type = 'radio';
      input.name = select.name;
      input.value = value;
      input.required = select.required && index === 0;
      input.setAttribute('aria-label', `${question}: ${label}`);
      const marker = document.createElement('span');
      marker.setAttribute('aria-hidden', 'true');
      marker.dataset.shortLabel = shortLabel;
      choice.append(input, marker);
      choiceCell.append(choice);
      row.insertBefore(choiceCell, cell);
    });
    cell.remove();
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

  const paidAccess = form.querySelector('[data-paid-access]');
  const paidAccessDetail = paidAccess.querySelector('[data-paid-access-detail]');
  const paidTools = paidAccessDetail.querySelector('input');
  paidAccess.addEventListener('change', () => {
    const show = form.elements.paid_ai_access.value === 'yes';
    paidAccessDetail.hidden = !show;
    paidTools.required = show;
    if (!show) paidTools.value = '';
  });

  const attendanceBlock = form.querySelector('[data-attendance-block]');
  const attendanceDiversion = form.querySelector('[data-attendance-diversion]');
  const attendanceFollowup = form.querySelector('[data-attendance-followup]');
  const attendanceFollowupFields = [...attendanceFollowup.querySelectorAll('input, select, textarea, button')];
  const updateAttendancePath = () => {
    const divert = form.elements.attendance.value === 'no';
    attendanceDiversion.setAttribute('aria-hidden', String(!divert));
    attendanceFollowupFields.forEach(field => { field.disabled = divert; });
    if (divert) {
      attendanceDiversion.focus();
      attendanceDiversion.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'center' });
    }
  };
  attendanceBlock.addEventListener('change', updateAttendancePath);
  updateAttendancePath();

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
    window.ndsTrack?.('application_submit_attempt', applicationEventParams);
    submit.disabled = true;
    status.classList.remove('error');
    status.textContent = 'Submitting your application…';
    try {
      // Apps Script web apps return through a Google-hosted redirect that does not
      // expose CORS response headers. An opaque response still confirms the browser
      // handed the submission to the public endpoint.
      const response = await fetch(form.action, { method: 'POST', body: new FormData(form), mode: 'no-cors' });
      if (response.type !== 'opaque' && !response.ok) throw new Error('Submission failed');
      form.hidden = true;
      document.querySelector('.form-progress').hidden = true;
      document.querySelector('.form-progress-copy').hidden = true;
      success.hidden = false;
      success.focus();
      window.ndsTrack?.('application_complete', applicationEventParams);
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
