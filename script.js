/*
  Script para funcionalidade da navegação e interação do site.
  Destaca links ativos conforme a rolagem, copia URLs e mostra botão de voltar ao topo.
*/
(function () {
  // Atualiza o ano automaticamente no rodapé
  const yearEl = document.querySelector('[data-year]');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // Seleciona links de navegação e seções correspondentes
  const navLinks = Array.from(document.querySelectorAll('[data-nav]')).filter((link) => link.classList.contains('nav__link'));
  const sectionIds = ['inicio', 'filosofia', 'psicologia', 'neuro', 'sobre', 'contato'];
  const sections = sectionIds
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  function setActive(id) {
    navLinks.forEach((link) => {
      const hash = link.getAttribute('href');
      link.classList.toggle('is-active', hash === `#${id}`);
    });
  }

  const observer = new IntersectionObserver(
    (entries) => {
      // Determine a seção mais visível no viewport
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible && visible.target && visible.target.id) {
        setActive(visible.target.id);
      }
    },
    {
      threshold: [0.2, 0.4, 0.6],
    },
  );
  sections.forEach((section) => observer.observe(section));

  // Scroll suave ao clicar nos links de navegação
  navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href').substring(1);
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        window.scrollTo({ top: targetEl.offsetTop - 70, behavior: 'smooth' });
      }
    });
  });

  // Botão voltar ao topo
  const topBtn = document.querySelector('[data-top]');
  function toggleTopButton() {
    if (!topBtn) return;
    if (window.scrollY > 500) {
      topBtn.style.display = 'flex';
    } else {
      topBtn.style.display = 'none';
    }
  }
  window.addEventListener('scroll', toggleTopButton, { passive: true });
  toggleTopButton();
  if (topBtn) {
    topBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Função de cópia para a área de transferência
  async function copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }

  // Copiar link da seção
  document.querySelectorAll('[data-copy-section]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const hash = btn.getAttribute('data-copy-section');
      const url = `${window.location.href.split('#')[0]}${hash}`;
      const ok = await copyToClipboard(url);
      const original = btn.textContent;
      btn.textContent = ok ? 'Link copiado' : 'Falhou';
      setTimeout(() => {
        btn.textContent = original;
      }, 1400);
    });
  });

  // Copiar link completo do site (botão com data-copy, se presente)
  document.querySelectorAll('[data-copy]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const textToCopy = window.location.href.split('#')[0];
      const ok = await copyToClipboard(textToCopy);
      const original = btn.textContent;
      btn.textContent = ok ? 'Link copiado' : 'Falhou';
      setTimeout(() => {
        btn.textContent = original;
      }, 1400);
    });
  });

  // Formulário de contato (demonstração)
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      alert(
        'Mensagem enviada! Como este site é estático, para conectar com um serviço real (ex.: Formspree, Netlify Forms), altere o script.js para enviar dados via fetch.',
      );
      form.reset();
    });
  }
})();