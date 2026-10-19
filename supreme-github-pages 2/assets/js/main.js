/* ==========================================================================
   Supreme Inspection Services, main.js (v1, single layer)
   --------------------------------------------------------------------------
    0  Config + data (SERVICES / LOCATIONS / TESTIMONIALS, editable blocks)
    1  Helpers, mode switching (desktop vs compact), shared scroll loop
    2  Glide, momentum carousel engine (services rail, testimonials)
    3  Scenes: inspector drop, About Barend, services drive, road turn, HUD
    4  Services: desktop reel/grid + compact carousel
    5  Detail view: iOS-style slide-up sheet (all screen sizes)
    6  Testimonials A / B / C (+ review-only switcher)
    7  Locations map (Leaflet)
    8  Navigation: anchors, compact menu, smart header
    9  Reveal-on-scroll, certification accordions
   10  Enquiry form (single handler, endpoint placeholder)
   ========================================================================== */
(function () {
  'use strict';

/* ## reviewed 2026-10-09: config + data */
  /* 0. Config ------------------------------------------------------------- */
  var CONFIG = {
    desktopMin: 1025,          // >= this width runs the full desktop scenes
    servicesStepVh: 74,        // desktop drive: scroll length per reel slide
    testimonialAutoplayMs: 8000
  };

  /* FORM_CONFIG, the ONE place to connect a real email service.
     Formspree: endpoint 'https://formspree.io/f/XXXXXXX'
     Any JSON endpoint that answers 2xx on success works the same way.
     Leave endpoint empty to keep preview mode (nothing is sent). */
  var FORM_CONFIG = {
    endpoint: '',
    recipients: ['barend@supremeltd.co.nz', 'marisa@supremeltd.co.nz', 'admin@lioncompliance.co.nz']
  };

  /* @EDITABLE_SERVICES_START */
  var SERVICES = [
    { "id": "crane-inspection", "title": "Crane Inspection & Certification", "image": "assets/images/service-crane-inspection.webp", "alt": "Large crawler crane on site",
      "summary": "Stay compliant with New Zealand regulations and keep your cranes, lifting and hoisting equipment safe and operational.",
      "scope": ["Mobile cranes", "Truck loader cranes (Palfinger, HIAB)", "Vehicle-mounted truck loader cranes", "Crawler cranes", "Goliath and semi-goliath cranes", "Portal cranes", "Davit cranes", "Overhead cranes", "Gantry cranes", "Monorail hoists", "Jib cranes", "Tower cranes"],
      "formValue": "Crane Inspection & Certification", "icon": "crane" },
    { "id": "crane-servicing", "title": "Crane Servicing & Repairs", "image": "assets/images/service-crane-servicing.webp", "alt": "Palfinger truck-mounted loader crane",
      "summary": "Inspection advisory for maintenance and repairs, helping identify safety risks early and reduce downtime.",
      "scope": [], "formValue": "Crane Servicing & Repairs", "icon": "gear" },
    { "id": "ewp-inspection", "title": "EWP Inspections", "image": "assets/images/service-ewp-inspection.webp", "alt": "Inspector on an elevated work platform at height",
      "summary": "Full certification and compliance inspections for scissor lifts, cherry pickers, and all types of EWPs.",
      "scope": ["Scissor lifts", "Cherry pickers", "All other types of EWPs"], "formValue": "EWP Inspections", "icon": "ewp" },
    { "id": "welding-inspection", "title": "Welding Inspections & Qualifications", "image": "assets/images/service-welding-inspection.webp", "alt": "Inspector in full PPE beneath an overhead crane",
      "summary": "CBIP-certified welding inspections for structural integrity and compliance, plus welder qualification and certification.",
      "scope": ["Structural integrity & compliance inspections (CBIP-certified)", "Welder qualification & certification"], "formValue": "Welding Inspections & Qualifications", "icon": "spark" },
    { "id": "lifting-equipment", "title": "Lifting Equipment Inspections", "image": "assets/images/service-lifting-equipment.webp", "alt": "Yellow overhead gantry crane",
      "summary": "Comprehensive checks for hoisting and lifting equipment like man cages and spreader beams, maintaining safety and operational readiness.",
      "scope": ["Man cages", "Spreader beams", "Other hoisting & lifting equipment"], "formValue": "Lifting Equipment Inspections", "icon": "link" },
    { "id": "forklift-inspection", "title": "Forklift Inspections", "image": "assets/images/service-forklift-inspection.webp", "alt": "Forklift lifting a load on site",
      "summary": "Compliance inspections for forklifts, including load safety and operational checks.",
      "scope": ["Load safety checks", "Operational checks"], "formValue": "Forklift Inspections", "icon": "forklift" },
    { "id": "inspection-overview", "title": "Inspection Services Overview", "image": "assets/images/service-crane-inspection.webp", "alt": "Crane inspection work on site",
      "summary": "Detailed inspections and certifications for cranes, EWPs, welding, lifting and hoisting equipment, with clear guidance on process, timelines and compliance.",
      "scope": ["Step-by-step inspection process", "Certification timelines and what to expect", "Compliance guidance and frequently asked questions", "Support for cranes, EWPs, welding, lifting and hoisting equipment"],
      "formValue": "General Inspection Enquiry", "icon": "crane" }
  ];
  /* @EDITABLE_SERVICES_END */

  /* @EDITABLE_LOCATIONS_START */
  var LOCATIONS = [
    { "id": "auckland", "name": "Auckland", "lat": -36.8485, "lng": 174.7635 },
    { "id": "north-shore", "name": "North Shore, Auckland", "lat": -36.7869, "lng": 174.7719 },
    { "id": "manukau", "name": "Manukau, Auckland", "lat": -36.9928, "lng": 174.8799 },
    { "id": "wiri", "name": "Wiri", "lat": -36.9982, "lng": 174.8602 },
    { "id": "auckland-airport", "name": "Auckland Airport", "lat": -37.0081, "lng": 174.7917 },
    { "id": "otahuhu", "name": "Otahuhu", "lat": -36.9453, "lng": 174.845 },
    { "id": "pukekohe", "name": "Pukekohe", "lat": -37.2, "lng": 174.9 },
    { "id": "papakura", "name": "Papakura", "lat": -37.0625, "lng": 174.9419 },
    { "id": "bombay", "name": "Bombay", "lat": -37.1667, "lng": 174.9833 },
    { "id": "east-tamaki", "name": "East Tamaki", "lat": -36.95, "lng": 174.9 },
    { "id": "highbrook", "name": "Highbrook", "lat": -36.9358, "lng": 174.8767 },
    { "id": "west-auckland", "name": "West Auckland", "lat": -36.8333, "lng": 174.65 },
    { "id": "henderson", "name": "Henderson", "lat": -36.8801, "lng": 174.6198 },
    { "id": "hobsonville", "name": "Hobsonville", "lat": -36.7982, "lng": 174.6481 },
    { "id": "rodney", "name": "Rodney", "lat": -36.6782, "lng": 174.4502 },
    { "id": "hibiscus-coast", "name": "Hibiscus Coast", "lat": -36.581, "lng": 174.679 },
    { "id": "silverdale", "name": "Silverdale", "lat": -36.6187, "lng": 174.6776 },
    { "id": "warkworth", "name": "Warkworth", "lat": -36.4, "lng": 174.6667 },
    { "id": "matakana", "name": "Matakana", "lat": -36.35, "lng": 174.7167 },
    { "id": "wellsford", "name": "Wellsford", "lat": -36.2833, "lng": 174.5167 }
  ];
  /* @EDITABLE_LOCATIONS_END */

  /* @EDITABLE_TESTIMONIALS_START */
  var TESTIMONIALS = [
    { "quote": "Barend sorted our crane certification fast and hassle-free. Clear report, quick turnaround, exactly what we needed!", "name": "Mark T.", "role": "Construction Manager", "image": "assets/images/testimonial-old-1.webp", "tag": "Crane inspection" },
    { "quote": "Barend’s inspection was thorough and easy to follow. He picked up issues early and explained everything clearly, really gave us peace of mind!", "name": "Lisa K.", "role": "Operations Director", "image": "assets/images/testimonial-old-2.webp", "tag": "Crane inspection" },
    { "quote": "Super easy to work with and very professional. Barend kept the process simple and stress-free from start to finish.", "name": "James R.", "role": "Site Supervisor", "image": "assets/images/testimonial-old-3.webp", "tag": "Crane servicing" }
  ];
  /* @EDITABLE_TESTIMONIALS_END */

  var ASSETS = {
    craneSide: 'assets/images/crane-truck-side.webp',
    wheels: ['assets/images/crane-wheel-1.webp', 'assets/images/crane-wheel-2.webp', 'assets/images/crane-wheel-3.webp', 'assets/images/crane-wheel-4.webp', 'assets/images/crane-wheel-5.webp'],
    wheelLeft: [11.72, 23.13, 37.59, 48.78, 64.31]
  };

  var ICONS = {
    crane: '<svg viewBox="0 0 28 28" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><line x1="7" y1="23" x2="7" y2="5"/><line x1="7" y1="6" x2="22" y2="10"/><line x1="19" y1="9" x2="19" y2="17"/><path d="M19 17a3 3 0 0 0 3 3"/></svg>',
    gear: '<svg viewBox="0 0 28 28" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="14" cy="14" r="5"/><line x1="14" y1="2" x2="14" y2="6"/><line x1="14" y1="22" x2="14" y2="26"/><line x1="2" y1="14" x2="6" y2="14"/><line x1="22" y1="14" x2="26" y2="14"/><line x1="5.5" y1="5.5" x2="8.3" y2="8.3"/><line x1="19.7" y1="19.7" x2="22.5" y2="22.5"/><line x1="22.5" y1="5.5" x2="19.7" y2="8.3"/><line x1="8.3" y1="19.7" x2="5.5" y2="22.5"/></svg>',
    ewp: '<svg viewBox="0 0 28 28" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="20" width="16" height="4" rx="1"/><line x1="14" y1="16" x2="14" y2="4"/><path d="M9 9l5-5 5 5"/></svg>',
    spark: '<svg viewBox="0 0 28 28" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><line x1="14" y1="3" x2="14" y2="25"/><line x1="3" y1="14" x2="25" y2="14"/><line x1="6.5" y1="6.5" x2="21.5" y2="21.5"/><line x1="21.5" y1="6.5" x2="6.5" y2="21.5"/></svg>',
    link: '<svg viewBox="0 0 28 28" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="10" cy="14" rx="6" ry="4"/><ellipse cx="18" cy="14" rx="6" ry="4"/></svg>',
    forklift: '<svg viewBox="0 0 28 28" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="6" width="6" height="4" rx="1"/><line x1="6" y1="8" x2="6" y2="24"/><line x1="6" y1="20" x2="20" y2="20"/><line x1="10" y1="20" x2="10" y2="26"/><line x1="16" y1="20" x2="16" y2="26"/></svg>'
  };

/* ## reviewed 2026-10-09: helpers, mode, shared scroll loop */
  /* 1. Helpers + mode ------------------------------------------------------ */
  var root = document.documentElement;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var desktopMQ = window.matchMedia('(min-width: ' + CONFIG.desktopMin + 'px)');
  function isDesktop() { return desktopMQ.matches; }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function clamp01(v) { return clamp(v, 0, 1); }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function smooth(t) { t = clamp01(t); return t * t * (3 - 2 * t); }
  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function findService(id) { for (var i = 0; i < SERVICES.length; i++) if (SERVICES[i].id === id) return SERVICES[i]; return null; }

  function applyModeClass() {
    root.classList.toggle('is-desktop', isDesktop());
    root.classList.toggle('is-compact', !isDesktop());
    root.classList.toggle('is-static', reduceMotion);
  }
  applyModeClass();

  var modeListeners = [];
  function onModeChange(fn) { modeListeners.push(fn); }
  function modeChanged() { applyModeClass(); modeListeners.forEach(function (fn) { fn(isDesktop()); }); requestMeasure(); }
  if (desktopMQ.addEventListener) desktopMQ.addEventListener('change', modeChanged); else desktopMQ.addListener(modeChanged);

  /* One shared scroll/resize loop for every scroll-linked scene. Each
     scene exposes measure() and update(); DOM is only written when a
     value actually changes. */
  var scenes = [];
  var frameQueued = false, measureQueued = true;
  function requestFrame() { if (!frameQueued) { frameQueued = true; requestAnimationFrame(frame); } }
  function requestMeasure() { measureQueued = true; requestFrame(); }
  function frame() {
    frameQueued = false;
    if (measureQueued) { measureQueued = false; scenes.forEach(function (s) { s.measure && s.measure(); }); }
    scenes.forEach(function (s) { s.update(); });
  }
  window.addEventListener('scroll', requestFrame, { passive: true });
  window.addEventListener('resize', requestMeasure, { passive: true });
  window.addEventListener('load', requestMeasure);
  /* Phone browsers resize the visual viewport as the URL bar shows/hides;
     measure once it settles instead of on every pixel. */
  var settleTimer = 0;
  if (window.visualViewport) window.visualViewport.addEventListener('resize', function () { clearTimeout(settleTimer); settleTimer = setTimeout(requestMeasure, 150); });

  function trackProgress(track, stage) {
    var travel = track.offsetHeight - stage.offsetHeight;
    if (travel <= 0) return 0;
    return clamp01(-track.getBoundingClientRect().top / travel);
  }

  /* Scroll lock shared by nav / panel. The sheet uses its own (fixed-body)
     lock because iOS ignores overflow:hidden for touch scrolling. */
  var locks = {};
  function lockScroll(k) { locks[k] = 1; document.body.style.overflow = 'hidden'; }
  function unlockScroll(k) { delete locks[k]; if (!Object.keys(locks).length) document.body.style.overflow = ''; }

  /* 2. Glide, momentum carousel -------------------------------------------
     Pointer-driven, transform-only. Horizontal swipes are owned by JS
     (touch-action: pan-y lets the browser keep vertical page scrolling),
     so a vertical flick that starts on a card always scrolls the page.
     Release velocity is projected forward (iOS-style deceleration), the
     nearest card to that landing point is chosen, and a critically damped
     spring carries the release velocity into the snap, the glide and the
     settle are one continuous motion, never a jump. */
  function Glide(viewport, opts) {
    this.vp = viewport;
    this.track = opts.track || viewport.firstElementChild;
    this.opts = opts || {};
    this.x = 0; this.index = 0; this.snaps = [0];
    this.raf = 0; this.dragging = false; this.suppressClick = false;
    viewport.classList.add('glide');
    this._bind();
    this.measure();
  }
  Glide.prototype = {
    slides: function () { return Array.prototype.slice.call(this.track.children); },
    measure: function () {
      var slides = this.slides();
      var pad = parseFloat(getComputedStyle(this.track).paddingLeft) || 0;
      var max = Math.max(0, this.track.scrollWidth - this.vp.clientWidth);
      this.min = -max;
      this.snaps = slides.map(function (s) { return -clamp(s.offsetLeft - pad, 0, max); });
      this._set(this.snaps[this.index] || 0, true);
    },
    nearest: function (x) {
      var best = 0, d = Infinity;
      for (var i = 0; i < this.snaps.length; i++) { var dd = Math.abs(this.snaps[i] - x); if (dd < d - 0.5) { d = dd; best = i; } }
      return best;
    },
    _set: function (x, silent) {
      this.x = x;
      this.track.style.transform = 'translate3d(' + x.toFixed(2) + 'px,0,0)';
      var i = this.nearest(x);
      if (i !== this.index || silent) { this.index = i; if (this.opts.onChange) this.opts.onChange(i); }
    },
    stop: function () { if (this.raf) cancelAnimationFrame(this.raf); this.raf = 0; },
    goTo: function (i, v0) {
      i = clamp(i, 0, this.snaps.length - 1);
      this.animateTo(this.snaps[i], v0 || 0);
    },
    animateTo: function (target, v0) {
      var self = this; this.stop();
      if (reduceMotion) { this._set(target); return; }
      var w = 11, x0 = this.x, c1 = x0 - target, c2 = v0 + w * c1, t0 = performance.now();
      function step(now) {
        var t = (now - t0) / 1000, e = Math.exp(-w * t);
        var pos = target + (c1 + c2 * t) * e;
        var vel = (c2 - w * (c1 + c2 * t)) * e;
        if (Math.abs(pos - target) < 0.4 && Math.abs(vel) < 6) { self._set(target); self.raf = 0; return; }
        self._set(pos); self.raf = requestAnimationFrame(step);
      }
      this.raf = requestAnimationFrame(step);
    },
    _bind: function () {
      var self = this, vp = this.vp, s = null;
      function rubber(x) {
        if (x > 0) return x * 0.32;
        if (x < self.min) return self.min + (x - self.min) * 0.32;
        return x;
      }
      vp.addEventListener('pointerdown', function (e) {
        if (e.button > 0) return;
        self.stop();
        s = { id: e.pointerId, x0: e.clientX, y0: e.clientY, pos: self.x, axis: null, t: performance.now(), samples: [{ t: performance.now(), x: self.x }] };
        var card = e.target.closest('[data-glide-card]');
        if (card) { s.card = card; card.classList.add('is-pressed'); }
      });
      vp.addEventListener('pointermove', function (e) {
        if (!s || e.pointerId !== s.id) return;
        var dx = e.clientX - s.x0, dy = e.clientY - s.y0;
        if (!s.axis) {
          if (Math.abs(dx) < 6 && Math.abs(dy) < 6) return;
          s.axis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
          if (s.card) s.card.classList.remove('is-pressed');
          if (s.axis === 'x') { self.dragging = true; vp.classList.add('is-dragging'); if (e.pointerType === 'mouse') { try { vp.setPointerCapture(e.pointerId); } catch (err) {} } }
        }
        if (s.axis !== 'x') return;
        var now = performance.now();
        self._set(rubber(s.pos + dx));
        s.samples.push({ t: now, x: self.x });
        while (s.samples.length > 2 && now - s.samples[0].t > 100) s.samples.shift();
      });
      function end(e, cancelled) {
        if (!s || e.pointerId !== s.id) return;
        if (s.card) s.card.classList.remove('is-pressed');
        var udx = e.clientX - s.x0, udy = e.clientY - s.y0;
        if (!cancelled && !s.axis && Math.abs(udx) > 10 && Math.abs(udx) > Math.abs(udy)) s.axis = 'x'; // all moves coalesced into the release
        if (!cancelled && s.axis === 'x' && e.clientX) {                                                 // include the release position itself
          self._set(rubber(s.pos + udx)); s.samples.push({ t: performance.now(), x: self.x });
        }
        if (s.axis === 'x') {
          var now = performance.now(), first = s.samples[0];
          var dt = now - first.t, v = dt > 8 ? (self.x - first.x) / dt : 0; // px per ms
          if (s.samples.length > 1 && now - s.samples[s.samples.length - 2].t > 90) v = 0; // held still before release
          v = clamp(v, -4.5, 4.5);
          var projected = self.x + v * 330;
          var target = self.nearest(clamp(projected, self.min, 0));
          var startIdx = self.nearest(s.pos);
          var moved = self.x - s.pos, slideW = Math.abs((self.snaps[1] || 0) - (self.snaps[0] || 0)) || self.vp.clientWidth;
          if (target === startIdx && (Math.abs(v) > 0.22 || Math.abs(moved) > slideW * 0.2)) target = startIdx + ((Math.abs(v) > 0.22 ? v : moved) < 0 ? 1 : -1);
          self.goTo(target, v * 1000);
          self.suppressClick = true;
          setTimeout(function () { self.suppressClick = false; }, 60);
        }
        self.dragging = false; vp.classList.remove('is-dragging');
        s = null;
      }
      vp.addEventListener('pointerup', function (e) { end(e, false); });
      vp.addEventListener('pointercancel', function (e) { end(e, true); });
      vp.addEventListener('lostpointercapture', function (e) { if (e.target === vp && s && s.axis === 'x' && e.pointerType === 'mouse') end(e, true); });
      vp.addEventListener('click', function (e) { if (self.suppressClick) { e.preventDefault(); e.stopPropagation(); } }, true);
      vp.addEventListener('dragstart', function (e) { e.preventDefault(); });
      /* Trackpads / horizontal wheels */
      var wheelTimer = 0;
      vp.addEventListener('wheel', function (e) {
        if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
        e.preventDefault(); self.stop();
        self._set(clamp(self.x - e.deltaX, self.min, 0));
        clearTimeout(wheelTimer);
        wheelTimer = setTimeout(function () { self.goTo(self.nearest(self.x)); }, 110);
      }, { passive: false });
      vp.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowRight') { e.preventDefault(); self.goTo(self.index + 1); }
        if (e.key === 'ArrowLeft') { e.preventDefault(); self.goTo(self.index - 1); }
      });
    }
  };

  /* 3. Scroll scenes ---------------------------------------------------------
     Every pinned scene writes --sp (0..1) on its stage, which drives the
     orange .scene-progress bar along its bottom edge. */
  function setProgress(stage, p) { stage.style.setProperty('--sp', p.toFixed(4)); }

  /* 3a. Inspector rig drop */
  (function () {
    var section = $('[data-scene="inspector"]');
    if (!section) return;
    var track = $('.inspector__track', section), stage = $('.inspector__stage', section);
    var last = -1;
    scenes.push({
      update: function () {
        if (reduceMotion) return;
        var raw = trackProgress(track, stage);
        if (raw === last) return; last = raw;
        var r = track.getBoundingClientRect(), vh = stage.clientHeight || innerHeight, desk = isDesktop();
        var delay = vh * (desk ? 0.42 : 0.3), dist = vh * (desk ? 1.6 : 1.12);
        var p = clamp01((-r.top - delay) / dist); p = 1 - Math.pow(1 - p, 3);
        section.style.setProperty('--p', p.toFixed(4));
        section.style.setProperty('--cap', smooth((p - 0.86) / 0.12).toFixed(3));
        setProgress(stage, raw);
      }
    });
  })();

