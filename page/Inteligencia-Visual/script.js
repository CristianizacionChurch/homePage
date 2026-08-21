(function () {
  "use strict";

  var gallery = document.getElementById("gallery");
  var lightbox = document.getElementById("lightbox");
  var lightboxImg = document.getElementById("lightboxImg");
  var lightboxDownload = document.getElementById("lightboxDownload");

  var PLACEHOLDER = "data:image/svg+xml," + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="160" height="120" fill="%23333"><rect width="160" height="120"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="%23777" font-size="12">Sin imagen</text></svg>');

  function thumbUrl(id) {
    return "https://lh3.googleusercontent.com/d/" + id + "=w1600";
  }

  function fallbackUrl(id) {
    return "https://drive.google.com/thumbnail?id=" + id + "&sz=w1600";
  }

  function onImgError(e) {
    var img = e.target;
    var retries = parseInt(img.getAttribute("data-retries") || "0", 10);
    var id = img.getAttribute("data-id");
    if (retries === 0 && id) {
      img.setAttribute("data-retries", "1");
      img.src = fallbackUrl(id);
    } else if (retries < 2 && id) {
      img.setAttribute("data-retries", "2");
      img.src = thumbUrl(id);
    } else {
      img.src = PLACEHOLDER;
    }
  }

  function render(sections) {
    if (!sections || sections.length === 0) {
      gallery.innerHTML = '<p class="empty-msg">Las fotos estarán disponibles próximamente.</p>';
      return;
    }
    var html = sections.map(function (s) {
      var photos = s.fotos.map(function (f) {
        var imgSrc = thumbUrl(f.id);
        return '<div class="gallery-item" data-url="' + imgSrc + '" data-id="' + f.id + '" data-name="' + (f.name || '') + '">' +
               '<img loading="lazy" data-id="' + f.id + '" data-retries="0" src="' + imgSrc + '" alt="' + (f.name || 'Foto') + '" onerror="(' + onImgError.toString() + ')(event)"/>' +
               '</div>';
      }).join("");
      return '<section class="gallery-section"><h2 class="gallery-title">' + s.seccion + '</h2>' +
             '<div class="gallery-grid">' + photos + '</div></section>';
    }).join("");
    gallery.innerHTML = html;
  }

  function openLightbox(url, id, name) {
    lightboxImg.src = url;
    lightboxDownload.href = "/api/camp-foto?id=" + id;
    lightboxDownload.download = name || "foto";
    lightbox.classList.add("lightbox-open");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    lightbox.classList.remove("lightbox-open");
    lightboxImg.src = "";
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
