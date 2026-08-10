(function () {
  "use strict";

  var tbody = document.getElementById("registroBody");

  fetch("/api/reglas-acceptances")
    .then(function (res) { return res.json(); })
    .then(function (records) {
      if (!records.length) {
        tbody.innerHTML = '<tr><td colspan="3" class="px-4 py-8 text-center text-white/40">Aún no hay aceptaciones registradas.</td></tr>';
        return;
      }

      var rows = records.slice().reverse().map(function (r) {
        var fecha = new Date(r.fecha).toLocaleDateString("es-DO");
        return '<tr class="border-b border-fire-700/10">' +
          '<td class="px-4 py-3 text-white/80">' + r.nombre + '</td>' +
          '<td class="px-4 py-3 text-emerald-400 font-semibold">Sí</td>' +
          '<td class="px-4 py-3 text-white/50">' + fecha + '</td>' +
          '</tr>';
      });
      tbody.innerHTML = rows.join("");
    })
    .catch(function () {
      tbody.innerHTML = '<tr><td colspan="3" class="px-4 py-8 text-center text-alert">No se pudo cargar el registro.</td></tr>';
    });
})();
