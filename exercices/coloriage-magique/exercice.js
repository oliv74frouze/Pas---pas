/* Exercice : coloriage magique (une couleur par numéro).
   Le dépassement est toléré : une zone se remplit proprement dès
   qu'elle est assez coloriée avec la bonne couleur.
   Les dessins sont dans dessins.js (même dossier). */
(function () {
  'use strict';

  function menu(zone, kit) {
    const faits = kit.progres.lire('faits', {});
    const g = kit.el('div', { class: 'grille' });
    for (const d of PetitsPas.dessins || [])
      g.append(kit.el('button', { class: 'carte', style: 'background:#D6E8FF', onclick: () => kit.ouvrir(d.nom, z => colorier(z, kit, d)) },
        kit.el('span', { class: 'em' }, d.icone), d.nom, faits[d.nom] ? kit.el('small', {}, '⭐ réussi') : null));
    zone.append(g);
  }

  function colorier(zone, kit, D) {
    const el = kit.el, C = kit.couleurs, cv = el('canvas'), scene = el('div', { class: 'scene' }, cv), barre = el('div', { class: 'barre' });
    // Toujours les 8 couleurs, pour que les numéros se suivent (1, 2, 3… 8)
    const toutes = Object.keys(C).map(Number);
    let cur = toutes[0];
    const pastilles = toutes.map(n => {
      const b = el('button', { class: 'pastille', style: `background:${C[n].hex}`, onclick: () => { cur = n; pastilles.forEach(s => s.classList.toggle('sel', s === b)); kit.sons.clic(); kit.dire(n + ', ' + C[n].nom); } }, String(n));
      return b;
    });
    pastilles[0].classList.add('sel');
    barre.append(...pastilles, el('button', { class: 'bouton-rond', onclick: () => recommencer() }, '↺'));
    zone.append(el('div', { class: 'ecran lateral' }, scene, barre));

    // Grille d'échantillons (pas de 5) pour mesurer le remplissage de chaque zone
    const chemins = D.zones.map(r => new Path2D(r.d)), details = (D.details || []).map(d => ({ ...d, p: new Path2D(d.d) }));
    const G = 5, N = 80, pc = document.createElement('canvas').getContext('2d'), zoneDe = new Int16Array(N * N).fill(-1);
    const Z = D.zones.map(r => ({ c: r.c, total: 0, ok: 0, fini: false, sx: 0, sy: 0 }));
    for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) {
      const x = i * G + G / 2, y = j * G + G / 2;
      for (let k = chemins.length - 1; k >= 0; k--) if (pc.isPointInPath(chemins[k], x, y)) { zoneDe[j * N + i] = k; Z[k].total++; Z[k].sx += x; Z[k].sy += y; break; }
    }
    // Place chaque numéro au point le plus « à l'intérieur » de sa zone
    const dist = new Float32Array(N * N);
    for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) {
      const id = j * N + i, r = zoneDe[id]; if (r < 0) { dist[id] = 0; continue; }
      const bord = i == 0 || j == 0 || i == N - 1 || j == N - 1 || zoneDe[id - 1] !== r || zoneDe[id + 1] !== r || zoneDe[id - N] !== r || zoneDe[id + N] !== r;
      dist[id] = bord ? 1 : 1e9;
    }
    for (let j = 1; j < N; j++) for (let i = 1; i < N - 1; i++) { const id = j * N + i; dist[id] = Math.min(dist[id], dist[id - 1] + 1, dist[id - N] + 1, dist[id - N - 1] + 1.4, dist[id - N + 1] + 1.4); }
    for (let j = N - 2; j >= 0; j--) for (let i = N - 2; i > 0; i--) { const id = j * N + i; dist[id] = Math.min(dist[id], dist[id + 1] + 1, dist[id + N] + 1, dist[id + N + 1] + 1.4, dist[id + N - 1] + 1.4); }
    Z.forEach((R, k) => {
      if (!R.total) { R.fini = true; return; }
      const cx = R.sx / R.total, cy = R.sy / R.total; let best = -1, bd = 0, bc = 1e9;
      for (let id = 0; id < N * N; id++) if (zoneDe[id] === k) {
        const x = (id % N) * G + G / 2, y = (id / N | 0) * G + G / 2, dc = (x - cx) ** 2 + (y - cy) ** 2;
        if (dist[id] > bd + .5 || (dist[id] > bd - .5 && dc < bc)) { if (dist[id] > bd) bd = dist[id]; best = id; bc = dc; }
      }
      const o = D.zones[k].l;
      if (o) { R.lx = o[0]; R.ly = o[1]; const id = (o[1] / G | 0) * N + (o[0] / G | 0); R.lr = Math.max(8, Math.min(14, dist[id] * G * .9)); }
      else { R.lx = (best % N) * G + G / 2; R.ly = (best / N | 0) * G + G / 2; R.lr = Math.max(7, Math.min(14, bd * G * .9)); }
    });

    const etat = new Int8Array(N * N), PINCEAU = 15, touchees = new Set();
    let S, dpr, k, ctx, peinture, pctx, calque, cctx, traits, anim = 0, pid = null, dernier, enAttente = false, nb = 0, termine = false;

    function preparer() {
      S = Math.max(200, Math.min(scene.clientWidth, scene.clientHeight) - 16); k = S / 400;
      ({ ctx, dpr } = kit.preparerToile(cv, S, S));
      const ancienne = peinture;
      peinture = document.createElement('canvas'); peinture.width = peinture.height = S * dpr; pctx = peinture.getContext('2d');
      if (ancienne) pctx.drawImage(ancienne, 0, 0, peinture.width, peinture.height);
      pctx.setTransform(dpr * k, 0, 0, dpr * k, 0, 0); pctx.lineCap = pctx.lineJoin = 'round';
      calque = document.createElement('canvas'); calque.width = calque.height = S * dpr; cctx = calque.getContext('2d');
      traits = document.createElement('canvas'); traits.width = traits.height = S * dpr;
      refaireTraits(); refaireCalque(); dessiner();
    }
    // Contours : chaque zone cache les traits des zones qui sont derrière elle
    // (sinon la ligne de l'herbe traverse la maison et coupe le mur en deux)
    function refaireTraits() {
      const t = traits.getContext('2d'); t.setTransform(dpr * k, 0, 0, dpr * k, 0, 0);
      t.lineJoin = t.lineCap = 'round'; t.lineWidth = 3; t.strokeStyle = kit.encre;
      chemins.forEach(p => {
        t.globalCompositeOperation = 'destination-out'; t.fill(p);
        t.globalCompositeOperation = 'source-over'; t.stroke(p);
      });
    }
    // Calque des zones terminées (remplies proprement, dans l'ordre arrière → avant)
    function refaireCalque() {
      cctx.setTransform(1, 0, 0, 1, 0, 0); cctx.clearRect(0, 0, calque.width, calque.height); cctx.setTransform(dpr * k, 0, 0, dpr * k, 0, 0);
      Z.forEach((R, i) => { cctx.globalCompositeOperation = R.fini ? 'source-over' : 'destination-out'; cctx.fillStyle = R.fini ? C[R.c].hex : '#000'; cctx.fill(chemins[i]); });
      cctx.globalCompositeOperation = 'source-over';
    }
    function dessiner(t = performance.now()) {
      ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, cv.width, cv.height);
      ctx.drawImage(peinture, 0, 0); ctx.drawImage(calque, 0, 0); ctx.drawImage(traits, 0, 0);
      ctx.setTransform(dpr * k, 0, 0, dpr * k, 0, 0); ctx.lineJoin = ctx.lineCap = 'round';
      for (const d of details) { if (d.fill) { ctx.fillStyle = d.fill; ctx.fill(d.p); } if (d.stroke) { ctx.strokeStyle = d.stroke; ctx.lineWidth = 3; ctx.stroke(d.p); } }
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      const ind = kit.indices(), restantes = Z.filter(R => !R.fini).length;
      Z.forEach(R => {
        if (R.fini) return;
        // Quand il ne reste que quelques zones, leurs numéros palpitent pour qu'on les trouve
        const lr = R.lr * (restantes <= 3 ? 1 + .18 * (1 + Math.sin(t / 180)) / 2 : 1);
        ctx.beginPath(); ctx.arc(R.lx, R.ly, lr, 0, 7); ctx.fillStyle = ind ? C[R.c].hex : '#fff'; ctx.fill();
        ctx.lineWidth = 2; ctx.strokeStyle = kit.encre; ctx.stroke();
        ctx.fillStyle = ind ? '#fff' : kit.encre; ctx.font = `700 ${lr * 1.35}px Fredoka,sans-serif`;
        if (ind) { ctx.lineWidth = 3; ctx.strokeText(R.c, R.lx, R.ly + 1); }
        ctx.fillText(R.c, R.lx, R.ly + 1);
      });
      // Animation continue seulement pendant que des numéros palpitent
      if (restantes > 0 && restantes <= 3 && !termine && !anim) anim = requestAnimationFrame(function boucle(t2) { anim = 0; if (!termine && Z.some(R => !R.fini)) dessiner(t2); });
    }
    const demander = () => { if (!enAttente) { enAttente = true; requestAnimationFrame(() => { enAttente = false; dessiner(); }); } };

    function marquer(x, y) {
      const i0 = Math.max(0, (x - PINCEAU) / G | 0), i1 = Math.min(N - 1, (x + PINCEAU) / G | 0), j0 = Math.max(0, (y - PINCEAU) / G | 0), j1 = Math.min(N - 1, (y + PINCEAU) / G | 0);
      for (let j = j0; j <= j1; j++) for (let i = i0; i <= i1; i++) {
        const cx = i * G + G / 2 - x, cy = j * G + G / 2 - y; if (cx * cx + cy * cy > PINCEAU * PINCEAU) continue;
        const id = j * N + i, rg = zoneDe[id]; if (rg < 0) continue; const R = Z[rg]; if (R.fini) continue;
        const o = etat[id]; if (o === cur) continue;
        if (o === R.c) R.ok--; if (cur === R.c) R.ok++; etat[id] = cur; touchees.add(rg);
      }
    }
    function trait(a, b) {
      pctx.strokeStyle = C[cur].hex; pctx.lineWidth = PINCEAU * 2;
      pctx.beginPath(); pctx.moveTo(a.x, a.y); pctx.lineTo(b.x + .01, b.y); pctx.stroke();
      const d = Math.hypot(b.x - a.x, b.y - a.y), n = Math.max(1, Math.ceil(d / 3));
      for (let s = 1; s <= n; s++) marquer(a.x + (b.x - a.x) * s / n, a.y + (b.y - a.y) * s / n);
      // Les très grandes zones (le ciel, le fond…) demandent un peu moins de remplissage
      const seuil = kit.difficulte().coloriage;
      for (const rg of touchees) { const R = Z[rg]; if (!R.fini && R.ok / R.total >= seuil * (R.total > 1000 ? .8 : 1)) reussie(R); }
      touchees.clear(); demander();
    }
    function reussie(R) {
      R.fini = true; refaireCalque(); kit.sons.pop(nb++);
      const r = cv.getBoundingClientRect(); kit.confettis(r.left + R.lx * k, r.top + R.ly * k, 26, [C[R.c].hex, '#fff']);
      if (Z.every(x => x.fini)) bravo();
    }
    function effacerPeinture() { pctx.save(); pctx.setTransform(1, 0, 0, 1, 0, 0); pctx.clearRect(0, 0, peinture.width, peinture.height); pctx.restore(); }
    function bravo() {
      if (termine) return; termine = true; pid = null; effacerPeinture(); demander();
      kit.feuxDArtifice(); setTimeout(() => kit.dire('Bravo ! Tu as tout colorié !'), 700);
      const f = kit.progres.lire('faits', {}); f[D.nom] = 1; kit.progres.ecrire('faits', f);
      setTimeout(() => kit.felicitations(null, { encore: recommencer }), 2200);
    }
    function recommencer() { etat.fill(0); Z.forEach(R => { if (R.total) { R.ok = 0; R.fini = false; } }); nb = 0; termine = false; effacerPeinture(); refaireCalque(); dessiner(); }

    const vb = e => { const r = cv.getBoundingClientRect(); return { x: (e.clientX - r.left) / r.width * 400, y: (e.clientY - r.top) / r.height * 400 }; };
    cv.addEventListener('pointerdown', e => { if (termine || pid !== null) return; pid = e.pointerId; try { cv.setPointerCapture(pid); } catch (_) {} dernier = vb(e); trait(dernier, dernier); });
    cv.addEventListener('pointermove', e => {
      if (e.pointerId !== pid) return;
      const evs = e.getCoalescedEvents ? e.getCoalescedEvents() : [];
      for (const ev of (evs.length ? evs : [e])) { const p = vb(ev); trait(dernier, p); dernier = p; }
    });
    const lacher = e => { if (e.pointerId === pid) pid = null; };
    cv.addEventListener('pointerup', lacher); cv.addEventListener('pointercancel', lacher);

    kit.surRedimension(preparer);
    requestAnimationFrame(() => { preparer(); kit.dire('Colorie chaque zone avec la bonne couleur'); });
    return () => cancelAnimationFrame(anim);
  }

  PetitsPas.ajouter({
    id: 'coloriage-magique', nom: 'Coloriage magique', icone: '🎨', theme: 'coloriage', niveaux: ['PS', 'MS', 'GS'],
    auteur: 'Petits Pas', description: 'Colorier chaque zone avec la couleur de son numéro.',
    lancer: menu
  });
})();
