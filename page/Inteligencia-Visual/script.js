(function () {
  "use strict";

  var gallery = document.getElementById("gallery");
  var lightbox = document.getElementById("lightbox");
  var lightboxImg = document.getElementById("lightboxImg");
  var lightboxDownload = document.getElementById("lightboxDownload");

  function render(sections) {
    if (!sections || sections.length === 0) {
      gallery.innerHTML = '<p class="empty-msg">Las fotos estarán disponibles próximamente.</p>';
      return;
    }
    var html = sections.map(function (s) {
      var photos = s.fotos.map(function (f) {
        return '<div class="gallery-item" data-url="' + f.url + '" data-id="' + f.id + '" data-name="' + (f.name || '') + '">' +
               '<img loading="lazy" src="' + f.url + '" alt="' + (f.name || 'Foto') + '"/>' +
               '</div>';
      }).join("");
      return '<section class="gallery-section"><h2 class="gallery-title">' + s.seccion + '</h2>' +
             '<div class="gallery-grid">' + photos + '</div></section>';
    }).join("");
    gallery.innerHTML = html;
  }

  function openLightbox(url, id, name) {
    lightboxImg.src = url;
    // Configurar handler de descarga
    var lightboxDownload = document.getElementById("lightboxDownload");
    lightboxDownload.onclick = function(e) {
        e.preventDefault();
        fetch("https://drive.google.com/uc?export=download&id=" + id)
            .then(r => r.blob())
            .then(blob => {
                var a = document.createElement("a");
                a.href = URL.createObjectURL(blob);
                a.download = name || "foto";
                a.click();
                URL.revokeObjectURL(a.href);
            });
    };
    lightbox.classList.add("lightbox-open");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    lightbox.classList.remove("lightbox-open");
    lightboxImg.src = "";
    // Reset download handler
    var lightboxDownload = document.getElementById("lightboxDownload");
    lightboxDownload.onclick = null;
    document.body.style.overflow = "";
  }

  gallery.addEventListener("click", function (e) {
    var item = e.target.closest(".gallery-item");
    if (item) openLightbox(item.dataset.url, item.dataset.id, item.dataset.name);
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