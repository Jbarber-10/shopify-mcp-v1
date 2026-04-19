// A2B preview animations - GSAP + ScrollTrigger
(function(){
  const ready = (fn) => document.readyState !== 'loading' ? fn() : document.addEventListener('DOMContentLoaded', fn);

  ready(() => {
    if (typeof gsap === 'undefined') return;
    if (window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

    // Split hero headline into chars for stagger
    document.querySelectorAll('.split-text').forEach(el => {
      const text = el.textContent;
      el.innerHTML = '';
      [...text].forEach(ch => {
        const span = document.createElement('span');
        span.className = 'char';
        span.textContent = ch === ' ' ? '\u00A0' : ch;
        el.appendChild(span);
      });
    });

    // Hero entrance
    const heroTl = gsap.timeline({ defaults: { ease: 'expo.out' } });
    heroTl.to('.hero .split-text .char', { y: 0, opacity: 1, duration: 1.1, stagger: 0.025 })
          .from('.hero-eyebrow', { y: 20, opacity: 0, duration: .8 }, 0.2)
          .from('.hero-lead', { y: 20, opacity: 0, duration: .9 }, '-=.7')
          .from('.hero-ctas > *', { y: 20, opacity: 0, duration: .7, stagger: .1 }, '-=.6')
          .from('.hero-visual', { scale: 1.1, opacity: 0, duration: 1.4, ease: 'power3.out' }, 0)
          .from('.hero-badge', { y: 20, opacity: 0, duration: .7 }, '-=.3')
          .from('.hero-stat', { y: 24, opacity: 0, duration: .8, stagger: .15 }, '-=.5');

    // Stat counters
    document.querySelectorAll('.hero-stat .num[data-count]').forEach(el => {
      const target = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      const obj = { v: 0 };
      ScrollTrigger.create({
        trigger: el, start: 'top 85%', once: true,
        onEnter: () => gsap.to(obj, {
          v: target, duration: 2, ease: 'power2.out',
          onUpdate: () => {
            el.childNodes[0].nodeValue = Math.round(obj.v).toLocaleString('es-ES') + suffix;
          }
        })
      });
    });

    // Reveal on scroll
    gsap.utils.toArray('.reveal').forEach(el => {
      gsap.to(el, {
        y: 0, opacity: 1, duration: 1.1, ease: 'expo.out',
        scrollTrigger: { trigger: el, start: 'top 85%', once: true }
      });
    });
    gsap.utils.toArray('.reveal-x').forEach(el => {
      gsap.to(el, {
        x: 0, opacity: 1, duration: 1, ease: 'expo.out',
        scrollTrigger: { trigger: el, start: 'top 85%', once: true }
      });
    });

    // Stagger grids
    gsap.utils.toArray('.reveal-stagger').forEach(wrap => {
      const items = wrap.children;
      gsap.from(items, {
        y: 40, opacity: 0, duration: 1, ease: 'expo.out', stagger: .08,
        scrollTrigger: { trigger: wrap, start: 'top 80%', once: true }
      });
    });

    // Parallax on images with data-parallax
    gsap.utils.toArray('[data-parallax]').forEach(el => {
      const depth = parseFloat(el.dataset.parallax) || .2;
      gsap.to(el, {
        yPercent: -depth * 30,
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true }
      });
    });

    // Section heading split reveal
    gsap.utils.toArray('.section-head h2').forEach(h => {
      gsap.from(h, {
        y: 60, opacity: 0, duration: 1.1, ease: 'expo.out',
        scrollTrigger: { trigger: h, start: 'top 85%', once: true }
      });
    });

    // Header shadow on scroll
    ScrollTrigger.create({
      start: 'top -1', end: 99999,
      onUpdate: self => {
        document.querySelector('.header')?.classList.toggle('scrolled', self.scroll() > 10);
      }
    });
  });

  // ===== Gallery thumbs (PDP) =====
  ready(() => {
    document.querySelectorAll('.thumb').forEach(t => {
      t.addEventListener('click', () => {
        const src = t.querySelector('img')?.src;
        const main = document.querySelector('.main-img img');
        if (!src || !main) return;
        document.querySelectorAll('.thumb').forEach(x => x.classList.remove('active'));
        t.classList.add('active');
        if (typeof gsap !== 'undefined') {
          gsap.fromTo(main, { opacity: 0, scale: 1.05 }, { opacity: 1, scale: 1, duration: .6, ease: 'power2.out' });
        }
        main.src = src;
      });
    });
  });

  // ===== Tabs (PDP) =====
  ready(() => {
    document.querySelectorAll('.tab').forEach(tab => {
      tab.addEventListener('click', () => {
        const id = tab.dataset.tab;
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
        tab.classList.add('active');
        document.querySelector(`.tab-panel[data-panel="${id}"]`)?.classList.add('active');
      });
    });
  });

  // ===== Variant chips + qty =====
  ready(() => {
    document.querySelectorAll('.variant-chips').forEach(group => {
      group.querySelectorAll('.chip').forEach(chip => {
        chip.addEventListener('click', () => {
          group.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
          chip.classList.add('active');
        });
      });
    });
    const qtyInput = document.querySelector('.qty input');
    document.querySelector('.qty .minus')?.addEventListener('click', () => {
      qtyInput.value = Math.max(1, parseInt(qtyInput.value) - 1);
    });
    document.querySelector('.qty .plus')?.addEventListener('click', () => {
      qtyInput.value = parseInt(qtyInput.value) + 1;
    });
  });

  // ===== Filter count (catalogue) =====
  ready(() => {
    const checkboxes = document.querySelectorAll('.filters input[type=checkbox]');
    const products = document.querySelectorAll('.products .product');
    const info = document.querySelector('.toolbar-info strong');
    const update = () => {
      const active = [...checkboxes].filter(c => c.checked).map(c => c.value);
      let visible = 0;
      products.forEach(p => {
        const tags = (p.dataset.tags || '').split(' ');
        const show = active.length === 0 || active.some(a => tags.includes(a));
        p.style.display = show ? '' : 'none';
        if (show) visible++;
      });
      if (info) info.textContent = visible;
    };
    checkboxes.forEach(c => c.addEventListener('change', update));
  });
})();
