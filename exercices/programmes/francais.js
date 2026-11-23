/* PROGRAMMES — français du CP au CM2
   D'après les fiches « Ce que votre enfant va apprendre en CP / CE1 / CE2 / CM1 / CM2 ».
   Phrases et mots originaux. */
(function () {
  'use strict';
  const M = PetitsPas.moteurs, el = PetitsPas.el, H = M.hasard, E = M.entre;
  const rang = n => ['CP', 'CE1', 'CE2', 'CM1', 'CM2'].indexOf(n);
  const niv = kit => Math.max(0, rang(kit.niveau));
  const autres = (liste, bon, n) => M.melanger(liste.filter(x => x !== bon)).slice(0, n);

  /* ---------- 👫 Féminin et pluriel (CP, CE1) ---------- */
  const FEMININ = [['un chat', 'une chatte', ['une chate', 'une chats']], ['un ami', 'une amie', ['une amis', 'une amit']], ['un lion', 'une lionne', ['une lione', 'une lions']],
    ['un voisin', 'une voisine', ['une voisins', 'une voisinne']], ['un chanteur', 'une chanteuse', ['une chanteure', 'une chantrice']], ['un boulanger', 'une boulangère', ['une boulangeuse', 'une boulangé']],
    ['un élève', 'une élève', ['une élèva', 'une élèvee']], ['un loup', 'une louve', ['une loupe', 'une loupette']]];
  const PLURIEL = [['un ballon', 'des ballons', ['des ballon', 'des ballonx']], ['un gâteau', 'des gâteaux', ['des gâteaus', 'des gâteau']], ['un cheval', 'des chevaux', ['des chevals', 'des chevales']],
    ['une souris', 'des souris', ['des souriss', 'des sourix']], ['un jeu', 'des jeux', ['des jeus', 'des jeu']], ['une fleur', 'des fleurs', ['des fleur', 'des fleurx']], ['un bijou', 'des bijoux', ['des bijous', 'des bijou']]];
  const PHRASES_PL = [['Le chien aboie.', 'Les chiens aboient.', ['Les chiens aboie.', 'Les chien aboient.']], ['La fille chante.', 'Les filles chantent.', ['Les filles chante.', 'Les fille chantent.']],
    ['Le chat dort.', 'Les chats dorment.', ['Les chats dort.', 'Les chats dorts.']], ['L’oiseau vole.', 'Les oiseaux volent.', ['Les oiseaus volent.', 'Les oiseaux vole.']]];
  M.quiz({
    id: 'feminin-pluriel', nom: 'Féminin et pluriel', icone: '👫', theme: 'francais', niveaux: ['CP', 'CE1'], manches: 8,
    description: 'Mettre un mot au féminin, au pluriel ; une phrase au pluriel.',
    questions: [
      ...FEMININ.map(([m, f, x]) => ({ q: 'Mets au féminin', visuel: m, options: [f, ...x], explication: `${m} → ${f}` })),
      ...PLURIEL.map(([s, p, x]) => ({ q: 'Mets au pluriel', visuel: s, options: [p, ...x], explication: `${s} → ${p}` })),
      ...PHRASES_PL.map(([s, p, x]) => ({ q: 'Mets la phrase au pluriel', visuel: s, options: [p, ...x], explication: `${p} Le nom prend un s, le verbe prend -nt.` }))
    ]
  });

  /* ---------- 🤝 Les mots de même sens (CP → CE2) ---------- */
  const SYNONYMES = [['content', 'heureux', ['triste', 'fatigué']], ['rapide', 'vite', ['lent', 'lourd']], ['joli', 'beau', ['laid', 'petit']], ['commencer', 'débuter', ['finir', 'oublier']],
    ['effrayé', 'apeuré', ['calme', 'joyeux']], ['grand', 'immense', ['minuscule', 'court']], ['parler', 'bavarder', ['dormir', 'courir']], ['maison', 'habitation', ['jardin', 'voiture']],
    ['regarder', 'observer', ['écouter', 'goûter']], ['difficile', 'compliqué', ['facile', 'simple']]];
  const INTRUS = [['cuisine', ['casserole', 'fourchette', 'louche'], 'trottinette'], ['école', ['cartable', 'cahier', 'trousse'], 'parapluie'], ['mer', ['vague', 'plage', 'coquillage'], 'sapin'],
    ['jardin', ['pelle', 'arrosoir', 'râteau'], 'oreiller'], ['météo', ['pluie', 'vent', 'neige'], 'fourchette'], ['corps', ['genou', 'coude', 'épaule'], 'chaussure']];
  M.quiz({
    id: 'vocabulaire', nom: 'Les mots de même sens', icone: '🤝', theme: 'francais', niveaux: ['CP', 'CE1', 'CE2'], manches: 8,
    description: 'Regrouper les mots qui ont le même sens ; trouver l’intrus d’un thème.',
    questions: [
      ...SYNONYMES.map(([m, s, x]) => ({ q: `Quel mot veut dire presque la même chose que « ${m} » ?`, options: [s, ...x], explication: `« ${m} » et « ${s} » ont presque le même sens.` })),
      ...INTRUS.map(([t, ok, i]) => ({ q: `Quel mot n’appartient pas au thème « ${t} » ?`, options: [i, ...ok], explication: `« ${i} » n’a rien à voir avec ${t === 'corps' ? 'le corps' : t === 'école' ? 'l’école' : t === 'météo' ? 'la météo' : 'la ' + t}.` }))
    ]
  });

  /* ---------- 🔗 L'accord sujet-verbe (CE1 → CM1) ---------- */
  const VERBES_ACC = [['jouer', 'dans la cour'], ['chanter', 'une chanson'], ['regarder', 'les nuages'], ['manger', 'à la cantine'], ['dessiner', 'un château'], ['arriver', 'en retard'], ['parler', 'fort']];
  const SUJETS_ACC = [['Les enfants', 3], ['Mon frère', 1], ['Tu', 2], ['Nous', 4], ['Les chats de la voisine', 3], ['La sœur de mes amis', 1], ['Vous', 5], ['Léa et Tom', 3], ['Je', 0], ['Le maître', 1]];
  // indices des sujets : 0 je · 1 il/elle · 2 tu · 3 ils/elles · 4 nous · 5 vous
  const TERM = ['e', 'e', 'es', 'ent', 'ons', 'ez'];
  const forme = (inf, p) => { let r = inf.slice(0, -2); if (p === 4 && r.endsWith('g')) r += 'e'; return r + TERM[p]; };
  M.quiz({
    id: 'accord-sujet-verbe', nom: 'Accorder le verbe', icone: '🔗', theme: 'francais', niveaux: ['CE1', 'CE2', 'CM1'], manches: 8,
    description: 'Accorder le verbe avec son sujet, même quand ils sont éloignés.',
    questions: kit => SUJETS_ACC.flatMap(([s, p]) => [H(VERBES_ACC.filter(([v]) => p !== 0 || !/^[aeiou]/.test(v)))].map(([v, c]) => {
      const bon = forme(v, p), opts = [...new Set([bon, forme(v, 1), forme(v, 3), forme(v, 2), forme(v, 4)])];
      return { q: 'Choisis la bonne forme du verbe', visuel: `${s} … ${c}. (${v})`, options: [bon, ...autres(opts, bon, 2)],
        explication: `Le sujet est « ${s} » : ${s} ${bon} ${c}.` + (s.includes(' de ') ? ' Attention, le sujet est le groupe entier, pas le mot juste avant le verbe !' : '') };
    }))
  });

  /* ---------- 🌈 Les accords dans le groupe nominal (CE2 → CM2) ---------- */
  const GN = [['des fleurs …', 'rouges', ['rouge', 'rougent']], ['une … maison', 'petite', ['petit', 'petits']], ['les … chevaux', 'beaux', ['beau', 'beauxs']],
    ['des chemises …', 'blanches', ['blanche', 'blancs']], ['une histoire …', 'amusante', ['amusant', 'amusantes']], ['des garçons …', 'gentils', ['gentil', 'gentille']],
    ['la … voiture', 'nouvelle', ['nouveau', 'nouvel']], ['des routes …', 'dangereuses', ['dangereux', 'dangereuse']], ['les … journées', 'longues', ['longs', 'longue']],
    ['un … arbre', 'vieil', ['vieux', 'vieille']]];
  M.quiz({
    id: 'accords-gn', nom: 'Accorder l’adjectif', icone: '🌈', theme: 'francais', niveaux: ['CE2', 'CM1', 'CM2'], manches: 8,
    description: 'Accorder l’adjectif avec le nom (genre et nombre).',
    questions: GN.map(([g, b, x]) => ({ q: 'Complète avec l’adjectif bien accordé', visuel: g, options: [b, ...x], explication: g.replace('…', b) + ' : l’adjectif s’accorde avec le nom.' }))
  });

  /* ---------- ⏳ Conjuguer à 4 temps (CE2 → CM2) ---------- */
  const PERS = ['je', 'tu', 'il', 'nous', 'vous', 'ils'];
  const IRR = {
    être: { present: 'suis es est sommes êtes sont', imparfait: 'étais étais était étions étiez étaient', futur: 'serai seras sera serons serez seront', pp: 'été' },
    avoir: { present: 'ai as a avons avez ont', imparfait: 'avais avais avait avions aviez avaient', futur: 'aurai auras aura aurons aurez auront', pp: 'eu' },
    aller: { present: 'vais vas va allons allez vont', imparfait: 'allais allais allait allions alliez allaient', futur: 'irai iras ira irons irez iront', pp: 'allé', etre: true },
    faire: { present: 'fais fais fait faisons faites font', imparfait: 'faisais faisais faisait faisions faisiez faisaient', futur: 'ferai feras fera ferons ferez feront', pp: 'fait' },
    finir: { present: 'finis finis finit finissons finissez finissent', imparfait: 'finissais finissais finissait finissions finissiez finissaient', futur: 'finirai finiras finira finirons finirez finiront', pp: 'fini' }
  };
  function conj(v, t, p) {
    if (t === 'passe') {
      const aux = IRR[v] && IRR[v].etre ? IRR.être.present : IRR.avoir.present, pp = IRR[v] ? IRR[v].pp : v.slice(0, -2) + 'é';
      return aux.split(' ')[p] + ' ' + pp + (IRR[v] && IRR[v].etre && p >= 3 ? 's' : '');
    }
    if (IRR[v]) return IRR[v][t].split(' ')[p];
    const r = v.slice(0, -2), dur = r.endsWith('g') ? r + 'e' : r.endsWith('c') ? r.slice(0, -1) + 'ç' : r;
    if (t === 'present') return (p === 3 ? dur : r) + ['e', 'es', 'e', 'ons', 'ez', 'ent'][p];
    if (t === 'imparfait') return ([3, 4].includes(p) ? r : dur) + ['ais', 'ais', 'ait', 'ions', 'iez', 'aient'][p];
    return v + ['ai', 'as', 'a', 'ons', 'ez', 'ont'][p];
  }
  const avecSujet = (p, f) => (p === 0 && /^[aeéèêiouyh]/.test(f) ? 'j’' : PERS[p] + ' ') + f;
  const TEMPS = { present: ['En ce moment', 'au présent'], imparfait: ['Autrefois', 'à l’imparfait'], futur: ['Demain', 'au futur'], passe: ['Hier', 'au passé composé'] };
  const COMPL = { être: 'à la maison', avoir: 'un vélo rouge', aller: 'à la piscine', faire: 'un gâteau', finir: 'le puzzle', chanter: 'une chanson', jouer: 'aux billes', manger: 'des crêpes', commencer: 'le livre', regarder: 'les étoiles' };
  M.quiz({
    id: 'conjugaison-4-temps', nom: 'Conjuguer à 4 temps', icone: '⏳', theme: 'francais', niveaux: ['CE2', 'CM1', 'CM2'], manches: 8,
    description: 'Présent, imparfait, futur et passé composé : être, avoir, aller, faire, finir et les verbes en -er.',
    questions: () => Array.from({ length: 16 }, () => {
      const v = H(Object.keys(COMPL)), t = H(Object.keys(TEMPS)), p = E(0, 5);
      const bon = avecSujet(p, conj(v, t, p));
      const pieges = new Set(Object.keys(TEMPS).filter(x => x !== t).map(x => avecSujet(p, conj(v, x, p))));
      pieges.add(avecSujet(p, conj(v, t, (p + 3) % 6)));
      pieges.delete(bon);
      return { q: `Conjugue « ${v} » ${TEMPS[t][1]} avec « ${PERS[p]} »`, visuel: `${TEMPS[t][0]}, … ${COMPL[v]}.`, options: [bon, ...M.melanger([...pieges]).slice(0, 3)],
        explication: `${TEMPS[t][0]}, ${bon} ${COMPL[v]}.` };
    })
  });

  /* ---------- 🔍 La nature des mots (CM1) et les groupes de la phrase (CM2) ---------- */
  const NATURE = { D: 'les déterminants', N: 'les noms', A: 'les adjectifs', V: 'les verbes', Adv: 'les adverbes' };
  const PHRASES_NAT = [
    'Le|D petit|A chat|N gris|A dort|V tranquillement|Adv .',
    'Ma|D sœur|N lit|V un|D gros|A livre|N .',
    'Les|D oiseaux|N chantent|V joyeusement|Adv dans|P le|D jardin|N .',
    'Nous|Pro mangeons|V souvent|Adv une|D délicieuse|A tarte|N .',
    'Cette|D vieille|A maison|N est|V très|Adv grande|A .',
    'Le|D chien|N noir|A court|V vite|Adv vers|P la|D rivière|N .',
    'Mon|D frère|N range|V soigneusement|Adv ses|D jouets|N .',
    'Ces|D enfants|N attentifs|A écoutent|V une|D histoire|N amusante|A .'
  ];
  const GROUPES = { S: 'le groupe sujet', V: 'le verbe', C: 'les compléments' };
  const PHRASES_GR = [
    'Le petit chat gris|S / dort|V / sur le canapé|C / .',
    'Chaque matin|C / , / mon grand frère|S / prépare|V / le petit-déjeuner|C / .',
    'Les élèves de la classe|S / visitent|V / le musée|C / demain|C / .',
    'Dans la forêt|C / , / un renard roux|S / chasse|V / les souris|C / .',
    'Ma grand-mère|S / raconte|V / une histoire|C / à ses petits-enfants|C / .',
    'Les feuilles des arbres|S / tombent|V / en automne|C / .'
  ];
  function chasse(zone, kit, mode) {
    const groupes = mode === 'groupes', source = M.melanger(groupes ? PHRASES_GR : PHRASES_NAT).slice(0, 6), titre = groupes ? 'Les groupes de la phrase' : 'La nature des mots';
    return kit.partie(zone, {
      manches: source.length, rejouer: () => kit.remplacer(titre, z => chasse(z, kit, mode)), pause: 2400,
      jouer(scene, fini, plusTard) {
        const morceaux = source.pop().split(groupes ? ' / ' : ' ').map(m => { const [t, c] = m.split('|'); return { t, c }; });
        const dispo = [...new Set(morceaux.map(m => m.c).filter(c => (groupes ? GROUPES : NATURE)[c]))];
        const cible = H(dispo), total = morceaux.filter(m => m.c === cible).length, aide = el('div');
        const libelle = (groupes ? GROUPES : NATURE)[cible];
        let trouves = 0, fait = false;
        const phrase = el('div', { class: 'pf-phrase' + (groupes ? ' groupes' : '') }, morceaux.map(m => {
          if (!m.c) return el('span', { class: 'pf-ponct' }, m.t);
          const b = el('button', { class: 'pf-mot' }, m.t);
          b.onclick = () => {
            if (fait || b.classList.contains('oui')) return;
            if (m.c === cible) { b.classList.add('oui'); kit.sons.pop(trouves++); if (trouves === total) { fait = true; kit.sons.bravo(); const r = phrase.getBoundingClientRect(); kit.confettis(r.left + r.width / 2, r.top + r.height / 2, 40); aide.replaceChildren(el('div', { class: 'pp-aide ok' }, `✔ Bravo ! ${total > 1 ? 'Tu as trouvé tous ' + libelle : 'Tu as trouvé ' + libelle.replace(/^les (.*)s$/, 'le $1')}.`)); fini(); } }
            else {
              b.classList.remove('non'); void b.offsetWidth; b.classList.add('non'); kit.sons.rate();
              const nomC = groupes ? { S: 'le groupe sujet', V: 'le verbe', C: 'un complément' }[m.c] : { D: 'un déterminant', N: 'un nom', A: 'un adjectif', V: 'un verbe', Adv: 'un adverbe', Pro: 'un pronom', P: 'une préposition' }[m.c];
              aide.replaceChildren(el('div', { class: 'pp-aide' }, `💡 « ${m.t} » est ${nomC}.`));
            }
          };
          return b;
        }));
        const q = `Touche ${total > 1 || groupes && cible === 'C' ? libelle : libelle.replace(/^les (.*)s$/, 'le $1')}`;
        scene.append(M.consigne(kit, q), el('div', { class: 'mo-centre' }, phrase, el('div', { style: 'opacity:.65' }, total > 1 ? `Il y en a ${total}.` : 'Il y en a 1.'), aide));
        plusTard(() => kit.dire(q), 300);
      }
    });
  }
  PetitsPas.ajouter({ id: 'nature-mots', nom: 'La nature des mots', icone: '🔍', theme: 'francais', niveaux: ['CE2', 'CM1', 'CM2'], auteur: 'Petits Pas',
    description: 'Reconnaître les déterminants, noms, adjectifs, verbes et adverbes.', lancer: (z, kit) => chasse(z, kit, 'nature') });
  PetitsPas.ajouter({ id: 'groupes-phrase', nom: 'Les groupes de la phrase', icone: '🧩', theme: 'francais', niveaux: ['CM1', 'CM2'], auteur: 'Petits Pas',
    description: 'Reconnaître le groupe sujet, le verbe et les compléments.', lancer: (z, kit) => chasse(z, kit, 'groupes') });

  document.head.append(el('style', {}, `
    .pf-phrase{display:flex;flex-wrap:wrap;gap:8px;justify-content:center;align-items:center;max-width:900px;background:#fff;border-radius:26px;padding:16px 20px;box-shadow:0 6px 0 var(--ombre)}
    .pf-mot{border:3px solid transparent;background:#F6F0E7;border-radius:14px;padding:6px 10px;font:500 clamp(22px,3.4vw,32px) Fredoka,sans-serif}
    .pf-phrase.groupes .pf-mot{border-color:#E9DCC8;background:#fff}
    .pf-mot.oui{background:#FFE08A;border-color:#FFB020}
    .pf-mot.non{animation:pp-secoue .4s}
    .pf-ponct{font:500 clamp(22px,3.4vw,32px) Fredoka,sans-serif}
  `));
})();
