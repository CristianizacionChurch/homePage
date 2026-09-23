(function () {
  "use strict";

  var gallery = document.getElementById("gallery");
  var lightbox = document.getElementById("lightbox");
  var lightboxImg = document.getElementById("lightboxImg");
  var lightboxDownload = document.getElementById("lightboxDownload");

  var PLACEHOLDER = "data:image/svg+xml," + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="160" height="120" fill="%23333"><rect width="160" height="120"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="%23777" font-size="12">Sin imagen</text></svg>');

  function thumbUrl(id) {
    return "/api/camp-foto?id=" + id;
  }

  function fallbackUrl(id) {
    return "https://lh3.googleusercontent.com/d/" + id + "=w1600";
  }

  function onImgError(e) {
    var img = e.target;
    var retries = parseInt(img.getAttribute("data-retries") || "0", 10);
    var id = img.getAttribute("data-id");
    if (retries === 0 && id) {
      img.setAttribute("data-retries", "1");
      img.src = fallbackUrl(id);
    } else if (retries === 1 && id) {
      img.setAttribute("data-retries", "2");
      img.src = "https://drive.google.com/thumbnail?id=" + id + "&sz=w1600";
    } else {
      img.src = PLACEHOLDER;
    }
  }

  function toggleSection(idx) {
    var sections = gallery.querySelectorAll(".gallery-section");
    sections.forEach(function (sec, i) {
      var grid = sec.querySelector(".gallery-grid");
      var header = sec.querySelector(".gallery-header");
      if (i === idx) {
        var isOpen = grid.classList.contains("gallery-open");
        grid.classList.toggle("gallery-open");
        header.setAttribute("aria-expanded", !isOpen);
      } else {
        grid.classList.remove("gallery-open");
        header.setAttribute("aria-expanded", "false");
      }
    });
  }

  function render(sections) {
    if (!sections || sections.length === 0) {
      gallery.innerHTML = '<p class="empty-msg">Las fotos estarán disponibles próximamente.</p>';
      return;
    }
    var html = sections.map(function (s) {
      var photos = s.fotos.filter(function (f) {
        return /\.(jpe?g|png|webp|gif)$/i.test(f.name || "");
      }).map(function (f) {
        var imgSrc = thumbUrl(f.id);
        return '<div class="gallery-item" data-url="' + imgSrc + '" data-id="' + f.id + '" data-name="' + (f.name || '') + '">' +
               '<img loading="lazy" data-id="' + f.id + '" data-retries="0" src="' + imgSrc + '" alt="' + (f.name || 'Foto') + '" onerror="(' + onImgError.toString() + ')(event)"/>' +
               '</div>';
      }).join("");
      return '<section class="gallery-section">' +
             '<button class="gallery-header" aria-expanded="false"><h2 class="gallery-title">' + s.seccion + '</h2><span class="gallery-chevron"></span></button>' +
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
    var header = e.target.closest(".gallery-header");
    if (header) {
      var section = header.closest(".gallery-section");
      var idx = Array.prototype.indexOf.call(gallery.querySelectorAll(".gallery-section"), section);
      toggleSection(idx);
      return;
    }
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
