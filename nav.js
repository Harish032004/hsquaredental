

const toggle = document.getElementById('mobileMenuToggle');
const overlay = document.getElementById('mobileNavOverlay');

toggle.addEventListener('click', () => {
  overlay.classList.toggle('active');
});

document.querySelectorAll('.mobile-dropdown-toggle').forEach(btn => {
  btn.addEventListener('click', () => {
    btn.parentElement.classList.toggle('active');
  });
});