/* ## reviewed 2026-10-09: About Barend scene (JS) */
  /* 3b. About Barend, outlined words fill with orange, step back to a
     watermark while the story reads in word by word, then the field photo
     rises as a card and expands to full-bleed. */
  (function () {
    var section = $('[data-scene="barend"]');
    if (!section) return;
    var track = $('.barend__track', section), stage = $('.barend__stage', section), para = $('[data-read]', section);
    var text = para.textContent.trim();
    para.setAttribute('aria-label', text);
    para.innerHTML = text.split(/(\s+)/).map(function (t) { return /^\s+$/.test(t) ? t : '<span class="read-word" aria-hidden="true">' + esc(t) + '</span>'; }).join('');
    var words = $$('.read-word', para), lastA = [], lastP = -1;
    scenes.push({
      update: function () {
        if (reduceMotion) return;
        var p = trackProgress(track, stage);
        if (p === lastP) return; lastP = p;
        var d = isDesktop();
        var fill = smooth(p / (d ? 0.2 : 0.16));
        var txt = smooth((p - (d ? 0.2 : 0.16)) / 0.12);
        var rp = clamp01((p - (d ? 0.28 : 0.24)) / (d ? 0.3 : 0.3));
        var card = smooth((p - (d ? 0.5 : 0.6)) / 0.1);
        var ex = smooth((p - (d ? 0.7 : 0.74)) / (d ? 0.18 : 0.16));
        section.style.setProperty('--fill', fill.toFixed(4));
        section.style.setProperty('--text', txt.toFixed(4));
        section.style.setProperty('--card', card.toFixed(4));
        section.style.setProperty('--ex', ex.toFixed(4));
        setProgress(stage, p);
        var head = rp * (words.length + 5);
        for (var i = 0; i < words.length; i++) {
          var a = Math.round((0.2 + clamp01((head - i) / 5) * 0.8) * 50) / 50;
          if (a !== lastA[i]) { lastA[i] = a; words[i].style.color = 'rgba(255,255,255,' + a + ')'; }
        }
      }
    });
  })();

  /* 4. Services -------------------------------------------------------------- */
  function pad2(n) { return (n < 10 ? '0' : '') + n; }
  function svcCardHTML(s, i) {
    return '<article class="svc' + (s.id === 'inspection-overview' ? ' svc--overview' : '') + '" data-service-id="' + s.id + '">' +
      '<div class="svc__media"><img src="' + s.image + '" alt="' + esc(s.alt) + '" loading="lazy"></div>' +
      '<div class="svc__top"><span class="svc__num">' + pad2(i + 1) + '</span><span class="svc__icon">' + (ICONS[s.icon] || ICONS.crane) + '</span></div>' +
      '<h3 data-svc-field="title">' + esc(s.title) + '</h3>' +
      '<p data-svc-field="summary">' + esc(s.summary) + '</p>' +
      '<button type="button" class="svc__more" data-service-trigger="' + s.id + '">Learn more <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg></button>' +
    '</article>';
  }

  /* 4a. Desktop: horizontal drive.
     0 -> LOCK_AT : the reel and ghost heading travel right-to-left while the
                    truck rolls in under the banner and cruises.
     LOCK_AT -> 1 : the last card (Inspection Services Overview) is fully in
                    view, so the reel LOCKS in place and the truck drives off
                    the right-hand edge. */
  var drive = null, LOCK_AT = 0.8;
  function buildDesktopServices() {
    var mount = $('#servicesDesktop');
    if (!mount || mount.dataset.built) return;
    mount.dataset.built = '1';
    var intro = '<div class="drive__intro" aria-hidden="true">' +
      '<h3>Crane, lifting equipment &amp; welding inspections &amp; certification.</h3>' +
      '<p>CBIP certified, Barend delivers reliable inspections in accordance with all applicable regulations, standards and engineering practices.</p></div>';
    if (reduceMotion) {
      mount.innerHTML = '<div class="svc-grid-wrap"><div class="wrap"><div class="head"><h2 style="color:#fff">What we inspect.</h2></div><div class="svc-grid" id="servicesGrid">' + SERVICES.map(svcCardHTML).join('') + '</div></div></div>';
      return;
    }
    var slides = SERVICES.length + 1;
    var wheels = ASSETS.wheels.map(function (src, i) { return '<img class="crane__wheel crane__wheel--' + (i + 1) + '" src="' + src + '" alt="" draggable="false" style="left:' + ASSETS.wheelLeft[i] + '%">'; }).join('');
    mount.innerHTML =
      '<div class="drive" id="servicesGrid">' +
        '<div class="drive__track" style="height:' + Math.round(slides * CONFIG.servicesStepVh / LOCK_AT) + 'vh">' +
          '<div class="drive__stage">' +
            '<div class="drive__banner"><div class="drive__heading" aria-hidden="true">Our Services</div></div>' +
            '<div class="drive__panel"><div class="drive__reel">' + intro + SERVICES.map(svcCardHTML).join('') + '</div></div>' +
            '<div class="drive__vehicle" aria-hidden="true"><div class="crane"><img class="crane__body" src="' + ASSETS.craneSide + '" alt="" draggable="false">' + wheels + '</div></div>' +
            '<div class="scene-progress" aria-hidden="true"><i></i><span class="scene-progress__meta">01 / ' + pad2(SERVICES.length) + '</span></div>' +
          '</div>' +
        '</div>' +
      '</div>';
    var root = $('.drive', mount), track = $('.drive__track', mount), stage = $('.drive__stage', mount), banner = $('.drive__banner', mount);
    var heading = $('.drive__heading', mount), panel = $('.drive__panel', mount), reel = $('.drive__reel', mount), vehicle = $('.drive__vehicle', mount), meta = $('.scene-progress__meta', mount);
    var slideEls = Array.prototype.slice.call(reel.children), cards = $$('.svc', reel);
    var m = {}, lastP = -1, lastIdx = -1;
    drive = {
      track: track,
      measure: function () {
        m.headingW = heading.offsetWidth; m.bannerW = banner.clientWidth;
        m.panelW = panel.clientWidth; m.reelW = reel.scrollWidth;
        m.vehicleW = vehicle.offsetWidth || 620; m.stageW = stage.clientWidth || innerWidth;
        m.offsets = slideEls.map(function (el) { return [el.offsetLeft, el.offsetWidth]; });
        m.cards = cards.map(function (el) { return el.offsetLeft + el.offsetWidth / 2; });
        lastP = -1;
      },
      update: function () {
        if (!isDesktop()) return;
        var p = trackProgress(track, stage);
        if (p === lastP) return; lastP = p;
        var t = clamp01(p / LOCK_AT), locked = p >= LOCK_AT;
        root.classList.toggle('is-locked', locked);
        /* reel: from just off the right edge to "last card fully in view" */
        var reelEnd = Math.min(0, m.panelW - m.reelW);
        var reelX = lerp(m.panelW, reelEnd, t);
        reel.style.setProperty('--reel-x', reelX.toFixed(1) + 'px');
        heading.style.setProperty('--heading-x', lerp(m.bannerW, m.bannerW - m.headingW - m.bannerW * 0.04, t).toFixed(1) + 'px');
        /* truck: roll in, cruise with the reel, then drive off once locked */
        var startX = -m.vehicleW * 0.9, settleX = m.stageW * 0.12, cruiseX = m.stageW * 0.5, endX = m.stageW + m.vehicleW * 0.1, x;
        if (p < 0.1) x = lerp(startX, settleX, smooth(p / 0.1));
        else if (p < LOCK_AT) x = lerp(settleX, cruiseX, (p - 0.1) / (LOCK_AT - 0.1));
        else { var e = clamp01((p - LOCK_AT) / (1 - LOCK_AT) / 0.85); x = lerp(cruiseX, endX, e * e); }
        var wheelR = m.vehicleW * (48 / 947), ang = ((x - startX) / Math.max(1, wheelR)) * (180 / Math.PI);
        vehicle.style.setProperty('--wheel-rot', ang.toFixed(2) + 'deg');
        vehicle.style.transform = 'translate3d(' + x.toFixed(1) + 'px, calc(-50% + ' + (Math.sin(ang * 0.0038) * 0.75).toFixed(2) + 'px), 0)';
        setProgress(stage, p);
        /* counter: card closest to the panel centre */
        var c = m.panelW / 2, best = 0, bd = Infinity;
        for (var k = 0; k < m.cards.length; k++) { var dd = Math.abs(reelX + m.cards[k] - c); if (dd < bd) { bd = dd; best = k; } }
        if (locked) best = m.cards.length - 1;
        if (best !== lastIdx) { lastIdx = best; meta.textContent = pad2(best + 1) + ' / ' + pad2(SERVICES.length); }
        for (var i = 0; i < slideEls.length; i++) {
          var l = reelX + m.offsets[i][0], vis = l + m.offsets[i][1] > 0 && l < m.panelW;
          if (slideEls[i].inert === vis) slideEls[i].inert = !vis;
        }
      }
    };
    scenes.push(drive);
    requestMeasure();
  }

  /* 4b. Compact: momentum carousel */
  var svcGlide = null;
  function buildCompactServices() {
    var mount = $('#servicesCompact');
    if (!mount) return;
    mount.innerHTML =
      '<div class="svc-rail" role="region" aria-roledescription="carousel" aria-label="Our services">' +
        '<div class="svc-rail__viewport" tabindex="0" aria-label="Services, swipe or use arrow keys"><div class="glide__track">' +
          SERVICES.map(function (s, i) {
            return '<article class="svc-card" data-glide-card data-service-id="' + s.id + '" role="button" tabindex="-1" aria-label="' + esc(s.title) + ', view details">' +
              '<img class="svc-card__img" src="' + s.image + '" alt="" draggable="false" loading="' + (i < 2 ? 'eager' : 'lazy') + '">' +
              '<div class="svc-card__gradient"></div>' +
              '<div class="svc-card__top"><span class="svc-card__num">' + pad2(i + 1) + '</span><span class="svc-card__plus" aria-hidden="true"><svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg></span></div>' +
              '<div class="svc-card__content"><h3 class="svc-card__title" data-svc-field="title">' + esc(s.title) + '</h3><p class="svc-card__sub" data-svc-field="summary">' + esc(s.summary) + '</p></div>' +
            '</article>';
          }).join('') +
        '</div></div>' +
        '<div class="svc-rail__meta"><span class="svc-rail__count">01 <span>/ ' + pad2(SERVICES.length) + '</span></span><span class="svc-rail__progress" aria-hidden="true"><i></i></span><span class="svc-rail__hint">Swipe ⟷</span></div>' +
      '</div>';
    var vp = $('.svc-rail__viewport', mount), count = $('.svc-rail__count', mount), prog = $('.svc-rail__progress i', mount), cards = $$('.svc-card', mount), hint = $('.svc-rail__hint', mount);
    svcGlide = new Glide(vp, {
      onChange: function (i) {
        cards.forEach(function (c, j) { c.classList.toggle('is-active', j === i); });
        prog.style.setProperty('--prog', ((i + 1) / cards.length).toFixed(4));
        count.innerHTML = pad2(i + 1) + ' <span>/ ' + pad2(cards.length) + '</span>';
        if (i > 0) hint.textContent = 'Tap for details';
      }
    });
    mount.addEventListener('click', function (e) {
      var card = e.target.closest('.svc-card');
      if (card) openService(card.getAttribute('data-service-id'), card);
    });
    vp.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openService(SERVICES[svcGlide.index].id, cards[svcGlide.index]); } });
    scenes.push({ measure: function () { if (!isDesktop()) svcGlide.measure(); }, update: function () {} });
  }

