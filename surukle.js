/* ===== Ortak sürükle & bırak yardımcısı =====
   Parmakla tut → hayalet takip eder → hedefe bırak.
   Sürükleyemeyen küçük parmaklar için: sadece dokunmak da
   "seç" sayılır (tekDokunus geri çağrısı).                 */
window.Surukle = (function () {
  let aktif = null, hayalet = null;

  function hayaletYap(html, boyut) {
    hayaletSil();
    hayalet = document.createElement('div');
    hayalet.className = 'sr-hayalet';
    if (boyut) hayalet.style.cssText = `width:${boyut};height:${boyut}`;
    hayalet.innerHTML = html;
    document.body.appendChild(hayalet);
  }
  function hayaletTasi(x, y) {
    if (hayalet) { hayalet.style.left = x + 'px'; hayalet.style.top = y + 'px'; }
  }
  function hayaletSil() { if (hayalet) { hayalet.remove(); hayalet = null; } }

  /* opt: { veri, hayaletHtml, boyut, tutuldu(veri), tekDokunus(veri),
           birakildi(veri, hedefEl, x, y), hedefSec(x,y) }            */
  function bagla(el, opt) {
    el.style.touchAction = 'none';
    el.addEventListener('pointerdown', ev => {
      ev.preventDefault();
      try { el.setPointerCapture(ev.pointerId); } catch (e) {}
      aktif = { el, opt, x: ev.clientX, y: ev.clientY, tasidi: false };
      el.classList.add('sr-tutuluyor');
      opt.tutuldu && opt.tutuldu(opt.veri);
    });
    el.addEventListener('pointermove', ev => {
      if (!aktif || aktif.el !== el) return;
      const d = Math.hypot(ev.clientX - aktif.x, ev.clientY - aktif.y);
      if (!aktif.tasidi && d < 10) return;
      if (!aktif.tasidi) {
        aktif.tasidi = true;
        hayaletYap(opt.hayaletHtml || el.innerHTML, opt.boyut);
      }
      hayaletTasi(ev.clientX, ev.clientY);
      if (opt.hedefSec) opt.hedefSec(ev.clientX, ev.clientY);
    });
    ['pointerup', 'pointercancel'].forEach(t => el.addEventListener(t, ev => {
      if (!aktif || aktif.el !== el) return;
      el.classList.remove('sr-tutuluyor');
      const tasidi = aktif.tasidi;
      hayaletSil(); aktif = null;
      if (tasidi) opt.birakildi && opt.birakildi(opt.veri, ev.clientX, ev.clientY);
      else opt.tekDokunus && opt.tekDokunus(opt.veri);
    }));
  }

  /* verilen noktanın altındaki hedef kutuyu bul */
  function hedefBul(kap, secici, x, y) {
    return [...kap.querySelectorAll(secici)].find(h => {
      const r = h.getBoundingClientRect();
      return x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;
    }) || null;
  }

  return { bagla, hedefBul, hayaletSil };
})();
