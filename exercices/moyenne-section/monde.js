/* MOYENNE SECTION — se repérer, découvrir le monde, musique
   🐱 Où est le chat ?        « décrire où se trouve un objet : devant, derrière, à côté, près, loin »
   🐣 Remets dans l'ordre     « comprendre la succession des événements », « étapes de la vie des animaux et des plantes »
   🛟 Flotte ou coule ?       « petites expériences : faire flotter un objet »
   🧲 L'aimant                « reconnaître ce qui est attiré par un aimant »
   👏 Répète le rythme        « reproduire un rythme simple avec les mains » */
(function () {
  'use strict';
  const MS = PetitsPas.ms;

  /* ---------- 🐱 Où est le chat ? ---------- */
  // Chaque relation = une petite scène dessinée (emojis positionnés)
  const SCENES = {
    table: {
      decor: el => [el('div', { class: 'ms-table' }, el('i'), el('b'), el('b', { class: 'd' }))],
      rel: { sur: { dit: 'sur la table', pos: 'left:58px;top:12px' }, sous: { dit: 'sous la table', pos: 'left:58px;top:78px' }, 'à côté': { dit: 'à côté de la table', pos: 'left:150px;top:78px' } }
    },
    boite: {
      decor: el => [el('span', { class: 'ms-ref', style: 'left:52px;top:46px;font-size:76px;z-index:1' }, '📦')],
      rel: { devant: { dit: 'devant la boîte', pos: 'left:72px;top:72px;font-size:52px;z-index:2' }, derrière: { dit: 'derrière la boîte', pos: 'left:64px;top:16px;font-size:40px;z-index:0' }, 'à côté': { dit: 'à côté de la boîte', pos: 'left:142px;top:66px' } }
    },
    maison: {
      decor: el => [el('span', { class: 'ms-ref', style: 'left:6px;top:40px;font-size:72px' }, '🏠')],
      rel: { près: { dit: 'près de la maison', pos: 'left:82px;top:74px' }, loin: { dit: 'loin de la maison', pos: 'left:168px;top:84px;font-size:30px' } }
    }
  };
  function ouEstLeChat(zone, kit) {
    const el = kit.el;
    const tirages = MS.melanger(Object.entries(SCENES).flatMap(([nom, S]) => Object.keys(S.rel).map(r => [nom, r]))).slice(0, 6);
    return kit.partie(zone, {
      manches: tirages.length, rejouer: () => kit.remplacer('Où est le chat ?', z => ouEstLeChat(z, kit)),
      jouer(scene, fini, plusTard) {
        const [nom, rel] = tirages.pop(), S = SCENES[nom];
        const consigne = `Touche l’image où le chat est ${S.rel[rel].dit}`;
        const options = MS.melanger(Object.keys(S.rel)).map(r => ({
          bon: r === rel, dire: 'Le chat est ' + S.rel[r].dit,
          contenu: el('div', { class: 'ms-scene' }, S.decor(el), el('span', { class: 'ms-chat', style: S.rel[r].pos }, '🐱'))
        }));
        scene.append(MS.consigne(kit, `Le chat est ${S.rel[rel].dit}`, consigne),
          el('div', { class: 'ms-centre' }, MS.choix(kit, options, fini, { classe: 'ms-carte ms-carte-scene' })));
        plusTard(() => kit.dire(consigne), 400);
      }
    });
  }

  /* ---------- 🐣 Remets dans l'ordre ---------- */
  const HISTOIRES = [
    { titre: 'La poule', etapes: [['🥚', 'l’œuf'], ['🐣', 'le poussin sort de l’œuf'], ['🐥', 'le poussin grandit'], ['🐔', 'c’est une poule']] },
    { titre: 'L’arbre', etapes: [['🌰', 'la graine'], ['🌱', 'la petite pousse'], ['🪴', 'la plante grandit'], ['🌳', 'c’est un arbre']] },
    { titre: 'La fleur', etapes: [['🌱', 'la pousse'], ['🌷', 'la fleur s’ouvre'], ['🥀', 'la fleur fane']] },
    { titre: 'La journée', etapes: [['🌅', 'le matin'], ['☀️', 'le midi'], ['🌇', 'le soir'], ['🌙', 'la nuit']] },
    { titre: 'Le bonhomme de neige', etapes: [['❄️', 'il neige'], ['⛄', 'on fait un bonhomme de neige'], ['💧', 'il fond au soleil']] },
    { titre: 'Le soir', etapes: [['🍽️', 'on mange'], ['🪥', 'on se brosse les dents'], ['😴', 'on dort']] },
    { titre: 'Le gâteau', etapes: [['🥚', 'on prépare la pâte'], ['🎂', 'le gâteau est cuit'], ['🍰', 'on le mange']] }
  ];
  function ordre(zone, kit) {
    const el = kit.el, liste = MS.melanger(HISTOIRES).slice(0, 5), court = kit.difficulte().nom === 'Très facile';
    return kit.partie(zone, {
      manches: liste.length, rejouer: () => kit.remplacer('Remets dans l’ordre', z => ordre(z, kit)), pause: 2600,
      jouer(scene, fini, plusTard) {
        const H = liste.pop(), etapes = court && H.etapes.length > 3 ? [H.etapes[0], H.etapes[1], H.etapes[H.etapes.length - 1]] : H.etapes;
        let pos = 0;
        const cases = etapes.map((_, i) => el('div', { class: 'ms-case' }, el('small', {}, String(i + 1))));
        const cartes = el('div', { class: 'ms-cartes' }, MS.melanger(etapes).map(([emoji, dit]) => {
          const b = el('button', { class: 'ms-carte petite' }, emoji);
          b.onclick = () => {
            if (b.disabled) return;
            if (emoji === etapes[pos][0] && dit === etapes[pos][1]) {
              cases[pos].replaceChildren(el('span', {}, emoji)); cases[pos].classList.add('pleine');
              b.disabled = true; b.style.visibility = 'hidden'; kit.sons.pop(pos); kit.dire(dit); pos++;
              if (pos === etapes.length) { plusTard(() => { MS.bravo(kit, cases[0].parentNode); kit.dire(etapes.map(e => e[1]).join(', puis ')); }, 900); fini(); }
            } else { MS.secouer(b); kit.sons.rate(); kit.dire(pos === 0 ? 'Qu’est-ce qui se passe en premier ?' : 'Et ensuite ?'); }
          };
          return b;
        }));
        scene.append(MS.consigne(kit, `${H.titre} : remets les images dans l’ordre`, `${H.titre}. Qu’est-ce qui se passe en premier ? Remets les images dans l’ordre.`),
          el('div', { class: 'ms-centre' }, el('div', { class: 'ms-cases' }, cases.flatMap((c, i) => i ? [el('span', { class: 'ms-fleche' }, '➜'), c] : [c])), cartes));
        plusTard(() => kit.dire(`${H.titre}. Qu’est-ce qui se passe en premier ?`), 400);
      }
    });
  }

  /* ---------- 🛟 Flotte ou coule ? / 🧲 L'aimant ---------- */
  const FLOTTE = [['🦆', 'le canard en plastique', 1], ['🍃', 'la feuille', 1], ['🪵', 'le morceau de bois', 1], ['⚽', 'le ballon', 1], ['🧽', 'l’éponge', 1],
    ['🍎', 'la pomme', 1], ['🧊', 'le glaçon', 1], ['🪶', 'la plume', 1],
    ['🪨', 'le caillou', 0], ['🔩', 'la vis', 0], ['🪙', 'la pièce', 0], ['⚓', 'l’ancre', 0], ['💍', 'la bague', 0], ['🔑', 'la clé', 0]];
  const AIMANT = [['📎', 'le trombone', 1], ['🔩', 'la vis', 1], ['🧷', 'l’épingle', 1], ['🥫', 'la boîte de conserve', 1], ['🪛', 'le tournevis', 1], ['✂️', 'les ciseaux', 1],
    ['🧸', 'le nounours', 0], ['✏️', 'le crayon', 0], ['🍃', 'la feuille', 0], ['🧦', 'la chaussette', 0], ['🪵', 'le bois', 0], ['🥛', 'le verre', 0], ['🧽', 'l’éponge', 0]];

  function experience(zone, kit, mode) {
    const el = kit.el, eau = mode === 'eau', banque = eau ? FLOTTE : AIMANT;
    const objets = MS.melanger([...MS.melanger(banque.filter(o => o[2])).slice(0, 3), ...MS.melanger(banque.filter(o => !o[2])).slice(0, 3)]);
    const titre = eau ? 'Flotte ou coule ?' : 'L’aimant';
    return kit.partie(zone, {
      manches: objets.length, rejouer: () => kit.remplacer(titre, z => experience(z, kit, mode)), pause: 2400,
      jouer(scene, fini, plusTard) {
        const [emoji, nom, oui] = objets.pop();
        const question = eau ? `Est-ce que ${nom} flotte ou coule ?` : `Est-ce que l’aimant attire ${nom} ?`;
        const objet = el('span', { class: 'ms-objet' }, emoji);
        const bac = eau ? el('div', { class: 'ms-bac' }, objet, el('div', { class: 'ms-eau' }))
          : el('div', { class: 'ms-bac ms-table-aimant' }, el('span', { class: 'ms-aimant' }, '🧲'), objet);
        let fait = false;
        const repondre = (rep, b) => {
          if (fait) return;
          if (rep === !!oui) {
            fait = true; b.classList.add('oui'); bac.classList.add(eau ? (oui ? 'flotte' : 'coule') : (oui ? 'attire' : 'rien'));
            plusTard(() => { MS.bravo(kit, bac); kit.dire(eau ? `Oui, ${nom} ${oui ? 'flotte' : 'coule'} !` : (oui ? `Oui, l’aimant attire ${nom} : c’est en métal !` : `Non, l’aimant n’attire pas ${nom}.`)); }, 900);
            fini();
          } else { MS.secouer(b); kit.sons.rate(); kit.dire('Tu es sûr ? Essaie l’autre réponse.'); }
        };
        const bouton = (texte, rep) => { const b = el('button', { class: 'ms-carte', style: 'font-size:clamp(22px,3.4vw,30px);flex-direction:column;gap:6px;font-weight:700' }, texte); b.onclick = () => repondre(rep, b); return b; };
        scene.append(MS.consigne(kit, question),
          el('div', { class: 'ms-centre' }, bac, el('div', { class: 'ms-cartes' },
            eau ? [bouton([el('span', { style: 'font-size:56px' }, '🛟'), 'Il flotte'], true), bouton([el('span', { style: 'font-size:56px' }, '⬇️'), 'Il coule'], false)]
              : [bouton([el('span', { style: 'font-size:56px' }, '🧲'), 'Oui, il est attiré'], true), bouton([el('span', { style: 'font-size:56px' }, '🚫'), 'Non'], false)])));
        plusTard(() => kit.dire(question), 400);
      }
    });
  }

  /* ---------- 👏 Répète le rythme ---------- */
  const R = .32, L = .75; // intervalle rapide / lent (secondes)
  const RYTHMES = [[L, L], [L, L, L], [R, L], [L, R], [R, R, L], [R, L, R], [L, R, R]];
  function rythme(zone, kit) {
    const el = kit.el, liste = MS.melanger(kit.difficulte().nom === 'Très facile' ? RYTHMES.slice(0, 4) : RYTHMES).slice(0, 5);
    return kit.partie(zone, {
      manches: liste.length, rejouer: () => kit.remplacer('Répète le rythme', z => rythme(z, kit)),
      jouer(scene, fini, plusTard) {
        const P = liste.pop(), nb = P.length + 1;
        const mains = Array.from({ length: nb }, (_, i) => el('span', { class: 'ms-main', style: i ? `margin-left:${P[i - 1] === R ? 4 : 40}px` : '' }, '👏'));
        const modele = el('div', { class: 'ms-rythme' }, mains);
        const traces = el('div', { class: 'ms-groupe', style: 'min-height:66px' });
        let taps = [], fait = false, ecoute = false, attente;
        function jouer() {
          ecoute = true; let t = 0;
          mains.forEach((m, i) => { if (i) t += P[i - 1]; setTimeout(() => { m.classList.add('on'); kit.sons.note(523, 0, .15, 'triangle', .3); setTimeout(() => m.classList.remove('on'), 180); }, 500 + t * 1000); });
          setTimeout(() => { ecoute = false; taps = []; traces.innerHTML = ''; }, 700 + t * 1000);
        }
        function verifier() {
          if (fait) return;
          const iv = taps.slice(1).map((t, i) => (t - taps[i]) / 1000);
          let ok = taps.length === nb;
          if (ok && iv.length) {
            const mn = Math.min(...iv), mx = Math.max(...iv), mixte = P.some(x => x === R) && P.some(x => x === L);
            if (mixte) { const seuil = (mn + mx) / 2; ok = mx / mn >= 1.5 && iv.every((x, i) => (x < seuil) === (P[i] === R)); }
            else ok = mx / mn <= 1.8;
          }
          if (ok) { fait = true; MS.bravo(kit, modele); kit.dire('Bravo, c’est le même rythme !'); fini(); }
          else { kit.sons.rate(); kit.dire(taps.length !== nb ? `Écoute bien : il y a ${nb} frappes.` : 'Presque ! Écoute bien les silences.'); setTimeout(jouer, 1800); }
        }
        const tambour = el('button', { class: 'ms-grande', style: 'font-size:clamp(70px,12vw,110px)', onclick: () => {
          if (fait || ecoute) return;
          taps.push(performance.now()); traces.append(el('span', {}, '👏')); kit.sons.note(392, 0, .15, 'triangle', .3);
          clearTimeout(attente); attente = setTimeout(verifier, 1300);
        } }, '🙌');
        scene.append(MS.consigne(kit, 'Écoute, puis tape le même rythme', 'Écoute bien le rythme, puis tape le même avec tes mains.'),
          el('div', { class: 'ms-centre' }, modele, el('button', { class: 'pp-bouton', onclick: () => !ecoute && jouer() }, '🔊 Réécouter'), tambour, traces));
        plusTard(() => kit.dire('Écoute bien le rythme.'), 200);
        plusTard(jouer, 1600);
        return () => clearTimeout(attente);
      }
    });
  }

  document.head.append(PetitsPas.el('style', {}, `
    .ms-carte-scene{padding:0!important;font-size:16px!important}
    .ms-scene{position:relative;width:clamp(180px,26vw,220px);height:140px;overflow:hidden;border-radius:24px;background:linear-gradient(#E8F6FF 0 75%,#DDEFC8 75%)}
    .ms-scene span{position:absolute;line-height:1;font-size:44px}
    .ms-scene .ms-ref{z-index:1}
    .ms-table{position:absolute;left:30px;top:58px;width:110px;height:66px}
    .ms-table i{position:absolute;left:0;top:0;width:110px;height:14px;background:#A86B3C;border-radius:6px;z-index:3}
    .ms-table b{position:absolute;left:10px;top:10px;width:10px;height:56px;background:#8B5530}
    .ms-table b.d{left:90px}
    .ms-scene .ms-chat{z-index:2}
    .ms-cases{display:flex;align-items:center;gap:8px;flex-wrap:wrap;justify-content:center}
    .ms-case{width:clamp(80px,13vw,110px);height:clamp(80px,13vw,110px);border:4px dashed #CDBFAF;border-radius:24px;background:#fff;display:flex;align-items:center;justify-content:center;font-size:clamp(48px,8vw,70px)}
    .ms-case small{font:700 26px Fredoka,sans-serif;color:#CDBFAF}
    .ms-case.pleine{border-style:solid;border-color:#5CC95C;animation:pp-pop .35s}
    .ms-fleche{font-size:28px;color:#CDBFAF}
    .ms-bac{position:relative;width:min(320px,70vw);height:170px;border:5px solid #3B2F4A;border-top:none;border-radius:0 0 30px 30px;background:#fff;overflow:hidden}
    .ms-eau{position:absolute;left:0;right:0;bottom:0;height:62%;background:linear-gradient(#9FD8F5cc,#4DA3FFcc);z-index:2}
    .ms-objet{position:absolute;left:50%;top:6px;transform:translateX(-50%);font-size:58px;line-height:1;z-index:1;transition:top 1.2s cubic-bezier(.3,1.4,.6,1)}
    .ms-bac.flotte .ms-objet{top:44px;z-index:3;animation:ms-flotte 1.6s 1.2s ease-in-out infinite}
    .ms-bac.coule .ms-objet{top:108px;transition:top 1.8s ease-in}
    @keyframes ms-flotte{50%{transform:translateX(-50%) translateY(-5px) rotate(4deg)}}
    .ms-table-aimant{border:none;background:#F3ECE1;border-radius:30px;height:150px}
    .ms-aimant{position:absolute;left:18px;top:42px;font-size:60px;line-height:1;transform:rotate(-90deg)}
    .ms-table-aimant .ms-objet{top:44px;left:72%;transition:left .7s ease-in}
    .ms-table-aimant.attire .ms-objet{left:110px}
    .ms-table-aimant.rien .ms-objet{animation:pp-secoue .5s}
    .ms-rythme{display:flex;align-items:center;font-size:clamp(40px,7vw,56px);background:#fff;border-radius:26px;padding:10px 20px;box-shadow:0 6px 0 var(--ombre)}
    .ms-main{transition:transform .12s}
    .ms-main.on{transform:scale(1.35)}
  `));

  PetitsPas.ajouter({ id: 'ms-ou-est-le-chat', nom: 'Où est le chat ?', icone: '🐱', theme: 'reperer', niveaux: ['PS', 'MS', 'GS'], auteur: 'Petits Pas',
    description: 'Sur, sous, à côté, devant, derrière, près, loin.', lancer: ouEstLeChat });
  PetitsPas.ajouter({ id: 'ms-ordre', nom: 'Remets dans l’ordre', icone: '🐣', theme: 'reperer', niveaux: ['MS', 'GS'], auteur: 'Petits Pas',
    description: 'Ranger les étapes d’une histoire, de la vie d’un animal ou d’une plante.', lancer: ordre });
  PetitsPas.ajouter({ id: 'ms-flotte-coule', nom: 'Flotte ou coule ?', icone: '🛟', theme: 'monde', niveaux: ['MS', 'GS'], auteur: 'Petits Pas',
    description: 'Prévoir si un objet flotte ou coule, puis observer.', lancer: (z, kit) => experience(z, kit, 'eau') });
  PetitsPas.ajouter({ id: 'ms-aimant', nom: 'L’aimant', icone: '🧲', theme: 'monde', niveaux: ['MS', 'GS'], auteur: 'Petits Pas',
    description: 'Prévoir ce que l’aimant attire, puis observer.', lancer: (z, kit) => experience(z, kit, 'aimant') });
  PetitsPas.ajouter({ id: 'ms-rythme', nom: 'Répète le rythme', icone: '👏', theme: 'musique', niveaux: ['PS', 'MS', 'GS'], auteur: 'Petits Pas',
    description: 'Écouter un rythme et le reproduire en tapant.', lancer: rythme });
})();