/* ## reviewed 2026-10-09: road + credentials scene (JS) */
  /* 3c. Road turn + credentials (one pinned scene, both modes) */
  (function () {
    var section = $('[data-scene="road"]');
    var stat = $('[data-creds-static]');
    if (stat) stat.innerHTML = '<h2 style="font-size:clamp(30px,4vw,52px);letter-spacing:-.045em">With over a decade of experience, Barend Botha is a trusted equipment inspector.</h2>' + $('[data-creds]').outerHTML.replace('data-creds', 'data-creds-copy');
    if (!section || reduceMotion) return;
    var track = $('.road__track', section), stage = $('.road__stage', section);
    var paths = $$('.road__svg path', section), edge = paths[0], inner = paths[1], dash = paths[2];
    var vehicle = $('.road__vehicle', section), copy = $('.road__copy', section), creds = $$('.cred', section);
    var g = {}, lastP = -1;
    function qPoint(a, b, c, t) { var u = 1 - t; return { x: u * u * a.x + 2 * u * t * b.x + t * t * c.x, y: u * u * a.y + 2 * u * t * b.y + t * t * c.y }; }
    function qTan(a, b, c, t) { return { x: 2 * (1 - t) * (b.x - a.x) + 2 * t * (c.x - b.x), y: 2 * (1 - t) * (b.y - a.y) + 2 * t * (c.y - b.y) }; }
    scenes.push({
      measure: function () {
        var w = stage.clientWidth, h = stage.clientHeight, desk = isDesktop(), roadW, cx, y0, r;
        if (desk) { roadW = clamp(w * 0.2, 280, 360); cx = w / 2; y0 = clamp(h * 0.3, 180, 250); r = clamp(roadW * 1.08, 210, 320); }
        else { roadW = clamp(w * 0.19, 64, 92); cx = w - 22 - roadW / 2; y0 = clamp(h * 0.15, 96, 150); r = Math.min(110, w * 0.22); }
        var start = { x: cx - r, y: y0 }, ctrl = { x: cx, y: y0 }, end = { x: cx, y: y0 + r };
        var d = 'M -160 ' + y0.toFixed(1) + ' L ' + start.x.toFixed(1) + ' ' + y0.toFixed(1) + ' Q ' + cx.toFixed(1) + ' ' + y0.toFixed(1) + ' ' + end.x.toFixed(1) + ' ' + end.y.toFixed(1) + ' L ' + cx.toFixed(1) + ' ' + (h + 200).toFixed(1);
        paths.forEach(function (p) { p.setAttribute('d', d); });
        edge.setAttribute('stroke-width', (roadW + (desk ? 14 : 8)).toFixed(1));
        inner.setAttribute('stroke-width', roadW.toFixed(1));
        dash.style.strokeWidth = desk ? 5 : 3; dash.style.strokeDasharray = desk ? '34 34' : '20 20';
        g = { w: w, h: h, cx: cx, y0: y0, start: start, ctrl: ctrl, end: end, desk: desk, vw: vehicle.offsetWidth || 150, vh: vehicle.offsetHeight || 420 };
        /* Keep the copy and credential cards in the open ground beside the
           road, never on it. The horizontal band and the vertical leg are
           both measured, and each text block is sized and placed to clear
           them by a safe margin at every screen size. */
        var half = roadW / 2 + (desk ? 7 : 4), gut = clamp(w * 0.04, 18, 56), gap = desk ? 48 : 16;
        var bandBottom = y0 + half, legLeft = cx - half, legRight = cx + half;
        var copyW = Math.max(160, Math.min(desk ? 540 : 520, legLeft - gap - gut));
        copy.style.left = gut + 'px'; copy.style.width = copyW + 'px';
        var cardsEl = creds[0].parentNode;
        if (desk) {
          var cardsLeft = legRight + gap, cardsW = Math.max(220, Math.min(430, w - gut - cardsLeft));
          cardsEl.style.left = (w - gut - cardsW) + 'px'; cardsEl.style.right = 'auto'; cardsEl.style.width = cardsW + 'px';
          var ch = copy.offsetHeight, top = Math.max(bandBottom + 40, (bandBottom + h) / 2 - ch / 2);
          copy.style.top = Math.min(top, h - ch - 48) + 'px';
          var kh = cardsEl.offsetHeight; cardsEl.style.top = Math.max(48, (h - kh) / 2) + 'px'; cardsEl.style.bottom = 'auto';
        } else {
          cardsEl.style.left = gut + 'px'; cardsEl.style.width = copyW + 'px'; cardsEl.style.top = 'auto'; cardsEl.style.right = 'auto';
          copy.style.top = (bandBottom + 26) + 'px';
          /* Short phones: step the heading down until it clears the cards. */
          var h2 = copy.querySelector('h2'); h2.style.fontSize = '';
          var size = parseFloat(getComputedStyle(h2).fontSize);
          while (size > 18 && bandBottom + 26 + copy.offsetHeight > h - (h - cardsEl.offsetTop) - 16 + 0 && bandBottom + 26 + copy.offsetHeight > cardsEl.offsetTop - 16) { size -= 1; h2.style.fontSize = size + 'px'; }
        }
        lastP = -1;
      },
      update: function () {
        if (!g.w) return;
        var p = trackProgress(track, stage);
        if (p === lastP) return; lastP = p;
        var desk = g.desk, a1 = desk ? 0.26 : 0.2, a2 = desk ? 0.62 : 0.42, tx, ty, ang;
        if (p < a1) { tx = lerp(-g.vw * 0.55, g.start.x, smooth(p / a1)); ty = g.y0; ang = 90; }
        else if (p < a2) { var c = smooth((p - a1) / (a2 - a1)), q = qPoint(g.start, g.ctrl, g.end, c), tg = qTan(g.start, g.ctrl, g.end, c); tx = q.x; ty = q.y; ang = Math.atan2(tg.y, tg.x) * 180 / Math.PI + 90; }
        else { tx = g.cx; ty = lerp(g.end.y, g.h + g.vh * 0.58 + 24, smooth((p - a2) / (1 - a2))); ang = 180; }
        vehicle.style.transform = 'translate3d(' + (tx - g.vw / 2).toFixed(1) + 'px,' + (ty - g.vh / 2).toFixed(1) + 'px,0) rotate(' + ang.toFixed(2) + 'deg)';
        dash.style.strokeDashoffset = (-p * 1280).toFixed(1);
        setProgress(stage, p);
        var cp = desk ? smooth((p - 0.6) / 0.16) : smooth((p - 0.28) / 0.14);
        copy.style.opacity = cp.toFixed(3);
        copy.style.transform = 'translateY(' + ((1 - cp) * 28).toFixed(1) + 'px)';
        creds.forEach(function (el, i) {
          var l = desk ? smooth((p - (0.66 + i * 0.07)) / 0.09) : smooth((p - (0.46 + i * 0.12)) / 0.1);
          el.style.opacity = l.toFixed(3); el.style.transform = 'translateY(' + ((1 - l) * 22).toFixed(1) + 'px)';
        });
      }
    });
  })();

  /* 3d. Speed HUD (desktop drive sequence) */
  (function () {
    if (reduceMotion) return;
    var hud = document.createElement('div');
    hud.className = 'speed-hud only-desktop'; hud.setAttribute('aria-hidden', 'true');
    hud.innerHTML = '<span class="speed-hud__value">00</span><span class="speed-hud__unit">KM/H</span>';
    document.body.appendChild(hud);
    var val = hud.firstChild, startY = 0, endY = 0, visible = false, lastY = 0, lastT = 0, disp = 0, idle = 0, raf = 0;
    function tick(now) {
      var y = scrollY, dt = Math.max(1, now - lastT), dy = Math.abs(y - lastY);
      var target = Math.min(62, (dy / dt) * 60 * 0.22);
      if (dy < 0.5) { if (++idle > 3) target = 0; } else idle = 0;
      disp += (target - disp) * 0.16; if (disp < 0.4) disp = 0;
      val.textContent = String(Math.round(disp)).padStart(2, '0');
      lastY = y; lastT = now;
      raf = visible ? requestAnimationFrame(tick) : 0;
    }
    scenes.push({
      measure: function () {
        var s = drive && drive.track, e = $('.road__track');
        if (!s || !e) { startY = endY = 0; return; }
        startY = s.getBoundingClientRect().top + scrollY; endY = e.getBoundingClientRect().bottom + scrollY;
      },
      update: function () {
        var y = scrollY, inRange = isDesktop() && endY > 0 && y >= startY - 40 && y < endY - innerHeight * 0.6;
        if (inRange && !visible) { visible = true; hud.classList.add('is-visible'); lastY = y; lastT = performance.now(); if (!raf) raf = requestAnimationFrame(tick); }
        else if (!inRange && visible) { visible = false; hud.classList.remove('is-visible'); disp = 0; val.textContent = '00'; }
      }
    });
  })();


  /* 5. Detail views ----------------------------------------------------------
     openService() picks the right one for the current mode:
     Every screen size uses the same iOS-style slide-up sheet. It fills the
     [data-detail] slots and fires
     'supreme:detail-open' so the editor layer can hook in. */
  function fillDetail(container, s) {
    $('[data-detail="title"]', container).textContent = s.title;
    $('[data-detail="summary"]', container).textContent = s.summary;
    var scope = $('[data-detail="scope"]', container);
    scope.innerHTML = s.scope && s.scope.length
      ? '<h4 class="detail-scope-heading">What’s covered</h4><ul class="detail-scope">' + s.scope.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>'
      : '';
    container.setAttribute('data-service-id', s.id);
    $$('[data-detail="num"]', container).forEach(function (n) { n.textContent = pad2(SERVICES.indexOf(s) + 1); });
    $('[data-detail="cta"]', container).dataset.serviceValue = s.formValue;
    $$('[data-detail="count"]', container).forEach(function (n) { n.textContent = pad2(SERVICES.indexOf(s) + 1) + ' / ' + pad2(SERVICES.length); });
  }
  function preselectService(value) {
    var sel = $('#f-service');
    if (sel && value) { sel.value = value; sel.dispatchEvent(new Event('change', { bubbles: true })); }
  }
  function openService(id, trigger) {
    var s = findService(id);
    if (!s) return;
    sheetOpen(s, trigger);
  }

  /* 5b. Service sheet (all screen sizes).
     Opens to ~92% height while the page behind dims and recedes. Drag the
     grabber (or the content, once it's scrolled to the top) down to
     dismiss, a quick flick closes it, a slow drag past ~28% closes it,
     anything less springs back. Compact uses a fixed-body scroll lock so
     iOS can't scroll the page underneath; desktop locks with overflow so
     the pinned services scene behind stays exactly where it is. */
  var sheet = $('#serviceSheet'), sheetBackdrop = $('#sheetBackdrop'), sheetScroll = $('#sheetScroll'), pageEl = $('#page');
  var sheetState = { open: false, y: 0, trigger: null, closeTimer: 0 };
  var SHEET_MS = 500, PAGE_SCALE = 0.93;
  function setPageRecede(t, animate) {
    /* t: 1 = fully receded (sheet open), 0 = normal */
    if (!sheetState.fixed) {
      /* Desktop: never transform the page (it holds pinned scenes). The
         real page stays visible behind a dimmed, blurred backdrop. */
      pageEl.style.transform = '';
      sheetBackdrop.style.transition = animate ? '' : 'none';
      sheetBackdrop.style.opacity = t > 0 ? t.toFixed(3) : '';
      return;
    }
    var sc = 1 - (1 - PAGE_SCALE) * t;
    pageEl.style.transition = animate ? 'transform ' + SHEET_MS + 'ms cubic-bezier(.32,.72,0,1)' : 'none';
    pageEl.style.transform = t > 0 ? 'scale(' + sc.toFixed(4) + ')' : '';
    sheetBackdrop.style.transition = animate ? '' : 'none';
    sheetBackdrop.style.opacity = t > 0 ? (0.4 * t).toFixed(3) : '';
  }
  function blockScroll(e) {
    var sc = e.target.closest && e.target.closest('.sheet__scroll');
    if (!sc || sc.scrollHeight <= sc.clientHeight) e.preventDefault();
  }
  function blockKeys(e) {
    if (['PageDown', 'PageUp', 'Home', 'End', ' ', 'ArrowDown', 'ArrowUp'].indexOf(e.key) > -1 && !e.target.closest('input, textarea, select')) e.preventDefault();
  }
  function sheetOpen(s, trigger) {
    if (sheetState.open) return;
    clearTimeout(sheetState.closeTimer);
    sheetState.open = true; sheetState.trigger = trigger;
    fillDetail(sheet, s);
    var img = $('#sheetImage'); img.src = s.image; img.alt = s.alt;
    sheetScroll.scrollTop = 0;
    sheetState.y = scrollY; sheetState.fixed = !isDesktop();
    pageEl.style.transformOrigin = '50% ' + (sheetState.y + innerHeight / 2).toFixed(0) + 'px';
    if (sheetState.fixed) { document.body.style.top = -sheetState.y + 'px'; document.body.classList.add('is-sheet-locked', 'is-sheet-open'); }
    sheetState.current = s;
    /* Desktop: changing overflow on <html>/<body> would un-pin the sticky
       scene behind the sheet, so block page scrolling with input guards. */
    if (sheetState.fixed) root.classList.add('sheet-lock'); else { window.addEventListener('wheel', blockScroll, { passive: false }); window.addEventListener('keydown', blockKeys); }
    root.classList.add('sheet-open');
    nav.classList.add('is-hidden');
    sheet.setAttribute('aria-hidden', 'false');
    sheet.style.transform = '';
    sheetBackdrop.classList.add('is-open');
    void sheet.offsetWidth;
    sheet.classList.add('is-open');
    setPageRecede(1, !reduceMotion);
    document.dispatchEvent(new CustomEvent('supreme:detail-open', { detail: { el: sheet, service: s, image: img } }));
    setTimeout(function () { $('[data-sheet-close]', sheet).focus({ preventScroll: true }); }, 80);
  }
  function sheetHide(then) {
    if (!sheetState.open) return;
    sheetState.open = false;
    sheet.classList.remove('is-dragging');
    sheet.classList.add('is-closing');
    sheet.style.transform = '';
    sheet.classList.remove('is-open');
    sheetBackdrop.classList.remove('is-open');
    setPageRecede(0, !reduceMotion);
    sheetState.closeTimer = setTimeout(function () {
      sheet.classList.remove('is-closing');
      sheet.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('is-sheet-locked', 'is-sheet-open');
      document.body.style.top = '';
      root.classList.remove('sheet-lock', 'sheet-open');
      window.removeEventListener('wheel', blockScroll); window.removeEventListener('keydown', blockKeys);
      pageEl.style.transition = ''; pageEl.style.transformOrigin = '';
      if (sheetState.fixed) window.scrollTo(0, sheetState.y);
      if (!then && sheetState.trigger && sheetState.trigger.focus) sheetState.trigger.focus({ preventScroll: true });
      if (then) then();
    }, reduceMotion ? 10 : SHEET_MS);
  }
  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-service-trigger]');
    if (t) openService(t.getAttribute('data-service-trigger'), t);
  });
  if (sheet) {
    sheetBackdrop.addEventListener('click', function () { sheetHide(); });
    /* Desktop: step through services without closing the sheet. */
    $$('[data-sheet-step]', sheet).forEach(function (b) {
      b.addEventListener('click', function () {
        var i = (SERVICES.indexOf(sheetState.current) + (+b.getAttribute('data-sheet-step')) + SERVICES.length) % SERVICES.length;
        var next = SERVICES[i];
        sheet.classList.add('is-swapping');
        setTimeout(function () {
          sheetState.current = next;
          fillDetail(sheet, next);
          var img = $('#sheetImage'); img.src = next.image; img.alt = next.alt;
          sheetScroll.scrollTop = 0;
          sheet.classList.remove('is-swapping');
          document.dispatchEvent(new CustomEvent('supreme:detail-open', { detail: { el: sheet, service: next, image: img } }));
        }, reduceMotion ? 0 : 200);
      });
    });
    $('[data-sheet-close]', sheet).addEventListener('click', function () { sheetHide(); });
    $('[data-detail="cta"]', sheet).addEventListener('click', function (e) {
      e.preventDefault();
      var v = this.dataset.serviceValue;
      sheetHide(function () { preselectService(v); scrollToAnchor('#contact'); });
    });
    /* Drag to dismiss (touch) */
    var d = null, handle = $('[data-sheet-handle]', sheet);
    function dragTo(off) {
      var h = sheet.offsetHeight || innerHeight * 0.92;
      sheet.style.transform = 'translate3d(0,' + off.toFixed(1) + 'px,0)';
      setPageRecede(1 - clamp01(off / h), false);
    }
    function dragEnd() {
      if (!d || !d.active) { d = null; return; }
      var h = sheet.offsetHeight, last = d.samples[d.samples.length - 1], first = d.samples[0];
      var v = (last.y - first.y) / Math.max(1, last.t - first.t);
      if (performance.now() - last.t > 90) v = 0;
      sheet.classList.remove('is-dragging');
      if (v > 0.45 || d.off > h * 0.28) sheetHide();
      else { sheet.style.transform = ''; setPageRecede(1, true); }
      d = null;
    }
    sheet.addEventListener('touchstart', function (e) {
      if (!sheetState.open || e.touches.length > 1) return;
      var inHandle = !!e.target.closest('[data-sheet-handle]');
      d = { y0: e.touches[0].clientY, inHandle: inHandle, active: false, off: 0, samples: [] };
    }, { passive: true });
    sheet.addEventListener('touchmove', function (e) {
      if (!d) return;
      var y = e.touches[0].clientY, dy = y - d.y0;
      if (!d.active) {
        if (dy > 4 && (d.inHandle || sheetScroll.scrollTop <= 0)) { d.active = true; d.y0 = y; dy = 0; sheet.classList.add('is-dragging'); }
        else if (Math.abs(dy) > 4) { d = null; return; }
        else return;
      }
      e.preventDefault();
      d.off = dy > 0 ? dy : dy * 0.18;
      dragTo(Math.max(-20, d.off));
      var now = performance.now();
      d.samples.push({ t: now, y: y });
      while (d.samples.length > 2 && now - d.samples[0].t > 100) d.samples.shift();
    }, { passive: false });
    sheet.addEventListener('touchend', dragEnd);
    sheet.addEventListener('touchcancel', dragEnd);
    /* Mouse drag on the grabber (desktop browsers at narrow widths) */
    handle.addEventListener('pointerdown', function (e) {
      if (e.pointerType !== 'mouse' || e.target.closest('[data-sheet-close]')) return;
      d = { y0: e.clientY, active: true, off: 0, samples: [{ t: performance.now(), y: e.clientY }] };
      sheet.classList.add('is-dragging'); handle.setPointerCapture(e.pointerId);
    });
    handle.addEventListener('pointermove', function (e) {
      if (!d || e.pointerType !== 'mouse') return;
      d.off = Math.max(0, e.clientY - d.y0); dragTo(d.off);
      d.samples.push({ t: performance.now(), y: e.clientY }); if (d.samples.length > 6) d.samples.shift();
    });
    handle.addEventListener('pointerup', function (e) { if (e.pointerType === 'mouse') dragEnd(); });
    sheet.addEventListener('keydown', function (e) {
      if (e.key !== 'Tab') return;
      var f = $$('a[href], button:not([disabled])', sheet); if (!f.length) return;
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
    });
  }
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if (sheetState.open) sheetHide();
    else closeNav();
  });
  /* Switching mode while a detail view is open: close it cleanly. */
  onModeChange(function () { if (sheetState.open) sheetHide(); });

