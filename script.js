/*
  Script para navegação interativa e comportamento do portfólio.
  Destaca o link ativo de navegação, permite copiar links de seções,
  mostra o botão de voltar ao topo e lida com o formulário de contato.
*/
(function () {
  // Atualiza o ano automaticamente no rodapé
  const yearEl = document.querySelector("[data-year]");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Navegação ativa conforme a seção visível
  const links = Array.from(document.querySelectorAll("[data-nav]"))
    .filter(a => a.classList.contains("nav__link"));
  const sectionIds = [
    "apresentacao",
    "clinica",
    "neuro",
    "publicacoes",
    "curriculo",
    "contato"
  ];
  const sections = sectionIds
    .map(id => document.getElementById(id))
    .filter(Boolean);

  const setActive = (id) => {
    links.forEach(a => {
      const hash = a.getAttribute("href");
      a.classList.toggle("is-active", hash === `#${id}`);
    });
  };

  const observer = new IntersectionObserver((entries) => {
    // escolha a seção com maior visibilidade
    const visible = entries
      .filter(e => e.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (visible && visible.target && visible.target.id) {
      setActive(visible.target.id);
    }
  }, { threshold: [0.2, 0.4, 0.6] });

  sections.forEach(s => observer.observe(s));

  // Botão voltar ao topo
  const topBtn = document.querySelector("[data-top]");
  const toggleTopBtn = () => {
    if (!topBtn) return;
    topBtn.style.display = (window.scrollY > 600) ? "block" : "none";
  };
  window.addEventListener("scroll", toggleTopBtn, { passive: true });
  toggleTopBtn();
  if (topBtn) topBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // Função auxiliar para copiar texto para o clipboard
  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (e) {
      return false;
    }
  }

  // Copiar link da seção
  document.querySelectorAll("[data-copy-section]").forEach(btn => {
    btn.addEventListener("click", async () => {
      const hash = btn.getAttribute("data-copy-section");
      const url = location.href.split("#")[0] + hash;
      const ok = await copyText(url);
      const original = btn.textContent;
      btn.textContent = ok ? "Link copiado" : "Falha ao copiar";
      setTimeout(() => { btn.textContent = original; }, 1600);
    });
  });

  // Formulário de contato em modo demonstração
  const form = document.getElementById("contactForm");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      alert("Mensagem enviada! Este formulário está em modo demonstração. Personalize a integração no script.js para enviar dados a um serviço real.");
      form.reset();
    });
  }
})();