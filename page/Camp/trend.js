(function () {
  "use strict";

  var CANVAS_WIDTH = 1080;
  var CANVAS_HEIGHT = 1920;
  var CIRCLE_RADIUS = 340;
  var CIRCLE_CENTER_X = CANVAS_WIDTH / 2;
  var CIRCLE_CENTER_Y = 700;
  var DIAMETER = CIRCLE_RADIUS * 2;

  // Circle geometry per template — extracted from SVG viewBox (810x1440), scaled to 1080x1920
  // Scale factor: 1080/810 = 1.333
  var TEMPLATE_CIRCLES = {
    "fuerza-aerea.svg":  { cx: 540, cy: 900, r: 267 },
    "Fuerza-naval.svg":  { cx: 540, cy: 900, r: 267 },
    "fuerza-terrestre.svg": { cx: 540, cy: 900, r: 267 }
  };

  function getCircleForTemplate(name) {
    return TEMPLATE_CIRCLES[name] || { cx: CIRCLE_CENTER_X, cy: CIRCLE_CENTER_Y, r: CIRCLE_RADIUS };
  }

  var canvas = document.getElementById("trendCanvas");
  var ctx = canvas.getContext("2d");
  var uploadInput = document.getElementById("photoUpload");
  var downloadBtn = document.getElementById("downloadBtn");
  var templateBtns = document.querySelectorAll(".template-btn");

  var userImage = null;
  var currentTemplate = "fuerza-aerea.svg";
  var templateCache = {};
  var templateFailed = {};

  function drawPlaceholder() {
    ctx.fillStyle = "#1C1917";
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    var circle = getCircleForTemplate(currentTemplate);

    ctx.beginPath();
    ctx.arc(circle.cx, circle.cy, circle.r, 0, Math.PI * 2);
    ctx.strokeStyle = "#F97316";
    ctx.lineWidth = 3;
    ctx.setLineDash([10, 10]);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = "rgba(255,255,255,0.3)";
    ctx.font = "600 24px Poppins, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("Sube una foto para comenzar", circle.cx, circle.cy);

    if (templateCache[currentTemplate]) {
      ctx.drawImage(templateCache[currentTemplate], 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    } else if (!templateFailed[currentTemplate]) {
      loadTemplateImage(currentTemplate, function (img) {
        if (img) drawPlaceholder();
      });
    }
  }

  function coverFit(imgW, imgH, diam) {
    var imgAspect = imgW / imgH;
    var sx = 0, sy = 0, sw = imgW, sh = imgH;

    if (imgAspect > 1) {
      sw = imgH;
      sx = (imgW - sw) / 2;
    } else {
      sh = imgW;
      sy = (imgH - sh) / 2;
    }

    return { sx: sx, sy: sy, sw: sw, sh: sh };
  }

  function render() {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.fillStyle = "#1C1917";
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    if (!userImage) {
      drawPlaceholder();
      return;
    }

    var circle = getCircleForTemplate(currentTemplate);
    var diam = circle.r * 2;
    var fit = coverFit(userImage.width, userImage.height, diam);

    // 1. Draw SVG template
    if (templateCache[currentTemplate]) {
      ctx.drawImage(templateCache[currentTemplate], 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      // 2. Punch hole in template so photo can go underneath
      ctx.save();
      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      ctx.arc(circle.cx, circle.cy, circle.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    } else if (!templateFailed[currentTemplate]) {
      loadTemplateImage(currentTemplate, function (img) {
        if (img && userImage) render();
      });
      return;
    }

    // 3. Draw photo clipped to circle (on top of the hole)
    ctx.save();
    ctx.beginPath();
    ctx.arc(circle.cx, circle.cy, circle.r, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(
      userImage,
      fit.sx, fit.sy, fit.sw, fit.sh,
      circle.cx - circle.r, circle.cy - circle.r,
      diam, diam
    );
    ctx.restore();
  }

  function loadTemplateImage(name, callback) {
    if (templateCache[name]) {
      if (callback) callback(templateCache[name]);
      return;
    }

    var img = new Image();
    img.onload = function () {
      templateCache[name] = img;
      if (callback) callback(img);
    };
    img.onerror = function () {
      templateFailed[name] = true;
      if (callback) callback(null);
    };
    img.src = name;
  }

  uploadInput.addEventListener("change", function (e) {
    var file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/") || file.size > 10 * 1024 * 1024) {
      alert("Selecciona una imagen de menos de 10 MB.");
      return;
    }

    var reader = new FileReader();
    reader.onload = function (ev) {
      var img = new Image();
      img.onload = function () {
        userImage = img;
        downloadBtn.disabled = false;
        render();
      };
      img.src = ev.target.result;
    };
    reader.onerror = function () {
      alert("No se pudo leer el archivo.");
    };
    reader.readAsDataURL(file);
  });

  downloadBtn.addEventListener("click", function () {
    if (!userImage) return;
    canvas.toBlob(function (blob) {
      if (!blob) return;
      var url = URL.createObjectURL(blob);
      var a = document.createElement("a");
      a.href = url;
      a.download = "mayday-trend-2026.png";
      a.click();
      URL.revokeObjectURL(url);
    }, "image/png", 1.0);
  });

  templateBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      templateBtns.forEach(function (b) { b.classList.remove("active"); });
      btn.classList.add("active");
      currentTemplate = btn.getAttribute("data-template");
      render();
    });
  });

  drawPlaceholder();
})();
