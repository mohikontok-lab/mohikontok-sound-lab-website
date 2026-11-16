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

  // The time selects show AM/PM labels ("7:00 PM") but submit 24-hour
  // values ("19:00"), and FormSubmit echoes the raw values in the email.
  // Report the label the visitor actually picked, so the booking email
  // reads in regular 12-hour time.
  function selectedLabel(el) {
    if (!el || !el.value) return null;
    var opt = el.options[el.selectedIndex];
    return opt ? opt.text : null;
  }

  // "2026-11-20" -> "Friday, November 20, 2026". Anchored on UTC so the
  // calendar date is the one entered, whatever the visitor's timezone.
  function formatDateLong(v) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(v || "");
    if (!m) return v;
    var d = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3]));
    var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    return days[d.getUTCDay()] + ", " + months[d.getUTCMonth()] + " " + (+m[3]) + ", " + m[1];
  }

  // Submission moment in New York local time, e.g. "Sunday, November 15,
  // 2026 at 9:39 PM EST". FormSubmit's own "Submitted at" footer is UTC
  // and can't be changed, so this row carries the local time instead.
  function formatSubmittedAt(d) {
    try {
      return new Intl.DateTimeFormat("en-US", {
        timeZone: "America/New_York",
        weekday: "long", year: "numeric", month: "long", day: "numeric",
        hour: "numeric", minute: "2-digit", hour12: true, timeZoneName: "short"
      }).format(d);
    } catch (e) {
      return d.toString();
    }
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
    // Report times the way the visitor saw them: 12-hour AM/PM, a
    // spelled-out date, and the submission moment in New York time.
    // (The estimate math above still uses the raw 24-hour values.)
    var startLabel = selectedLabel(start);
    var endLabel = selectedLabel(end);
    if (startLabel) data.set("Start time", startLabel);
    if (endLabel) data.set("End time", endLabel);
    var dateVal = data.get("Date");
    if (dateVal) data.set("Date", formatDateLong(dateVal));
    data.set("Submitted New York time", formatSubmittedAt(new Date()));
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
