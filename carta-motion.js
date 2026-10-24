(() => {
  'use strict';
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const animations = new Set();
  // Progressive enhancement: all content stays visible without animation support.
  if ('IntersectionObserver' in window && typeof Element.prototype.animate === 'function') {
    const reveal = new IntersectionObserver((entries) => {
      entries.forEach(({ target, isIntersecting }) => {
        if (!isIntersecting) return;
        reveal.unobserve(target);
        if (reduced.matches) return;
        const animation = target.animate([
          { opacity: .35, transform: 'translateY(22px)' },
          { opacity: 1, transform: 'translateY(0)' }
        ], { duration: 580, easing: 'cubic-bezier(.2,.7,.2,1)' });
        animations.add(animation);
        animation.onfinish = animation.oncancel = () => animations.delete(animation);
      });
    }, { threshold: .08 });
    document.querySelectorAll('[data-reveal]').forEach((element) => reveal.observe(element));
  }
  const stopMotion = () => {
    if (reduced.matches) animations.forEach((animation) => animation.cancel());
  };
  if (reduced.addEventListener) reduced.addEventListener('change', stopMotion);
  else if (reduced.addListener) reduced.addListener(stopMotion);
  const nav = document.querySelector('.category-nav');
  const sections = [...document.querySelectorAll('.category')];
  if (!nav || !sections.length) return;
  const links = [...nav.querySelectorAll('a')];
  let current = '';
  let scheduled = false;
  const update = () => {
    scheduled = false;
    const navHeight = Math.ceil(nav.getBoundingClientRect().height);
    document.documentElement.style.setProperty('--nav-offset', (navHeight + 28) + 'px');
    let selected = sections[0].id;
    sections.forEach((section) => {
      if (section.getBoundingClientRect().top <= navHeight + 45) selected = section.id;
    });
    if (selected === current) return;
    current = selected;
    links.forEach((link) => {
      const active = link.hash === '#' + selected;
      link.classList.toggle('is-active', active);
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  };
  const schedule = () => {
    if (scheduled) return;
    scheduled = true;
    window.requestAnimationFrame(update);
  };
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
  window.addEventListener('hashchange', schedule);
  if ('ResizeObserver' in window) new ResizeObserver(schedule).observe(nav);
  update();
})();