/* ## reviewed 2026-10-09: testimonials, old, replaced by build (JS) */
  /* ## reviewed 2026-10-09: written and tested by Claude (desktop 1440 + phone 375) */
/* 6. Testimonials + team (Design B: "On Site") -----------------------------
     Section HTML is static (readable without JS). Desktop pins the scene and
     steps through the three quotes from scroll progress via the shared
     scenes loop; compact is a native swipe row. */
  function renderTestimonials() {}   /* kept for the editor API; content is static */
  (function () {
    var sec = $('#testimonials.ts-b');
    if (!sec) return;
    var track = $('.ts-b__track', sec), stage = $('.ts-b__stage', sec);
    var quotes = $$('.ts-b__q', sec), steps = $$('.ts-b__step', sec), imgs = $$('.ts-b__img', sec), hudN = $('.ts-b__hud-n', sec);
    var N = quotes.length, cur = -2, fills = [], mode = '';
    var HOLD = 0.78;   /* rail fills over this share of each chapter, then holds */
    function pinned() { return isDesktop() && !reduceMotion; }
    function setCurrent(i) {
      if (cur === i) return; cur = i;
      quotes.forEach(function (q, j) { q.classList.toggle('is-current', j === i); q.classList.toggle('is-past', i >= 0 && j < i); q.setAttribute('aria-hidden', String(i >= 0 && j !== i)); });
      imgs.forEach(function (im, j) { im.classList.toggle('is-current', j === i); im.classList.toggle('is-past', j < i); });
      steps.forEach(function (s, j) { s.setAttribute('aria-current', String(j === i)); });
      if (hudN && i >= 0) hudN.textContent = (i < 9 ? '0' : '') + (i + 1);
    }
    function setFill(j, f) { var v = f.toFixed(3); if (fills[j] === v) return; fills[j] = v; steps[j].style.setProperty('--f', v); }

    scenes.push({ update: function () {
      var m = pinned() ? 'pin' : 'stack';
      if (m !== mode) {
        mode = m; cur = -2;
        if (m === 'stack') { quotes.forEach(function (q) { q.classList.remove('is-current', 'is-past'); q.removeAttribute('aria-hidden'); }); return; }
      }
      if (m !== 'pin') return;
      var p = trackProgress(track, stage);
      var seg = p * N, i = Math.min(N - 1, Math.floor(seg)), lp = seg - i;
      setCurrent(i);
      for (var j = 0; j < N; j++) setFill(j, j < i ? 1 : j > i ? 0 : clamp01(lp / HOLD));
      stage.style.setProperty('--sp', p.toFixed(4));
    } });

    steps.forEach(function (s, j) {
      s.addEventListener('click', function () {
        if (!pinned()) return;
        var travel = track.offsetHeight - stage.offsetHeight;
        var top = track.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({ top: top + travel * ((j + 0.2) / N), behavior: 'smooth' });
      });
    });
  })();

  /* Team: open the field photo frame on entry; edge light follows the cursor. */
  (function () {
    var clips = $$('.reveal-clip');
    if (reduceMotion || !('IntersectionObserver' in window)) { clips.forEach(function (c) { c.classList.add('is-visible'); }); }
    else {
      var io = new IntersectionObserver(function (en) {
        en.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); } });
      }, { threshold: 0.2 });
      clips.forEach(function (c) { io.observe(c); });
    }
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    $$('.edge-light').forEach(function (el) {
      el.addEventListener('pointermove', function (ev) {
        var r = el.getBoundingClientRect();
        el.style.setProperty('--mx', (ev.clientX - r.left) + 'px');
        el.style.setProperty('--my', (ev.clientY - r.top) + 'px');
      }, { passive: true });
    });
  })();

  /* Final: team text motion (build in once when in view) */
  (function () {
    var els = $$('.motion-in');
    if (reduceMotion || !('IntersectionObserver' in window)) { els.forEach(function (el) { el.classList.add('is-in'); }); return; }
    var io = new IntersectionObserver(function (en) {
      en.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
    }, { threshold: 0.25, rootMargin: '0px 0px -40px 0px' });
    els.forEach(function (el) { io.observe(el); });
  })();

  /* Final: road heading ("With over a decade of experience...") fills orange
     word by word with scroll, just after it fades in. */
  (function () {
    var sec = $('[data-scene="road"]'); if (!sec) return;
    var h2 = $('.road__copy h2', sec); if (!h2) return;
    var text = h2.textContent.trim();
    h2.setAttribute('aria-label', text);
    h2.innerHTML = text.split(/\s+/).map(function (w) { return '<span class="road-word" aria-hidden="true">' + esc(w) + '</span>'; }).join(' ');
    var ws = $$('.road-word', h2), track = $('.road__track', sec), stage = $('.road__stage', sec), last = -1;
    if (reduceMotion) { ws.forEach(function (w) { w.classList.add('is-lit'); }); return; }
    scenes.push({ update: function () {
      var d = isDesktop(), p = trackProgress(track, stage);
      var n = Math.round(clamp01((p - (d ? 0.66 : 0.34)) / (d ? 0.2 : 0.22)) * ws.length);
      if (n === last) return; last = n;
      ws.forEach(function (w, k) { w.classList.toggle('is-lit', k < n); });
    } });
  })();

  /* Final: certification guide cards open their article in a dialog. Esc,
     backdrop click and the X close it; focus returns to the card. */
  (function () {
    var opens = $$('[data-guide]'); if (!opens.length) return;
    var current = null, trigger = null;
    function close() {
      var dlg = current; if (!dlg) return; current = null;
      function done() { dlg.classList.remove('is-closing'); if (dlg.open) dlg.close(); unlockScroll('guide'); if (trigger) trigger.focus({ preventScroll: true }); }
      if (reduceMotion) return done();
      dlg.classList.add('is-closing'); setTimeout(done, 190);
    }
    opens.forEach(function (b) {
      b.addEventListener('click', function () {
        var dlg = document.getElementById(b.getAttribute('data-guide'));
        if (!dlg || !dlg.showModal) return;
        var im = $('img[data-from]', dlg), src = $('.guide__media img', b);
        if (im && src && !im.src) im.src = src.currentSrc || src.src;   /* reuse the card photo, stored once */
        trigger = b; current = dlg;
        dlg.showModal(); lockScroll('guide');
        var body = $('.guide-dlg__body', dlg); if (body) body.scrollTop = 0; dlg.scrollTop = 0;
      });
    });
    $$('.guide-dlg').forEach(function (dlg) {
      dlg.addEventListener('cancel', function (ev) { ev.preventDefault(); close(); });
      dlg.addEventListener('click', function (ev) { if (ev.target === dlg) close(); });
      $$('[data-guide-close]', dlg).forEach(function (c) {
        c.addEventListener('click', function (ev) {
          if (c.getAttribute('href') === '#contact') { ev.preventDefault(); trigger = null; close(); setTimeout(function () { var t = $('#contact'); if (t) t.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' }); }, 220); }
          else close();
        });
      });
    });
  })();

  /* Final: contact background video. The clip is embedded as inert base64;
     it is decoded into a blob only when the visitor nears the section, and
     plays only while the section is on screen and the tab is visible. */
  (function () {
    var bg = $('.contact__bg');   /* the data block sits after this script, so look it up lazily */
    if (!bg || reduceMotion || !('IntersectionObserver' in window)) return;
    var video = $('video', bg), ready = false, inView = false;
    function load() {
      if (ready || document.readyState === 'loading') return;   /* the data block may still be streaming in */
      if (video.getAttribute('data-src')) {   /* web build: the video is a normal file next to the page */
        ready = true; video.src = video.getAttribute('data-src');
      } else {                                 /* single-file build: decode the embedded data block */
        var store = document.getElementById('contactVideoData'); if (!store) return;
        ready = true;
        try {
          var bin = atob(store.textContent.trim()), len = bin.length, bytes = new Uint8Array(len);
          for (var i = 0; i < len; i++) bytes[i] = bin.charCodeAt(i);
          video.src = URL.createObjectURL(new Blob([bytes], { type: 'video/mp4' }));
          store.textContent = '';   /* free the text copy */
        } catch (e) { return; }
      }
      video.addEventListener('playing', function () { bg.classList.add('is-playing'); }, { once: true });
      video.addEventListener('loadeddata', sync, { once: true });
      var r = bg.getBoundingClientRect(); inView = r.top < innerHeight && r.bottom > 0;
      sync();
    }
    function sync() {
      if (!ready) return;
      if (inView && !document.hidden) { var p = video.play(); if (p && p.catch) p.catch(function () {}); }
      else video.pause();
    }
    /* Re-checked on every scroll until loaded: the data block at the end of the
       file may still be parsing the first time the visitor gets close. */
    scenes.push({ update: function () {
      var r = bg.getBoundingClientRect();
      if (!ready && r.top < innerHeight + 1200) load();
      var vis = r.top < innerHeight && r.bottom > 0;
      if (vis !== inView) { inView = vis; sync(); }
    } });
    document.addEventListener('DOMContentLoaded', function () { if (!ready && bg.getBoundingClientRect().top < innerHeight + 1200) load(); });
    document.addEventListener('visibilitychange', sync);
  })();


  /* ## reviewed 2026-10-10: written by Claude from the improve-animations audit. Both versions since 2026-10-10. */
  (function () {
    /* 1 + 10: once a build-in has played, drop its delays so hover feels instant. */
    function settleAfter(el, ms) {
      if (reduceMotion) { el.classList.add('is-settled'); return; }
      var mo = new MutationObserver(function () {
        if (el.classList.contains('is-in') || el.classList.contains('is-visible')) { mo.disconnect(); setTimeout(function () { el.classList.add('is-settled'); }, ms); }
      });
      mo.observe(el, { attributes: true, attributeFilter: ['class'] });
      if (el.classList.contains('is-in') || el.classList.contains('is-visible')) { mo.disconnect(); setTimeout(function () { el.classList.add('is-settled'); }, ms); }
    }
    $$('.tm-a__person').forEach(function (p) { settleAfter(p, 1900); });
    var contactCol = $('.contact > .reveal'); if (contactCol) settleAfter(contactCol, 1300);

    /* 3: form -> success. The card eases to its new height (rare, one-off moment),
       the content rises in and the tick draws itself. */
    var card = $('#formCard'), success = $('#formSuccess');
    if (card && success) {
      var lastH = card.offsetHeight;
      if ('ResizeObserver' in window) new ResizeObserver(function () { if (!card.dataset.morphing) lastH = card.offsetHeight; }).observe(card);
      var icon = $('.form-success__icon svg', success);
      var strokes = icon ? $$('path, polyline', icon) : [];
      new MutationObserver(function () {
        if (success.hidden) { success.classList.remove('is-entering'); return; }
        if (reduceMotion) return;
        var from = lastH, to = card.offsetHeight;
        success.classList.remove('is-entering'); void success.offsetWidth; success.classList.add('is-entering');
        strokes.forEach(function (s) {
          if (!s.getTotalLength) return;
          var len = s.getTotalLength(); s.style.transition = 'none'; s.style.strokeDasharray = len; s.style.strokeDashoffset = len;
          s.getBoundingClientRect(); s.style.transition = ''; s.style.strokeDashoffset = '0';
        });
        if (card.animate && Math.abs(from - to) > 4) {
          card.dataset.morphing = '1'; card.style.overflow = 'hidden';
          var a = card.animate([{ height: from + 'px' }, { height: to + 'px' }], { duration: 420, easing: 'cubic-bezier(.22,1,.36,1)' });
          a.onfinish = a.oncancel = function () { card.style.overflow = ''; delete card.dataset.morphing; lastH = card.offsetHeight; };
        }
      }).observe(success, { attributes: true, attributeFilter: ['hidden'] });
    }
  })();


  /* ## reviewed 2026-10-10: written by Claude. Radial reveal buttons (green version). */
  (function () {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    var SEL = '.btn, .svc__more, .nav__links a, .nav__call';
    function btnOf(e) { return e.target && e.target.closest ? e.target.closest(SEL) : null; }
    function place(b, fill, e) {
      var r = b.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
      x = Math.max(0, Math.min(r.width, x)); y = Math.max(0, Math.min(r.height, y));
      var R = Math.hypot(Math.max(x, r.width - x), Math.max(y, r.height - y)) + 2;
      fill.style.setProperty('--fx-x', x.toFixed(1) + 'px');
      fill.style.setProperty('--fx-y', y.toFixed(1) + 'px');
      fill.style.setProperty('--fx-r', R.toFixed(1) + 'px');
    }
    document.addEventListener('pointerover', function (e) {
      var b = btnOf(e); if (!b || (e.relatedTarget && b.contains(e.relatedTarget)) || e.pointerType === 'touch') return;
      var f = b.querySelector(':scope > .fx-fill');
      if (!f) { f = document.createElement('span'); f.className = 'fx-fill'; f.setAttribute('aria-hidden', 'true'); b.appendChild(f); }
      if (!b.classList.contains('fx-on')) { place(b, f, e); f.getBoundingClientRect(); }   /* start the circle at the entry point */
      b.classList.add('fx-on');
    });
    document.addEventListener('pointerout', function (e) {
      var b = btnOf(e); if (!b || (e.relatedTarget && b.contains(e.relatedTarget))) return;
      var f = b.querySelector(':scope > .fx-fill'); if (f) place(b, f, e);   /* shrink back to the exit point */
      b.classList.remove('fx-on');
    });
  })();


  /* ## reviewed 2026-10-09: written and tested by Claude */
/* 7. Locations map (v28 behaviour) ------------------------------------------
     Satellite fly-in to Auckland, then 19 orange lines branch out to every
     service area and the view frames them all. Same choreography as v28.
     Added: labels that would collide tuck away (hover, focus or tap a pin to
     see its name) and return as you zoom in; labels use the site font. */
  (function () {
    var list = $('#locationsList'), mapEl = $('#locationsMap');
    var hub = LOCATIONS.filter(function (l) { return l.id === 'auckland'; })[0] || LOCATIONS[0];
    var branches = LOCATIONS.filter(function (l) { return l !== hub; });
    if (list) list.innerHTML = LOCATIONS.map(function (l) {
      return '<li class="area locations__item" data-location-id="' + l.id + '"><span class="area__dot" aria-hidden="true"></span><h3 class="locations__name">' + esc(l.name) + '</h3><span>' + (l === hub ? 'Home base' : 'Service area') + '</span></li>';
    }).join('');
    if (!mapEl) return;
    if (!window.L) {   /* library blocked or offline: show the list instead of an empty box */
      mapEl.parentNode.style.display = 'none';
      if (list) { list.classList.remove('u-sr-only'); list.classList.add('locations__fallback'); }
      return;
    }
    var L = window.L, touch = L.Browser.mobile;
    var map = L.map(mapEl, { scrollWheelZoom: false, dragging: false, tap: !touch, attributionControl: false });
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', { maxZoom: 18, attribution: 'Tiles &copy; Esri, Maxar, Earthstar Geographics, and the GIS User Community' }).addTo(map);
    var hubIcon = L.divIcon({ className: 'locations__marker locations__marker--hub', html: '<span></span>', iconSize: [20, 20] });
    var pinIcon = L.divIcon({ className: 'locations__marker', html: '<span></span>', iconSize: [14, 14] });
    var hubM = L.marker([hub.lat, hub.lng], { icon: hubIcon, keyboard: true, alt: hub.name, title: hub.name }).bindTooltip(hub.name, { permanent: true, direction: 'top', offset: [0, -13], className: 'locations__map-label locations__map-label--hub' });
    var brM = branches.map(function (l) { return L.marker([l.lat, l.lng], { icon: pinIcon, keyboard: true, alt: l.name, title: l.name }).bindTooltip(l.name, { permanent: true, direction: 'top', offset: [0, -9], className: 'locations__map-label' }); });
    var all = [hubM].concat(brM);
    var bounds = L.latLngBounds(LOCATIONS.map(function (l) { return [l.lat, l.lng]; }));
    var lines = L.layerGroup().addTo(map);

    /* Label collision: hub first, then outermost areas (they rarely clash),
       so the dense centre is what tucks away. */
    var order = all.slice().sort(function (a, b) {
      if (a === hubM) return -1; if (b === hubM) return 1;
      return map.distance(b.getLatLng(), hubM.getLatLng()) - map.distance(a.getLatLng(), hubM.getLatLng());
    });
    var peek = null, dq = false;
    function tipEl(m) { var t = m.getTooltip(); return t && t.getElement(); }
    function declutter() {
      dq = false;
      var kept = [];
      order.forEach(function (m) {
        var el = tipEl(m); if (!el || !map.hasLayer(m)) return;
        el.classList.remove('is-tucked');
        var r = el.getBoundingClientRect(), pad = 3, hit = false;
        for (var k = 0; k < kept.length; k++) {
          var q = kept[k];
          if (r.left < q.right + pad && r.right > q.left - pad && r.top < q.bottom + pad && r.bottom > q.top - pad) { hit = true; break; }
        }
        if (hit && m !== peek) el.classList.add('is-tucked'); else kept.push(r);
      });
    }
    function queueDeclutter() { if (!dq) { dq = true; requestAnimationFrame(declutter); } }
    map.on('zoom move zoomend moveend resize', queueDeclutter);
    all.forEach(function (m) {
      function show() { peek = m; var el = tipEl(m); if (el) { el.classList.remove('is-tucked'); el.classList.add('is-peek'); } }
      function hide() { var el = tipEl(m); if (el) el.classList.remove('is-peek'); if (peek === m) peek = null; queueDeclutter(); }
      m.on('mouseover focus', show); m.on('mouseout blur', hide);
      m.on('click', function () { if (peek === m) hide(); else { if (peek) { var p = peek; peek = null; var pe = tipEl(p); if (pe) pe.classList.remove('is-peek'); } show(); queueDeclutter(); } });
    });

    function drawLines() {
      branches.forEach(function (l, i) {
        var line = L.polyline([[hub.lat, hub.lng], [l.lat, l.lng]], { color: '#fd9d23', weight: 1.5, opacity: 0.8, interactive: false }).addTo(lines);
        requestAnimationFrame(function () {
          var p = line.getElement(); if (!p || !p.getTotalLength) return;
          var len = p.getTotalLength(); p.style.strokeDasharray = len; p.style.strokeDashoffset = len; p.getBoundingClientRect();
          p.style.transition = 'stroke-dashoffset .7s ease-out'; setTimeout(function () { p.style.strokeDashoffset = 0; }, i * 90);
        });
      });
    }
    function revealPins() {
      brM.forEach(function (m, i) {
        setTimeout(function () {
          m.addTo(map); var el = m.getElement(), tip = tipEl(m);
          if (el) el.getBoundingClientRect();
          requestAnimationFrame(function () { el && el.classList.add('locations__marker--in'); tip && tip.classList.add('locations__map-label--in'); queueDeclutter(); });
        }, i * 90);
      });
    }
    /* Phones and tablets: one-finger drags scroll the PAGE until the visitor
       taps the hint. Pinch zoom always works. Mouse devices: drag on. */
    function settle() {
      if (!touch) { map.dragging.enable(); return; }
      if ($('.locations__map-hint', mapEl.parentNode)) return;
      var hint = document.createElement('button');
      hint.type = 'button'; hint.className = 'locations__map-hint'; hint.textContent = 'Tap to explore the map';
      mapEl.parentNode.appendChild(hint);
      hint.addEventListener('click', function () { map.dragging.enable(); hint.remove(); map.invalidateSize(); });
    }
    function intro() {
      mapEl.classList.add('is-introducing'); hubM.addTo(map);
      map.setView([10, 160], 2, { animate: false });
      setTimeout(function () {
        map.flyTo([hub.lat, hub.lng], 11, { duration: 2.4 });
        map.once('moveend', function () {
          var t = tipEl(hubM); t && t.classList.add('locations__map-label--in');
          setTimeout(function () {
            drawLines(); revealPins(); map.flyToBounds(bounds, { padding: [36, 36], duration: 1.6 });
            setTimeout(function () { mapEl.classList.remove('is-introducing'); settle(); queueDeclutter(); }, 1900);
          }, 500);
        });
      }, 300);
    }
    /* Grey box until the intro starts, exactly like v28 (no early world view). */
    if (reduceMotion || !('IntersectionObserver' in window)) { all.forEach(function (m) { m.addTo(map); }); map.fitBounds(bounds, { padding: [36, 36], animate: false }); settle(); queueDeclutter(); }
    else {
      var io = new IntersectionObserver(function (en) { if (en[0].isIntersecting) { io.disconnect(); intro(); } }, { threshold: 0.3 });
      io.observe(mapEl);
    }
    setTimeout(function () { map.invalidateSize(); }, 250);
    window.addEventListener('load', function () { map.invalidateSize(); });
  })();

  /* 8. Navigation -------------------------------------------------------------
     Floating pill header: transparent over the hero, solid elsewhere; it
     tucks away while scrolling down and returns on any deliberate scroll
     up. Compact also gets a bottom action bar (Call / Get a quote) that
     appears after the hero and steps aside at the contact form. */
  var nav = $('#nav'), menu = $('#menu'), actionbar = $('#actionbar'), lastNavToggle = null;
  function openNav(btn) {
    lastNavToggle = btn; menu.classList.add('is-open'); lockScroll('nav');
    $$('[data-nav-toggle]').forEach(function (b) { b.setAttribute('aria-expanded', 'true'); });
    setTimeout(function () { $('[data-nav-close]', menu).focus({ preventScroll: true }); }, 50);
  }
  function closeNav(restore) {
    if (!menu || !menu.classList.contains('is-open')) return;
    menu.classList.remove('is-open'); unlockScroll('nav');
    $$('[data-nav-toggle]').forEach(function (b) { b.setAttribute('aria-expanded', 'false'); });
    if (restore !== false && lastNavToggle) lastNavToggle.focus({ preventScroll: true });
  }
  $$('[data-nav-toggle]').forEach(function (b) { b.addEventListener('click', function () { menu.classList.contains('is-open') ? closeNav() : openNav(b); }); });
  $('[data-nav-close]') && $('[data-nav-close]').addEventListener('click', function () { closeNav(); });
  onModeChange(function (desk) { if (desk) closeNav(false); });

  var anchorScrolling = 0;
  function scrollToAnchor(id) {
    var target = $(id); if (!target) return;
    var top = target.getBoundingClientRect().top + scrollY;
    anchorScrolling = performance.now();
    window.scrollTo({ top: top, behavior: reduceMotion ? 'auto' : 'smooth' });
    if (history.replaceState) history.replaceState(null, '', id);
  }
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href^="#"]');
    if (!a || a.hasAttribute('data-detail')) return;
    var id = a.getAttribute('href');
    if (id.length < 2 || !$(id)) return;
    e.preventDefault();
    var wasOpen = menu && menu.classList.contains('is-open');
    closeNav(false);
    if (wasOpen) setTimeout(function () { scrollToAnchor(id); }, 80); else scrollToAnchor(id);
  });

  (function () {
    var hero = $('.hero'), contact = $('#contact'), lastY = scrollY, acc = 0, hidden = false, solid = null, barShown = false;
    function setHidden(v) { if (v !== hidden) { hidden = v; nav.classList.toggle('is-hidden', v); } }
    function setBar(v) {
      if (!actionbar || v === barShown) return; barShown = v;
      actionbar.classList.toggle('is-shown', v); actionbar.setAttribute('aria-hidden', String(!v));
      $$('a', actionbar).forEach(function (el) { el.tabIndex = v ? 0 : -1; });
    }
    scenes.push({
      update: function () {
        var y = scrollY, dy = y - lastY; lastY = y;
        var heroH = hero ? hero.offsetHeight : innerHeight;
        var s = y > heroH - 80;
        if (s !== solid) { solid = s; nav.classList.toggle('is-solid', s); }
        if (sheetState.open) { setHidden(true); setBar(false); return; }
        if (y < 120) { setHidden(false); acc = 0; }
        else {
          acc = (dy > 0) === (acc > 0) ? acc + dy : dy;
          if (acc > 14) setHidden(true); else if (acc < -28 && performance.now() - anchorScrolling > 900) setHidden(false);
        }
        var cr = contact ? contact.getBoundingClientRect() : null;
        var atContact = cr && cr.top < innerHeight * 0.75 && cr.bottom > innerHeight * 0.25;
        setBar(!isDesktop() && y > heroH * 0.6 && !atContact);
      }
    });
  })();

