/* MOYENNE SECTION — se préparer à lire
   👏 Frappe les syllabes    « Jouer avec les syllabes »
   🏠 Ça commence comme…     « Quels mots commencent comme maison ? »
   🔤 Les lettres jumelles   « Reconnaître des lettres en capitales, scripts et cursives » */
(function () {
  'use strict';
  const MS = PetitsPas.ms;

  // Mots découpés en syllabes ORALES (sans e muet final, pour ne pas hésiter)
  const SYLLABES = [
    ['🐱', 'chat'], ['🍞', 'pain'], ['🚂', 'train'], ['🐺', 'loup'], ['🔥', 'feu'], ['🔑', 'clé'], ['🚌', 'bus'], ['🐻', 'ours'],
    ['🐇', 'la-pin'], ['🎈', 'bal-lon'], ['🐑', 'mou-ton'], ['👶', 'bé-bé'], ['🚲', 'vé-lo'], ['🏍️', 'mo-to'], ['🐼', 'pan-da'],
    ['🎄', 'sa-pin'], ['🏠', 'mai-son'], ['🚀', 'fu-sée'], ['🍋', 'ci-tron'], ['🐷', 'co-chon'], ['🤖', 'ro-bot'], ['🎂', 'gâ-teau'],
    ['⛵', 'ba-teau'], ['🎁', 'ca-deau'], ['🐢', 'tor-tue'], ['🐟', 'pois-son'], ['🦆', 'ca-nard'],
    ['🍫', 'cho-co-lat'], ['🍍', 'a-na-nas'], ['🐘', 'é-lé-phant'], ['🦋', 'pa-pi-llon'], ['🦘', 'kan-gou-rou'], ['☂️', 'pa-ra-pluie'], ['🥑', 'a-vo-cat'],
    ['💻', 'or-di-na-teur'], ['📺', 'té-lé-vi-sion']
  ].map(([emoji, s]) => ({ emoji, syl: s.split('-'), mot: s.replace(/-/g, '') }));

  // Familles de mots qui commencent par la même syllabe orale
  const DEBUTS = [
    { syl: 'ca', mots: [['🦆', 'canard'], ['🎁', 'cadeau'], ['🥕', 'carotte'], ['☕', 'café']] },
    { syl: 'ba', mots: [['🎈', 'ballon'], ['🍌', 'banane'], ['⛵', 'bateau'], ['🧹', 'balai']] },
    { syl: 'pa', mots: [['🐼', 'panda'], ['🦋', 'papillon'], ['☂️', 'parapluie'], ['🍉', 'pastèque']] },
    { syl: 'cha', mots: [['🐱', 'chat'], ['🎩', 'chapeau'], ['🏰', 'château'], ['🐪', 'chameau']] },
    { syl: 'ro', mots: [['🤖', 'robot'], ['🌹', 'rose'], ['👗', 'robe']] },
    { syl: 'so', mots: [['☀️', 'soleil'], ['🛋️', 'sofa']] },
    { syl: 'la', mots: [['🐇', 'lapin'], ['🦙', 'lama']] },
    { syl: 'mou', mots: [['🐑', 'mouton'], ['🦟', 'moustique']] }
  ];

  /* ---------- 👏 Frappe les syllabes ---------- */
  function frappe(zone, kit) {
    const el = kit.el, ordre = MS.melanger(SYLLABES);
    // une partie : mots de 1, 2, 3 et 4 syllabes mélangés
    const tirage = MS.melanger([1, 2, 2, 3, 3, 4].map(n => ordre.find(m => m.syl.length === n && !m.pris && (m.pris = true))).filter(Boolean));
    ordre.forEach(m => delete m.pris);
    return kit.partie(zone, {
      manches: tirage.length, rejouer: () => kit.remplacer('Frappe les syllabes', z => frappe(z, kit)),
      jouer(scene, fini, plusTard, n) {
        const M = tirage[n]; let coups = 0, fait = false;
        const mains = el('div', { class: 'ms-groupe', style: 'min-height:70px' });
        const mot = el('div', { class: 'ms-mot', style: 'visibility:hidden' }, M.syl.map((s, i) => el('span', { style: `color:${i % 2 ? '#2F7FD8' : '#E8424B'}` }, s.toUpperCase())));
        const dire = () => kit.dire(M.mot);
        const tambour = el('button', { class: 'ms-grande', style: 'font-size:clamp(70px,12vw,110px)', onclick: () => {
          if (fait) return; coups++; kit.sons.note(220 + coups * 40, 0, .18, 'triangle', .3); mains.append(el('span', {}, '👏'));
        } }, '🥁');
        const recommencer = el('button', { class: 'pp-bouton', onclick: () => { coups = 0; mains.innerHTML = ''; } }, '↺');
        const valider = el('button', { class: 'pp-bouton principal', onclick: () => {
          if (fait || !coups) return;
          if (coups === M.syl.length) {
            fait = true; mot.style.visibility = 'visible'; MS.bravo(kit, mains);
            kit.dire(M.syl.join(' … ')); fini();
          } else {
            MS.secouer(valider); kit.sons.rate();
            // on montre et on dit le mot syllabe par syllabe, puis on recommence
            mot.style.visibility = 'visible'; kit.dire(`Écoute : ${M.syl.join(' … ')}. ${M.syl.length} syllabe${M.syl.length > 1 ? 's' : ''}.`);
            plusTard(() => { mot.style.visibility = 'hidden'; coups = 0; mains.innerHTML = ''; }, 3500);
          }
        } }, '✔ J’ai fini');
        scene.append(MS.consigne(kit, 'Tape sur le tambour pour chaque syllabe', 'Dis le mot en tapant une fois pour chaque syllabe. ' + M.mot),
          el('div', { class: 'ms-centre' },
            el('button', { class: 'ms-grande', onclick: dire }, M.emoji), mot, mains,
            el('div', { style: 'display:flex;gap:16px;align-items:center' }, recommencer, tambour, valider)));
        plusTard(dire, 400);
      }
    });
  }

  /* ---------- 🏠 Ça commence comme… ---------- */
  function commeMaison(zone, kit) {
    const el = kit.el, familles = MS.melanger(DEBUTS).slice(0, 5);
    return kit.partie(zone, {
      manches: familles.length, rejouer: () => kit.remplacer('Ça commence comme…', z => commeMaison(z, kit)),
      jouer(scene, fini, plusTard) {
        const F = familles.pop(), [modele, ...autres] = MS.melanger(F.mots);
        const bons = autres.slice(0, 2);
        const pieges = MS.melanger(DEBUTS.filter(d => d.syl !== F.syl).flatMap(d => d.mots)).slice(0, 4 - bons.length);
        const consigne = `Quels mots commencent comme ${modele[1]} ?`;
        let trouves = 0;
        const cartes = el('div', { class: 'ms-cartes' }, MS.melanger([...bons.map(m => [...m, true]), ...pieges.map(m => [...m, false])]).map(([emoji, mot, bon]) => {
          const b = el('button', { class: 'ms-carte' }, emoji);
          b.onclick = () => {
            kit.dire(mot); if (b.classList.contains('oui')) return;
            if (bon) { b.classList.add('oui'); kit.sons.pop(trouves++); if (trouves === bons.length) { plusTard(() => { MS.bravo(kit, cartes); kit.dire(`${modele[1]}, ${bons.map(x => x[1]).join(', ')} : ça commence par ${F.syl} !`); }, 600); fini(); } }
            else { MS.secouer(b); kit.sons.rate(); }
          };
          return b;
        }));
        scene.append(MS.consigne(kit, 'Quels mots commencent pareil ?', consigne),
          el('div', { class: 'ms-centre' },
            el('button', { class: 'ms-grande', onclick: () => kit.dire(modele[1]) }, modele[0]), cartes));
        plusTard(() => kit.dire(consigne), 400);
      }
    });
  }

  /* ---------- 🔤 Les lettres jumelles ---------- */
  const LETTRES = 'ABCDEFGHIJLMNOPRSTUV'.split('');
  const ECRITURES = {
    capitale: { nom: 'capitale', style: 'font-family:Andika,sans-serif;text-transform:uppercase' },
    script: { nom: 'script', style: 'font-family:Andika,sans-serif;text-transform:lowercase' },
    cursive: { nom: 'cursive', style: 'font-family:"Playwrite FR Moderne",cursive;text-transform:lowercase;font-size:.8em' }
  };
  let cursiveChargee = false;
  try { document.fonts.load('40px "Playwrite FR Moderne"', 'abc').then(l => { cursiveChargee = l.length > 0; }).catch(() => {}); } catch (e) {}
  function jumelles(zone, kit) {
    const el = kit.el;
    // La cursive n'est proposée que si la police cursive a bien été chargée (pas toujours hors ligne)
    const cursiveOk = cursiveChargee;
    const paires = [['capitale', 'script'], ['script', 'capitale']];
    if (cursiveOk && kit.difficulte().nom !== 'Très facile') paires.push(['capitale', 'cursive'], ['script', 'cursive']);
    const deja = [];
    return kit.partie(zone, {
      manches: 6, rejouer: () => kit.remplacer('Les lettres jumelles', z => jumelles(z, kit)),
      jouer(scene, fini, plusTard) {
        const L = MS.hasard(LETTRES.filter(l => !deja.includes(l))); deja.push(L);
        const [de, vers] = MS.hasard(paires);
        const options = MS.melanger([L, ...MS.melanger(LETTRES.filter(x => x !== L)).slice(0, 3)]);
        const lettre = (c, e) => el('span', { style: ECRITURES[e].style }, c);
        scene.append(MS.consigne(kit, `Trouve la même lettre en ${ECRITURES[vers].nom}`, `Trouve la lettre ${L} écrite en ${ECRITURES[vers].nom}`),
          el('div', { class: 'ms-centre' },
            el('button', { class: 'ms-grande ms-mot', style: 'font-size:clamp(90px,16vw,140px);min-width:180px', onclick: () => kit.dire(L) }, lettre(L, de)),
            MS.choix(kit, options.map(c => ({ contenu: lettre(c, vers), bon: c === L, dire: c })), fini, { classe: 'ms-carte ms-mot' })));
        plusTard(() => kit.dire(`Trouve la lettre ${L} écrite en ${ECRITURES[vers].nom}`), 400);
      }
    });
  }

  const base = { theme: 'lecture', auteur: 'Petits Pas' };
  PetitsPas.ajouter({ ...base, id: 'ms-syllabes', nom: 'Frappe les syllabes', icone: '👏', niveaux: ['MS', 'GS'],
    description: 'Taper une fois par syllabe en disant le mot.', lancer: frappe });
  PetitsPas.ajouter({ ...base, id: 'ms-commence-comme', nom: 'Ça commence comme…', icone: '🏠', niveaux: ['MS', 'GS'],
    description: 'Trouver les mots qui commencent par la même syllabe.', lancer: commeMaison });
  PetitsPas.ajouter({ ...base, id: 'ms-lettres-jumelles', nom: 'Les lettres jumelles', icone: '🔤', niveaux: ['MS', 'GS'],
    description: 'Associer une lettre en capitale, en script et en cursive.', lancer: jumelles });
})();
