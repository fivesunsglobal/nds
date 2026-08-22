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