/* ## reviewed 2026-10-09: reveal + FAQ accordions */
  /* 9. Reveal + certification accordions ---------------------------------- */
  (function () {
    var targets = $$('.reveal, .reveal-stagger, .mask-heading');
    if (reduceMotion || !('IntersectionObserver' in window)) { targets.forEach(function (el) { el.classList.add('is-visible'); }); return; }
    var io = new IntersectionObserver(function (en) {
      en.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); } });
    }, { threshold: 0.18, rootMargin: '0px 0px -60px 0px' });
    targets.forEach(function (el) { io.observe(el); });
    /* Jumps (anchors, restored scroll) can skip the crossing entirely. */
    scenes.push({ update: function () {
      targets = targets.filter(function (el) {
        if (el.classList.contains('is-visible')) return false;
        if (el.getBoundingClientRect().top < innerHeight) { el.classList.add('is-visible'); return false; }
        return true;
      });
    } });
  })();

  $$('.faq details').forEach(function (det) {
    var sum = $('summary', det), body = $('.faq__body', det), anim = null;
    sum.addEventListener('click', function (e) {
      if (reduceMotion || !body.animate) return;
      e.preventDefault();
      if (anim) anim.cancel();
      if (!det.open) {
        det.open = true;
        var h = body.offsetHeight;
        anim = body.animate([{ height: '0px', opacity: 0 }, { height: h + 'px', opacity: 1 }], { duration: 380, easing: 'cubic-bezier(.22,1,.36,1)' });
      } else {
        anim = body.animate([{ height: body.offsetHeight + 'px', opacity: 1 }, { height: '0px', opacity: 0 }], { duration: 300, easing: 'cubic-bezier(.4,0,.2,1)' });
        anim.onfinish = function () { det.open = false; };
      }
      anim.addEventListener('finish', function () { anim = null; requestMeasure(); });
    });
  });

  /* ## reviewed 2026-10-10: contact form validation + submit (JS) */
