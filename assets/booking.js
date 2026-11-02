(function () {
  var form = document.getElementById("booking-form");
  if (!form) return;

  var room = document.getElementById("room");
  var musician = document.getElementById("musician");
  var estimate = document.getElementById("estimate");
  var result = document.getElementById("booking-result");

  function hoursBetween(start, end) {
    if (!start || !end) return 0;
    var s = start.split(":").map(Number);
    var e = end.split(":").map(Number);
    var h = (e[0] * 60 + e[1] - (s[0] * 60 + s[1])) / 60;
    return h > 0 ? h : 0;
  }

  function updateEstimate() {
    var rate = parseFloat(room.value) || 0;
    if (musician.checked) rate += 30;
    var h = hoursBetween(form.start.value, form.end.value);
    estimate.textContent = "$" + (rate * h).toFixed(0);
  }

  ["room", "musician", "start", "end"].forEach(function (id) {
    var el = document.getElementById(id) || form[id];
    if (el) el.addEventListener("change", updateEstimate);
  });
  form.start.addEventListener("input", updateEstimate);
  form.end.addEventListener("input", updateEstimate);
  updateEstimate();

  form.addEventListener("submit", function (ev) {
    ev.preventDefault();
    updateEstimate();
    var summary = "Request: " + form.sessionType.value + ", " +
      room.options[room.selectedIndex].text + ", " + form.date.value +
      " " + form.start.value + "–" + form.end.value +
      ", " + (form.participants.value || 1) + " participant(s)" +
      ", estimated " + estimate.textContent + ".";
    result.textContent = summary + " To confirm, send this request to hello@mohikontoksoundlab.com or call (929) 244-4144.";
    result.hidden = false;
  });
})();
