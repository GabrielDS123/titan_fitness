/**
 * TITAN FITNESS — JavaScript Principal
 * Funcionalidades: Navbar, Animações, Contador, Menu Mobile, Toast
 */

'use strict';

/* ============================================================
   1. NAVBAR — scroll e menu mobile
   ============================================================ */
(function initNavbar() {
  const navbar   = document.getElementById('navbar');
  const toggle   = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  const allLinks = document.querySelectorAll('.nav-links a');

  // Efeito de scroll
  function onScroll() {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    updateActiveLink();
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Menu mobile
  if (toggle) {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('active');
      navLinks.classList.toggle('open');
      document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    });
  }

  // Fechar ao clicar em link
  allLinks.forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('active');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // Fechar ao clicar fora
  document.addEventListener('click', (e) => {
    if (navLinks.classList.contains('open') &&
        !navLinks.contains(e.target) &&
        !toggle.contains(e.target)) {
      toggle.classList.remove('active');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    }
  });

  // Link ativo baseado na seção visível
  function updateActiveLink() {
    const sections = document.querySelectorAll('section[id]');
    let current = '';

    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    allLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  }
})();


/* ============================================================
   2. ANIMAÇÕES DE SCROLL (Intersection Observer)
   ============================================================ */
(function initScrollAnimations() {
  const revealClasses = ['.reveal', '.reveal-left', '.reveal-right', '.reveal-scale'];
  const elements = document.querySelectorAll(revealClasses.join(', '));

  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Não desconectar para manter animação ao rolar de volta
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  elements.forEach(el => observer.observe(el));
})();


/* ============================================================
   3. CONTADOR ANIMADO DE ESTATÍSTICAS
   ============================================================ */
(function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  let started = false;

  function animateCounter(el) {
    const target  = parseInt(el.getAttribute('data-count'), 10);
    const duration = 2000; // ms
    const start   = performance.now();

    function update(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Easing: ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * target);
      el.textContent = current.toLocaleString('pt-BR');

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = target.toLocaleString('pt-BR');
      }
    }

    requestAnimationFrame(update);
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !started) {
        started = true;
        counters.forEach(counter => animateCounter(counter));
        observer.disconnect();
      }
    });
  }, { threshold: 0.5 });

  const statsSection = document.getElementById('stats');
  if (statsSection) observer.observe(statsSection);
})();


/* ============================================================
   4. FORMULÁRIO DE CONTATO — validação e toast
   ============================================================ */
(function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name    = form.querySelector('#name').value.trim();
    const email   = form.querySelector('#email').value.trim();
    const message = form.querySelector('#message').value.trim();

    if (!name || !email || !message) {
      showToast('⚠️', 'Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    if (!isValidEmail(email)) {
      showToast('⚠️', 'Por favor, insira um e-mail válido.');
      return;
    }

    // Simula envio
    const btn = form.querySelector('.form-submit');
    btn.textContent = 'Enviando...';
    btn.disabled = true;

    setTimeout(() => {
      form.reset();
      btn.textContent = 'Enviar Mensagem';
      btn.disabled = false;
      showToast('✅', 'Mensagem enviada com sucesso! Entraremos em contato em breve.');
    }, 1500);
  });

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
})();


/* ============================================================
   5. TOAST NOTIFICATION
   ============================================================ */
function showToast(icon, message) {
  // Remove toast existente
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span class="toast-icon">${icon}</span><span>${message}</span>`;
  document.body.appendChild(toast);

  // Animar entrada
  requestAnimationFrame(() => {
    requestAnimationFrame(() => toast.classList.add('show'));
  });

  // Remover após 4s
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  }, 4000);
}


/* ============================================================
   6. SMOOTH SCROLL para âncoras
   ============================================================ */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 80; // altura da navbar
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
})();


/* ============================================================
   7. PARALLAX LEVE no Hero
   ============================================================ */
(function initParallax() {
  const heroBg = document.querySelector('.hero-bg');
  if (!heroBg) return;

  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    if (scrolled < window.innerHeight) {
      heroBg.style.transform = `scale(1.05) translateY(${scrolled * 0.3}px)`;
    }
  }, { passive: true });
})();


/* ============================================================
   8. PLANOS — botão de inscrição
   ============================================================ */
(function initPlanButtons() {
  document.querySelectorAll('.btn-plan').forEach(btn => {
    btn.addEventListener('click', () => {
      const planName = btn.closest('.plano-card').querySelector('.plano-name').textContent;
      showToast('🎯', `Ótima escolha! Você selecionou o ${planName}. Redirecionando...`);
      setTimeout(() => {
        document.getElementById('contato').scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 1800);
    });
  });
})();


/* ============================================================
   9. YEAR AUTOMÁTICO no footer
   ============================================================ */
(function setYear() {
  const yearEl = document.getElementById('footer-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
