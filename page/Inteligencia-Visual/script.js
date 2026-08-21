(function () {
  "use strict";

  var gallery = document.getElementById("gallery");
  var lightbox = document.getElementById("lightbox");
  var lightboxImg = document.getElementById("lightboxImg");

  function render(sections) {
    if (!sections || sections.length === 0) {
      gallery.innerHTML = '<p class="empty-msg">Las fotos estarán disponibles próximamente.</p>';
      return;
    }
    var html = sections.map(function (s) {
      var photos = s.fotos.map(function (f) {
        return '<div class="gallery-item" data-url="' + f.url + '" data-name="' + (f.name || '') + '">' +
               '<img loading="lazy" src="' + f.url + '" alt="' + (f.name || 'Foto') + '"/>' +
               '</div>';
      }).join("");
      return '<section class="gallery-section"><h2 class="gallery-title">' + s.seccion + '</h2>' +
             '<div class="gallery-grid">' + photos + '</div></section>';
    }).join("");
    gallery.innerHTML = html;
  }

  function openLightbox(url) {
    lightboxImg.src = url;
    lightbox.classList.remove("hidden");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    lightbox.classList.add("hidden");
    lightboxImg.src = "";
    document.body.style.overflow = "";
  }

  gallery.addEventListener("click", function (e) {
    var item = e.target.closest(".gallery-item");
    if (item) openLightbox(item.dataset.url);
  });
  lightbox.addEventListener("click", closeLightbox);
  document.getElementById("lightboxClose").addEventListener("click", closeLightbox);
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeLightbox();
  });

  fetch("/api/camp-fotos")
    .then(function (r) { if (!r.ok) throw new Error("HTTP " + r.status); return r.json(); })
    .then(render)
    .catch(function () {
      gallery.innerHTML = '<p class="empty-msg">No se pudieron cargar las fotos. Intenta de nuevo.</p>';
    });
})();