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
    '<div class="lb-hint">swipe · double-tap or pinch to zoom · esc</div>';
  document.body.appendChild(lb);

  var track = lb.querySelector(".lb-track");
  var counter = lb.querySelector(".lb-counter");
  var row = document.createElement("div");
  row.className = "lb-row";
  track.appendChild(row);

  var slides = items.map(function (it, i) {
    var s = document.createElement("div");
    s.className = "lb-slide";
    var idxLabel = String(i + 1).padStart(2, "0") + " / " + String(total).padStart(2, "0");
    s.innerHTML =
      '<img alt="' + it.title.replace(/"/g, "&quot;") + '" data-src="' + it.full + '">' +
      '<div class="lb-label"><span class="idx">' + idxLabel + "</span>" +
      (it.title ? '<span class="ttl">' + it.title + "</span>" : "") + "</div>";
    row.appendChild(s);
    return s;
  });

  var current = 0, W = 0;
  var MAX_SCALE = 4;
  // zoom transform of the current image
  var scale = 1, tx = 0, ty = 0;

  function curImg() { return slides[current].querySelector("img"); }

  function loadNear(i) {
    for (var j = i - 1; j <= i + 1; j++) {
      if (j < 0 || j >= total) continue;
      var img = slides[j].querySelector("img");
      if (img && !img.src && img.dataset.src) img.src = img.dataset.src;
    }
  }

  function measure() { W = track.clientWidth; }

  function layoutRow(animate) {
    row.classList.toggle("anim", !!animate);
    row.style.transform = "translateX(" + (-current * W) + "px)";
  }

  function applyZoom(animate) {
    var img = curImg();
    img.classList.toggle("zanim", !!animate);
    img.style.transform = "translate(" + tx + "px," + ty + "px) scale(" + scale + ")";
    lb.classList.toggle("zoomed", scale > 1.01);
  }

  function resetZoom(animate) {
    scale = 1; tx = 0; ty = 0;
    applyZoom(animate);
  }

  function clampPan() {
    var img = curImg();
    var maxX = Math.max(0, (img.clientWidth * scale - W) / 2);
    var maxY = Math.max(0, (img.clientHeight * scale - track.clientHeight) / 2);
    tx = Math.max(-maxX, Math.min(maxX, tx));
    ty = Math.max(-maxY, Math.min(maxY, ty));
  }

  function updateCounter() {
    counter.textContent = String(current + 1).padStart(2, "0") + " / " + String(total).padStart(2, "0");
  }

  function setCurrent(i, animate) {
    // reset any zoom on the outgoing image
    var prevImg = curImg();
    prevImg.style.transform = "";
    prevImg.classList.remove("zanim");
    current = Math.max(0, Math.min(total - 1, i));
    scale = 1; tx = 0; ty = 0;
    lb.classList.remove("zoomed");
    updateCounter();
    loadNear(current);
    layoutRow(animate);
  }

  function open(i) {
    lb.classList.add("open");
    document.body.style.overflow = "hidden";
    current = Math.max(0, Math.min(total - 1, i));
    scale = 1; tx = 0; ty = 0;
    lb.classList.remove("zoomed");
    measure();
    updateCounter();
    loadNear(current);
    layoutRow(false);
    applyZoom(false);
  }

  function close() {
    lb.classList.remove("open");
    document.body.style.overflow = "";
  }

  function go(delta) {
    if (scale > 1.01) return; // don't page while zoomed
    var next = Math.max(0, Math.min(total - 1, current + delta));
    if (next === current) { layoutRow(true); return; }
    setCurrent(next, true);
  }

  tiles.forEach(function (t, i) {
    t.addEventListener("click", function (e) { e.preventDefault(); open(i); });
  });
  lb.querySelector(".lb-close").addEventListener("click", close);
  lb.querySelector(".lb-prev").addEventListener("click", function () { go(-1); });
  lb.querySelector(".lb-next").addEventListener("click", function () { go(1); });

  document.addEventListener("keydown", function (e) {
    if (!lb.classList.contains("open")) return;
    if (e.key === "Escape") { if (scale > 1.01) resetZoom(true); else close(); }
    else if (e.key === "ArrowLeft") { e.preventDefault(); go(-1); }
    else if (e.key === "ArrowRight") { e.preventDefault(); go(1); }
  });

  window.addEventListener("resize", function () {
    if (!lb.classList.contains("open")) return;
    measure();
    resetZoom(false);
    layoutRow(false);
  });

  /* ---- Touch gestures: swipe carousel + pinch-zoom + pan ---- */
  var mode = null;              // 'drag' | 'pan' | 'pinch'
  var sx = 0, sy = 0, sTx = 0, sTy = 0;
  var pinchStartDist = 0, pinchStartScale = 1, cX0 = 0, cY0 = 0, fdx = 0, fdy = 0;
  var lastTapT = 0, lastTapX = 0, lastTapY = 0, moved = false;

  function dist(a, b) { var dx = a.clientX - b.clientX, dy = a.clientY - b.clientY; return Math.hypot(dx, dy); }

  function startPinch(e) {
    mode = "pinch";
    pinchStartDist = dist(e.touches[0], e.touches[1]);
    pinchStartScale = scale;
    var mx = (e.touches[0].clientX + e.touches[1].clientX) / 2;
    var my = (e.touches[0].clientY + e.touches[1].clientY) / 2;
    var img = curImg();
    img.classList.remove("zanim");
    var r = img.getBoundingClientRect();
    cX0 = (r.left + r.width / 2) - tx; // element centre at zero-translate (invariant)
    cY0 = (r.top + r.height / 2) - ty;
    fdx = mx - (cX0 + tx);
    fdy = my - (cY0 + ty);
    sTx = tx; sTy = ty;
  }

  track.addEventListener("touchstart", function (e) {
    moved = false;
    if (e.touches.length === 2) { startPinch(e); return; }
    var t = e.touches[0];
    sx = t.clientX; sy = t.clientY;
    if (scale > 1.01) { mode = "pan"; sTx = tx; sTy = ty; }
    else { mode = "drag"; row.classList.remove("anim"); }
  }, { passive: false });

  track.addEventListener("touchmove", function (e) {
    if (mode === "pinch" && e.touches.length >= 2) {
      e.preventDefault();
      var d = dist(e.touches[0], e.touches[1]);
      var s = Math.max(1, Math.min(MAX_SCALE, pinchStartScale * d / pinchStartDist));
      var mx = (e.touches[0].clientX + e.touches[1].clientX) / 2;
      var my = (e.touches[0].clientY + e.touches[1].clientY) / 2;
      // keep the pinched content point under the fingers as scale changes
      var contentX = fdx / pinchStartScale, contentY = fdy / pinchStartScale;
      tx = (mx - s * contentX) - cX0;
      ty = (my - s * contentY) - cY0;
      scale = s;
      clampPan();
      applyZoom(false);
      moved = true;
      return;
    }
    if (mode === "pan") {
      e.preventDefault();
      var p = e.touches[0];
      tx = sTx + (p.clientX - sx);
      ty = sTy + (p.clientY - sy);
      clampPan();
      applyZoom(false);
      moved = true;
      return;
    }
    if (mode === "drag") {
      var q = e.touches[0];
      var dx = q.clientX - sx, dy = q.clientY - sy;
      if (Math.abs(dx) > Math.abs(dy)) {
        e.preventDefault();
        moved = true;
        var off = -current * W + dx;
        // resistance at the ends
        if ((current === 0 && dx > 0) || (current === total - 1 && dx < 0)) off = -current * W + dx * 0.35;
        row.style.transform = "translateX(" + off + "px)";
      }
    }
  }, { passive: false });

  track.addEventListener("touchend", function (e) {
    if (mode === "pinch") {
      if (e.touches.length === 0) {
        if (scale <= 1.02) resetZoom(true);
        else { clampPan(); applyZoom(true); }
        mode = null;
      } else if (e.touches.length === 1) {
        // finished pinch but a finger remains → continue as pan
        mode = "pan"; var t = e.touches[0]; sx = t.clientX; sy = t.clientY; sTx = tx; sTy = ty;
      }
      return;
    }
    if (mode === "pan") { clampPan(); applyZoom(false); mode = null; return; }
    if (mode === "drag") {
      var dx = e.changedTouches[0].clientX - sx;
      var dy = e.changedTouches[0].clientY - sy;
      mode = null;
      if (!moved) { handleTap(e.changedTouches[0]); return; }
      if (Math.abs(dx) > Math.abs(dy)) {
        if (Math.abs(dx) > W * 0.18) go(dx < 0 ? 1 : -1);
        else layoutRow(true);
      } else if (dy > 90) {
        close();
      } else {
        layoutRow(true);
      }
    }
  }, { passive: false });

  // double-tap to zoom in/out
  function handleTap(pt) {
    var now = Date.now();
    if (now - lastTapT < 300 && Math.abs(pt.clientX - lastTapX) < 30 && Math.abs(pt.clientY - lastTapY) < 30) {
      lastTapT = 0;
      if (scale > 1.01) { resetZoom(true); }
      else {
        var img = curImg();
        var r = img.getBoundingClientRect();
        var cx = r.left + r.width / 2, cy = r.top + r.height / 2;
        scale = 2.5;
        tx = (cx - pt.clientX) * (scale - 1) / 1; // move tapped point toward centre
        ty = (cy - pt.clientY) * (scale - 1) / 1;
        clampPan();
        applyZoom(true);
      }
    } else {
      lastTapT = now; lastTapX = pt.clientX; lastTapY = pt.clientY;
    }
  }
})();
