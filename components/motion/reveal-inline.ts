/**
 * Inline bootstrap, serialised into the document before any content. It marks
 * `html.js`, immediately shows reveal targets that start inside the viewport,
 * and observes the rest, all before React hydrates so above-the-fold content
 * never waits for JavaScript bundles. `RevealObserver` re-runs it on navigation.
 */
export const REVEAL_INLINE_SCRIPT = `
(function(){
  var d=document, h=d.documentElement; h.classList.add('js');
  function scan(){
    var reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    var els = d.querySelectorAll('[data-reveal="out"]');
    if (reduced || !('IntersectionObserver' in window)) { els.forEach(function(e){ e.setAttribute('data-reveal','in'); }); return; }
    var vh = innerHeight;
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(en){ if (en.isIntersecting) { en.target.setAttribute('data-reveal','in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.05 });
    els.forEach(function(e){
      var r = e.getBoundingClientRect();
      if (r.top < vh && r.bottom > 0) { e.setAttribute('data-reveal-instant',''); e.setAttribute('data-reveal','in'); } else { io.observe(e); }
    });
  }
  window.__revealScan = scan;
  if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', scan); else scan();
})();
`.trim();
