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
  var aceptoCheck = document.getElementById("acepto");
  var btn = document.getElementById("aceptarBtn");
  var msg = document.getElementById("msg");
  var registroLink = document.getElementById("registroLink");

  function showMsg(text, ok) {
    msg.textContent = text;
    msg.className = "mt-6 text-center text-sm " + (ok ? "text-emerald-400" : "text-alert");
  }

  function downloadPdf(nombre) {
    try {
      var doc = new window.jspdf.jsPDF();
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.text("MAYDAY 2026 - Reglas del Campamento", 105, 20, { align: "center" });
      doc.setFontSize(12);
      doc.text("Normas Durante Su Estadía", 105, 30, { align: "center" });
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      var y = 42;
      RULES.forEach(function (rule, i) {
        doc.splitTextToSize((i + 1) + ". " + rule, 180).forEach(function (line) {
          if (y > 270) { doc.addPage(); y = 20; }
          doc.text(line, 15, y);
          y += 6;
        });
      });
      y += 12;
      if (y > 270) { doc.addPage(); y = 20; }
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text("Yo, " + nombre + ", acepto acatarme a las reglas del campamento.", 15, y);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text("Fecha: " + new Date().toLocaleDateString("es-DO"), 15, y + 8);
      doc.save("reglas-campamento-aceptacion.pdf");
    } catch (err) {
      showMsg("No se pudo generar el PDF. Revisa tu conexión o inténtalo de nuevo.", false);
      return;
    }
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    var nombre = nombreInput.value.trim();

    if (!nombre) {
      showMsg("Por favor escribe tu nombre completo.", false);
      nombreInput.focus();
      return;
    }
    if (!aceptoCheck.checked) {
      showMsg("Debes marcar la casilla para aceptar las reglas.", false);
      return;
    }

    var btnOriginal = btn.innerHTML;
    btn.disabled = true;
    btn.textContent = "Registrando...";
    fetch("/api/reglas-accept", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre: nombre, acepto: true })
    })
      .then(function (res) { return res.json(); })
      .then(function (data) {
        if (data.success) {
          showMsg("Aceptación registrada con éxito.", true);
          downloadPdf(nombre);
          registroLink.hidden = false;
        } else {
          showMsg(data.error || "Error al registrar. Intenta de nuevo.", false);
        }
      })
      .catch(function () {
        showMsg("Error de conexión. Intenta de nuevo.", false);
      })
      .finally(function () {
        btn.disabled = false;
        btn.innerHTML = btnOriginal;
      });
  });
})();
