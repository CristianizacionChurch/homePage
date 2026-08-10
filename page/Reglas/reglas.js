(function () {
  "use strict";

  var RULES = [
    "No armas blancas, ni de fuego",
    "No objetos punzantes",
    "No drogas",
    "No cigarrillos, no cigarrillos electrónicos, vapers, No hookah",
    "No bebidas alcohólicas",
    "Respetar la propiedad y las instalaciones",
    "Evitar la entrada a las cabañas del sexo opuesto",
    "Tirar la basura al zafacón y en las zonas indicadas",
    "Utilizar ropa adecuada para cada actividad",
    "Mantener baños y cabañas limpias y organizadas",
    "Cuidar sus pertenencias personales",
    "Participar en las actividades del campamento",
    "Respetar los tiempos programados para cada actividad",
    "Colaborar con el equipo asignado"
  ];

  var form = document.getElementById("aceptarForm");
  var nombreInput = document.getElementById("nombre");
  var contactoInput = document.getElementById("contactoEmergencia");
  var condicionInput = document.getElementById("condicionMedica");
  var alergiasInput = document.getElementById("alergias");
  var aceptoCheck = document.getElementById("acepto");
  var btn = document.getElementById("aceptarBtn");
  var msg = document.getElementById("msg");

  function showMsg(text, ok) {
    msg.textContent = text;
    msg.className = ok
      ? "mt-6 p-4 rounded-xl border border-emerald-400/40 bg-emerald-500/10 text-emerald-400 font-semibold text-center text-sm"
      : "mt-6 text-center text-sm text-alert";
  }

  function savePdf(doc, filename) {
    var isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    if (isMobile) {
      // Mobile: abrir en pestaña nueva (los navegadores bloquean el atributo download en callbacks async)
      var url = doc.output("bloburl");
      var win = window.open(url, "_blank");
      if (!win) {
        var a = document.createElement("a");
        a.href = url;
        a.download = filename;
        a.rel = "noopener";
        document.body.appendChild(a);
        a.click();
        setTimeout(function () { document.body.removeChild(a); }, 100);
      }
    } else {
      doc.save(filename);
    }
  }

  function downloadPdf(nombre, contacto, condicion, alergias) {
    var logo = new Image();
    logo.onload = function () {
      var canvas = document.createElement("canvas");
      canvas.width = 120;
      canvas.height = Math.round(120 * (logo.height / logo.width));
      var ctx = canvas.getContext("2d");
      ctx.drawImage(logo, 0, 0, canvas.width, canvas.height);
      renderPdf(nombre, contacto, condicion, alergias, canvas.toDataURL("image/png"));
    };
    logo.onerror = function () {
      renderPdf(nombre, contacto, condicion, alergias, null);
    };
    logo.src = "../../img/favicon.svg";
  }

  function renderPdf(nombre, contacto, condicion, alergias, logoDataUrl) {
    try {
      var doc = new window.jspdf.jsPDF();
      if (logoDataUrl) {
        doc.addImage(logoDataUrl, "PNG", 95, 5, 20, 30);
      }
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.text("MAYDAY 2026 - Reglas del Campamento", 105, 42, { align: "center" });

      doc.setFontSize(13);
      doc.text("SECCION PERSONAL", 15, 56);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      var y = 64;
      var personalFields = [
        ["Nombre", nombre],
        ["Contacto de emergencia", contacto],
        ["Condicion medica", condicion],
        ["Alergias", alergias]
      ];
      personalFields.forEach(function (field) {
        doc.text(field[0] + ": " + field[1], 15, y);
        y += 6;
      });

      y += 6;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.text("SECCION REGLAS", 15, y);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      y += 8;
      RULES.forEach(function (rule, i) {
        doc.splitTextToSize((i + 1) + ". " + rule, 180).forEach(function (line) {
          if (y > 270) { doc.addPage(); y = 20; }
          doc.text(line, 15, y);
          y += 6;
        });
      });
      y += 10;
      if (y > 270) { doc.addPage(); y = 20; }
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.text("Yo, " + nombre + ", acepto acatarme a las reglas del campamento.", 15, y);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text("Fecha: " + new Date().toLocaleDateString("es-DO"), 15, y + 8);
      savePdf(doc, "reglas-campamento-aceptacion.pdf");
    } catch (err) {
      showMsg("No se pudo generar el PDF. Revisa tu conexion o intentalo de nuevo.", false);
      return;
    }
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    var nombre = nombreInput.value.trim();
    var contacto = contactoInput.value.trim();
    var condicion = condicionInput.value.trim();
    var alergias = alergiasInput.value.trim();

    if (!nombre) {
      showMsg("Por favor escribe tu nombre completo.", false);
      nombreInput.focus();
      return;
    }
    if (!contacto) {
      showMsg("Por favor escribe tu contacto de emergencia.", false);
      contactoInput.focus();
      return;
    }
    if (!condicion) {
      showMsg("Por favor escribe tu condicion medica.", false);
      condicionInput.focus();
      return;
    }
    if (!alergias) {
      showMsg("Por favor escribe tus alergias.", false);
      alergiasInput.focus();
      return;
    }
    if (!aceptoCheck.checked) {
      showMsg("Debes marcar la casilla para aceptar las reglas.", false);
      return;
    }

    var btnOriginal = btn.innerHTML;
    var dataSuccess = false;
    btn.disabled = true;
    btn.textContent = "Registrando...";
    fetch("/api/reglas-accept", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nombre: nombre,
        contactoEmergencia: contacto,
        condicionMedica: condicion,
        alergias: alergias,
        acepto: true
      })
    })
      .then(function (res) { return res.json(); })
      .then(function (data) {
        if (data.success) {
          dataSuccess = true;
          showMsg("Datos registrados exitosamente.", true);
          downloadPdf(nombre, contacto, condicion, alergias);
          btn.disabled = true;
          btn.innerHTML = '<span class="material-icons-outlined">check_circle</span> Registrado';
          nombreInput.value = "";
          contactoInput.value = "";
          condicionInput.value = "";
          alergiasInput.value = "";
          aceptoCheck.checked = false;
        } else {
          showMsg(data.error || "Error al registrar. Intenta de nuevo.", false);
        }
      })
      .catch(function () {
        showMsg("Error de conexion. Intenta de nuevo.", false);
      })
      .finally(function () {
        if (!dataSuccess) {
          btn.disabled = false;
          btn.innerHTML = btnOriginal;
        }
      });
  });
})();
