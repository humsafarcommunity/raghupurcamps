/**
 * RAGHUPUR FORT CAMPS
 * Navigation, booking dialog (WhatsApp), and a lightweight starfield.
 * No dependencies.
 */

(function () {
  'use strict';

  var WHATSAPP_NUMBER = '917018236861';

  var PACKAGES = {
    'serolsar-day': 'Serolsar Lake guided day trek',
    'serolsar-combo': 'Serolsar + Raghupur Fort camp (2D / 1N)',
    'camp-standard': 'Camping: standard alpine dome tent',
    'camp-luxury': 'Camping: luxury meadow tent',
    'camp-astro': 'Camping: astrophile private setup',
    'fort-trek': 'Raghupur Fort trek with guide',
    'circuit': 'Full Seraj Valley circuit (3D / 2N)',
    'jibhi': 'Jibhi & Tirthan Valley trip',
    'custom': 'Custom group / general enquiry'
  };

  /* Old single-page links such as index.html#camping keep working. */
  var LEGACY_HASHES = {
    'serolsar': 'serolsar-lake-trek.html',
    'camping': 'raghupur-fort-camping.html',
    'fort-trek': 'raghupur-fort-trek.html',
    'jibhi-tirthan': 'jibhi-tirthan-valley.html',
    'plan-trip': 'plan-your-trip.html'
  };

  function redirectLegacyHash() {
    if (document.body.getAttribute('data-page') !== 'home') return;
    var key = window.location.hash.replace('#', '');
    if (key && Object.prototype.hasOwnProperty.call(LEGACY_HASHES, key)) {
      window.location.replace(LEGACY_HASHES[key]);
    }
  }

  /* ---------- Header + mobile drawer ---------- */
  function initHeader() {
    var header = document.getElementById('header');
    var toggle = document.getElementById('mobile-toggle');
    var closeBtn = document.getElementById('close-drawer');
    var drawer = document.getElementById('mobile-drawer');
    var overlay = document.getElementById('drawer-overlay');

    function onScroll() {
      if (header) header.classList.toggle('scrolled', window.scrollY > 40);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    if (!toggle || !drawer) return;

    function setDrawer(open) {
      drawer.classList.toggle('open', open);
      if (overlay) overlay.classList.toggle('open', open);
      document.body.classList.toggle('no-scroll', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      if (open && closeBtn) closeBtn.focus();
      if (!open && document.activeElement && drawer.contains(document.activeElement)) toggle.focus();
    }

    toggle.addEventListener('click', function () { setDrawer(!drawer.classList.contains('open')); });
    if (closeBtn) closeBtn.addEventListener('click', function () { setDrawer(false); });
    if (overlay) overlay.addEventListener('click', function () { setDrawer(false); });
    drawer.addEventListener('click', function (e) {
      if (e.target.closest('a')) setDrawer(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && drawer.classList.contains('open')) setDrawer(false);
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > 960 && drawer.classList.contains('open')) setDrawer(false);
    });
  }

  /* ---------- Booking dialog ---------- */
  function pad(n) { return String(n).padStart(2, '0'); }

  var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  /* '2026-12-14' -> '14 Dec 2026' (falls back to the raw value) */
  function prettyDate(iso) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
    if (!m) return iso;
    return parseInt(m[3], 10) + ' ' + MONTHS[parseInt(m[2], 10) - 1] + ' ' + m[1];
  }

  function tomorrowISO() {
    var d = new Date();
    d.setDate(d.getDate() + 1);
    return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
  }

  function initBooking() {
    var dialog = document.getElementById('booking-dialog');
    var form = document.getElementById('booking-form');
    if (!dialog || !form) return;

    var select = document.getElementById('form-package');
    var dateInput = document.getElementById('form-date');
    if (dateInput) dateInput.min = tomorrowISO();

    function openDialog(key) {
      if (select) select.value = Object.prototype.hasOwnProperty.call(PACKAGES, key) ? key : 'custom';
      if (typeof dialog.showModal === 'function') {
        dialog.showModal();
      } else {
        dialog.setAttribute('open', '');
      }
      document.body.classList.add('no-scroll');
    }

    function closeDialog() {
      if (typeof dialog.close === 'function') dialog.close(); else dialog.removeAttribute('open');
      document.body.classList.remove('no-scroll');
    }

    document.addEventListener('click', function (e) {
      var opener = e.target.closest('[data-book]');
      if (opener) {
        e.preventDefault();
        openDialog(opener.getAttribute('data-book'));
        return;
      }
      if (e.target.closest('[data-close-dialog]')) {
        closeDialog();
        return;
      }
      if (e.target === dialog) closeDialog(); // click on backdrop
    });

    dialog.addEventListener('close', function () { document.body.classList.remove('no-scroll'); });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      var f = new FormData(form);
      var lines = [
        'Hello Raghupur Fort Camps,',
        'I would like to book / enquire about:',
        '*Experience:* ' + (PACKAGES[f.get('package')] || f.get('package')),
        '*Name:* ' + String(f.get('name')).trim(),
        '*Phone:* ' + String(f.get('phone')).trim(),
        '*Travel date:* ' + prettyDate(String(f.get('date'))),
        '*Guests:* ' + f.get('guests')
      ];
      var notes = String(f.get('notes') || '').trim();
      if (notes) lines.push('*Notes:* ' + notes);
      lines.push('', 'Please confirm availability and share the details. Thank you!');
      lines.push('(Sent from: ' + document.title + ')');

      var url = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(lines.join('\n'));
      closeDialog();
      // Note: the 'noopener' feature makes window.open return null, which would be
      // mistaken for a blocked popup. Open normally, then drop the opener reference.
      var w = window.open(url, '_blank');
      if (w) {
        w.opener = null;
      } else {
        window.location.href = url; // popup really was blocked
      }
    });
  }

  /* ---------- Starfield (one canvas per page) ---------- */
  function initStarfield() {
    var canvas = document.getElementById('starfield');
    if (!canvas || !canvas.getContext) return;

    var ctx = canvas.getContext('2d');
    var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var width = 0, height = 0, dpr = 1;
    var stars = [];
    var shooting = [];
    var running = false;
    var visible = true;
    var rafId = 0;

    function resize() {
      var parent = canvas.parentElement;
      var w = parent.offsetWidth;
      var h = parent.offsetHeight;
      if (!w || !h) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = w; height = h;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var count = Math.min(420, Math.floor((w * h) / 3600));
      stars = [];
      for (var i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: Math.random() * 1.2 + 0.3,
          a: Math.random() * 0.6 + 0.3,
          s: Math.random() * 1.2 + 0.3,
          p: Math.random() * Math.PI * 2,
          warm: Math.random() > 0.85
        });
      }
      draw(performance.now());
    }

    function draw(now) {
      ctx.clearRect(0, 0, width, height);
      var t = now * 0.001;
      for (var i = 0; i < stars.length; i++) {
        var s = stars[i];
        var alpha = reduceMotion ? s.a : s.a + Math.sin(t * s.s + s.p) * 0.25;
        alpha = Math.max(0.1, Math.min(1, alpha));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, 6.2832);
        ctx.fillStyle = s.warm ? 'rgba(247,185,128,' + alpha + ')' : 'rgba(235,245,255,' + alpha + ')';
        ctx.fill();
      }
      if (reduceMotion) return;

      if (Math.random() < 0.006 && shooting.length < 1) {
        shooting.push({
          x: Math.random() * width * 0.7,
          y: Math.random() * height * 0.35,
          len: Math.random() * 80 + 40,
          v: Math.random() * 7 + 6,
          ang: Math.PI / 4 + (Math.random() * 0.2 - 0.1),
          o: 1
        });
      }
      for (var j = shooting.length - 1; j >= 0; j--) {
        var m = shooting[j];
        var tx = m.x - Math.cos(m.ang) * m.len;
        var ty = m.y - Math.sin(m.ang) * m.len;
        var g = ctx.createLinearGradient(tx, ty, m.x, m.y);
        g.addColorStop(0, 'rgba(255,255,255,0)');
        g.addColorStop(1, 'rgba(255,255,255,' + m.o + ')');
        ctx.strokeStyle = g;
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(tx, ty);
        ctx.lineTo(m.x, m.y);
        ctx.stroke();
        m.x += Math.cos(m.ang) * m.v;
        m.y += Math.sin(m.ang) * m.v;
        m.o -= 0.02;
        if (m.o <= 0 || m.x > width || m.y > height) shooting.splice(j, 1);
      }
    }

    function loop(now) {
      if (!running) return;
      draw(now);
      rafId = requestAnimationFrame(loop);
    }

    function start() {
      if (reduceMotion || running || !visible || document.hidden) return;
      running = true;
      rafId = requestAnimationFrame(loop);
    }

    function stop() {
      running = false;
      cancelAnimationFrame(rafId);
    }

    var resizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 150);
    });

    document.addEventListener('visibilitychange', function () {
      if (document.hidden) stop(); else start();
    });

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        visible = entries[0].isIntersecting;
        if (visible) start(); else stop();
      }).observe(canvas.parentElement);
    }

    resize();
    start();
  }

  redirectLegacyHash();
  initHeader();
  initBooking();
  initStarfield();
})();
