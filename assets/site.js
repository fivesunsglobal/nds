// Replace this ONE value with your Formspree form endpoint before launch.
// Example: https://formspree.io/f/abcdwxyz
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/REPLACE_ME';

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
