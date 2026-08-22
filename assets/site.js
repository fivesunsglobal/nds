const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xzepwgqk';

const modal = document.getElementById('requestModal');

document.querySelectorAll('[data-formspree-form]').forEach((form) => {
  form.action = FORMSPREE_ENDPOINT;
  form.method = 'POST';
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
