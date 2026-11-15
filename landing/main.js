// 1. Регулятор температури в першому екрані головної сторінки.
// Без цього файла сторінка працює так само: регулятор просто стоїть на 38°.
(function () {
  var hero = document.querySelector('.hero');
  var dial = document.querySelector('.dial');
  if (!hero || !dial) return;

  var input = dial.querySelector('.dial__input');
  var num = dial.querySelector('.dial__num');
  var MIN = Number(input.min);
  var MAX = Number(input.max);
  var t = (Number(input.value) - MIN) / (MAX - MIN);
  var userTookOver = false;

  function show(value) {
    var degrees = Math.round(MIN + value * (MAX - MIN));
    num.textContent = degrees;
    input.value = degrees;
    input.setAttribute('aria-valuetext', degrees + ' °C');
  }

  function set(value) {
    t = Math.min(1, Math.max(0, value));
    hero.style.setProperty('--t', t.toFixed(3));
    show(t);
  }

  function takeOver() {
    if (userTookOver) return;
    userTookOver = true;
    hero.style.animation = 'none'; // стартова анімація більше не керує --t
  }

  // Поки триває стартова CSS-анімація, цифра йде слідом за нею.
  function followIntro() {
    if (userTookOver) return;
    var running = hero.getAnimations().some(function (a) {
      return a.animationName === 'warm-up' && a.playState !== 'finished';
    });
    var current = parseFloat(getComputedStyle(hero).getPropertyValue('--t'));
    if (!isNaN(current)) show(current);
    if (running) requestAnimationFrame(followIntro);
  }
  requestAnimationFrame(followIntro);

  // Кут від центру: 0° вгорі, шкала від −135° (холодна) до +135° (гаряча).
  function fromPointer(event, dragging) {
    var box = dial.getBoundingClientRect();
    var x = event.clientX - (box.left + box.width / 2);
    var y = event.clientY - (box.top + box.height / 2);
    var angle = (Math.atan2(x, -y) * 180) / Math.PI;
    var next = (Math.min(135, Math.max(-135, angle)) + 135) / 270;
    // не перестрибувати з гарячої на холодну через «мертву зону» внизу
    if (dragging && Math.abs(next - t) > 0.6) return;
    set(next);
  }

  var dragging = false;

  dial.addEventListener('pointerdown', function (event) {
    takeOver();
    dragging = true;
    dial.setPointerCapture(event.pointerId);
    fromPointer(event, false);
  });

  dial.addEventListener('pointermove', function (event) {
    if (dragging) fromPointer(event, true);
  });

  ['pointerup', 'pointercancel'].forEach(function (type) {
    dial.addEventListener(type, function () {
      dragging = false;
    });
  });

  input.addEventListener('input', function () {
    takeOver();
    set((Number(input.value) - MIN) / (MAX - MIN));
  });
})();

// Меню для телефона: закривати після вибору пункту, кліку повз або клавіші Esc.
(function () {
  var menu = document.querySelector('.menu');
  if (!menu) return;

  menu.addEventListener('click', function (event) {
    if (event.target.closest('nav a')) menu.removeAttribute('open');
  });

  document.addEventListener('click', function (event) {
    if (menu.open && !menu.contains(event.target)) menu.removeAttribute('open');
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && menu.open) {
      menu.removeAttribute('open');
      menu.querySelector('summary').focus();
    }
  });
})();

// Карусель на сторінці «Про нас»: одне фото за раз. Кнопки гортають на одне фото,
// лічильник показує номер. Без скрипта стрічку можна гортати пальцем чи колесом.
(function () {
  var strip = document.querySelector('.car');
  if (!strip) return;

  var buttons = document.querySelectorAll('.car-btn');
  var now = document.querySelector('.gal__now');
  var total = strip.children.length;

  function index() {
    return Math.min(total - 1, Math.max(0, Math.round(strip.scrollLeft / strip.clientWidth)));
  }

  function go(i) {
    var target = Math.min(total - 1, Math.max(0, i));
    strip.scrollTo({ left: target * strip.clientWidth, behavior: 'smooth' });
  }

  function update() {
    var i = index();
    if (now) now.textContent = i + 1;
    buttons.forEach(function (button) {
      button.disabled = Number(button.dataset.dir) < 0 ? i === 0 : i === total - 1;
    });
  }

  buttons.forEach(function (button) {
    button.addEventListener('click', function () {
      go(index() + Number(button.dataset.dir));
    });
  });

  strip.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
})();
