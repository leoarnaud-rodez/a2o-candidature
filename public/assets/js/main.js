/* Seul fichier JavaScript du site. Il fait deux choses :
   1. mémoriser le thème clair ou sombre choisi par le visiteur ;
   2. ouvrir et fermer le menu sur téléphone.
   Le site fonctionne sans lui : les pages restent lisibles, en thème clair. */
(function () {
  var root = document.documentElement;

  // Appliqué tout de suite (le fichier est chargé dans <head>) pour éviter un flash de thème.
  try {
    var saved = localStorage.getItem("theme");
    if (saved === "dark") root.setAttribute("data-theme", "dark");
  } catch (e) { /* stockage indisponible : on reste en thème clair */ }

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
  });
})();
