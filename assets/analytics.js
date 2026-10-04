(() => {
  'use strict';

  const measurementId = 'G-QP81VPX4T9';
  const consentKey = 'nds_analytics_consent_v1';
  const isSpanish = document.documentElement.lang === 'es';
  let analyticsLoaded = false;

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function gtag(){ window.dataLayer.push(arguments); };
  window.gtag('consent', 'default', {
    analytics_storage: 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    wait_for_update: 500
  });

  const getConsent = () => {
    try { return localStorage.getItem(consentKey); }
    catch { return null; }
  };

  const setConsent = value => {
    try { localStorage.setItem(consentKey, value); }
    catch {}
  };

  const loadAnalytics = () => {
    if (analyticsLoaded) return;
    analyticsLoaded = true;
    window.gtag('consent', 'update', {
      analytics_storage: 'granted',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied'
    });
    window.gtag('js', new Date());
    window.gtag('config', measurementId, {
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
      send_page_view: true
    });
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
    document.head.append(script);
  };

  window.ndsTrack = (eventName, parameters = {}) => {
    if (getConsent() !== 'granted' || typeof window.gtag !== 'function') return;
    window.gtag('event', eventName, parameters);
  };

  const eraseAnalyticsCookies = () => {
    document.cookie.split(';').forEach(cookie => {
      const name = cookie.split('=')[0].trim();
      if (!name.startsWith('_ga')) return;
      document.cookie = `${name}=; Max-Age=0; path=/; SameSite=Lax`;
      document.cookie = `${name}=; Max-Age=0; path=/; domain=.${location.hostname}; SameSite=Lax`;
    });
  };

  const copy = isSpanish ? {
    title: 'Tu privacidad',
    body: 'Con tu permiso, usamos Google Analytics para comprender cómo se utiliza el sitio y mejorar nuestros programas. No enviamos a Google nombres, correos electrónicos ni respuestas de formularios.',
    accept: 'Aceptar analítica',
    decline: 'Rechazar',
    choices: 'Opciones de analítica',
    privacy: 'Política de privacidad'
  } : {
    title: 'Your privacy',
    body: 'With your permission, we use Google Analytics to understand how the site is used and improve our programs. We do not send Google names, email addresses, or form responses.',
    accept: 'Accept analytics',
    decline: 'Decline',
    choices: 'Analytics choices',
    privacy: 'Privacy policy'
  };

  const closePanel = () => document.querySelector('[data-analytics-consent]')?.remove();

  const renderPanel = () => {
    closePanel();
    const panel = document.createElement('section');
    panel.className = 'analytics-consent';
    panel.dataset.analyticsConsent = '';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-labelledby', 'analytics-consent-title');
    panel.innerHTML = `
      <div class="analytics-consent-copy">
        <h2 id="analytics-consent-title">${copy.title}</h2>
        <p>${copy.body} <a href="${isSpanish ? 'privacy-es.html' : 'privacy.html'}">${copy.privacy}</a>.</p>
      </div>
      <div class="analytics-consent-actions">
        <button class="analytics-consent-accept" type="button" data-consent-choice="granted">${copy.accept}</button>
        <button class="analytics-consent-decline" type="button" data-consent-choice="denied">${copy.decline}</button>
      </div>`;
    document.body.append(panel);
    panel.querySelector('.analytics-consent-accept')?.focus();
  };

  const applyChoice = value => {
    const previous = getConsent();
    setConsent(value);
    if (value === 'granted') loadAnalytics();
    else {
      window.gtag('consent', 'update', {
        analytics_storage: 'denied',
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied'
      });
      eraseAnalyticsCookies();
    }
    closePanel();
    if (previous === 'granted' && value === 'denied') location.reload();
  };

  document.addEventListener('click', event => {
    const choice = event.target.closest('[data-consent-choice]');
    if (choice) {
      applyChoice(choice.dataset.consentChoice);
      return;
    }
    const link = event.target.closest('a');
    if (!link) return;
    if (link.matches('.language-link')) {
      window.ndsTrack('language_switch', {
        destination_language: link.hreflang || (isSpanish ? 'en' : 'es')
      });
    }
    if (link.closest('.cohort-transition-copy')) {
      window.ndsTrack('cohort_promo_click', { link_url: link.href });
    }
    if (link.closest('#programs, .d2-program-preview') && /democracy-ai/.test(link.getAttribute('href') || '')) {
      window.ndsTrack('program_explore', { program_name: 'democracy_ai', link_url: link.href });
    }
  });

  document.addEventListener('DOMContentLoaded', () => {
    const manage = document.createElement('button');
    manage.type = 'button';
    manage.className = 'analytics-choices';
    manage.textContent = copy.choices;
    manage.addEventListener('click', renderPanel);
    document.body.append(manage);

    const consent = getConsent();
    if (consent === 'granted') loadAnalytics();
    else if (consent !== 'denied') renderPanel();
  });
})();
