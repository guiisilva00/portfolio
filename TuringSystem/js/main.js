/* ============================================================================
   MAIN.JS — TURING SYSTEMS
   ============================================================================
   Script único, compartilhado por todas as páginas. Cada bloco verifica se
   os elementos existem antes de agir, então é seguro incluir este arquivo
   em qualquer página do site.

   ÍNDICE
   1. Utilidades
   2. Ano atual no rodapé
   3. Menu mobile (hambúrguer)
   4. Realce do link ativo na navegação
   5. Reveal ao rolar a página (IntersectionObserver)
   6. Contadores animados (telemetria)
   7. Constelação interativa no hero (canvas)
   8. Botão "voltar ao topo"
   9. Mostrar/ocultar senha
   10. Validação acessível de formulários
   ============================================================================ */

(function () {
  "use strict";

  /* ==========================================================================
     1. UTILIDADES
     ========================================================================== */
  var prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  function qs(sel, ctx) {
    return (ctx || document).querySelector(sel);
  }

  function qsa(sel, ctx) {
    return Array.prototype.slice.call((ctx || document).querySelectorAll(sel));
  }

  /* ==========================================================================
     2. ANO ATUAL NO RODAPÉ
     ========================================================================== */
  qsa("[data-ano-atual]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* ==========================================================================
     3. MENU MOBILE (HAMBÚRGUER)
     ========================================================================== */
  (function initMobileNav() {
    var toggle = qs("#navToggle");
    var nav = qs("#primaryNav");
    if (!toggle || !nav) return;

    function closeNav() {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Abrir menu de navegação");
    }

    function openNav() {
      nav.classList.add("is-open");
      toggle.setAttribute("aria-expanded", "true");
      toggle.setAttribute("aria-label", "Fechar menu de navegação");
    }

    toggle.addEventListener("click", function () {
      var isOpen = nav.classList.contains("is-open");
      isOpen ? closeNav() : openNav();
    });

    qsa("a", nav).forEach(function (link) {
      link.addEventListener("click", closeNav);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeNav();
    });

    document.addEventListener("click", function (e) {
      if (!nav.classList.contains("is-open")) return;
      if (nav.contains(e.target) || toggle.contains(e.target)) return;
      closeNav();
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 860) closeNav();
    });
  })();

  /* ==========================================================================
     4. REALCE DO LINK ATIVO NA NAVEGAÇÃO
     ========================================================================== */
  (function highlightActiveLink() {
    var current = window.location.pathname.split("/").pop() || "index.html";
    qsa(".nav a").forEach(function (link) {
      var href = link.getAttribute("href").split("#")[0];
      if (href === current || (current === "" && href === "index.html")) {
        link.setAttribute("aria-current", "page");
      }
    });
  })();

  /* ==========================================================================
     5. REVEAL AO ROLAR A PÁGINA
     ========================================================================== */
  (function initScrollReveal() {
    var targets = qsa(".reveal");
    if (!targets.length) return;

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      targets.forEach(function (el) {
        el.classList.add("is-visible");
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    targets.forEach(function (el, i) {
      el.style.setProperty("--i", i % 6);
      observer.observe(el);
    });
  })();

  /* ==========================================================================
     6. CONTADORES ANIMADOS (TELEMETRIA)
     ========================================================================== */
  (function initCounters() {
    var counters = qsa("[data-count]");
    if (!counters.length) return;

    function animateCounter(el) {
      var target = parseFloat(el.getAttribute("data-count"));
      if (isNaN(target)) return;

      if (prefersReducedMotion) {
        el.textContent = target;
        return;
      }

      var duration = 1500;
      var start = null;

      function step(timestamp) {
        if (start === null) start = timestamp;
        var progress = Math.min((timestamp - start) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(eased * target);
        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          el.textContent = target;
        }
      }

      requestAnimationFrame(step);
    }

    if (!("IntersectionObserver" in window)) {
      counters.forEach(animateCounter);
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach(function (el) {
      observer.observe(el);
    });
  })();

  /* ==========================================================================
     7. CONSTELAÇÃO INTERATIVA NO HERO (CANVAS)
     ========================================================================== */
  (function initHeroConstellation() {
    var canvas = qs("#heroCanvas");
    if (!canvas || !canvas.getContext) return;

    var ctx = canvas.getContext("2d");
    var wrapper = canvas.parentElement;
    var particles = [];
    var pointer = { x: null, y: null, active: false };
    var rafId = null;
    var running = true;

    var PARTICLE_COUNT = 70;
    var LINK_DISTANCE = 130;
    var POINTER_RADIUS = 150;

    function resize() {
      var rect = wrapper.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    }

    function createParticles() {
      particles = [];
      var count = Math.min(
        PARTICLE_COUNT,
        Math.floor((canvas.width * canvas.height) / 16000)
      );
      for (var i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.25,
          vy: (Math.random() - 0.5) * 0.25,
          r: Math.random() * 1.4 + 0.6
        });
      }
    }

    function drawFrame() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];

        if (running) {
          p.x += p.vx;
          p.y += p.vy;

          if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
          if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

          if (pointer.active) {
            var dx = p.x - pointer.x;
            var dy = p.y - pointer.y;
            var dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < POINTER_RADIUS) {
              var force = (POINTER_RADIUS - dist) / POINTER_RADIUS;
              p.x += (dx / (dist || 1)) * force * 0.6;
              p.y += (dy / (dist || 1)) * force * 0.6;
            }
          }
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(214, 188, 255, 0.85)";
        ctx.fill();
      }

      for (var a = 0; a < particles.length; a++) {
        for (var b = a + 1; b < particles.length; b++) {
          var p1 = particles[a];
          var p2 = particles[b];
          var ddx = p1.x - p2.x;
          var ddy = p1.y - p2.y;
          var d = Math.sqrt(ddx * ddx + ddy * ddy);
          if (d < LINK_DISTANCE) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle =
              "rgba(138, 43, 226, " + (1 - d / LINK_DISTANCE) * 0.5 + ")";
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
    }

    function loop() {
      drawFrame();
      rafId = requestAnimationFrame(loop);
    }

    resize();
    createParticles();

    if (prefersReducedMotion) {
      running = false;
      drawFrame();
    } else {
      loop();
    }

    window.addEventListener("resize", function () {
      resize();
      createParticles();
      if (prefersReducedMotion) drawFrame();
    });

    wrapper.addEventListener("mousemove", function (e) {
      var rect = canvas.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
      pointer.active = true;
    });

    wrapper.addEventListener("mouseleave", function () {
      pointer.active = false;
    });

    document.addEventListener("visibilitychange", function () {
      if (prefersReducedMotion) return;
      if (document.hidden) {
        cancelAnimationFrame(rafId);
      } else {
        loop();
      }
    });
  })();

  /* ==========================================================================
     8. BOTÃO "VOLTAR AO TOPO"
     ========================================================================== */
  (function initBackToTop() {
    var btn = qs("#voltarTopo");
    if (!btn) return;

    function toggle() {
      if (window.scrollY > 560) {
        btn.classList.add("is-visible");
      } else {
        btn.classList.remove("is-visible");
      }
    }

    window.addEventListener("scroll", toggle, { passive: true });
    toggle();

    btn.addEventListener("click", function () {
      window.scrollTo({
        top: 0,
        behavior: prefersReducedMotion ? "auto" : "smooth"
      });
    });
  })();

  /* ==========================================================================
     9. MOSTRAR/OCULTAR SENHA
     ========================================================================== */
  qsa(".toggle-senha").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var campo = btn.closest(".campo-senha");
      var input = campo ? campo.querySelector("input") : null;
      if (!input) return;

      var isVisible = input.getAttribute("type") === "text";
      input.setAttribute("type", isVisible ? "password" : "text");
      btn.setAttribute("aria-pressed", String(!isVisible));
      btn.setAttribute(
        "aria-label",
        isVisible ? "Mostrar senha" : "Ocultar senha"
      );
    });
  });

  /* ==========================================================================
     10. VALIDAÇÃO ACESSÍVEL DE FORMULÁRIOS
     ========================================================================== */
  (function initFormValidation() {
    var forms = qsa(".js-validate");
    if (!forms.length) return;

    var mensagens = {
      valueMissing: "Este campo é obrigatório.",
      typeMismatch: "Informe um valor válido neste formato.",
      tooShort: "Esse campo precisa de mais caracteres.",
      patternMismatch: "Formato inválido."
    };

    function mensagemDeErro(campo) {
      var validity = campo.validity;
      if (validity.valid) return "";
      for (var chave in mensagens) {
        if (validity[chave]) return mensagens[chave];
      }
      return "Verifique este campo.";
    }

    function validarCampo(campo) {
      var erroEl = campo.getAttribute("aria-describedby")
        ? document.getElementById(campo.getAttribute("aria-describedby"))
        : null;

      if (campo.checkValidity()) {
        campo.removeAttribute("aria-invalid");
        if (erroEl) erroEl.textContent = "";
        return true;
      }

      campo.setAttribute("aria-invalid", "true");
      if (erroEl) erroEl.textContent = mensagemDeErro(campo);
      return false;
    }

    forms.forEach(function (form) {
      var campos = qsa("input, select, textarea", form).filter(function (c) {
        return c.willValidate;
      });

      campos.forEach(function (campo) {
        campo.addEventListener("blur", function () {
          validarCampo(campo);
        });
        campo.addEventListener("input", function () {
          if (campo.getAttribute("aria-invalid") === "true") {
            validarCampo(campo);
          }
        });
      });

      form.addEventListener("submit", function (e) {
        e.preventDefault();

        var valido = true;
        var primeiroInvalido = null;

        campos.forEach(function (campo) {
          var ok = validarCampo(campo);
          if (!ok) {
            valido = false;
            if (!primeiroInvalido) primeiroInvalido = campo;
          }
        });

        if (!valido) {
          if (primeiroInvalido) primeiroInvalido.focus();
          return;
        }

        var sucesso = qs(".form-sucesso", form);
        var botao = qs(".botao, button[type='submit']", form);

        if (sucesso) {
          sucesso.classList.add("is-visible");
          sucesso.setAttribute("role", "status");
        }

        if (botao) {
          botao.setAttribute("disabled", "true");
          botao.textContent = "Enviado ✓";
        }

        // Observação: este formulário é apenas demonstrativo (front-end).
        // Para envio real, integre com seu backend ou serviço de e-mail aqui.
        setTimeout(function () {
          form.reset();
          campos.forEach(function (campo) {
            campo.removeAttribute("aria-invalid");
          });
        }, 400);
      });
    });
  })();
})();