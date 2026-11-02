(function () {
  var form = document.getElementById("booking-form");
  if (!form) return;

  var room = document.getElementById("room");
  var musician = document.getElementById("musician");
  var start = document.getElementById("start");
  var end = document.getElementById("end");
  var estimate = document.getElementById("estimate");
  var estimateField = document.getElementById("estimate-field");
  var banner = document.getElementById("booked-banner");

  if (banner && new URLSearchParams(window.location.search).get("booked") === "1") {
    banner.hidden = false;
  }

  function hoursBetween(s, e) {
    if (!s || !e) return 0;
    var a = s.split(":").map(Number);
    var b = e.split(":").map(Number);
    var h = (b[0] * 60 + b[1] - (a[0] * 60 + a[1])) / 60;
    return h > 0 ? h : 0;
  }

  function updateEstimate() {
    var rate = parseFloat(room.options[room.selectedIndex].dataset.rate) || 0;
    if (musician.checked) rate += 30;
    var total = "$" + (rate * hoursBetween(start.value, end.value)).toFixed(0);
    estimate.textContent = total;
    estimateField.value = total;
  }

  [room, musician, start, end].forEach(function (el) {
    el.addEventListener("change", updateEstimate);
    el.addEventListener("input", updateEstimate);
  });
  updateEstimate();

  // Let the form submit natively to the form endpoint; just refresh the
  // hidden estimate field first so the submitted value is current.
  form.addEventListener("submit", updateEstimate);
})();
