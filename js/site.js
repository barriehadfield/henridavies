/* Henri Davies — nav toggle + gallery lightbox */
(function () {
  "use strict";

  /* ----- Mobile nav ----- */
  var nav = document.querySelector(".nav");
  var toggle = document.querySelector(".nav-toggle");
  if (nav && toggle) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  /* ----- Lightbox ----- */
  var tiles = Array.prototype.slice.call(document.querySelectorAll(".tile[data-full]"));
  if (!tiles.length) return;

  var box = document.createElement("div");
  box.className = "lightbox";
  box.setAttribute("role", "dialog");
  box.setAttribute("aria-modal", "true");
  box.innerHTML =
    '<button class="lb-btn lb-close" aria-label="Close">&times;</button>' +
    '<button class="lb-btn lb-prev" aria-label="Previous">&#8249;</button>' +
    '<button class="lb-btn lb-next" aria-label="Next">&#8250;</button>' +
    '<img alt="">' +
    '<div class="lb-caption"></div>';
  document.body.appendChild(box);

  var lbImg = box.querySelector("img");
  var lbCaption = box.querySelector(".lb-caption");
  var current = -1;

  function show(i) {
    current = (i + tiles.length) % tiles.length;
    var t = tiles[current];
    lbImg.src = t.getAttribute("data-full");
    var title = t.getAttribute("data-title") || "";
    lbImg.alt = title;
    lbCaption.textContent = title;
  }

  function open(i) {
    show(i);
    box.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function close() {
    box.classList.remove("open");
    document.body.style.overflow = "";
    lbImg.removeAttribute("src");
  }

  tiles.forEach(function (t, i) {
    t.addEventListener("click", function (e) {
      e.preventDefault();
      open(i);
    });
  });

  box.querySelector(".lb-close").addEventListener("click", close);
  box.querySelector(".lb-prev").addEventListener("click", function () { show(current - 1); });
  box.querySelector(".lb-next").addEventListener("click", function () { show(current + 1); });
  box.addEventListener("click", function (e) {
    if (e.target === box) close();
  });

  document.addEventListener("keydown", function (e) {
    if (!box.classList.contains("open")) return;
    if (e.key === "Escape") close();
    else if (e.key === "ArrowLeft") show(current - 1);
    else if (e.key === "ArrowRight") show(current + 1);
  });

  /* Touch swipe */
  var startX = null;
  box.addEventListener("touchstart", function (e) { startX = e.touches[0].clientX; }, { passive: true });
  box.addEventListener("touchend", function (e) {
    if (startX === null) return;
    var dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 45) show(current + (dx < 0 ? 1 : -1));
    startX = null;
  });
})();
