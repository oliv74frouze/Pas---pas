/* Exercice : conjuguer au présent les verbes en -er (CE2–CM1)
   Les phrases sont fabriquées au hasard (sujet + verbe + complément).
   Cas particuliers travaillés : -cer (nous lançons) et -ger (nous nageons),
   j' devant une voyelle ou un h muet (j'aime, j'habite).
   Clavier de la tablette + touches ç é è â pour aider. */
(function () {
  'use strict';

  // [infinitif, complément] — phrases originales
  const VERBES = [
    ['parler', 'à voix basse'], ['chanter', 'une chanson'], ['jouer', 'au ballon'], ['regarder', 'les étoiles'],
    ['danser', 'dans le salon'], ['nager', 'dans la piscine'], ['manger', 'une pomme'], ['ranger', 'la chambre'],
    ['bouger', 'les bras'], ['partager', 'le goûter'], ['plonger', 'dans le lac'], ['lancer', 'la balle'],
    ['avancer', 'vers la porte'], ['placer', 'les chaises'], ['commencer', 'la course'], ['effacer', 'le tableau'],
    ['dessiner', 'un dragon'], ['crier', 'de joie'], ['oublier', 'son cartable'], ['marcher', 'dans la forêt'],
    ['sauter', 'très haut'], ['écouter', 'la maîtresse'], ['aimer', 'les gâteaux'], ['arriver', 'à l’heure'],
    ['habiter', 'près de l’école'], ['grimper', 'à l’arbre'], ['préparer', 'une surprise'], ['trouver', 'la solution'],
    ['compter', 'jusqu’à cent'], ['mesurer', 'la table'], ['colorier', 'un mandala'], ['visiter', 'le château']
  ];
  const SUJETS = [
    { s: 'je', fin: 'e' }, { s: 'tu', fin: 'es' }, { s: 'il', fin: 'e' }, { s: 'elle', fin: 'e' }, { s: 'on', fin: 'e' },
    { s: 'nous', fin: 'ons' }, { s: 'vous', fin: 'ez' }, { s: 'ils', fin: 'ent' }, { s: 'elles', fin: 'ent' },
    { s: 'Léa', fin: 'e' }, { s: 'Mes amis', fin: 'ent' }, { s: 'Le chat', fin: 'e' }, { s: 'Tom et moi', fin: 'ons', nous: true }
  ];

  function conjuguer(inf, S) {
    let rad = inf.slice(0, -2);
    if (S.fin === 'ons') { if (rad.endsWith('c')) rad = rad.slice(0, -1) + 'ç'; else if (rad.endsWith('g')) rad += 'e'; }
    return rad + S.fin;
  }
  const commenceParVoyelle = v => /^[aeiouyéèêâh]/i.test(v);
  const normaliser = t => t.trim().toLowerCase().replace(/[’`]/g, '\'').replace(/\s+/g, ' ');

  const CSS = `
  .pre-phrase{font:500 clamp(24px,3.6vw,38px)/1.7 Fredoka,sans-serif;text-align:center}
  .pre-inf{font-weight:700;color:#9B6BFF}
  .pre-champ{font:700 clamp(24px,3.6vw,36px) Fredoka,sans-serif;width:9em;max-width:70vw;text-align:center;border:none;border-bottom:4px dashed #CDBFAF;background:#FFF7E0;border-radius:10px;padding:4px 8px;color:#3B2F4A;outline:none;user-select:text;-webkit-user-select:text}
  .pre-champ:focus{border-bottom-color:#FFB020}
  .pre-champ.bon{background:#E3F7DF;border-bottom:4px solid #5CC95C;color:#2E8B3A}
  .pre-accents{display:flex;justify-content:center;gap:10px;flex-wrap:wrap;padding:6px}
  .pre-accents button{width:56px;height:56px;border:none;border-radius:14px;background:#fff;box-shadow:0 4px 0 var(--ombre);font:700 26px Fredoka,sans-serif}
  .pre-terminaisons{font-size:16px;opacity:.75;text-align:center;padding:2px 10px}`;

  function jouerPartie(zone, kit) {
    if (!document.getElementById('pre-css')) document.head.append(kit.el('style', { id: 'pre-css' }, CSS));
    const verbes = [...VERBES].sort(() => Math.random() - .5);
    // On s'assure de rencontrer au moins un -cer et un -ger avec « nous »
    const speciaux = [verbes.findIndex(v => v[0].endsWith('cer')), verbes.findIndex(v => v[0].endsWith('ger'))];
    return kit.partie(zone, {
      manches: 8, rejouer: () => kit.remplacer('Le présent', z => jouerPartie(z, kit)),
      jouer(scene, fini, plusTard, numero) {
        const el = kit.el;
        const [inf, compl] = numero < 2 ? verbes[speciaux[numero]] : verbes.filter((_, i) => !speciaux.includes(i))[numero];
        const S = numero < 2 ? SUJETS.find(x => x.s === 'nous') : SUJETS[Math.random() * SUJETS.length | 0];
        const forme = conjuguer(inf, S);
        let sujet = S.s;
        if (sujet === 'je' && commenceParVoyelle(forme)) sujet = 'j’';
        const sujetAffiche = sujet.charAt(0).toUpperCase() + sujet.slice(1);
        const champ = el('input', { class: 'pre-champ', type: 'text', autocomplete: 'off', autocorrect: 'off', autocapitalize: 'off', spellcheck: 'false', placeholder: '…' });
        const aide = el('div'); let essais = 0, fait = false;

        function verifier() {
          if (fait) return;
          const rep = normaliser(champ.value).replace(/^(je |j'|j’|tu |il |elle |on |nous |vous |ils |elles )/, '');
          if (!rep) { champ.focus(); return; }
          if (rep === forme) {
            fait = true; champ.classList.add('bon'); champ.blur(); kit.sons.bravo();
            const r = champ.getBoundingClientRect(); kit.confettis(r.left + r.width / 2, r.top + r.height / 2, 40);
            const phrase = `${sujetAffiche}${sujet.endsWith('’') ? '' : ' '}${forme} ${compl}.`;
            aide.replaceChildren(el('div', { class: 'pp-aide ok' }, '✔ ' + phrase));
            kit.dire(phrase); fini(); return;
          }
          essais++; kit.sons.rate();
          const rad = inf.slice(0, -2);
          let conseil;
          if (S.fin === 'ons' && /[cg]er$/.test(inf) && rep === rad + 'ons')
            conseil = inf.endsWith('cer') ? `💡 Avec nous, le c devient ç pour garder le son [s] : nous …çons.` : `💡 Avec nous, on garde un e après le g pour garder le son [j] : nous …geons.`;
          else if (!rep.startsWith(rad.slice(0, -1))) conseil = `💡 Garde le radical du verbe : ${rad}-`;
          else conseil = `💡 Avec « ${S.nous ? 'nous' : S.s.toLowerCase()} », la terminaison est -${S.fin}.`;
          if (essais >= 3) { conseil = `La bonne réponse : ${sujetAffiche}${sujet.endsWith('’') ? '' : ' '}${forme}.`; fait = true; champ.value = forme; plusTard(fini, 2200); }
          aide.replaceChildren(el('div', { class: 'pp-aide' }, conseil));
          if (!fait) { champ.select(); }
        }
        champ.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); verifier(); } });
        const accent = c => el('button', { onclick: () => {
          const a = champ.selectionStart ?? champ.value.length, b = champ.selectionEnd ?? a;
          champ.value = champ.value.slice(0, a) + c + champ.value.slice(b); champ.focus(); champ.setSelectionRange(a + 1, a + 1);
        } }, c);

        scene.append(
          el('div', { class: 'pp-consigne' }, 'Conjugue le verbe au présent'),
          el('div', { class: 'pp-carte' }, el('div', { class: 'pre-phrase' },
            sujetAffiche, sujet.endsWith('’') ? '' : ' ', champ, ' ', compl, '.',
            el('div', {}, el('span', { class: 'pre-inf' }, '(' + inf + ')')))),
          el('div', { class: 'pre-accents' }, ['ç', 'é', 'è', 'ê', 'â'].map(accent),
            el('button', { class: 'pp-bouton principal', style: 'width:auto;height:56px;padding:0 24px', onclick: verifier }, 'Vérifier')),
          el('div', { class: 'pre-terminaisons' }, 'je -e · tu -es · il/elle/on -e · nous -ons · vous -ez · ils/elles -ent'),
          aide);
        plusTard(() => champ.focus(), 300);
      }
    });
  }

  PetitsPas.ajouter({
    id: 'present-er', nom: 'Le présent (-er)', icone: '✍️', theme: 'francais', niveaux: ['CE2', 'CM1'],
    auteur: 'Petits Pas', description: 'Conjuguer les verbes du 1er groupe au présent, y compris -cer et -ger.',
    lancer: jouerPartie
  });
})();
