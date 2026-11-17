/* =====================================================================
   LECTURE — banque de mots, sons et outils communs
   ---------------------------------------------------------------------
   Partagé par tous les exercices du dossier « lecture ».

   Chaque mot : [écrit, emoji, sons]
     sons = les sons qu'on ENTEND, séparés par des espaces
            (p b t d k g f v s z ch j m n l r gn
             a e é è i o u ou on an in oi eu)
   Les lettres muettes sont repérées automatiquement (e final) ou
   indiquées avec « _ » dans un 4e champ, ex. ['lit','🛏️','l i','l|i|_t'].

   Code couleur (comme dans beaucoup de méthodes Montessori) :
     voyelles en rouge · consonnes en bleu · sons à plusieurs lettres
     en vert · lettres muettes en gris.
   ===================================================================== */
(function () {
  'use strict';

  const MOTS = [
    ['poule', '🐔', 'p ou l'], ['panda', '🐼', 'p an d a'], ['pomme', '🍎', 'p o m'], ['poire', '🍐', 'p oi r'],
    ['pizza', '🍕', 'p i d z a'], ['piano', '🎹', 'p i a n o'], ['pingouin', '🐧', 'p in g ou in'], ['lapin', '🐇', 'l a p in'],
    ['sapin', '🎄', 's a p in'], ['parapluie', '☂️', 'p a r a p l u i'], ['singe', '🐒', 's in j'], ['rose', '🌹', 'r o z'],
    ['kiwi', '🥝', 'k i w i'], ['lézard', '🦎', 'l é z a r', 'l|é|z|a|r|_d'], ['hippopotame', '🦛', 'i p o p o t a m', '_h|i|p|p|o|p|o|t|a|m|_e'],
    ['chat', '🐱', 'ch a', 'ch|a|_t'], ['souris', '🐭', 's ou r i', 's|ou|r|i|_s'], ['tortue', '🐢', 't o r t u'], ['lion', '🦁', 'l i on'],
    ['fraise', '🍓', 'f r è z'], ['poisson', '🐟', 'p oi s on'], ['vis', '🔩', 'v i s'], ['vache', '🐄', 'v a ch'],
    ['vélo', '🚲', 'v é l o'], ['violon', '🎻', 'v i o l on'], ['avion', '✈️', 'a v i on'], ['fusée', '🚀', 'f u z é'],
    ['feu', '🔥', 'f eu'], ['fourmi', '🐜', 'f ou r m i'], ['phoque', '🦭', 'f o k'], ['tomate', '🍅', 't o m a t'],
    ['tambour', '🥁', 't an b ou r'], ['train', '🚂', 't r in'], ['café', '☕', 'k a f é'], ['tigre', '🐯', 't i g r'],
    ['maison', '🏠', 'm è z on'], ['mouton', '🐑', 'm ou t on'], ['ballon', '🎈', 'b a l on'], ['bonbon', '🍬', 'b on b on'],
    ['citron', '🍋', 's i t r on'], ['cochon', '🐷', 'k o ch on'], ['melon', '🍈', 'm e l on'], ['lune', '🌙', 'l u n'],
    ['moto', '🏍️', 'm o t o'], ['bus', '🚌', 'b u s'], ['bébé', '👶', 'b é b é'], ['clé', '🔑', 'k l é'],
    ['mur', '🧱', 'm u r'], ['arc', '🏹', 'a r k'], ['lit', '🛏️', 'l i', 'l|i|_t'], ['nid', '🪺', 'n i', 'n|i|_d'],
    ['riz', '🍚', 'r i', 'r|i|_z'], ['nez', '👃', 'n é', 'n|ez'], ['os', '🦴', 'o s'], ['sac', '👜', 's a k'],
    ['robe', '👗', 'r o b'], ['sofa', '🛋️', 's o f a'], ['lama', '🦙', 'l a m a'], ['dé', '🎲', 'd é'],
    ['canard', '🦆', 'k a n a r', 'c|a|n|a|r|_d'], ['ananas', '🍍', 'a n a n a s'], ['papillon', '🦋', 'p a p i j on', 'p|a|p|ill|on'], ['abeille', '🐝', 'a b è j', 'a|b|eill|_e'],
    ['banane', '🍌', 'b a n a n'], ['carotte', '🥕', 'k a r o t'], ['ours', '🐻', 'ou r s'], ['éléphant', '🐘', 'é l é f an', 'é|l|é|ph|an|_t'],
    ['étoile', '⭐', 'é t oi l'], ['loup', '🐺', 'l ou', 'l|ou|_p'], ['renard', '🦊', 'r e n a r', 'r|e|n|a|r|_d'], ['serpent', '🐍', 's è r p an', 's|e|r|p|en|_t'],
    ['tulipe', '🌷', 't u l i p'], ['dauphin', '🐬', 'd o f in'], ['gâteau', '🎂', 'g a t o'], ['glace', '🍦', 'g l a s'],
    ['pain', '🍞', 'p in'], ['chapeau', '🎩', 'ch a p o'], ['cheval', '🐴', 'ch e v a l'], ['salade', '🥗', 's a l a d'],
    ['tente', '⛺', 't an t'], ['nuage', '☁️', 'n u a j'], ['volcan', '🌋', 'v o l k an'], ['valise', '🧳', 'v a l i z'],
    ['robot', '🤖', 'r o b o', 'r|o|b|o|_t'], ['fée', '🧚', 'f é'], ['fromage', '🧀', 'f r o m a j'], ['avocat', '🥑', 'a v o k a', 'a|v|o|c|a|_t'],
    ['vague', '🌊', 'v a g', 'v|a|gu|_e']
  ];

  // Les sons travaillés, avec la phrase dite par la voix
  const SONS = [
    { id: 'p', g: 'P', ex: 'poule', dire: 'le son du début de poule' },
    { id: 'v', g: 'V', ex: 'vélo', dire: 'le son du début de vélo' },
    { id: 'f', g: 'F', ex: 'fée', dire: 'le son du début de fée' },
    { id: 't', g: 'T', ex: 'tortue', dire: 'le son du début de tortue' },
    { id: 'm', g: 'M', ex: 'moto', dire: 'le son du début de moto' },
    { id: 'l', g: 'L', ex: 'lune', dire: 'le son du début de lune' },
    { id: 'r', g: 'R', ex: 'robe', dire: 'le son du début de robe' },
    { id: 's', g: 'S', ex: 'sac', dire: 'le son du début de sac' },
    { id: 'b', g: 'B', ex: 'bébé', dire: 'le son du début de bébé' },
    { id: 'ch', g: 'CH', ex: 'chat', dire: 'le son du début de chat' },
    { id: 'a', g: 'A', ex: 'arc', dire: 'le son a, comme dans arc' },
    { id: 'i', g: 'I', ex: 'lit', dire: 'le son i, comme dans lit' },
    { id: 'o', g: 'O', ex: 'os', dire: 'le son o, comme dans os' },
    { id: 'u', g: 'U', ex: 'lune', dire: 'le son u, comme dans lune' },
    { id: 'é', g: 'É', ex: 'bébé', dire: 'le son é, comme dans bébé' },
    { id: 'ou', g: 'OU', ex: 'loup', dire: 'le son ou, comme dans loup' },
    { id: 'on', g: 'ON', ex: 'mouton', dire: 'le son on, comme dans mouton' },
    { id: 'an', g: 'AN', ex: 'panda', dire: 'le son an, comme dans panda' },
    { id: 'in', g: 'IN', ex: 'lapin', dire: 'le son in, comme dans lapin' }
  ];

  const VOYELLES = 'aeiouyéèêëàâîïôûù';
  const DIGRAMMES = ['eill', 'ill', 'eau', 'ou', 'oi', 'eu', 'au', 'ai', 'ei', 'ch', 'ph', 'gn', 'gu', 'qu'];
  const NASALES = ['an', 'am', 'en', 'em', 'on', 'om', 'in', 'im', 'un'];

  /** Découpe un mot écrit en graphèmes : [{ t:'ch', type:'son'|'voyelle'|'consonne'|'muet' }] */
  function graphemes(m) {
    if (m.ecrit) return m.ecrit.split('|').map(t => t[0] === '_' ? { t: t.slice(1), type: 'muet' } : { t, type: type(t) });
    const w = m.mot, r = [];
    for (let i = 0; i < w.length;) {
      const nasale = liste => { const n = liste.find(d => w.startsWith(d, i)); return n && !(VOYELLES + 'nm').includes(w[i + n.length] || '#') ? n : null; };
      let g = nasale(['ain', 'ein']) || DIGRAMMES.find(d => w.startsWith(d, i)) || nasale(NASALES);
      g = g || w[i];
      r.push({ t: g, type: type(g) }); i += g.length;
    }
    // e final muet (pomme, lune…) sauf s'il se prononce (melon n'est pas concerné)
    const d = r[r.length - 1];
    if (d && d.t === 'e' && r.length > 1 && !m.sons.endsWith(' e')) d.type = 'muet';
    return r;
  }
  const type = t => t.length > 1 ? 'son' : VOYELLES.includes(t) ? 'voyelle' : 'consonne';

  const L = PetitsPas.lecture = {
    MOTS: MOTS.map(([mot, emoji, sons, ecrit]) => ({ mot, emoji, sons, liste: sons.split(' '), ecrit })),
    SONS,
    graphemes: m => graphemes(m),
    contient: (m, son) => m.liste.includes(son),
    hasard: t => t[Math.random() * t.length | 0],
    melanger: t => { t = t.slice(); for (let i = t.length - 1; i > 0; i--) { const j = Math.random() * (i + 1) | 0; [t[i], t[j]] = [t[j], t[i]]; } return t; },
    /** Le mot écrit en capitales, lettres colorées selon le code. */
    motColore(el, m, classe = 'lec-mot') {
      return el('div', { class: classe }, graphemes(m).map(g => el('span', { class: 'lec-' + g.type }, g.t.toUpperCase())));
    },
    /** Mots « réguliers » pour écrire lettre par lettre (pas de lettre muette sauf e final). */
    motsAEcrire(longueurMax = 5) {
      return L.MOTS.filter(m => !m.ecrit && m.mot.length <= longueurMax && graphemes(m).every(g => g.type !== 'son'));
    },
    /** Points de progression ⭐⭐⚪⚪ */
    points: (el, fait, total) => el('div', { class: 'lec-points' }, '⭐'.repeat(fait) + '⚪'.repeat(total - fait)),
    style() {
      if (document.getElementById('lec-css')) return;
      document.head.append(PetitsPas.el('style', { id: 'lec-css' }, `
        .lec-voyelle{color:#E8424B}.lec-consonne{color:#2F7FD8}.lec-son{color:#3AA54A}.lec-muet{color:#B7ADA2}
        .lec-points{display:flex;justify-content:center;gap:8px;font-size:30px;padding:4px 0}
        .lec-consigne{text-align:center;font-size:clamp(20px,3vw,28px);font-weight:700;padding:4px 16px;display:flex;align-items:center;justify-content:center;gap:14px;flex-wrap:wrap}
        .lec-ecoute{width:60px;height:60px;border-radius:50%;border:none;background:#fff;box-shadow:0 4px 0 var(--ombre);font-size:28px;flex:none}
        .lec-graph{font:700 clamp(60px,12vw,110px)/1 Andika,sans-serif;background:#fff;border-radius:28px;padding:10px 34px;box-shadow:0 6px 0 var(--ombre);text-shadow:0 2px 0 #fff}
        .lec-images{flex:1;min-height:0;display:flex;flex-wrap:wrap;align-content:center;justify-content:center;gap:clamp(12px,2.5vw,26px);padding:12px}
        .lec-image{position:relative;width:clamp(110px,22vw,190px);aspect-ratio:1;border:none;border-radius:30px;background:#fff;box-shadow:0 6px 0 var(--ombre);font-size:clamp(60px,12vw,110px);line-height:1;display:flex;align-items:center;justify-content:center;transition:transform .15s}
        .lec-image:active{transform:scale(.96)}
        .lec-image.oui{box-shadow:0 0 0 7px #FFB020,0 6px 0 var(--ombre)}
        .lec-image.oui::after{content:"✔";position:absolute;top:-10px;right:-10px;background:#5CC95C;color:#fff;border-radius:50%;width:38px;height:38px;font-size:24px;display:flex;align-items:center;justify-content:center}
        .lec-image.non{animation:pp-secoue .4s}
        .lec-mot{font:700 clamp(54px,11vw,100px)/1.1 Andika,sans-serif;letter-spacing:.06em;text-align:center;background:#fff;border-radius:28px;padding:12px 30px;box-shadow:0 6px 0 var(--ombre)}
        .lec-cases{display:flex;gap:10px;justify-content:center;flex-wrap:wrap;padding:6px}
        .lec-case{width:clamp(62px,11vw,96px);aspect-ratio:1;border:4px dashed #CDBFAF;border-radius:20px;background:#fff;font:700 clamp(40px,8vw,66px)/1 Andika,sans-serif;display:flex;align-items:center;justify-content:center}
        .lec-case.pleine{border-style:solid;border-color:#E9DCC8;animation:pp-pop .35s}
        .lec-case.donnee{border-style:solid;border-color:#E9DCC8;background:#FFF7E0}
        .lec-tuiles{display:flex;gap:12px;justify-content:center;flex-wrap:wrap;padding:8px 12px 18px}
        .lec-tuile{width:clamp(66px,11vw,92px);aspect-ratio:1;border:none;border-radius:20px;background:#fff;box-shadow:0 5px 0 var(--ombre);font:700 clamp(40px,7vw,60px)/1 Andika,sans-serif;color:var(--encre)}
        .lec-tuile.non{animation:pp-secoue .4s}
        .lec-tuile.utilisee{visibility:hidden}
        .lec-lettre{width:clamp(72px,12vw,104px);aspect-ratio:1;border-radius:22px;border:4px solid #D9CBB9;background:#fff;font:700 clamp(46px,8vw,70px)/1 Andika,sans-serif;color:transparent;-webkit-text-stroke:2px #C9B49C;transition:all .25s}
        .lec-lettre.trouvee{-webkit-text-stroke:0;border-color:currentColor;animation:pp-pop .4s}
        .lec-lettre.trouvee.lec-voyelle{color:#E8424B;background:#FFE8E9}.lec-lettre.trouvee.lec-consonne{color:#2F7FD8;background:#E3F0FF}
        .lec-lettre.non{animation:pp-secoue .4s}
        .lec-centre{display:flex;flex-direction:column;align-items:center;gap:10px;padding:6px}
        .lec-grande-image{font-size:clamp(90px,17vw,150px);line-height:1;background:#fff;border-radius:34px;padding:16px 26px;box-shadow:0 6px 0 var(--ombre);border:none}
      `));
    }
  };
})();
