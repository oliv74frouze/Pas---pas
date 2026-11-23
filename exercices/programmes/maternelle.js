/* PROGRAMMES — maternelle (petite et grande section)
   D'après les fiches « Ce que votre enfant va apprendre en petite section »
   et « … en grande section » du ministère de l'Éducation nationale. */
(function () {
  'use strict';
  const M = PetitsPas.moteurs, el = PetitsPas.el;

  /* ---------- 🐰 L'imagier (PS) : « nommer animaux, parties du corps, objets et leur fonction » ---------- */
  const ANIMAUX = [['🐇', 'le lapin'], ['🐱', 'le chat'], ['🐶', 'le chien'], ['🐄', 'la vache'], ['🐷', 'le cochon'], ['🐔', 'la poule'], ['🦆', 'le canard'],
    ['🐴', 'le cheval'], ['🐑', 'le mouton'], ['🐟', 'le poisson'], ['🐌', 'l’escargot'], ['🦋', 'le papillon'], ['🐞', 'la coccinelle'], ['🐭', 'la souris']];
  const CORPS = [['✋', 'la main'], ['🦶', 'le pied'], ['👂', 'l’oreille'], ['👃', 'le nez'], ['👁️', 'l’œil'], ['👄', 'la bouche'], ['🦷', 'la dent'], ['🦵', 'la jambe']];
  const OBJETS = [['🪥', 'Avec quoi on se brosse les dents ?'], ['✂️', 'Avec quoi on coupe le papier ?'], ['🥄', 'Avec quoi on mange la soupe ?'], ['🛏️', 'Où est-ce qu’on dort ?'],
    ['🧼', 'Avec quoi on se lave les mains ?'], ['✏️', 'Avec quoi on dessine ?'], ['☂️', 'Qu’est-ce qui protège de la pluie ?'], ['🧦', 'Qu’est-ce qu’on met aux pieds avant les chaussures ?']];
  const choisir = (liste, bon, n = 4) => [bon, ...M.melanger(liste.filter(x => x !== bon)).slice(0, n - 1)];
  M.quiz({
    id: 'ps-imagier', nom: 'L’imagier', icone: '🐰', theme: 'monde', niveaux: ['PS', 'MS'], manches: 8,
    description: 'Reconnaître les animaux, les parties du corps et les objets du quotidien.',
    questions: () => [
      ...ANIMAUX.map(a => { const o = choisir(ANIMAUX, a); return { q: 'Montre-moi ' + a[1], options: o.map(x => x[0]), bon: 0 }; }),
      ...CORPS.map(a => { const o = choisir(CORPS, a); return { q: 'Montre-moi ' + a[1], options: o.map(x => x[0]), bon: 0 }; }),
      ...OBJETS.map(a => { const o = choisir(OBJETS, a, 3); return { q: a[1], options: o.map(x => x[0]), bon: 0 }; })
    ]
  });

  /* ---------- 🌅 Le matin ou le soir ? (PS) ---------- */
  const MOMENTS = [['⏰', 'Je me réveille', 0], ['🥣', 'Je prends mon petit-déjeuner', 0], ['🎒', 'Je pars à l’école', 0],
    ['🛁', 'Je prends mon bain avant de dormir', 1], ['🪥', 'Je me brosse les dents avant d’aller au lit', 1], ['📖', 'On me lit une histoire au lit', 1], ['🌙', 'La lune se lève', 1], ['🌄', 'Le soleil se lève', 0]];
  M.quiz({
    id: 'ps-matin-soir', nom: 'Le matin ou le soir ?', icone: '🌅', theme: 'reperer', niveaux: ['PS', 'MS'], manches: 6,
    description: 'Différencier les moments de la journée.',
    questions: MOMENTS.map(([e, t, b]) => ({ q: t + ' : c’est le matin ou le soir ?', visuel: e, garderOrdre: true, bon: b,
      options: [x => x('span', {}, '🌅 Le matin'), x => x('span', {}, '🌙 Le soir')] }))
  });

  /* ---------- 🍴 Mets la table (PS → GS) : « Prends 3 fourchettes » ---------- */
  const COUVERTS = [['🍴', 'fourchettes'], ['🥄', 'cuillères'], ['🍽️', 'assiettes'], ['🥤', 'gobelets'], ['🍎', 'pommes'], ['🧁', 'gâteaux']];
  const NOMBRES = ['zéro', 'une', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf', 'dix'];
  function metsLaTable(zone, kit) {
    const max = { PS: 4, MS: 6 }[kit.niveau] || 10;
    return kit.partie(zone, {
      manches: 5, rejouer: () => kit.remplacer('Mets la table', z => metsLaTable(z, kit)),
      jouer(scene, fini, plusTard) {
        const [emoji, nom] = M.hasard(COUVERTS), n = M.entre(1, max);
        const nb = n === 1 ? (['fourchettes', 'cuillères', 'assiettes', 'pommes'].includes(nom) ? 'une' : 'un') : NOMBRES[n];
        const q = `Mets ${nb} ${n === 1 ? nom.replace(/x$|s$/, '') : nom} sur la table`;
        const table = el('div', { class: 'pm-table' }), tas = el('div', { class: 'pm-tas' });
        let fait = false;
        const compte = () => table.children.length;
        for (let i = 0; i < max + 2; i++) {
          const o = el('button', { class: 'pm-objet' }, emoji);
          o.onclick = () => { if (fait) return; (o.parentNode === tas ? table : tas).append(o); kit.sons.pop(compte()); };
          tas.append(o);
        }
        const ok = el('button', { class: 'pp-bouton principal', onclick: () => {
          if (fait) return;
          if (compte() === n) { fait = true; kit.sons.bravo(); const r = table.getBoundingClientRect(); kit.confettis(r.left + r.width / 2, r.top + r.height / 2, 45); kit.dire(`Bravo, il y a bien ${NOMBRES[n]} !`); fini(); }
          else { kit.sons.rate(); kit.dire(compte() < n ? `Il en manque. Il en faut ${NOMBRES[n]}.` : `Il y en a trop. Il en faut ${NOMBRES[n]}.`); }
        } }, '✔ C’est prêt');
        scene.append(M.consigne(kit, q), el('div', { class: 'mo-centre' }, table, el('div', { style: 'opacity:.65' }, 'Touche un objet pour le poser sur la table (ou le reprendre)'), tas, ok));
        plusTard(() => kit.dire(q), 300);
      }
    });
  }
  PetitsPas.ajouter({ id: 'ps-mets-la-table', nom: 'Mets la table', icone: '🍴', theme: 'calcul', niveaux: ['PS', 'MS', 'GS'], auteur: 'Petits Pas',
    description: 'Prendre exactement le bon nombre d’objets.', lancer: metsLaTable });

  /* ---------- 〰️ Graphisme (PS, MS) : traits, ronds, croix ---------- */
  PetitsPas.ajouter({ id: 'ps-graphisme', nom: 'Graphisme', icone: '〰️', theme: 'ecriture', niveaux: ['PS', 'MS'], auteur: 'Petits Pas',
    description: 'Repasser des traits verticaux, horizontaux, des ronds et des croix.',
    lancer: (zone, kit) => PetitsPas.tracer(zone, kit, ['|', '—', 'O', '/', '+', 'X'], 0, { prenom: true, titre: 'Graphisme', fin: 'Bravo, tu as tout tracé !' }) });

  /* ---------- 🔠 Les lettres de mon prénom (PS) ---------- */
  function lettresPrenom(zone, kit) {
    const nom = (kit.prenom || '').toUpperCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^A-Z]/g, '');
    if (!nom) { zone.append(el('div', { class: 'oups' }, el('div', { class: 'em' }, '🙂'), 'Cet exercice utilise le prénom de l’enfant.', el('small', {}, 'Crée un profil (⚙️ Espace parents) pour l’essayer.'))); return; }
    const lettres = [...new Set(nom)].slice(0, 6);
    return kit.partie(zone, {
      manches: lettres.length, rejouer: () => kit.remplacer('Les lettres de mon prénom', z => lettresPrenom(z, kit)),
      jouer(scene, fini, plusTard, k) {
        const L = lettres[k], autres = M.melanger('ABCDEFGHIJKLMNOPRSTUV'.split('').filter(c => c !== L)).slice(0, 3);
        let fait = false;
        const modele = el('div', { class: 'modele-mot' }, nom.split('').map(c => el('span', { class: c === L ? 'actuel' : lettres.indexOf(c) < k ? 'fait' : '' }, c)));
        const cartes = el('div', { class: 'mo-cartes' }, M.melanger([L, ...autres]).map(c => {
          const b = el('button', { class: 'mo-carte', style: 'font:700 clamp(52px,9vw,80px) Andika,sans-serif' }, c);
          b.onclick = () => { kit.dire(c); if (fait) return;
            if (c === L) { fait = true; b.classList.add('oui'); kit.sons.bravo(); fini(); } else { b.classList.remove('non'); void b.offsetWidth; b.classList.add('non'); kit.sons.rate(); } };
          return b;
        }));
        scene.append(M.consigne(kit, `Trouve la lettre ${L} de ton prénom`), el('div', { class: 'mo-centre' }, modele, cartes));
        plusTard(() => kit.dire(`Trouve la lettre ${L}, comme dans ${kit.prenom}`), 300);
      }
    });
  }
  PetitsPas.ajouter({ id: 'ps-lettres-prenom', nom: 'Les lettres de mon prénom', icone: '🔠', theme: 'lecture', niveaux: ['PS', 'MS'], auteur: 'Petits Pas',
    description: 'Reconnaître les lettres de son prénom en capitales.', lancer: lettresPrenom });

  /* ---------- ⚖️ La balance (GS) : « plus lourd que, plus léger que, du même poids que » ---------- */
  const BOITES = [['🟥', 'la boîte rouge'], ['🟦', 'la boîte bleue'], ['🟩', 'la boîte verte'], ['🟨', 'la boîte jaune'], ['🟪', 'la boîte violette'], ['🟧', 'la boîte orange']];
  function balance(zone, kit) {
    const types = M.melanger(['lourd', 'leger', 'lourd', 'leger', 'egal', 'lourd']);
    return kit.partie(zone, {
      manches: types.length, rejouer: () => kit.remplacer('La balance', z => balance(z, kit)),
      jouer(scene, fini, plusTard, k) {
        const [A, B] = M.melanger(BOITES), T = types[k], pente = T === 'egal' ? 0 : M.hasard([-14, 14]);
        // pente < 0 : le plateau de gauche descend → A est plus lourd
        const lourd = pente < 0 ? A : B, leger = pente < 0 ? B : A;
        const q = T === 'egal' ? 'Que montre la balance ?' : T === 'lourd' ? 'Quelle boîte est la plus lourde ?' : 'Quelle boîte est la plus légère ?';
        const dessin = el('div', { class: 'pm-balance' },
          el('div', { class: 'pm-fleau', style: `transform:rotate(${-pente}deg)` },
            el('div', { class: 'pm-plateau g', style: `transform:rotate(${pente}deg)` }, A[0]),
            el('div', { class: 'pm-plateau d', style: `transform:rotate(${pente}deg)` }, B[0])),
          el('div', { class: 'pm-pied' }));
        const options = T === 'egal'
          ? [{ t: 'Elles ont le même poids', bon: true }, { t: `${A[1].replace('la ', 'La ')} est plus lourde`, bon: false }, { t: `${B[1].replace('la ', 'La ')} est plus lourde`, bon: false }]
          : [A, B].map(x => ({ t: x[0], bon: x === (T === 'lourd' ? lourd : leger) }));
        let fait = false;
        const choix = el('div', { class: T === 'egal' ? 'mo-textes' : 'mo-cartes' }, M.melanger(options).map(o => {
          const b = el('button', { class: T === 'egal' ? 'mo-texte' : 'mo-carte' }, o.t);
          b.onclick = () => { if (fait) return;
            if (o.bon) { fait = true; b.classList.add('oui'); kit.sons.bravo(); const r = b.getBoundingClientRect(); kit.confettis(r.left + r.width / 2, r.top + r.height / 2, 40);
              kit.dire(T === 'egal' ? 'Oui, la balance est droite : elles ont le même poids.' : `Oui ! Le plateau le plus lourd descend.`); fini(); }
            else { b.classList.remove('non'); void b.offsetWidth; b.classList.add('non'); kit.sons.rate(); kit.dire('Regarde bien : le côté le plus lourd descend.'); } };
          return b;
        }));
        scene.append(M.consigne(kit, q), el('div', { class: 'mo-centre' }, dessin, choix));
        plusTard(() => kit.dire(q), 300);
      }
    });
  }
  PetitsPas.ajouter({ id: 'gs-balance', nom: 'La balance', icone: '⚖️', theme: 'calcul', niveaux: ['GS', 'CP'], auteur: 'Petits Pas',
    description: 'Lire une balance : plus lourd, plus léger, même poids.', lancer: balance });

  /* ---------- 🍂 Les saisons (GS) ---------- */
  const SAISONS = ['❄️ L’hiver', '🌷 Le printemps', '☀️ L’été', '🍂 L’automne'];
  const IMAGES_SAISONS = [['⛄', 0, 'On fait un bonhomme de neige en hiver.'], ['🎄', 0, 'Noël est en hiver.'], ['🧤', 0, 'On met des gants quand il fait froid, en hiver.'],
    ['🌷', 1, 'Les fleurs poussent au printemps.'], ['🐣', 1, 'Les poussins naissent souvent au printemps.'], ['🌸', 1, 'Les arbres fleurissent au printemps.'],
    ['🏖️', 2, 'On va à la plage en été.'], ['🍉', 2, 'La pastèque est un fruit d’été.'], ['🌻', 2, 'Les tournesols fleurissent en été.'],
    ['🍂', 3, 'Les feuilles tombent en automne.'], ['🎃', 3, 'Les citrouilles, c’est en automne.'], ['🍄', 3, 'On ramasse les champignons en automne.']];
  M.quiz({
    id: 'gs-saisons', nom: 'Les saisons', icone: '🍂', theme: 'reperer', niveaux: ['GS', 'CP'], manches: 6,
    description: 'Reconnaître les quatre saisons.',
    questions: IMAGES_SAISONS.map(([e, b, x]) => ({ q: 'C’est quelle saison ?', visuel: e, options: SAISONS, bon: b, explication: x, garderOrdre: true }))
  });

  /* ---------- 📅 Les jours et les mois (GS → CE1) ---------- */
  const JOURS = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];
  const MOIS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
  M.quiz({
    id: 'gs-jours-mois', nom: 'Les jours et les mois', icone: '📅', theme: 'reperer', niveaux: ['GS', 'CP', 'CE1'], manches: 8,
    description: 'Quel jour vient avant jeudi ? Quel mois vient après février ?',
    questions: kit => {
      const q = [], avecJours = kit.niveau !== 'GS';
      MOIS.forEach((m, i) => {
        const apres = MOIS[(i + 1) % 12], avant = MOIS[(i + 11) % 12];
        q.push({ q: `Quel mois vient après ${m} ?`, options: [apres, ...M.melanger(MOIS.filter(x => x !== apres && x !== m)).slice(0, 2)], explication: `Après ${m}, c’est ${apres}.` });
        if (kit.niveau !== 'GS') q.push({ q: `Quel mois vient avant ${m} ?`, options: [avant, ...M.melanger(MOIS.filter(x => x !== avant && x !== m)).slice(0, 2)], explication: `Avant ${m}, c’est ${avant}.` });
      });
      if (avecJours) JOURS.forEach((j, i) => {
        const apres = JOURS[(i + 1) % 7], avant = JOURS[(i + 6) % 7];
        q.push({ q: `Quel jour vient après ${j} ?`, options: [apres, ...M.melanger(JOURS.filter(x => x !== apres && x !== j)).slice(0, 2)], explication: `Après ${j}, c’est ${apres}.` });
        q.push({ q: `Quel jour vient avant ${j} ?`, options: [avant, ...M.melanger(JOURS.filter(x => x !== avant && x !== j)).slice(0, 2)], explication: `Avant ${j}, c’est ${avant}.` });
      });
      if (kit.niveau === 'GS') [['🎄', 'Noël', 'décembre'], ['🎆', 'le 14 juillet', 'juillet'], ['🎒', 'la rentrée des classes', 'septembre'], ['🎉', 'le jour de l’An', 'janvier']]
        .forEach(([e, f, m]) => q.push({ q: `En quel mois est ${f} ?`, visuel: e, options: [m, ...M.melanger(MOIS.filter(x => x !== m)).slice(0, 2)], explication: `${f.charAt(0).toUpperCase() + f.slice(1)}, c’est en ${m}.` }));
      return q;
    }
  });

  /* ---------- 🦵 Les articulations (GS) : genou, coude, cheville… ---------- */
  const ARTIC = { 'l’épaule': [[70, 70], [130, 70]], 'le coude': [[58, 112], [142, 112]], 'le poignet': [[50, 150], [150, 150]],
    'la hanche': [[84, 160], [116, 160]], 'le genou': [[82, 212], [118, 212]], 'la cheville': [[80, 262], [120, 262]], 'le cou': [[100, 56]] };
  function articulations(zone, kit) {
    const ordre = M.melanger(Object.keys(ARTIC)).slice(0, 6);
    return kit.partie(zone, {
      manches: ordre.length, rejouer: () => kit.remplacer('Les articulations', z => articulations(z, kit)),
      jouer(scene, fini, plusTard) {
        const cible = ordre.pop(), NS = 'http://www.w3.org/2000/svg';
        const svg = document.createElementNS(NS, 'svg'); svg.setAttribute('viewBox', '0 0 200 290'); svg.setAttribute('class', 'pm-corps');
        svg.innerHTML = `<g stroke="#3B2F4A" stroke-width="12" stroke-linecap="round" fill="none">
          <line x1="100" y1="56" x2="100" y2="160"/><line x1="70" y1="70" x2="130" y2="70"/>
          <polyline points="70,70 58,112 50,150"/><polyline points="130,70 142,112 150,150"/>
          <line x1="84" y1="160" x2="116" y2="160"/><polyline points="84,160 82,212 80,262 64,270"/><polyline points="116,160 118,212 120,262 136,270"/></g>
          <circle cx="100" cy="30" r="24" fill="#FFD9B3" stroke="#3B2F4A" stroke-width="5"/>
          <circle cx="92" cy="27" r="3" fill="#3B2F4A"/><circle cx="108" cy="27" r="3" fill="#3B2F4A"/><path d="M92 38 Q100 44 108 38" stroke="#3B2F4A" stroke-width="3" fill="none"/>`;
        let fait = false;
        for (const [nom, pts] of Object.entries(ARTIC)) for (const [x, y] of pts) {
          const c = document.createElementNS(NS, 'circle'); c.setAttribute('cx', x); c.setAttribute('cy', y); c.setAttribute('r', 11); c.setAttribute('class', 'pm-artic');
          c.addEventListener('pointerdown', () => {
            if (fait) return;
            if (nom === cible) { fait = true; c.classList.add('oui'); kit.sons.bravo(); const r = c.getBoundingClientRect(); kit.confettis(r.left + r.width / 2, r.top + r.height / 2, 35); kit.dire('Oui, c’est ' + nom + ' !'); fini(); }
            else { c.classList.add('non'); setTimeout(() => c.classList.remove('non'), 800); kit.sons.rate(); kit.dire('Ça, c’est ' + nom); }
          });
          svg.append(c);
        }
        scene.append(M.consigne(kit, 'Touche ' + cible), el('div', { class: 'mo-centre' }, svg));
        plusTard(() => kit.dire('Touche ' + cible), 300);
      }
    });
  }
  PetitsPas.ajouter({ id: 'gs-articulations', nom: 'Les articulations', icone: '🦵', theme: 'monde', niveaux: ['GS', 'CP'], auteur: 'Petits Pas',
    description: 'Situer le genou, le coude, la cheville, l’épaule, le poignet…', lancer: articulations });

  document.head.append(el('style', {}, `
    .pm-table{min-width:min(460px,86vw);min-height:110px;border-radius:50% / 40%;background:#C98B5A;border:6px solid #A86B3C;display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:4px;padding:16px 30px}
    .pm-tas{display:flex;flex-wrap:wrap;justify-content:center;gap:6px;max-width:600px}
    .pm-objet{border:none;background:none;font-size:clamp(40px,7vw,58px);line-height:1;padding:2px}
    .pm-table .pm-objet{animation:pp-pop .3s}
    .pm-balance{position:relative;width:300px;height:190px}
    .pm-fleau{position:absolute;left:20px;top:60px;width:260px;height:10px;background:#3B2F4A;border-radius:5px;transition:transform .6s}
    .pm-plateau{position:absolute;top:10px;width:90px;height:72px;font-size:56px;line-height:1;display:flex;align-items:flex-end;justify-content:center;border-bottom:8px solid #A86B3C;border-radius:0 0 40px 40px}
    .pm-plateau.g{left:-30px}.pm-plateau.d{right:-30px}
    .pm-pied{position:absolute;left:142px;top:66px;width:16px;height:110px;background:#3B2F4A;border-radius:4px}
    .pm-pied::after{content:"";position:absolute;left:-40px;bottom:-6px;width:96px;height:14px;background:#3B2F4A;border-radius:7px}
    .pm-corps{width:min(300px,60vw);height:auto;max-height:52vh;background:#fff;border-radius:28px;box-shadow:0 6px 0 var(--ombre);padding:8px}
    .pm-artic{fill:#FFD93B;stroke:#3B2F4A;stroke-width:3;cursor:pointer}
    .pm-artic.oui{fill:#5CC95C}.pm-artic.non{fill:#FF5A5F}
  `));
})();
