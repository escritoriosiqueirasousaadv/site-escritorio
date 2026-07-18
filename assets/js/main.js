// Siqueira & Sousa Advogados — shared behavior

(function () {
  var toggle = document.querySelector('.hamburger');
  var mobileNav = document.querySelector('.mobile-nav');
  if (toggle && mobileNav) {
    toggle.addEventListener('click', function () {
      mobileNav.classList.toggle('open');
    });
  }

  // Footer year
  var yearEl = document.getElementById('footer-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // Hero video sound toggle
  var heroVideo = document.getElementById('hero-video');
  var soundBtn = document.getElementById('hero-sound-toggle');
  if (heroVideo && soundBtn) {
    soundBtn.addEventListener('click', function () {
      heroVideo.muted = !heroVideo.muted;
      soundBtn.textContent = heroVideo.muted ? 'Ativar som' : 'Silenciar';
    });
  }

  // Contact form -> WhatsApp deep link
  var form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = document.getElementById('form-name').value.trim();
      var message = document.getElementById('form-message').value.trim();
      var text = 'Olá, meu nome é ' + (name || '...') + '. ' + (message || 'Gostaria de falar sobre um caso.');
      var url = 'https://wa.me/5591986230430?text=' + encodeURIComponent(text);
      window.open(url, '_blank', 'noopener');
    });
  }
})();
