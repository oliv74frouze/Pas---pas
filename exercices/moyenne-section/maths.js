/* MOYENNE SECTION — mathématiques
   🚗 Petits problèmes      « J'ai 5 voitures. J'en donne 2. Combien m'en reste-t-il ? » ; « 5, c'est 3 et encore 2 »
   🚂 Le petit train        « utiliser les nombres pour exprimer des positions (premier, deuxième…) »
   🔺 Les formes            « rond, carré, triangle, rectangle »
   🔁 Les suites            « prolonger des suites qui se répètent »
   ⚖️ Le plus…              « comparer des quantités, des longueurs, des masses » */
(function () {
  'use strict';
  const MS = PetitsPas.ms, NS = 'http://www.w3.org/2000/svg';
  const NOMBRES = ['zéro', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf', 'dix'];
  const OBJETS = [['🚗', 'voiture', 'voitures'], ['🍎', 'pomme', 'pommes'], ['🎈', 'ballon', 'ballons'], ['🍪', 'gâteau', 'gâteaux'],
    ['🐟', 'poisson', 'poissons'], ['⭐', 'étoile', 'étoiles'], ['🧸', 'nounours', 'nounours'], ['🍓', 'fraise', 'fraises']];
  const feminin = nom => ['voiture', 'pomme', 'étoile', 'fraise'].includes(nom);

  /** Trois chiffres à toucher ; un seul est le bon. */
  function chiffres(kit, bon, max, fini, plusTard) {
    const choix = new Set([bon]); while (choix.size < 3) choix.add(MS.entre(0, max));
    let fait = false;
    return kit.el('div', { class: 'ms-cartes' }, MS.melanger([...choix]).map(v => {
      const b = kit.el('button', { class: 'ms-chiffre' }, String(v));
      b.onclick = () => {
        if (fait) return;
        if (v === bon) { fait = true; b.classList.add('oui'); MS.bravo(kit, b); kit.dire(NOMBRES[v] + ' ! Bravo !'); fini(); }
        else { MS.secouer(b); b.disabled = true; kit.sons.rate(); }
      };
      return b;
    }));
  }

  /* ---------- 🚗 Petits problèmes ---------- */
  function problemes(zone, kit) {
    // PS : jusqu'à 4, sans « compléter » · MS : jusqu'à 6 · GS : jusqu'à 10
    const el = kit.el, ps = kit.niveau === 'PS';
    const max = ps ? 4 : kit.niveau === 'GS' ? 10 : kit.difficulte().nom === 'Très facile' ? 5 : 6;
    const types = MS.melanger(ps ? ['ajouter', 'ajouter', 'enlever', 'ajouter', 'enlever'] : ['enlever', 'ajouter', 'completer', 'enlever', 'ajouter', 'completer']);
    return kit.partie(zone, {
      manches: types.length, rejouer: () => kit.remplacer('Petits problèmes', z => problemes(z, kit)), pause: 2300,
      jouer(scene, fini, plusTard, n) {
        const [emoji, sing, plur] = MS.hasard(OBJETS), T = types[n], f = feminin(sing);
        const nom = k => k > 1 ? plur : sing, un = k => k === 1 ? (f ? 'une' : 'un') : NOMBRES[k];
        let depart, k, reponse, histoire, question;
        if (T === 'enlever') {
          depart = MS.entre(ps ? 2 : 3, max); k = MS.entre(1, depart - 1); reponse = depart - k;
          histoire = `J’ai ${un(depart)} ${nom(depart)}. J’en donne ${un(k)}.`; question = `Combien m’en reste-t-il ?`;
        } else if (T === 'ajouter') {
          depart = MS.entre(1, max - 1); k = MS.entre(1, Math.min(3, max - depart)); reponse = depart + k;
          histoire = `J’ai ${un(depart)} ${nom(depart)}. On m’en donne ${un(k)} de plus.`; question = `Combien j’en ai maintenant ?`;
        } else {
          const total = MS.entre(3, max); depart = MS.entre(1, total - 1); k = total - depart; reponse = k;
          histoire = `Il faut ${un(total)} ${nom(total)}. J’en ai déjà ${un(depart)}.`; question = `Combien il m’en manque ?`;
        }
        const groupe = MS.groupe(kit, emoji, depart, 'ms-groupe ms-anim');
        const reponses = el('div', { style: 'min-height:130px' });
        const texte = el('div', { class: 'ms-consigne', style: 'font-weight:500' }, histoire);
        scene.append(MS.consigne(kit, question, histoire + ' ' + question),
          el('div', { class: 'ms-centre' }, texte, el('div', { class: 'ms-grande', style: 'font-size:inherit;min-width:260px;min-height:120px;display:flex;align-items:center;justify-content:center' }, groupe), reponses));
        kit.dire(histoire);
        // L'animation montre ce qui se passe, puis on pose la question
        plusTard(() => {
          if (T === 'enlever') [...groupe.children].slice(-k).forEach((s, i) => setTimeout(() => s.classList.add('part'), i * 250));
          else if (T === 'ajouter') for (let i = 0; i < k; i++) setTimeout(() => groupe.append(el('span', { class: 'arrive' }, emoji)), i * 250);
          else for (let i = 0; i < k; i++) groupe.append(el('span', { class: 'fantome' }, emoji));
        }, 1800);
        plusTard(() => { kit.dire(question); reponses.append(chiffres(kit, reponse, max, fini, plusTard)); }, 3000);
      }
    });
  }

  /* ---------- 🚂 Le petit train ---------- */
  const ORDINAUX = ['premier', 'deuxième', 'troisième', 'quatrième', 'cinquième'];
  function train(zone, kit) {
    const el = kit.el, animaux = ['🐶', '🐱', '🐰', '🐻', '🐼', '🐸', '🐷', '🦊', '🐨', '🐯'];
    return kit.partie(zone, {
      manches: 5, rejouer: () => kit.remplacer('Le petit train', z => train(z, kit)),
      jouer(scene, fini, plusTard) {
        const nb = kit.difficulte().nom === 'Très facile' ? 4 : 5, rang = MS.entre(0, nb - 1);
        const passagers = MS.melanger(animaux).slice(0, nb);
        const consigne = `Qui est dans le ${ORDINAUX[rang]} wagon ?`;
        let fait = false;
        const wagons = passagers.map((a, i) => {
          const b = el('button', { class: 'ms-wagon' }, el('span', { class: 'ms-passager' }, a), el('span', { class: 'ms-roues' }, '⚫ ⚫'));
          b.onclick = () => {
            if (fait) return;
            if (i === rang) { fait = true; b.classList.add('oui'); MS.bravo(kit, b); kit.dire(`Oui ! C’est le ${ORDINAUX[rang]} wagon.`); fini(); }
            else { MS.secouer(b); kit.sons.rate(); kit.dire(`Ça, c’est le ${ORDINAUX[i]} wagon.`); }
          };
          return b;
        });
        scene.append(MS.consigne(kit, consigne),
          el('div', { class: 'ms-centre' }, el('div', { class: 'ms-train' }, el('span', { class: 'ms-loco' }, '🚂'), wagons),
            el('div', { style: 'opacity:.65;font-size:17px' }, '⬅️ Le train roule par ici : le premier wagon est juste derrière la locomotive')));
        plusTard(() => kit.dire(consigne), 400);
      }
    });
  }

  /* ---------- 🔺 Les formes ---------- */
  const FORMES = {
    rond: { le: 'les ronds', s: (t) => `<circle cx="50" cy="50" r="${38 * t}"/>` },
    carre: { le: 'les carrés', s: (t) => `<rect x="${50 - 36 * t}" y="${50 - 36 * t}" width="${72 * t}" height="${72 * t}" rx="3"/>` },
    triangle: { le: 'les triangles', s: (t) => `<polygon points="50,${50 - 40 * t} ${50 + 44 * t},${50 + 32 * t} ${50 - 44 * t},${50 + 32 * t}"/>` },
    rectangle: { le: 'les rectangles', s: (t) => `<rect x="${50 - 44 * t}" y="${50 - 24 * t}" width="${88 * t}" height="${48 * t}" rx="3"/>` }
  };
  function formes(zone, kit) {
    const el = kit.el, ordre = MS.melanger(Object.keys(FORMES).concat(Object.keys(FORMES))).slice(0, 6);
    return kit.partie(zone, {
      manches: ordre.length, rejouer: () => kit.remplacer('Les formes', z => formes(z, kit)),
      jouer(scene, fini, plusTard) {
        const cible = ordre.pop(), autres = Object.keys(FORMES).filter(f => f !== cible);
        const nbBons = MS.entre(2, 3), liste = MS.melanger([...Array(nbBons).fill(cible), ...MS.melanger([...autres, ...autres]).slice(0, 6 - nbBons)]);
        const consigne = `Touche tous ${FORMES[cible].le}`;
        let trouves = 0;
        const cartes = el('div', { class: 'ms-cartes' }, liste.map(f => {
          const svg = document.createElementNS(NS, 'svg'); svg.setAttribute('viewBox', '0 0 100 100'); svg.setAttribute('class', 'ms-forme');
          const coul = MS.hasard(kit.arcEnCiel), rot = f === 'rond' ? 0 : MS.hasard([0, 0, 15, -15, 90, 30]), t = .7 + Math.random() * .3;
          svg.innerHTML = `<g transform="rotate(${rot} 50 50)" fill="${coul}" stroke="#3B2F4A" stroke-width="3">${FORMES[f].s(t)}</g>`;
          const b = el('button', { class: 'ms-carte petite' }, svg);
          b.onclick = () => {
            if (b.classList.contains('oui')) return;
            if (f === cible) { b.classList.add('oui'); kit.sons.pop(trouves++); if (trouves === nbBons) { plusTard(() => MS.bravo(kit, cartes), 300); fini(); } }
            else { MS.secouer(b); kit.sons.rate(); kit.dire('Ça, c’est un ' + (f === 'carre' ? 'carré' : f)); }
          };
          return b;
        }));
        scene.append(MS.consigne(kit, consigne), el('div', { class: 'ms-centre' }, cartes));
        plusTard(() => kit.dire(consigne), 400);
      }
    });
  }

  /* ---------- 🔁 Les suites ---------- */
  const MOTIFS = ['AB', 'AB', 'AAB', 'ABB', 'ABC'];
  const JEUX = [['🔴', '🔵', '🟡'], ['⭐', '🌙', '☀️'], ['🍎', '🍌', '🍇'], ['🐱', '🐶', '🐰'], ['🟥', '🔺', '🟢'], ['🌸', '🍀', '🍄']];
  function suites(zone, kit) {
    const el = kit.el, facile = kit.difficulte().nom === 'Très facile' || kit.niveau === 'PS';
    return kit.partie(zone, {
      manches: 5, rejouer: () => kit.remplacer('Les suites', z => suites(z, kit)),
      jouer(scene, fini, plusTard, n) {
        const motif = facile ? 'AB' : MOTIFS[n % MOTIFS.length], jeu = MS.hasard(JEUX);
        const elt = c => jeu['ABC'.indexOf(c)];
        const longueur = motif.length * 2 + MS.entre(1, motif.length);
        const suite = Array.from({ length: longueur + 1 }, (_, i) => elt(motif[i % motif.length]));
        const bon = suite.pop();
        const options = MS.melanger([...new Set([...jeu.slice(0, motif.includes('C') ? 3 : 2), MS.hasard(jeu)])]);
        const ligne = el('div', { class: 'ms-suite' }, suite.map(e => el('span', {}, e)), el('span', { class: 'ms-trou' }, '?'));
        scene.append(MS.consigne(kit, 'Qu’est-ce qui vient après ?', 'Regarde bien la suite. Qu’est-ce qui vient après ?'),
          el('div', { class: 'ms-centre' }, ligne,
            MS.choix(kit, options.map(o => ({ contenu: o, bon: o === bon })), fini, { apres: () => { ligne.lastChild.textContent = bon; ligne.lastChild.classList.add('rempli'); } })));
        plusTard(() => kit.dire('Qu’est-ce qui vient après ?'), 400);
      }
    });
  }

  /* ---------- ⚖️ Le plus… ---------- */
  const LOURDS = [['🐘', '🐭'], ['🚗', '🚲'], ['🍉', '🍒'], ['🪨', '🪶'], ['🐄', '🐔'], ['🎃', '🍓']];
  function lePlus(zone, kit) {
    const el = kit.el, types = MS.melanger(['quantite', 'quantite', 'long', 'court', 'lourd', 'long']);
    return kit.partie(zone, {
      manches: types.length, rejouer: () => kit.remplacer('Le plus…', z => lePlus(z, kit)),
      jouer(scene, fini, plusTard, n) {
        const T = types[n]; let consigne, options;
        if (T === 'quantite') {
          const [emoji] = MS.hasard(OBJETS), a = MS.entre(1, 4), b = Math.min(8, a + MS.entre(2, 4));
          consigne = 'Où est-ce qu’il y en a le plus ?';
          options = MS.melanger([{ contenu: MS.groupe(kit, emoji, b), bon: true }, { contenu: MS.groupe(kit, emoji, a), bon: false }]);
        } else if (T === 'lourd') {
          const [l, p] = MS.hasard(LOURDS);
          consigne = 'Lequel est le plus lourd ?';
          options = MS.melanger([{ contenu: l, bon: true }, { contenu: p, bon: false }]);
        } else {
          const longs = MS.melanger([40, 65, 90]), coul = MS.melanger(kit.arcEnCiel), cible = T === 'long' ? 90 : 40;
          consigne = T === 'long' ? 'Quel serpent est le plus long ?' : 'Quel serpent est le plus court ?';
          options = longs.map((L, i) => ({ bon: L === cible, contenu: el('div', { class: 'ms-serpent', style: `width:${L * 2.4}px;background:${coul[i]}` }, el('span', {}, '👀')) }));
        }
        scene.append(MS.consigne(kit, consigne),
          el('div', { class: 'ms-centre' }, MS.choix(kit, options, fini, { classe: T === 'long' || T === 'court' ? 'ms-carte ms-ligne' : 'ms-carte ms-egal' })));
        plusTard(() => kit.dire(consigne), 400);
      }
    });
  }

  document.head.append(PetitsPas.el('style', {}, `
    .ms-anim span{transition:transform .6s,opacity .6s}
    .ms-anim span.part{transform:translate(120px,-60px) rotate(30deg);opacity:0}
    .ms-anim span.arrive{animation:pp-pop .5s}
    .ms-anim span.fantome{opacity:.25;filter:grayscale(1)}
    .ms-train{display:flex;align-items:flex-end;gap:6px;flex-wrap:wrap;justify-content:center}
    .ms-loco{font-size:clamp(70px,11vw,100px);line-height:1}
    .ms-wagon{position:relative;border:none;background:#FF9F40;border-radius:16px 16px 8px 8px;width:clamp(84px,13vw,112px);height:clamp(84px,13vw,112px);display:flex;flex-direction:column;align-items:center;justify-content:center;box-shadow:0 5px 0 #C8762A;padding:0}
    .ms-wagon:nth-child(odd){background:#4DA3FF;box-shadow:0 5px 0 #2F72BE}
    .ms-wagon .ms-passager{font-size:clamp(44px,7vw,60px);line-height:1}
    .ms-wagon .ms-roues{font-size:16px;letter-spacing:10px;margin-top:4px}
    .ms-wagon.oui{outline:7px solid #FFB020}
    .ms-wagon.non{animation:pp-secoue .4s}
    .ms-forme{width:clamp(70px,11vw,100px);height:clamp(70px,11vw,100px)}
    .ms-suite{display:flex;flex-wrap:wrap;justify-content:center;gap:8px;font-size:clamp(40px,7vw,64px);background:#fff;border-radius:26px;padding:12px 18px;box-shadow:0 6px 0 var(--ombre)}
    .ms-trou{display:inline-flex;align-items:center;justify-content:center;width:1.3em;border:4px dashed #FFB020;border-radius:14px;color:#FFB020;font:700 .8em Fredoka,sans-serif}
    .ms-trou.rempli{border-style:solid;animation:pp-pop .4s}
    .ms-egal{width:clamp(200px,34vw,300px)}
    .ms-egal .ms-groupe{max-width:100%}
    .ms-ligne{min-height:90px!important;padding:10px 20px}
    .ms-serpent{height:34px;border-radius:17px;display:flex;align-items:center;justify-content:flex-end;padding-right:4px;font-size:22px;border:3px solid #3B2F4A}
  `));

  const base = { theme: 'calcul', auteur: 'Petits Pas' };
  PetitsPas.ajouter({ ...base, id: 'ms-problemes', nom: 'Petits problèmes', icone: '🚗', niveaux: ['PS', 'MS', 'GS'],
    description: 'Enlever, ajouter, compléter : résoudre de petits problèmes jusqu’à 6.', lancer: problemes });
  PetitsPas.ajouter({ ...base, id: 'ms-train', nom: 'Le petit train', icone: '🚂', niveaux: ['MS', 'GS'],
    description: 'Premier, deuxième, troisième… trouver le bon wagon.', lancer: train });
  PetitsPas.ajouter({ ...base, id: 'ms-formes', nom: 'Les formes', icone: '🔺', niveaux: ['PS', 'MS', 'GS'],
    description: 'Reconnaître les ronds, carrés, triangles et rectangles.', lancer: formes });
  PetitsPas.ajouter({ ...base, id: 'ms-suites', nom: 'Les suites', icone: '🔁', niveaux: ['PS', 'MS', 'GS'],
    description: 'Continuer une suite qui se répète.', lancer: suites });
  PetitsPas.ajouter({ ...base, id: 'ms-le-plus', nom: 'Le plus…', icone: '⚖️', niveaux: ['PS', 'MS'],
    description: 'Comparer des quantités, des longueurs et des masses.', lancer: lePlus });
})();
