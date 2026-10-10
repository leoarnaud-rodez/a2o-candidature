/* Seul fichier JavaScript du site. Écrit avec l'aide de Claude (voir la page « Comment j'ai utilisé l'IA »).
   Il fait trois choses :
   1. mémoriser le thème clair ou sombre choisi par le visiteur ;
   2. ouvrir et fermer le menu sur téléphone ;
   3. animer légèrement l'accueil (particules et forme liquide).
   Le site fonctionne sans lui : les pages restent lisibles, en thème clair, sans animation. */
(function () {
  var root = document.documentElement;
  var reduceMotion = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);

  // Thème appliqué tout de suite (le fichier est chargé dans <head>) pour éviter un flash.
  try {
    var saved = localStorage.getItem("theme");
    if (saved === "dark") root.setAttribute("data-theme", "dark");
  } catch (e) { /* stockage indisponible : on reste en thème clair */ }

  /* ---------- Particules ---------- */
  function initParticles() {
    var canvas = document.getElementById("hero-canvas");
    if (!canvas || !canvas.getContext) return;
    var ctx = canvas.getContext("2d");
    var hero = canvas.parentNode;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var w = 0, h = 0, particles = [], running = false, visible = true, frame = 0;
    var rgb = "36,79,158";
    var pointer = { x: -9999, y: -9999 };

    function readColor() {
      var c = getComputedStyle(root).getPropertyValue("--accent").trim();
      var m = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(c);
      if (m) rgb = parseInt(m[1], 16) + "," + parseInt(m[2], 16) + "," + parseInt(m[3], 16);
    }

    function resize() {
      w = hero.clientWidth;
      h = hero.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var count = Math.max(14, Math.min(44, Math.round((w * h) / 24000)));
      particles = [];
      for (var i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: 1 + Math.random() * 1.8,
          vx: (Math.random() - 0.5) * 0.22,
          vy: (Math.random() - 0.5) * 0.22,
          a: 0.25 + Math.random() * 0.35
        });
      }
    }

    function draw(move) {
      ctx.clearRect(0, 0, w, h);
      var i, j, p, q, dx, dy, d;
      for (i = 0; i < particles.length; i++) {
        p = particles[i];
        if (move) {
          // léger recul quand le pointeur passe à proximité
          dx = p.x - pointer.x; dy = p.y - pointer.y; d = Math.sqrt(dx * dx + dy * dy);
          if (d < 110 && d > 0.1) { p.x += (dx / d) * 0.6; p.y += (dy / d) * 0.6; }
          p.x += p.vx; p.y += p.vy;
          if (p.x < -10) p.x = w + 10; else if (p.x > w + 10) p.x = -10;
          if (p.y < -10) p.y = h + 10; else if (p.y > h + 10) p.y = -10;
        }
        ctx.fillStyle = "rgba(" + rgb + "," + p.a + ")";
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.2832); ctx.fill();
      }
      // traits très discrets entre particules proches
      ctx.lineWidth = 1;
      for (i = 0; i < particles.length; i++) {
        for (j = i + 1; j < particles.length; j++) {
          p = particles[i]; q = particles[j];
          dx = p.x - q.x; dy = p.y - q.y; d = dx * dx + dy * dy;
          if (d < 8100) {
            ctx.strokeStyle = "rgba(" + rgb + "," + (0.1 * (1 - d / 8100)) + ")";
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
          }
        }
      }
    }

    function loop() {
      if (!running) return;
      frame++;
      if (frame % 40 === 0) readColor();
      draw(true);
      window.requestAnimationFrame(loop);
    }
    function start() { if (!running && visible && !document.hidden && !reduceMotion) { running = true; window.requestAnimationFrame(loop); } }
    function stop() { running = false; }

    readColor(); resize(); draw(false);
    window.addEventListener("resize", function () { resize(); draw(false); });
    window.addEventListener("themechange", function () { readColor(); if (!running) draw(false); });

    if (reduceMotion) return; // image fixe, aucune animation

    hero.addEventListener("pointermove", function (e) {
      var r = hero.getBoundingClientRect();
      pointer.x = e.clientX - r.left; pointer.y = e.clientY - r.top;
    });
    hero.addEventListener("pointerleave", function () { pointer.x = -9999; pointer.y = -9999; });
    document.addEventListener("visibilitychange", function () { if (document.hidden) stop(); else start(); });
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        visible = entries[0].isIntersecting;
        if (visible) start(); else stop();
      }).observe(hero);
    }
    start();
  }

  /* ---------- Forme liquide : l'animation SVG est faite en balisage, on la fige si besoin ---------- */
  function initBlob() {
    if (!reduceMotion) return;
    var svgs = document.querySelectorAll("svg.blob");
    for (var i = 0; i < svgs.length; i++) {
      if (svgs[i].pauseAnimations) svgs[i].pauseAnimations();
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    var themeBtn = document.getElementById("theme-toggle");
    var menuBtn = document.getElementById("menu-toggle");
    var menu = document.getElementById("site-menu");

    function isDark() { return root.getAttribute("data-theme") === "dark"; }

    function paintThemeButton() {
      if (!themeBtn) return;
      themeBtn.textContent = isDark() ? "Mode clair" : "Mode sombre";
      themeBtn.setAttribute("aria-pressed", isDark() ? "true" : "false");
    }

    if (themeBtn) {
      paintThemeButton();
      themeBtn.addEventListener("click", function () {
        if (isDark()) { root.removeAttribute("data-theme"); }
        else { root.setAttribute("data-theme", "dark"); }
        try { localStorage.setItem("theme", isDark() ? "dark" : "light"); } catch (e) { /* ignoré */ }
        paintThemeButton();
        window.dispatchEvent(new Event("themechange"));
      });
    }

    if (menuBtn && menu) {
      menuBtn.addEventListener("click", function () {
        var open = menu.getAttribute("data-open") === "true";
        menu.setAttribute("data-open", open ? "false" : "true");
        menuBtn.setAttribute("aria-expanded", open ? "false" : "true");
      });
      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && menu.getAttribute("data-open") === "true") {
          menu.setAttribute("data-open", "false");
          menuBtn.setAttribute("aria-expanded", "false");
          menuBtn.focus();
        }
      });
    }

    initParticles();
    initBlob();
  });
})();
