/* Exercice : repasser sur une lettre (ou un chiffre) avec le doigt.
   La lettre s'allume en arc-en-ciel quand elle est assez couverte.
   Ce fichier inscrit deux exercices : « Les lettres » et « Les chiffres ». */
(function () {
  'use strict';

  function grille(zone, kit, caracteres, consigne) {
    const faits = kit.progres.lire('faits', {});
    const g = kit.el('div', { class: 'tuiles' });
    caracteres.forEach((c, i) => g.append(kit.el('button', {
      class: 'tuile' + (faits[c] ? ' faite' : ''),
      onclick: () => kit.ouvrir(c, z => tracer(z, kit, caracteres, i))
    }, c)));
    zone.append(kit.el('p', { class: 'intro' }, consigne), g);
  }

  /** opts.prenom : on enchaîne les lettres d'un mot (le prénom), avec le modèle affiché en haut. */
  function tracer(zone, kit, chars, i, opts = {}) {
    const el = kit.el, ch = chars[i];
    const base = el('canvas'), encre = el('canvas'), cadre = el('div', { class: 'cadre' }, base, encre);
    const scene = el('div', { class: 'scene' }, cadre);
    const msg = el('div', { class: 'message' }, '👆 Repasse sur la lettre avec ton doigt'); scene.append(msg);
    const aller = j => kit.remplacer(opts.prenom ? opts.titre : chars[j], z => tracer(z, kit, chars, j, opts));
    if (opts.prenom) zone.append(el('div', { class: 'modele-mot' }, chars.map((c, k) => el('span', { class: k < i ? 'fait' : k === i ? 'actuel' : '' }, c))));
    const suivant = el('button', { class: 'bouton-rond', onclick: () => aller((i + 1) % chars.length) }, '▶');
    zone.append(el('div', { class: 'ecran' }, scene, el('div', { class: 'barre' },
      el('button', { class: 'bouton-rond', onclick: () => aller((i - 1 + chars.length) % chars.length) }, '◀'),
      el('button', { class: 'bouton-rond', onclick: () => reset() }, '↺'),
      el('button', { class: 'bouton-rond', onclick: () => kit.dire(ch) }, '🔊'),
      suivant)));

    const couleur = kit.arcEnCiel[i % 7];
    let W, H, bc, ic, cibles, morceauDe, morceaux, couvert, nCouv, dil, r2, lw, pas, dedans, dehors, fini, pid = null, dernier, tx, ty, fpx;
    const police = f => `700 ${f}px Andika,"Comic Sans MS",sans-serif`;

    async function preparer() {
      try { await document.fonts.load('700 100px Andika'); } catch (e) {}
      W = Math.max(200, scene.clientWidth - 16); H = Math.max(200, scene.clientHeight - 16);
      cadre.style.width = W + 'px'; cadre.style.height = H + 'px';
      bc = kit.preparerToile(base, W, H).ctx; ic = kit.preparerToile(encre, W, H).ctx;
      bc.font = police(100); let mm = bc.measureText(ch);
      const gh = (mm.actualBoundingBoxAscent + mm.actualBoundingBoxDescent) || 72;
      fpx = Math.min(H * .8 * 100 / gh, W * .78 * 100 / mm.width);
      bc.font = police(fpx); bc.textAlign = 'center'; mm = bc.measureText(ch);
      tx = W / 2; ty = H / 2 + ((mm.actualBoundingBoxAscent || fpx * .72) - (mm.actualBoundingBoxDescent || 0)) / 2;
      // masque de la lettre -> points cibles à couvrir
      const off = document.createElement('canvas'); off.width = W; off.height = H;
      const oc = off.getContext('2d', { willReadFrequently: true });
      oc.font = police(fpx); oc.textAlign = 'center'; oc.fillText(ch, tx, ty);
      const data = oc.getImageData(0, 0, W, H).data;
      pas = Math.max(4, Math.round(fpx / 45)); cibles = [];
      for (let y = pas / 2 | 0; y < H; y += pas) for (let x = pas / 2 | 0; x < W; x += pas) if (data[(y * W + x) * 4 + 3] > 128) cibles.push(x, y);
      // Découpe la lettre en petits morceaux : chacun devra être repassé
      // (sinon, pour un A, les deux jambes suffisaient sans la barre du milieu)
      const taille = fpx * .12, cles = new Map(); morceauDe = []; morceaux = [];
      for (let k = 0; k < cibles.length; k += 2) {
        const cle = (cibles[k] / taille | 0) + ',' + (cibles[k + 1] / taille | 0);
        if (!cles.has(cle)) { cles.set(cle, morceaux.length); morceaux.push({ total: 0, ok: 0 }); }
        const m = cles.get(cle); morceauDe.push(m); morceaux[m].total++;
      }
      // Le doigt « couvre » seulement ce qui est juste sous lui…
      const D = kit.difficulte(), rayon = fpx * .07 * Math.max(1, D.trace * .8); r2 = rayon * rayon; lw = fpx * .1;
      // …mais on tolère de s'écarter du trait (masque élargi selon le réglage parent)
      oc.clearRect(0, 0, W, H); oc.lineJoin = 'round'; oc.lineWidth = fpx * .075 * D.trace * 2.8; oc.strokeText(ch, tx, ty); oc.fillText(ch, tx, ty);
      dil = oc.getImageData(0, 0, W, H).data;
      reset();
    }
    function dessinerLettre() {
      bc.clearRect(0, 0, W, H); bc.lineJoin = 'round';
      if (!fini) {
        bc.fillStyle = '#EFE6D8'; bc.fillText(ch, tx, ty);
        bc.setLineDash([fpx * .035, fpx * .035]); bc.strokeStyle = '#BBA88F'; bc.lineWidth = 3; bc.strokeText(ch, tx, ty); bc.setLineDash([]);
      } else {
        const g = bc.createLinearGradient(tx - fpx * .4, 0, tx + fpx * .4, 0);
        kit.arcEnCiel.forEach((c, k) => g.addColorStop(k / 6, c));
        bc.save(); bc.shadowColor = 'rgba(255,200,60,.9)'; bc.shadowBlur = 30; bc.fillStyle = g; bc.fillText(ch, tx, ty); bc.restore();
        bc.strokeStyle = '#fff'; bc.lineWidth = 4; bc.strokeText(ch, tx, ty);
      }
    }
    function reset() { fini = false; morceaux.forEach(m => m.ok = 0); couvert = new Uint8Array(cibles.length / 2); nCouv = 0; dedans = dehors = 0; ic.clearRect(0, 0, W, H); dessinerLettre(); suivant.classList.remove('pulse'); }
    function toucher(x, y) {
      const xi = x | 0, yi = y | 0; if (xi < 0 || yi < 0 || xi >= W || yi >= H) return;
      if (dil[(yi * W + xi) * 4 + 3] > 0) dedans++; else { dehors++; return; }
      for (let k = 0, n = couvert.length; k < n; k++) {
        if (couvert[k]) continue;
        const dx = cibles[2 * k] - x, dy = cibles[2 * k + 1] - y;
        if (dx * dx + dy * dy < r2) { couvert[k] = 1; nCouv++; morceaux[morceauDe[k]].ok++; }
      }
    }
    function trait(a, b) {
      ic.strokeStyle = couleur; ic.lineWidth = lw; ic.lineCap = 'round';
      ic.beginPath(); ic.moveTo(a.x, a.y); ic.lineTo(b.x, b.y); ic.stroke();
      const d = Math.hypot(b.x - a.x, b.y - a.y), n = Math.max(1, Math.ceil(d / (pas / 2)));
      for (let k = 1; k <= n; k++) toucher(a.x + (b.x - a.x) * k / n, a.y + (b.y - a.y) * k / n);
    }
    const pos = e => { const r = encre.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; };
    encre.addEventListener('pointerdown', e => {
      if (fini || pid !== null) return; pid = e.pointerId;
      try { encre.setPointerCapture(pid); } catch (_) {}
      msg.style.opacity = 0; dernier = pos(e); trait(dernier, { x: dernier.x + .1, y: dernier.y });
    });
    encre.addEventListener('pointermove', e => {
      if (e.pointerId !== pid) return;
      const evs = e.getCoalescedEvents ? e.getCoalescedEvents() : [];
      for (const ev of (evs.length ? evs : [e])) { const p = pos(ev); trait(dernier, p); dernier = p; }
    });
    const lacher = e => { if (e.pointerId !== pid) return; pid = null; verifier(); };
    encre.addEventListener('pointerup', lacher); encre.addEventListener('pointercancel', lacher);

    function verifier() {
      if (fini) return; const D = kit.difficulte();
      if (nCouv / couvert.length < D.couverture) return;
      // Chaque morceau de la lettre (sauf les miettes de bord) doit être assez repassé
      const manquants = new Set(morceaux.map((m, j) => m.total >= 4 && m.ok / m.total < D.parties ? j : -1).filter(j => j >= 0));
      if (manquants.size) {
        // On montre en jaune le bout oublié (par ex. la barre du A)
        dessinerLettre(); bc.fillStyle = '#FFC93B';
        for (let k = 0; k < couvert.length; k++) if (!couvert[k] && manquants.has(morceauDe[k])) { bc.beginPath(); bc.arc(cibles[2 * k], cibles[2 * k + 1], pas * .7, 0, 7); bc.fill(); }
        msg.textContent = 'Il manque un petit bout ! 👀'; msg.style.opacity = 1; kit.sons.clic(); kit.dire('Il manque un petit bout !');
        return;
      }
      if (dehors / (dedans + dehors) > D.horsTrait) {
        kit.sons.rate(); msg.textContent = 'Presque ! Reste bien sur la lettre 😊'; msg.style.opacity = 1;
        setTimeout(reset, 1100); return;
      }
      fini = true; ic.clearRect(0, 0, W, H); dessinerLettre(); kit.sons.bravo();
      setTimeout(() => kit.dire('Bravo ! ' + ch), 500);
      cadre.classList.remove('youpi'); void cadre.offsetWidth; cadre.classList.add('youpi');
      const r = cadre.getBoundingClientRect(); kit.confettis(r.left + r.width / 2, r.top + r.height / 2, 70);
      const faits = kit.progres.lire('faits', {}); faits[ch] = 1; kit.progres.ecrire('faits', faits);
      suivant.classList.add('pulse'); msg.textContent = '⭐ Bravo ! ⭐'; msg.style.opacity = 1;
      if (opts.prenom) {
        if (i + 1 < chars.length) setTimeout(() => aller(i + 1), 1300);
        else setTimeout(() => {
          kit.feuxDArtifice(); kit.dire('Bravo ! Tu as écrit ' + (kit.prenom || 'ton prénom') + ' !');
          setTimeout(() => kit.felicitations(null, { encore: () => aller(0) }), 1800);
        }, 900);
      }
    }

    kit.surRedimension(preparer);
    requestAnimationFrame(() => { preparer(); kit.dire(ch); });
  }

  PetitsPas.ajouter({
    id: 'tracer-lettres', nom: 'Les lettres', icone: '🔤', theme: 'ecriture', niveaux: ['PS', 'MS'],
    auteur: 'Petits Pas', description: 'Repasser sur les lettres majuscules avec le doigt.',
    lancer: (zone, kit) => grille(zone, kit, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''), 'Choisis une lettre à écrire')
  });
  // Mon prénom : en capitales, une lettre après l'autre (« il sait copier son prénom en capitales »)
  function monPrenom(zone, kit) {
    const nom = (kit.prenom || '').toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^A-Z]/g, '');
    if (!nom) {
      zone.append(kit.el('div', { class: 'oups' }, kit.el('div', { class: 'em' }, '🙂'),
        'Cet exercice utilise le prénom de l’enfant.', kit.el('small', {}, 'Crée un profil (⚙️ Espace parents) pour l’essayer.')));
      return;
    }
    return tracer(zone, kit, nom.split(''), 0, { prenom: true, titre: 'Mon prénom' });
  }
  PetitsPas.ajouter({
    id: 'mon-prenom', nom: 'Mon prénom', icone: '📛', theme: 'ecriture', niveaux: ['PS', 'MS', 'GS'],
    auteur: 'Petits Pas', description: 'Écrire son prénom en capitales en repassant sur le modèle.',
    lancer: monPrenom
  });
  PetitsPas.ajouter({
    id: 'tracer-chiffres', nom: 'Les chiffres', icone: '🔢', theme: 'ecriture', niveaux: ['PS', 'MS'],
    auteur: 'Petits Pas', description: 'Repasser sur les chiffres de 1 à 9.',
    lancer: (zone, kit) => grille(zone, kit, '123456789'.split(''), 'Choisis un chiffre à écrire')
  });
})();
