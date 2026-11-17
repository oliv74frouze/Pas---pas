/* Exercice : dessin libre, avec palette, gomme et corbeille. */
(function () {
  'use strict';

  function dessinLibre(zone, kit) {
    const el = kit.el, cv = el('canvas', { style: 'background:#fff;border-radius:24px;box-shadow:0 6px 0 var(--ombre)' });
    const scene = el('div', { class: 'scene' }, cv), barre = el('div', { class: 'barre' });
    const GOMME = 'gomme', couleurs = [...Object.values(kit.couleurs).map(c => c.hex), kit.encre, GOMME];
    let cur = couleurs[4], ctx, W, H, pid = null, dernier;
    const pastilles = couleurs.map(c => {
      const b = el('button', { class: 'pastille', style: `background:${c === GOMME ? '#fff' : c}`, onclick: () => { cur = c; pastilles.forEach(s => s.classList.toggle('sel', s === b)); kit.sons.clic(); } }, c === GOMME ? '🧽' : '');
      return b;
    });
    pastilles[4].classList.add('sel');
    barre.append(...pastilles, el('button', { class: 'bouton-rond', onclick: () => { ctx.clearRect(0, 0, W, H); kit.sons.rate(); } }, '🗑️'));
    zone.append(el('div', { class: 'ecran lateral' }, scene, barre));

    function preparer() {
      let copie = null;
      if (cv.width) { copie = document.createElement('canvas'); copie.width = cv.width; copie.height = cv.height; copie.getContext('2d').drawImage(cv, 0, 0); }
      W = Math.max(200, scene.clientWidth - 16); H = Math.max(200, scene.clientHeight - 16);
      ({ ctx } = kit.preparerToile(cv, W, H));
      if (copie) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.drawImage(copie, 0, 0); ctx.restore(); }
      ctx.lineCap = ctx.lineJoin = 'round';
    }
    const pos = e => { const r = cv.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; };
    const trait = (a, b) => {
      const gomme = cur === GOMME;
      ctx.globalCompositeOperation = gomme ? 'destination-out' : 'source-over';
      ctx.strokeStyle = gomme ? '#000' : cur; ctx.lineWidth = gomme ? 44 : 22;
      ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x + .01, b.y); ctx.stroke();
    };
    cv.addEventListener('pointerdown', e => { if (pid !== null) return; pid = e.pointerId; try { cv.setPointerCapture(pid); } catch (_) {} dernier = pos(e); trait(dernier, dernier); });
    cv.addEventListener('pointermove', e => { if (e.pointerId !== pid) return; const p = pos(e); trait(dernier, p); dernier = p; });
    const lacher = e => { if (e.pointerId === pid) pid = null; };
    cv.addEventListener('pointerup', lacher); cv.addEventListener('pointercancel', lacher);
    kit.surRedimension(preparer);
    requestAnimationFrame(preparer);
  }

  PetitsPas.ajouter({
    id: 'dessin-libre', nom: 'Dessin libre', icone: '🌈', theme: 'dessin', niveaux: ['PS', 'MS', 'GS', 'CP'],
    auteur: 'Petits Pas', description: 'Dessiner librement avec les doigts.',
    lancer: dessinLibre
  });
})();
