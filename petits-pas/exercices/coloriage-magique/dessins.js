/* Dessins du « Coloriage magique ».
   ---------------------------------------------------------------
   Pour ajouter un dessin, ajoute un objet à la liste :
     nom      : le titre affiché
     icone    : un emoji pour le menu
     zones    : les parties à colorier, de l'arrière vers l'avant.
                d = chemin SVG dans un carré 400 × 400
                c = numéro de couleur (1 jaune, 2 bleu, 3 rouge, 4 vert,
                    5 orange, 6 rose, 7 marron, 8 violet)
                l = [x, y] (facultatif) pour placer le numéro à la main
     details  : traits décoratifs non coloriables (yeux, bouche…)
   ⚠️ Uniquement des dessins originaux : pas de personnages de dessins
   animés, de livres ou de marques (droits d'auteur).                */
(function () {
  const { rectArrondi: rr, ellipse: ell } = PetitsPas.formes, E = PetitsPas.ENCRE;
  const D = (PetitsPas.dessins = PetitsPas.dessins || []);

  D.push({
    nom: 'Bulle le poisson', icone: '🐠', auteur: 'Petits Pas',
    zones: [
      { d: rr(20, 20, 360, 360, 28), c: 2 },
      { d: 'M20 330Q110 305 200 325T380 320V352Q380 380 352 380H48Q20 380 20 352Z', c: 1 },
      { d: 'M55 335Q38 300 58 270Q72 250 66 230Q92 255 82 285Q72 310 82 332Z', c: 4 },
      { d: 'M300 330Q285 300 305 275Q318 258 312 240Q338 262 328 290Q320 312 330 328Z', c: 4 },
      { d: 'M262 190L345 128Q326 190 345 252Z', c: 3 },
      { d: 'M118 132Q165 72 228 126Z', c: 3 },
      { d: ell(175, 190, 105, 72), c: 5 },
      { d: 'M206 122Q229 190 206 258L182 261Q204 190 182 119Z', c: 1 }
    ],
    details: [
      { d: ell(115, 176, 15), fill: '#fff', stroke: E }, { d: ell(112, 178, 7), fill: E },
      { d: 'M84 212Q100 224 118 213', stroke: E }, { d: 'M145 150Q160 190 145 230', stroke: E },
      { d: ell(300, 80, 12), fill: 'rgba(255,255,255,.8)', stroke: E }, { d: ell(322, 52, 8), fill: 'rgba(255,255,255,.8)', stroke: E },
      { d: ell(60, 70, 10), fill: 'rgba(255,255,255,.8)', stroke: E }
    ]
  });

  D.push({
    nom: 'La maison', icone: '🏡', auteur: 'Petits Pas',
    zones: [
      { d: rr(20, 20, 360, 360, 28), c: 2 },
      { d: 'M20 300Q200 268 380 300V352Q380 380 352 380H48Q20 380 20 352Z', c: 4 },
      { d: ell(80, 80, 36), c: 1 },
      { d: 'M318 240H342V330H318Z', c: 7 },
      { d: ell(330, 212, 42, 45), c: 4 },
      { d: 'M240 128H262V180L240 160Z', c: 7 },
      { d: 'M110 200H275V325H110Z', c: 6 },
      { d: 'M92 205L192 115L293 205Z', c: 3 },
      { d: 'M172 258H212V325H172Z', c: 7 },
      { d: 'M128 220H160V252H128Z', c: 1 },
      { d: 'M228 220H260V252H228Z', c: 1 }
    ],
    details: [
      { d: 'M80 30V20M80 140V130M30 80H20M140 80H130M45 45L38 38M115 115L122 122M115 45L122 38M45 115L38 122', stroke: E },
      { d: 'M144 220V252M128 236H160M244 220V252M228 236H260', stroke: E }, { d: ell(204, 292, 3.5), fill: E },
      { d: 'M200 88a14 14 0 0 1 24-10a20 20 0 0 1 36 6a14 14 0 0 1 2 28H202a14 14 0 0 1-2-24Z', fill: '#fff', stroke: E }
    ]
  });

  D.push({
    nom: 'Pompon le chat', icone: '🐱', auteur: 'Petits Pas',
    zones: [
      { d: rr(20, 20, 360, 360, 28), c: 8 },
      { d: 'M20 335H380V352Q380 380 352 380H48Q20 380 20 352Z', c: 4 },
      { d: 'M270 300Q350 300 345 220Q343 200 325 205Q328 268 265 275Z', c: 5 },
      { d: ell(200, 285, 88, 68), c: 5 },
      { d: ell(200, 298, 44), c: 1 },
      { d: 'M128 130L138 58L190 98Z', c: 5 },
      { d: 'M272 130L262 58L210 98Z', c: 5 },
      { d: ell(200, 160, 82, 70), c: 5, l: [200, 116] },
      { d: 'M143 112L148 80L172 99Z', c: 6 },
      { d: 'M257 112L252 80L228 99Z', c: 6 },
      { d: 'M135 205Q200 240 265 205L268 222Q200 260 132 222Z', c: 3, l: [160, 225] }
    ],
    details: [
      { d: ell(170, 150, 13, 15), fill: '#fff', stroke: E }, { d: ell(172, 153, 6, 8), fill: E },
      { d: ell(230, 150, 13, 15), fill: '#fff', stroke: E }, { d: ell(228, 153, 6, 8), fill: E },
      { d: 'M192 172L208 172L200 182Z', fill: '#FF8FC7', stroke: E },
      { d: 'M200 182Q194 194 184 190M200 182Q206 194 216 190', stroke: E },
      { d: 'M150 178L110 172M150 186L110 192M250 178L290 172M250 186L290 192', stroke: E },
      { d: ell(200, 246, 9), fill: '#FFD93B', stroke: E }
    ]
  });

  D.push({
    nom: 'Le papillon', icone: '🦋', auteur: 'Petits Pas',
    zones: [
      { d: rr(20, 20, 360, 360, 28), c: 2 },
      { d: ell(150, 262, 58, 50), c: 8 }, { d: ell(250, 262, 58, 50), c: 8 },
      { d: ell(138, 150, 74, 62), c: 6 }, { d: ell(262, 150, 74, 62), c: 6 },
      { d: ell(126, 142, 24, 22), c: 1 }, { d: ell(274, 142, 24, 22), c: 1 },
      { d: ell(200, 215, 18, 92), c: 7 }, { d: ell(200, 106, 22), c: 7 }
    ],
    details: [
      { d: 'M192 88Q175 50 150 45M208 88Q225 50 250 45', stroke: E },
      { d: ell(150, 45, 7), fill: E }, { d: ell(250, 45, 7), fill: E },
      { d: ell(193, 104, 4), fill: '#fff' }, { d: ell(207, 104, 4), fill: '#fff' },
      { d: 'M192 114Q200 120 208 114', stroke: '#fff' }
    ]
  });
})();
