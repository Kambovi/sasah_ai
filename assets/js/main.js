/* Sasah AI — site behaviour. Settings live in config.js */
(function () {
  var S = window.SITE || {};
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var wa = function (t) { return "https://wa.me/" + (S.WHATSAPP || "") + "?text=" + encodeURIComponent(t || "Hi Sasah AI"); };

  /* ---- Contact details from config ---- */
  $$("[data-wa]").forEach(function (a) { a.href = wa(a.getAttribute("data-wa")); });
  $$("[data-c]").forEach(function (el) {
    var k = el.getAttribute("data-c");
    if (k === "email" && S.EMAIL) { el.textContent = S.EMAIL; if (el.tagName === "A") el.href = "mailto:" + S.EMAIL; }
    if (k === "phone" && S.PHONE_DISPLAY) { el.textContent = S.PHONE_DISPLAY; if (el.tagName === "A") el.href = "tel:" + S.PHONE_DISPLAY.replace(/[^\d+]/g, ""); }
    if (k === "city" && S.CITY) el.textContent = S.CITY;
  });
  /* WhatsApp / phone links stay hidden until a number is set in config.js */
  $$("[data-show]").forEach(function (el) {
    var k = el.getAttribute("data-show");
    if ((k === "wa" && S.WHATSAPP) || (k === "phone" && S.PHONE_DISPLAY)) el.hidden = false;
  });
  $$("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* ---- Mobile drawer ---- */
  var burger = $(".burger"), drawer = $("#drawer");
  if (burger && drawer) burger.addEventListener("click", function () {
    var open = drawer.classList.toggle("open");
    burger.setAttribute("aria-expanded", String(open));
  });
  $$("#drawer a").forEach(function (a) { a.addEventListener("click", function () { drawer.classList.remove("open"); burger.setAttribute("aria-expanded", "false"); }); });

  /* ---- Products dropdown ---- */
  $$(".has-dd").forEach(function (li) {
    var b = $("button", li);
    b.addEventListener("click", function (e) {
      e.stopPropagation();
      var open = li.classList.toggle("open");
      b.setAttribute("aria-expanded", String(open));
    });
  });
  document.addEventListener("click", function () { $$(".has-dd").forEach(function (li) { li.classList.remove("open"); $("button", li).setAttribute("aria-expanded", "false"); }); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") document.body.click(); });

  /* ---- Tabs ---- */
  $$('[role="tablist"]').forEach(function (list) {
    var tabs = $$('[role="tab"]', list);
    function select(t, focus) {
      tabs.forEach(function (x) {
        var on = x === t;
        x.setAttribute("aria-selected", String(on)); x.tabIndex = on ? 0 : -1;
        document.getElementById(x.getAttribute("aria-controls")).hidden = !on;
      });
      if (focus) t.focus();
    }
    tabs.forEach(function (t, i) {
      t.addEventListener("click", function () { select(t, true); });
      t.addEventListener("keydown", function (e) {
        if (e.key === "ArrowRight") select(tabs[(i + 1) % tabs.length], true);
        if (e.key === "ArrowLeft") select(tabs[(i - 1 + tabs.length) % tabs.length], true);
      });
    });
  });

  /* ---- Enquiry forms (Formspree if set, else the visitor's email app) ---- */
  $$("form[data-enquiry]").forEach(function (form) {
    var status = $(".status", form);
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      status.className = "status"; status.textContent = "";
      if (!form.checkValidity()) {
        status.className = "status err";
        status.textContent = "Please fill the required fields and tick the consent box.";
        var bad = $(":invalid", form); if (bad) bad.focus();
        return;
      }
      if (form._gotcha && form._gotcha.value) return;
      var fd = new FormData(form);
      fd.append("page", location.pathname);
      if (S.FORMSPREE_ID) {
        var btn = $('button[type="submit"]', form); btn.disabled = true;
        fetch("https://formspree.io/f/" + S.FORMSPREE_ID, { method: "POST", headers: { Accept: "application/json" }, body: fd })
          .then(function (r) { if (!r.ok) throw new Error(); form.reset(); status.className = "status ok"; status.textContent = "Thank you! We'll get back to you within 1 working day."; })
          .catch(function () { status.className = "status err"; status.textContent = "Could not send. Please email us at " + (S.EMAIL || "our email") + "."; })
          .then(function () { btn.disabled = false; });
      } else {
        var lines = ["New enquiry — Sasah AI"];
        fd.forEach(function (v, k) { if (k !== "_gotcha" && k !== "consent" && v) lines.push(k.replace(/_/g, " ") + ": " + v); });
        var subject = "Website enquiry" + (fd.get("interested_in") ? " – " + fd.get("interested_in") : "");
        location.href = "mailto:" + (S.EMAIL || "") + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(lines.join("\n"));
        status.className = "status ok"; status.textContent = "Opening your email app with your details. Just press Send. If nothing opens, email us at " + (S.EMAIL || "our email") + ".";
      }
    });
  });
})();
