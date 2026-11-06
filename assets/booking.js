(function () {
  var form = document.getElementById("booking-form");
  if (!form) return;

  var room = document.getElementById("room");
  var musician = document.getElementById("musician");
  var firstVisit = document.getElementById("firstVisit");
  var start = document.getElementById("start");
  var end = document.getElementById("end");
  var estimate = document.getElementById("estimate");
  var estimateField = document.getElementById("estimate-field");
  var discountNote = document.getElementById("discount-note");
  var error = document.getElementById("booking-error");
  var submitBtn = form.querySelector('button[type="submit"]');
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
    var hours = hoursBetween(start.value, end.value);
    var full = rate * hours;
    var total = full;
    var valid = !!(start.value && end.value && hours >= 2);
    if (firstVisit.checked) total = full * 0.75;
    estimate.textContent = "$" + total.toFixed(0);
    estimateField.value = "$" + total.toFixed(0);
    if (discountNote) {
      if (firstVisit.checked && hours > 0) {
        discountNote.hidden = false;
        discountNote.textContent = "25% first-visit discount applied (full price $" + full.toFixed(0) + ").";
      } else {
        discountNote.hidden = true;
      }
    }
    if (error) {
      error.hidden = !(start.value && end.value && hours < 2);
    }
    if (submitBtn) submitBtn.disabled = !valid;
    return valid;
  }

  [room, musician, firstVisit, start, end].forEach(function (el) {
    if (!el) return;
    el.addEventListener("change", updateEstimate);
    el.addEventListener("input", updateEstimate);
  });
  updateEstimate();

  // Enforce the 2-hour minimum even if the button state is bypassed.
  form.addEventListener("submit", function (ev) {
    if (!updateEstimate()) {
      ev.preventDefault();
      if (error) error.hidden = false;
    }
  });

  // FormSubmit has had Cloudflare 522 outages (Nov 5, 2026: its origin
  // stopped responding, so a plain form post landed on a Cloudflare error
  // page and the booking was lost). Send through its AJAX endpoint with a
  // 12-second timeout instead: on success, go to the confirmation page as
  // before; on any failure, save the visitor's details and send them to the
  // "try again in an hour" page, which pre-fills an email to the studio so
  // the booking isn't lost. Without fetch, the form posts natively as before.
  form.addEventListener("submit", function (ev) {
    if (!updateEstimate()) return; // invalid: the handler above already blocked it
    if (!window.fetch || !window.AbortController) return;
    ev.preventDefault();
    if (submitBtn) submitBtn.disabled = true;
    var controller = new AbortController();
    var timer = setTimeout(function () { controller.abort(); }, 12000);
    var data = new FormData(form);
    fetch("https://formsubmit.co/ajax/studio@mohikontok.com", {
      method: "POST",
      body: data,
      signal: controller.signal,
      headers: { Accept: "application/json" }
    })
      .then(function (resp) {
        clearTimeout(timer);
        if (!resp.ok) throw new Error("FormSubmit error " + resp.status);
        return resp.json();
      })
      .then(function () {
        window.location.href = "https://mohikontok.com/index.html?booked=1";
      })
      .catch(function () {
        clearTimeout(timer);
        if (submitBtn) submitBtn.disabled = false;
        try {
          if (window.sessionStorage) {
            var lines = [];
            data.forEach(function (v, k) {
              if (k.charAt(0) !== "_") lines.push(k + ": " + v);
            });
            sessionStorage.setItem("mohikontok-booking", JSON.stringify(lines));
          }
        } catch (e) { /* the page still works without the saved details */ }
        window.location.href = "https://mohikontok.com/booking-unavailable.html";
      });
  });
})();
