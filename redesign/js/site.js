/* Henri Davies — redesign prototype: theme, mobile menu, full-screen swipe lightbox */
(function () {
  "use strict";
  /* ---- Mobile menu ---- */
  var menuBtn = document.querySelector(".menu-btn");
  var nav = document.querySelector(".nav");
  if (menuBtn && nav) {
    var scrim = document.createElement("div");
    scrim.className = "nav-scrim";
    document.body.appendChild(scrim);
    var setMenu = function (open) {
      nav.classList.toggle("open", open);
      scrim.classList.toggle("open", open);
      menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
    };
    menuBtn.addEventListener("click", function () { setMenu(!nav.classList.contains("open")); });
    scrim.addEventListener("click", function () { setMenu(false); });
    nav.querySelectorAll("a").forEach(function (a) { a.addEventListener("click", function () { setMenu(false); }); });
  }

  /* ---- Reveal on scroll (runs on every page) ---- */
  var reveals = document.querySelectorAll(".reveal");
  if (reveals.length && !matchMedia("(prefers-reduced-motion: reduce)").matches && "IntersectionObserver" in window) {
    var ioR = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("in"); ioR.unobserve(en.target); } });
    }, { rootMargin: "0px 0px -6% 0px" });
    reveals.forEach(function (el) { ioR.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---- Lightbox ---- */
  var tiles = Array.prototype.slice.call(document.querySelectorAll(".tile[data-full]"));
  if (!tiles.length) return;

  var items = tiles.map(function (t) {
    return { full: t.getAttribute("data-full"), title: t.getAttribute("data-title") || "" };
  });
  var total = items.length;

  var lb = document.createElement("div");
  lb.className = "lb";
  lb.setAttribute("role", "dialog");
  lb.setAttribute("aria-modal", "true");
  lb.setAttribute("aria-label", "Image viewer");
  lb.innerHTML =
    '<div class="lb-top">' +
      '<span class="lb-counter"></span>' +
      '<button class="lb-close" aria-label="Close viewer">' +
        '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><line x1="6" y1="6" x2="18" y2="18"/><line x1="18" y1="6" x2="6" y2="18"/></svg>' +
      '</button>' +
    '</div>' +
    '<button class="lb-nav lb-prev" aria-label="Previous">&#8249;</button>' +
    '<button class="lb-nav lb-next" aria-label="Next">&#8250;</button>' +
    '<div class="lb-track"></div>' +
    '<div class="lb-hint">swipe · arrows · esc</div>';
  document.body.appendChild(lb);

  var track = lb.querySelector(".lb-track");
  var counter = lb.querySelector(".lb-counter");
  var slides = items.map(function (it, i) {
    var s = document.createElement("div");
    s.className = "lb-slide";
    var idxLabel = String(i + 1).padStart(2, "0") + " / " + String(total).padStart(2, "0");
    s.innerHTML =
      '<img alt="' + it.title.replace(/"/g, "&quot;") + '" data-src="' + it.full + '">' +
      '<div class="lb-label"><span class="idx">' + idxLabel + "</span>" +
      (it.title ? '<span class="ttl">' + it.title + "</span>" : "") + "</div>";
    track.appendChild(s);
    return s;
  });

  var current = 0;

  function loadNear(i) {
    for (var j = i - 1; j <= i + 1; j++) {
      if (j < 0 || j >= total) continue;
      var img = slides[j].querySelector("img");
      if (img && !img.src && img.dataset.src) img.src = img.dataset.src;
    }
  }

  function setCurrent(i) {
    current = Math.max(0, Math.min(total - 1, i));
    counter.textContent = String(current + 1).padStart(2, "0") + " / " + String(total).padStart(2, "0");
    loadNear(current);
  }

  function open(i) {
    lb.classList.add("open");
    document.body.style.overflow = "hidden";
    setCurrent(i);
    // jump without animation to the tapped image
    var prev = track.style.scrollBehavior;
    track.style.scrollBehavior = "auto";
    track.scrollLeft = i * track.clientWidth;
    void track.offsetWidth;
    track.style.scrollBehavior = prev || "";
  }

  function close() {
    lb.classList.remove("open");
    document.body.style.overflow = "";
  }

  function go(delta) {
    var next = Math.max(0, Math.min(total - 1, current + delta));
    track.scrollTo({ left: next * track.clientWidth, behavior: "smooth" });
  }

  tiles.forEach(function (t, i) {
    t.addEventListener("click", function (e) {
      e.preventDefault();
      open(i);
    });
  });

  lb.querySelector(".lb-close").addEventListener("click", close);
  lb.querySelector(".lb-prev").addEventListener("click", function () { go(-1); });
  lb.querySelector(".lb-next").addEventListener("click", function () { go(1); });

  // sync counter/lazy-load as the user swipes
  var raf = null;
  track.addEventListener("scroll", function () {
    if (raf) return;
    raf = requestAnimationFrame(function () {
      raf = null;
      var i = Math.round(track.scrollLeft / track.clientWidth);
      if (i !== current) setCurrent(i);
    });
  }, { passive: true });

  document.addEventListener("keydown", function (e) {
    if (!lb.classList.contains("open")) return;
    if (e.key === "Escape") close();
    else if (e.key === "ArrowLeft") { e.preventDefault(); go(-1); }
    else if (e.key === "ArrowRight") { e.preventDefault(); go(1); }
  });

  // swipe down to dismiss
  var startY = null, startX = null;
  lb.addEventListener("touchstart", function (e) {
    startY = e.touches[0].clientY; startX = e.touches[0].clientX;
  }, { passive: true });
  lb.addEventListener("touchend", function (e) {
    if (startY === null) return;
    var dy = e.changedTouches[0].clientY - startY;
    var dx = e.changedTouches[0].clientX - startX;
    if (dy > 90 && Math.abs(dy) > Math.abs(dx) * 1.4) close();
    startY = startX = null;
  }, { passive: true });

  // keep the current image centred on resize/orientation change
  window.addEventListener("resize", function () {
    if (lb.classList.contains("open")) track.scrollLeft = current * track.clientWidth;
  });
})();
