/* =====================================================================
   LECTURE — 5 exercices, inspirés des activités de conscience
   phonologique et de lecture des pédagogies Montessori / Céline Alvarez.
   Les mots, images (emojis) et consignes sont originaux.
     👂 J'entends le son…     trouver les images où l'on entend un son
     🎧 Quel son ?            choisir entre deux images
     🖍️ Les lettres du mot    colorier les lettres qu'on entend
     🧩 Écris le mot          remettre les lettres dans l'ordre
     📖 Lis le mot            lire un mot et trouver son image
   ===================================================================== */
(function () {
  'use strict';
  const L = PetitsPas.lecture;
  const typeSon = id => id.length > 1 ? 'son' : 'aeiouyé'.includes(id) ? 'voyelle' : 'consonne';
  const avance = kit => ['CP', 'CE1', 'CE2'].includes(kit.niveau);
  const secouer = b => { b.classList.remove('non'); void b.offsetWidth; b.classList.add('non'); };

  /** Déroulé commun : N manches, étoiles de progression, grand final. */
  function partie(zone, kit, { manches, jouer, rejouer }) {
    L.style();
    const el = kit.el, points = el('div'), scene = el('div', { class: 'ecran' });
    zone.append(el('div', { class: 'ecran' }, points, scene));
    let n = 0; const minuteurs = [];
    const plusTard = (f, ms) => minuteurs.push(setTimeout(f, ms));
    function suivante() {
      points.replaceChildren(L.points(el, n, manches)); scene.innerHTML = '';
      if (n === manches) {
        kit.feuxDArtifice(); kit.progres.ecrire('parties', kit.progres.lire('parties', 0) + 1);
        plusTard(() => kit.dire(kit.prenom ? `Bravo ${kit.prenom} !` : 'Bravo !'), 600);
        plusTard(() => kit.felicitations(null, { encore: rejouer }), 2000);
        return;
      }
      jouer(scene, () => { n++; plusTard(suivante, 1900); }, plusTard);
    }
    suivante();
    return () => minuteurs.forEach(clearTimeout);
  }
  const bravoManche = (kit, elem) => { kit.sons.bravo(); const r = elem.getBoundingClientRect(); kit.confettis(r.left + r.width / 2, r.top + r.height / 2, 45); };

  /* ---------- 👂 J'entends le son… ---------- */
  function sonEntendu(zone, kit) {
    const deja = [];
    return partie(zone, kit, {
      manches: 4, rejouer: () => kit.remplacer('J’entends le son…', z => sonEntendu(z, kit)),
      jouer(scene, fini, plusTard) {
        const el = kit.el;
        const S = L.hasard(L.SONS.filter(s => !deja.includes(s.id) && L.MOTS.filter(m => L.contient(m, s.id)).length >= 3)); deja.push(S.id);
        const oui = L.melanger(L.MOTS.filter(m => L.contient(m, S.id))).slice(0, 3);
        const non = L.melanger(L.MOTS.filter(m => !L.contient(m, S.id))).slice(0, 3);
        const consigne = 'Touche les images où tu entends ' + S.dire;
        scene.append(el('div', { class: 'lec-consigne' },
          el('span', { class: 'lec-graph lec-' + typeSon(S.id) }, S.g),
          el('button', { class: 'lec-ecoute', onclick: () => kit.dire(consigne) }, '🔊')));
        const images = el('div', { class: 'lec-images' }); let trouves = 0;
        L.melanger([...oui, ...non]).forEach(m => {
          const b = el('button', { class: 'lec-image' }, m.emoji);
          b.onclick = () => {
            kit.dire(m.mot);
            if (b.classList.contains('oui')) return;
            if (L.contient(m, S.id)) {
              b.classList.add('oui'); kit.sons.pop(trouves++);
              if (trouves === oui.length) { plusTard(() => bravoManche(kit, images), 700); fini(); }
            } else secouer(b);
          };
          images.append(b);
        });
        scene.append(images);
        plusTard(() => kit.dire(consigne), 300);
      }
    });
  }

  /* ---------- 🎧 Quel son ? ---------- */
  function quelSon(zone, kit) {
    return partie(zone, kit, {
      manches: 6, rejouer: () => kit.remplacer('Quel son ?', z => quelSon(z, kit)),
      jouer(scene, fini, plusTard) {
        const el = kit.el, S = L.hasard(L.SONS);
        const bon = L.hasard(L.MOTS.filter(m => L.contient(m, S.id))), autre = L.hasard(L.MOTS.filter(m => !L.contient(m, S.id)));
        const consigne = 'Où entends-tu ' + S.dire + ' ?';
        scene.append(el('div', { class: 'lec-consigne' },
          el('span', { class: 'lec-graph lec-' + typeSon(S.id) }, S.g),
          el('button', { class: 'lec-ecoute', onclick: () => kit.dire(consigne) }, '🔊')));
        const images = el('div', { class: 'lec-images' }); let fait = false;
        L.melanger([bon, autre]).forEach(m => {
          const b = el('button', { class: 'lec-image' }, m.emoji);
          b.onclick = () => {
            kit.dire(m.mot); if (fait) return;
            if (m === bon) { fait = true; b.classList.add('oui'); plusTard(() => bravoManche(kit, b), 600); fini(); }
            else secouer(b);
          };
          images.append(b);
        });
        scene.append(images);
        plusTard(() => kit.dire(consigne), 300);
      }
    });
  }

  /* ---------- 🖍️ Les lettres du mot ---------- */
  function lettresDuMot(zone, kit) {
    const deja = [];
    return partie(zone, kit, {
      manches: 5, rejouer: () => kit.remplacer('Les lettres du mot', z => lettresDuMot(z, kit)),
      jouer(scene, fini, plusTard) {
        const el = kit.el;
        const m = L.hasard(L.motsAEcrire(avance(kit) ? 7 : 4).filter(x => !deja.includes(x.mot))); deja.push(m.mot);
        const gr = L.graphemes(m), entendues = [...new Set(gr.filter(g => g.type !== 'muet').map(g => g.t))];
        const pieges = L.melanger('abdfilmoprstuv'.split('').filter(c => !m.mot.includes(c))).slice(0, Math.max(3, 8 - entendues.length));
        const consigne = 'Colorie les lettres que tu entends dans ' + m.mot;
        const centre = el('div', { class: 'lec-centre' },
          el('button', { class: 'lec-grande-image', onclick: () => kit.dire(m.mot) }, m.emoji));
        const lettres = el('div', { class: 'lec-images' }); let trouvees = 0;
        L.melanger([...entendues, ...pieges]).forEach(c => {
          const b = el('button', { class: 'lec-lettre' }, c.toUpperCase());
          b.onclick = () => {
            if (b.classList.contains('trouvee')) return;
            if (entendues.includes(c)) {
              b.classList.add('trouvee', 'lec-' + ('aeiouyé'.includes(c) ? 'voyelle' : 'consonne'));
              kit.sons.pop(trouvees++);
              if (trouvees === entendues.length) {
                centre.append(L.motColore(el, m)); kit.dire(m.mot);
                plusTard(() => bravoManche(kit, centre), 500); fini();
              }
            } else { secouer(b); kit.sons.rate(); }
          };
          lettres.append(b);
        });
        scene.append(el('div', { class: 'lec-consigne' }, 'Colorie les lettres que tu entends', el('button', { class: 'lec-ecoute', onclick: () => kit.dire(consigne) }, '🔊')), centre, lettres);
        plusTard(() => kit.dire(consigne), 300);
      }
    });
  }

  /* ---------- 🧩 Écris le mot ---------- */
  function ecrisLeMot(zone, kit) {
    const deja = [];
    return partie(zone, kit, {
      manches: 5, rejouer: () => kit.remplacer('Écris le mot', z => ecrisLeMot(z, kit)),
      jouer(scene, fini, plusTard) {
        const el = kit.el;
        const m = L.hasard(L.motsAEcrire(avance(kit) ? 7 : 4).filter(x => !deja.includes(x.mot))); deja.push(m.mot);
        const gr = L.graphemes(m);
        // Aide : la première lettre est déjà placée (sauf au CP et après, ou en mode difficile)
        let pos = avance(kit) || kit.difficulte().nom === 'Difficile' ? 0 : 1;
        const cases = gr.map((g, i) => el('div', { class: 'lec-case' + (i < pos ? ' donnee lec-' + g.type : '') }, i < pos ? g.t.toUpperCase() : ''));
        const pieges = L.melanger('abdfilmoprstuv'.split('').filter(c => !m.mot.includes(c))).slice(0, 2);
        const tuiles = el('div', { class: 'lec-tuiles' });
        L.melanger([...gr.slice(pos).map(g => g.t), ...pieges]).forEach(c => {
          const b = el('button', { class: 'lec-tuile' }, c.toUpperCase());
          b.onclick = () => {
            if (b.classList.contains('utilisee') || pos >= gr.length) return;
            if (c === gr[pos].t) {
              const k = cases[pos]; k.textContent = c.toUpperCase(); k.classList.add('pleine', 'lec-' + gr[pos].type);
              b.classList.add('utilisee'); kit.sons.pop(pos); pos++;
              if (pos === gr.length) { kit.dire(m.mot); plusTard(() => bravoManche(kit, k.parentNode), 500); fini(); }
            } else { secouer(b); kit.sons.rate(); }
          };
          tuiles.append(b);
        });
        const consigne = 'Écris le mot ' + m.mot;
        scene.append(
          el('div', { class: 'lec-consigne' }, 'Écris le mot', el('button', { class: 'lec-ecoute', onclick: () => kit.dire(m.mot) }, '🔊')),
          el('div', { class: 'lec-centre', style: 'flex:1;justify-content:center' },
            el('button', { class: 'lec-grande-image', onclick: () => kit.dire(m.mot) }, m.emoji),
            el('div', { class: 'lec-cases' }, cases)),
          tuiles);
        plusTard(() => kit.dire(consigne), 300);
      }
    });
  }

  /* ---------- 📖 Lis le mot ---------- */
  function lisLeMot(zone, kit) {
    const deja = [];
    return partie(zone, kit, {
      manches: 6, rejouer: () => kit.remplacer('Lis le mot', z => lisLeMot(z, kit)),
      jouer(scene, fini, plusTard) {
        const el = kit.el;
        const m = L.hasard(L.MOTS.filter(x => !deja.includes(x.mot) && x.mot.length <= (avance(kit) ? 9 : 5))); deja.push(m.mot);
        const autres = L.melanger(L.MOTS.filter(x => x !== m && x.mot[0] !== m.mot[0])).slice(0, 2);
        const images = el('div', { class: 'lec-images' }); let fait = false;
        L.melanger([m, ...autres]).forEach(x => {
          const b = el('button', { class: 'lec-image' }, x.emoji);
          b.onclick = () => {
            if (fait) return;
            if (x === m) { fait = true; b.classList.add('oui'); kit.dire(m.mot); plusTard(() => bravoManche(kit, b), 500); fini(); }
            else { secouer(b); kit.dire(x.mot); }
          };
          images.append(b);
        });
        scene.append(
          el('div', { class: 'lec-consigne' }, 'Lis le mot, puis touche la bonne image',
            el('button', { class: 'lec-ecoute', title: 'Aide : écouter le mot', onclick: () => kit.dire(m.mot) }, '🔊')),
          el('div', { class: 'lec-centre' }, L.motColore(el, m)), images);
        plusTard(() => kit.dire('Lis le mot, puis touche la bonne image'), 300);
      }
    });
  }

  const base = { theme: 'lecture', auteur: 'Petits Pas' };
  PetitsPas.ajouter({ ...base, id: 'lecture-son-entendu', nom: 'J’entends le son…', icone: '👂', niveaux: ['PS', 'MS', 'GS', 'CP'],
    description: 'Trouver les images dont le nom contient un son.', lancer: sonEntendu });
  PetitsPas.ajouter({ ...base, id: 'lecture-quel-son', nom: 'Quel son ?', icone: '🎧', niveaux: ['PS', 'MS', 'GS', 'CP'],
    description: 'Choisir l’image où l’on entend le son.', lancer: quelSon });
  PetitsPas.ajouter({ ...base, id: 'lecture-lettres-du-mot', nom: 'Les lettres du mot', icone: '🖍️', niveaux: ['GS', 'CP'],
    description: 'Colorier les lettres qu’on entend dans un mot.', lancer: lettresDuMot });
  PetitsPas.ajouter({ ...base, id: 'lecture-ecris-mot', nom: 'Écris le mot', icone: '🧩', niveaux: ['GS', 'CP'],
    description: 'Remettre les lettres du mot dans l’ordre.', lancer: ecrisLeMot });
  PetitsPas.ajouter({ ...base, id: 'lecture-lis-mot', nom: 'Lis le mot', icone: '📖', niveaux: ['GS', 'CP', 'CE1'],
    description: 'Lire un mot et trouver la bonne image.', lancer: lisLeMot });
})();