/* 10. Enquiry form ----------------------------------------------------------
     One submit handler. Validates inline (on blur once touched, live once
     an error is showing), focuses the first problem, then posts to
     FORM_CONFIG.endpoint. With no endpoint it shows the real success
     state plus a visible "preview: nothing sent" note, never a fake send. */
  (function () {
    var form = $('#enquiryForm'); if (!form) return;
    var btn = $('#formSubmit'), status = $('#formStatus'), success = $('#formSuccess');
    var rules = {
      name: function (v) { return v.trim().length > 0; },
      company: function (v) { return v.trim().length > 0; },
      email: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()); },
      service: function (v) { return !!v; }
    };
    function check(input, show) {
      var rule = rules[input.name]; if (!rule) return true;
      var ok = rule(input.value), row = input.closest('.form-row'), err = row && $('.field-error', row);
      if (show || input.getAttribute('aria-invalid') === 'true') {
        input.setAttribute('aria-invalid', ok ? 'false' : 'true');
        err && err.classList.toggle('is-visible', !ok);
      }
      row && row.classList.toggle('is-valid', ok && input.dataset.touched === '1');
      return ok;
    }
    var sel = $('#f-service');
    function syncSelect() { sel.classList.toggle('is-empty', !sel.value); }
    syncSelect();
    $$('input, select, textarea', form).forEach(function (el) {
      el.addEventListener('blur', function () { if (el.value) el.dataset.touched = '1'; if (el.dataset.touched) check(el, true); });
      el.addEventListener('input', function () { check(el, false); });
      el.addEventListener('change', function () { el.dataset.touched = '1'; check(el, el.tagName === 'SELECT'); if (el === sel) syncSelect(); });
    });
    function submitEnquiry(data) {
      if (!FORM_CONFIG.endpoint) return new Promise(function (res) { setTimeout(function () { res({ preview: true }); }, 600); });
      return fetch(FORM_CONFIG.endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: JSON.stringify(data) })
        .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return { preview: false }; });
    }
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (btn.disabled) return;
      var bad = null;
      ['name', 'company', 'email', 'service'].forEach(function (n) { var el = form.elements[n]; el.dataset.touched = '1'; if (!check(el, true) && !bad) bad = el; });
      if (bad) {
        status.textContent = 'Please check the highlighted fields.'; status.className = 'form-status is-visible form-status--error';
        bad.focus({ preventScroll: true });
        var r = bad.getBoundingClientRect();
        if (r.top < 90 || r.bottom > innerHeight - 40) window.scrollTo({ top: r.top + scrollY - 120, behavior: reduceMotion ? 'auto' : 'smooth' });
        return;
      }
      status.className = 'form-status';
      var data = {}; new FormData(form).forEach(function (v, k) { data[k] = v; });
      data._subject = 'Website enquiry, ' + data.service;
      data._recipients = FORM_CONFIG.recipients.join(', ');
      btn.disabled = true; btn.textContent = 'Sending…';
      submitEnquiry(data).then(function (res) {
        $('#formSuccessTitle').textContent = 'Thanks ' + data.name.trim().split(/\s+/)[0] + ', your enquiry is in.';
        $('#formSuccessService').textContent = data.service.toLowerCase();
        $('#formPreviewNote').hidden = !res.preview;
        form.hidden = true; success.hidden = false; success.focus({ preventScroll: true });
        var r = success.getBoundingClientRect();
        if (r.top < 90 || r.top > innerHeight * 0.6) window.scrollTo({ top: r.top + scrollY - 110, behavior: reduceMotion ? 'auto' : 'smooth' });
      }).catch(function () {
        status.innerHTML = 'Sorry, that didn’t send. Please try again, or call <a href="tel:+64225341090"><strong>+64 22 534 1090</strong></a>.';
        status.className = 'form-status is-visible form-status--error';
      }).then(function () { btn.disabled = false; btn.textContent = 'Send enquiry'; });
    });
    $('#formReset').addEventListener('click', function () {
      form.reset(); syncSelect();
      $$('[aria-invalid]', form).forEach(function (el) { el.removeAttribute('aria-invalid'); delete el.dataset.touched; });
      $$('.form-row', form).forEach(function (r) { r.classList.remove('is-valid'); });
      success.hidden = true; form.hidden = false; $('#f-name').focus();
    });
  })();

/* ## reviewed 2026-10-09: boot + editor API */
  /* Boot ----------------------------------------------------------------------- */
  buildCompactServices();
  if (isDesktop()) buildDesktopServices();
  onModeChange(function (desk) { if (desk) buildDesktopServices(); });
  var yearEl = $('#year'); if (yearEl) yearEl.textContent = new Date().getFullYear();
  requestMeasure();

  /* Shared with the editor layer (editable build only). */
  window.__SUPREME__ = {
    SERVICES: SERVICES, LOCATIONS: LOCATIONS, TESTIMONIALS: TESTIMONIALS,
    refreshService: function (id) {
      var s = findService(id); if (!s) return;
      $$('[data-service-id="' + id + '"]').forEach(function (el) {
        $$('[data-svc-field]', el).forEach(function (f) { var k = f.getAttribute('data-svc-field'); if (f.textContent !== s[k]) f.textContent = s[k]; });
        $$('img', el).forEach(function (im) { if (im.closest('.svc__media') || im.classList.contains('svc-card__img')) im.src = s.image; });
      });
      if (svcGlide) svcGlide.opts.onChange(svcGlide.index);
    },
    renderTestimonials: renderTestimonials,
    requestMeasure: requestMeasure
  };
})();
