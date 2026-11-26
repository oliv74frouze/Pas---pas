/* PROGRAMMES — mathématiques du CP au CM2
   D'après les fiches « Ce que votre enfant va apprendre en CP / CE1 / CE2 / CM1 / CM2 ».
   La plupart des exercices s'adaptent au niveau de l'enfant (kit.niveau). */
(function () {
  'use strict';
  const M = PetitsPas.moteurs, el = PetitsPas.el, NS = 'http://www.w3.org/2000/svg';
  const E = M.entre, H = M.hasard, F = M.formater;
  const rang = n => ['CP', 'CE1', 'CE2', 'CM1', 'CM2'].indexOf(n); // -1 en maternelle ou invité
  const niv = kit => Math.max(0, rang(kit.niveau));
  const svg = (vb, html, classe) => { const s = document.createElementNS(NS, 'svg'); s.setAttribute('viewBox', vb); if (classe) s.setAttribute('class', classe); s.innerHTML = html; return s; };

  /* ---------- 🧱 Dizaines et unités (CP → CE2) ---------- */
  M.saisie({
    id: 'nb-dizaines', nom: 'Dizaines et unités', icone: '🧱', theme: 'calcul', niveaux: ['CP', 'CE1', 'CE2'], manches: 8,
    description: '78, c’est 7 dizaines et 8 unités ; 3 087, c’est 3 milliers, 8 dizaines et 7 unités.',
    generer(k, kit) {
      const r = niv(kit);
      if (r === 0 || (r === 1 && k < 3)) { // dessin : barres de 10 et cubes
        const d = E(1, r === 0 && kit.periode <= 2 ? 5 : 9), u = E(0, 9), n = d * 10 + u;
        return { q: 'Combien y a-t-il de cubes ?', reponse: n, aide: 'Compte les barres de 10 (les dizaines), puis les cubes seuls (les unités).',
          apres: `${d} dizaine${d > 1 ? 's' : ''} et ${u} unité${u > 1 ? 's' : ''} : ${n}.`,
          visuel: () => el('div', { class: 'pg-base10' }, el('div', { class: 'pg-barres' }, Array.from({ length: d }, () => el('div', { class: 'pg-barre' }))),
            el('div', { class: 'pg-cubes' }, Array.from({ length: u }, () => el('div', { class: 'pg-cube' })))) };
      }
      const parts = r === 1 ? [['centaine', E(1, 9)], ['dizaine', E(0, 9)], ['unité', E(0, 9)]] : [['millier', E(1, 9)], ['centaine', E(0, 9)], ['dizaine', E(0, 9)], ['unité', E(0, 9)]];
      const n = parts.reduce((s, [, v]) => s * 10 + v, 0);
      const texte = M.melanger(parts.filter(([, v]) => v)).map(([nom, v]) => `${v} ${nom}${v > 1 ? 's' : ''}`).join(', ');
      return { q: 'Écris ce nombre en chiffres', visuel: texte, reponse: n, apres: `${texte} : ${F(n)}.`, aide: 'Range d’abord les milliers, puis les centaines, les dizaines et les unités. Mets 0 s’il n’y en a pas.' };
    }
  });

  /* ---------- 🔤 Les nombres en lettres (CP → CM2) ---------- */
  M.saisie({
    id: 'nb-lettres', nom: 'Les nombres en lettres', icone: '🔤', theme: 'calcul', niveaux: ['CP', 'CE1', 'CE2', 'CM1', 'CM2'], manches: 6,
    description: 'Lire un nombre écrit en lettres et l’écrire en chiffres.',
    generer(k, kit) {
      const max = [100, 1000, 10000, 999999, 999999999][niv(kit)];
      const n = k < 2 ? E(11, Math.min(99, max)) : E(Math.min(17, max), max);
      return { q: 'Écris ce nombre en chiffres', visuel: M.enLettres(n), reponse: n, apres: `${M.enLettres(n)} : ${F(n)}`, aide: 'Lis le nombre par morceaux : les millions, les milliers, puis le reste.' };
    }
  });

  /* ---------- ⚡ Calcul éclair (CP → CM2) : calcul mental chronométré ---------- */
  // Objectifs précis de calcul mental du CP (programme de mathématiques du cycle 2)
  const FOCUS_CP = {
    tables: () => H([() => { const a = E(0, 10), b = E(0, 10); return [`${a} + ${b}`, a + b]; },
      () => { const s = E(5, 20), a = E(Math.max(0, s - 10), Math.min(10, s)); return [`${a} + ? = ${s}`, s - a]; }])(),
    doubles: () => H([() => { const a = E(1, 10); return [`le double de ${a}`, 2 * a]; }, () => { const a = E(1, 10); return [`la moitié de ${2 * a}`, a]; },
      () => { const a = H([15, 20, 25, 30, 40, 50]); return [`le double de ${a}`, 2 * a]; }])(),
    dizaines: kit => { const max = kit.periode <= 2 ? 59 : 100; return H([() => { const a = E(1, max - 2), k = H([1, 2]); return [`${a} + ${k}`, a + k]; }, () => { const a = E(3, max), k = H([1, 2]); return [`${a} − ${k}`, a - k]; },
      () => { const a = E(1, max - 10); return [`${a} + 10`, a + 10]; }, () => { const a = E(11, max); return [`${a} − 10`, a - 10]; }, () => { const a = E(1, 5), b = E(1, 9 - a); return [`${a * 10} + ${b * 10}`, (a + b) * 10]; }])(); },
    complement: kit => { const a = E(11, kit.periode <= 2 ? 58 : 98); if (a % 10 === 0) return [`${a - 3} + ? = ${a}`, 3]; const d = Math.ceil(a / 10) * 10; return [`${a} + ? = ${d}`, d - a]; },
    ajouter: () => H([() => { const a = E(11, 80), b = E(2, 8); return [`${a} + ${b}`, a + b]; }, () => { const a = E(5, 80); return [`${a} + 9`, a + 9]; },
      () => { const a = E(2, 8) * 10, b = E(1, 9); return [`${a} − ${b}`, a - b]; }, () => { const a = E(11, 40), b = E(11, 40); return [`${a} + ${b}`, a + b]; }])()
  };
  function calcul(kit) {
    if (kit.focus && FOCUS_CP[kit.focus]) return FOCUS_CP[kit.focus](kit);
    const r = niv(kit), t = E(0, 5);
    if (r === 0) return [() => { const a = E(1, 9), b = E(1, 9); return [`${a} + ${b}`, a + b]; },
      () => { const s = E(8, 15), a = E(1, s - 1); return [`${a} + ? = ${s}`, s - a]; },
      () => { const a = E(1, 10); return [`le double de ${a}`, 2 * a]; },
      () => { const a = E(5, 15), b = E(1, a); return [`${a} − ${b}`, a - b]; }][t % 4]();
    if (r === 1) return [() => { const a = E(2, 5), b = E(1, 10); return [`${a} × ${b}`, a * b]; },
      () => { const a = E(11, 69), b = E(1, 9) * 10; return [`${a} + ${b}`, a + b]; },
      () => { const a = E(30, 99), b = E(1, 9); return [`${a} − ${b}`, a - b]; },
      () => { const a = E(1, 9) * 10, s = 100; return [`${a} + ? = ${s}`, s - a]; }][t % 4]();
    if (r === 2) return [() => { const a = E(2, 9), b = E(2, 9); return [`${a} × ${b}`, a * b]; },
      () => { const a = E(2, 99); const m = H([10, 100]); return [`${a} × ${m}`, a * m]; },
      () => { const a = E(2, 9), b = E(2, 9); return [`${a * b} : ${a}`, b]; },
      () => { const a = E(120, 990), b = E(1, 9) * 10; return [`${a} + ${b}`, a + b]; }][t % 4]();
    if (r === 3) return [() => { const a = E(3, 9), b = E(3, 9); return [`${a} × ${b}`, a * b]; },
      () => { const a = E(2, 9), b = E(2, 12); return [`${a * b} : ${a}`, b]; },
      () => { const a = E(11, 99) * 10; return [`${a} : 10`, a / 10]; },
      () => { const a = E(1, 9) / 10, b = E(1, 9) / 10; return [`${F(a)} + ${F(b)}`, Math.round((a + b) * 10) / 10]; },
      () => { const a = E(12, 49), b = H([2, 4, 5]); return [`${a} × ${b}`, a * b]; }][t % 5]();
    return [() => { const a = H([25, 50, 125, 250]), b = H([4, 8, 2]); return [`${a} × ${b}`, a * b]; },
      () => { const a = E(11, 99); return [`${a} × 11`, a * 11]; },
      () => { const a = E(1, 99) / 100, b = E(1, 9) / 10; return [`${F(a, 2)} + ${F(b, 1)}`, Math.round((a + b) * 100) / 100]; },
      () => { const a = E(101, 999); return [`${a} : 100`, a / 100]; },
      () => { const a = E(2, 9), b = E(2, 9); return [`${a * b * 10} : ${a}`, b * 10]; },
      () => { const a = E(12, 99), b = E(12, 99); return [`${a} + ${b}`, a + b]; }][t % 6]();
  }
  M.saisie({
    id: 'calcul-eclair', nom: 'Calcul éclair', icone: '⚡', theme: 'calcul', niveaux: ['CP', 'CE1', 'CE2', 'CM1', 'CM2'], manches: 10, chrono: true, virgule: true,
    description: 'Calcul mental chronométré, adapté au niveau (tables, doubles, compléments, décimaux…).',
    generer(k, kit) { const [q, rep] = calcul(kit); return { q: 'Calcule de tête', visuel: q.includes('?') ? q.replace('?', '…') : q + ' = ?', dire: q.replace('×', 'fois').replace('−', 'moins').replace(':', 'divisé par').replace('?', 'combien'), reponse: rep }; }
  });

  /* ---------- 🧮 Problèmes (CE1 → CM2) ---------- */
  const PRENOMS = ['Lucie', 'Pierre', 'Inès', 'Malo', 'Yasmine', 'Hugo', 'Léna', 'Sacha', 'Nina', 'Adam'];
  function probleme(kit) {
    const r = niv(kit), [a1, a2] = M.melanger(PRENOMS), c = E(0, 3);
    if (kit.niveau === 'CP') return [
      () => { const x = E(5, 40), y = E(3, 30); return { q: `${a1} a ${x} billes. On lui en donne ${y}. Combien de billes a maintenant ${a1} ?`, reponse: x + y, unite: 'billes', aide: 'On lui en donne : on ajoute.' }; },
      () => { const x = E(15, 60), y = E(3, x - 5); return { q: `Il y a ${x} oiseaux sur un arbre. ${y} s’envolent. Combien en reste-t-il ?`, reponse: x - y, unite: 'oiseaux', aide: 'Ils s’envolent : il en reste moins, on enlève.' }; },
      () => { const t = E(10, 30), p = E(3, t - 3); return { q: `Dans la classe, il y a ${t} élèves. ${p} sont des filles. Combien y a-t-il de garçons ?`, reponse: t - p, unite: 'garçons', aide: 'Les filles et les garçons font toute la classe : cherche ce qui manque.' }; },
      () => { const n = E(2, 5), k = E(2, 6); return { q: `${n} enfants ont chacun ${k} bonbons. Combien de bonbons en tout ?`, reponse: n * k, unite: 'bonbons', aide: `${n} fois ${k} bonbons : tu peux faire ${Array(n).fill(k).join(' + ')}.` }; },
      () => { const n = H([2, 3, 4, 5]), k = E(2, 6); return { q: `On partage ${n * k} images entre ${n} enfants. Chacun en a autant. Combien d’images pour chacun ?`, reponse: k, unite: 'images', aide: `Distribue une image à chacun, tour par tour, jusqu’à ce qu’il n’en reste plus.` }; },
      () => { const x = E(3, 10), y = E(2, 8), z = E(1, 8); return { q: `${a1} a ${x} cartes. ${a2} lui en donne ${y}, puis ${a1} en perd ${Math.min(z, x + y - 1)}. Combien de cartes a ${a1} à la fin ?`, reponse: x + y - Math.min(z, x + y - 1), unite: 'cartes', aide: 'Fais les étapes dans l’ordre : d’abord ce qu’elle reçoit, puis ce qu’elle perd.' }; }][E(0, 5)]();
    if (r <= 1) return [
      () => { const x = E(100, 300), y = E(12, 99); return { q: `${a1} a ${x} billes. ${a2} en a ${y} de plus. Combien ${a2} a-t-il de billes ?`, reponse: x + y, unite: 'billes', aide: '« De plus » : on ajoute.' }; },
      () => { const x = E(60, 200), y = E(11, 59); return { q: `${a1} avait ${x} images. Elle en donne ${y}. Combien lui en reste-t-il ?`, reponse: x - y, unite: 'images', aide: 'Elle en donne : il lui en reste moins, on soustrait.' }; },
      () => { const x = E(2, 5), y = E(2, 10); return { q: `Il y a ${x} boîtes de ${y} crayons. Combien de crayons en tout ?`, reponse: x * y, unite: 'crayons', aide: `${x} fois ${y} crayons.` }; },
      () => { const p = E(3, 9), n = E(2, 4); return { q: `Un cahier coûte ${p} €. ${a1} en achète ${n}. Combien paie-t-elle ?`, reponse: p * n, unite: '€', aide: `${n} fois ${p} €.` }; }][c]();
    if (r === 2) return [
      () => { const n = E(2, 4), p = E(2, 6), s = E(1, 5), t = n * p + s, b = H([20, 50].filter(v => v > t)); return { q: `${a1} achète ${n} cahiers à ${p} € et un stylo à ${s} €. Elle paie avec un billet de ${b} €. Combien lui rend-on ?`, reponse: b - t, unite: '€', aide: `D’abord le prix total (${n} × ${p} + ${s}), puis ce qu’on rend.` }; },
      () => { const x = E(120, 400), y = E(30, 90), z = E(20, 80); return { q: `Dans un bus, il y a ${x} places. Au premier arrêt, ${y} personnes montent. Au deuxième, ${z} personnes montent encore. Combien de places sont prises ?`, reponse: y + z, unite: 'places', aide: 'On ajoute les personnes qui sont montées.' }; },
      () => { const g = E(3, 6), e = g * E(4, 8); return { q: `${e} élèves forment des équipes de ${g}. Combien d’équipes y a-t-il ?`, reponse: e / g, unite: 'équipes', aide: `Combien de fois ${g} dans ${e} ?` }; },
      () => { const p = E(25, 60), q = E(10, 40); return { q: `Une corde mesure ${p + q} cm. On en coupe ${q} cm. Quelle longueur reste-t-il ?`, reponse: p, unite: 'cm', aide: 'On enlève la partie coupée.' }; }][c]();
    if (r === 3) return [
      () => { const c2 = E(12, 40), f = E(2, 5); return { q: `${a1} achète une trottinette et un casque. La trottinette coûte ${f} fois plus cher que le casque. Le casque coûte ${c2} €. Combien ${a1} doit-il payer ?`, reponse: c2 * f + c2, unite: '€', aide: `Trottinette : ${f} × ${c2} €. N’oublie pas d’ajouter le casque !` }; },
      () => { const n = E(3, 5), p = E(1, 4) + .5, m = n * 2; return { q: `${n} croissants coûtent ${F(n * p, 2)} €. Combien coûtent ${m} croissants ?`, reponse: Math.round(m * p * 100) / 100, unite: '€', aide: `${m} croissants, c’est 2 fois ${n} croissants.` }; },
      () => { const b = E(4, 8), t = b * E(12, 30); return { q: `On partage ${t} billes entre ${b} enfants. Combien de billes chacun reçoit-il ?`, reponse: t / b, unite: 'billes', aide: `On divise ${t} par ${b}.` }; },
      () => { const h = E(13, 16), m = H([0, 10, 15, 20, 30]), d = H([45, 50, 75, 85, 95, 105]), fin = h * 60 + m + d; return { q: `Un film commence à ${h} h ${String(m).padStart(2, '0')} et se termine à ${Math.floor(fin / 60)} h ${String(fin % 60).padStart(2, '0')}. Combien de minutes dure-t-il ?`, reponse: d, unite: 'min', aide: 'Compte jusqu’à l’heure pile suivante, puis ajoute le reste. 1 h = 60 min.' }; }][c]();
    return [
      () => { const p = H([4, 6, 8]), g = H([200, 250, 300]), n = H([2, 3]) * p / 2; return { q: `Pour ${p} personnes, une recette demande ${g} g de farine. Combien de farine faut-il pour ${n} personnes ?`, reponse: g * n / p, unite: 'g', aide: `Cherche d’abord pour 1 personne, ou pour la moitié (${p / 2} personnes).` }; },
      () => { const l = H([4, 5, 6, 10, 12]), A = 60; return { q: `Un rectangle a une aire de ${A} cm². Sa largeur mesure ${l} cm. Combien mesure sa longueur ?`, reponse: A / l, unite: 'cm', aide: `Aire = longueur × largeur. Cherche combien de fois ${l} dans ${A}.` }; },
      () => { const v = E(3, 8) * 10, h = E(2, 4); return { q: `Une voiture roule à ${v} km par heure. Quelle distance parcourt-elle en ${h} heures ?`, reponse: v * h, unite: 'km', aide: `En 1 h : ${v} km. En ${h} h : ${h} fois plus.` }; },
      () => { const pr = E(4, 9) * 10, re = H([10, 20, 25, 50]); return { q: `Un jeu coûte ${pr} €. Il est soldé à −${re} %. Combien coûte-t-il maintenant ?`, reponse: pr - pr * re / 100, unite: '€', aide: `${re} % de ${pr} €, c’est ${F(pr * re / 100, 0)} €. On l’enlève au prix.` }; }][c]();
  }
  M.saisie({
    id: 'problemes', nom: 'Problèmes', icone: '🧮', theme: 'calcul', niveaux: ['CP', 'CE1', 'CE2', 'CM1', 'CM2'], manches: 5, virgule: true,
    description: 'Problèmes à une ou plusieurs étapes, adaptés au niveau (monnaie, partage, proportionnalité…).',
    generer: (k, kit) => { const P = probleme(kit); return { q: 'Lis le problème et trouve la réponse', visuel: P.q, dire: P.q, reponse: P.reponse, unite: P.unite, aide: P.aide }; }
  });

  /* ---------- 🕐 Lire l'heure (CP → CE2) ---------- */
  function horloge(h, m) {
    const ah = ((h % 12) + m / 60) * 30, am = m * 6;
    let nums = ''; for (let i = 1; i <= 12; i++) { const a = (i * 30 - 90) * Math.PI / 180; nums += `<text x="${100 + 72 * Math.cos(a)}" y="${100 + 72 * Math.sin(a) + 7}">${i}</text>`; }
    let traits = ''; for (let i = 0; i < 60; i++) { const a = i * 6 * Math.PI / 180, r1 = i % 5 ? 88 : 84; traits += `<line x1="${100 + r1 * Math.sin(a)}" y1="${100 - r1 * Math.cos(a)}" x2="${100 + 92 * Math.sin(a)}" y2="${100 - 92 * Math.cos(a)}" stroke-width="${i % 5 ? 1 : 2.5}"/>`; }
    return svg('0 0 200 200', `<circle cx="100" cy="100" r="96" fill="#fff" stroke="#3B2F4A" stroke-width="5"/><g stroke="#3B2F4A">${traits}</g>
      <g font-family="Andika,sans-serif" font-size="20" font-weight="700" text-anchor="middle" fill="#3B2F4A">${nums}</g>
      <line x1="100" y1="100" x2="100" y2="48" stroke="#2F7FD8" stroke-width="8" stroke-linecap="round" transform="rotate(${ah} 100 100)"/>
      <line x1="100" y1="100" x2="100" y2="22" stroke="#E8424B" stroke-width="5" stroke-linecap="round" transform="rotate(${am} 100 100)"/>
      <circle cx="100" cy="100" r="7" fill="#3B2F4A"/>`, 'pg-horloge');
  }
  const ecrireHeure = (h, m) => m ? `${h} h ${String(m).padStart(2, '0')}` : `${h} h`;
  M.quiz({
    id: 'heure', nom: 'Lire l’heure', icone: '🕐', theme: 'calcul', niveaux: ['CP', 'CE1', 'CE2', 'CM1'], manches: 6, direReponse: true,
    description: 'Lire l’heure sur une horloge à aiguilles (heures pile, demies, quarts, minutes).',
    questions: kit => Array.from({ length: 12 }, () => {
      const r = niv(kit), h = E(1, 12), m = r === 0 ? 0 : r === 1 ? H([0, 30, 15, 45]) : E(0, 11) * 5;
      const faux = new Set(), bon = ecrireHeure(h, m);
      faux.add(ecrireHeure(m ? (m / 5 || 12) : (h % 12) + 1, m ? (h % 12) * 5 : 0)); // aiguilles inversées
      faux.add(ecrireHeure((h % 12) + 1, m)); faux.add(ecrireHeure(h, (m + 30) % 60)); faux.add(ecrireHeure(h === 1 ? 12 : h - 1, m));
      faux.delete(bon);
      return { q: 'Quelle heure est-il ?', visuel: () => horloge(h, m), options: [bon, ...M.melanger([...faux]).slice(0, 2)],
        explication: `La petite aiguille (bleue) montre les heures, la grande (rouge) les minutes : ${bon}.` };
    })
  });

  /* ---------- 💶 La monnaie (CP, CE1) : payer le prix exact ---------- */
  const PIECES = [[1, 'piece'], [2, 'piece'], [5, 'billet'], [10, 'billet'], [20, 'billet']];
  function monnaie(zone, kit) {
    const max = niv(kit) === 0 ? 20 : 50;
    return kit.partie(zone, {
      manches: 5, rejouer: () => kit.remplacer('La monnaie', z => monnaie(z, kit)),
      jouer(scene, fini, plusTard) {
        const prix = E(3, max), objet = H(['🧸', '📚', '⚽', '🪀', '🎨', '🧩', '🚗', '🖍️']);
        const porte = el('div', { class: 'pg-porte' }), total = el('div', { class: 'pg-total' }, 'Tu as donné : 0 €');
        let fait = false;
        const somme = () => [...porte.children].reduce((s, b) => s + +b.dataset.v, 0);
        const maj = () => { total.textContent = `Tu as donné : ${somme()} €`; };
        const piece = ([v, t]) => { const b = el('button', { class: 'pg-' + t, 'data-v': v }, v + ' €'); b.onclick = () => { if (fait) return; if (b.parentNode === porte) b.remove(); else porte.append(piece([v, t])); kit.sons.clic(); maj(); }; return b; };
        const caisse = el('div', { class: 'pg-caisse' }, PIECES.filter(([v]) => v <= max).map(piece));
        const ok = el('button', { class: 'pp-bouton principal', onclick: () => {
          if (fait) return;
          const s = somme();
          if (s === prix) { fait = true; kit.sons.bravo(); const r = porte.getBoundingClientRect(); kit.confettis(r.left + r.width / 2, r.top + r.height / 2, 40); kit.dire(`Bravo, tu as payé ${prix} euros !`); fini(); }
          else { kit.sons.rate(); kit.dire(s < prix ? `Il manque ${prix - s} euros.` : `C’est trop : tu as donné ${s - prix} euros de trop.`); }
        } }, '✔ Payer');
        scene.append(M.consigne(kit, `Paie exactement ${prix} €`),
          el('div', { class: 'mo-centre' }, el('div', { class: 'pg-etiquette' }, objet, el('span', {}, prix + ' €')),
            el('div', { style: 'opacity:.65' }, 'Touche les pièces et les billets pour payer'), caisse, porte, total, ok));
        plusTard(() => kit.dire(`Ça coûte ${prix} euros. Paie le prix exact.`), 300);
      }
    });
  }
  PetitsPas.ajouter({ id: 'monnaie', nom: 'La monnaie', icone: '💶', theme: 'calcul', niveaux: ['CP', 'CE1'], auteur: 'Petits Pas',
    description: 'Payer le prix exact avec des pièces et des billets.', lancer: monnaie });

  /* ---------- ➗ Fractions égales et sommes de fractions (CE2, CM1) ---------- */
  M.saisie({
    id: 'fractions-egales', nom: 'Fractions égales', icone: '🟰', theme: 'calcul', niveaux: ['CE2', 'CM1'], manches: 8,
    description: 'Trouver une fraction égale ; additionner des fractions de même dénominateur.',
    generer(k, kit) {
      const frac = (a, b, cls = '') => el('span', { class: 'pg-frac ' + cls }, el('span', {}, String(a)), el('span', {}, String(b)));
      if (k % 2 === 0) {
        const b = H([2, 3, 4, 5]), a = E(1, b - 1), f = H([2, 3, 4, 5]);
        return { q: 'Complète pour que les fractions soient égales', reponse: a * f, aide: `On a multiplié le bas par ${f} : fais pareil en haut.`, apres: `${a}/${b} = ${a * f}/${b * f}`,
          visuel: () => el('div', { class: 'pg-ligne' }, frac(a, b), ' = ', frac('?', b * f)) };
      }
      const d = H([4, 5, 6, 8, 10]), a = E(1, d - 2), c = E(1, d - a - 1), plus = niv(kit) >= 3 || Math.random() < .5;
      return plus ? { q: 'Calcule (même dénominateur)', reponse: a + c, aide: 'Quand le bas est le même, on additionne seulement les nombres du haut.', apres: `${a}/${d} + ${c}/${d} = ${a + c}/${d}`, visuel: () => el('div', { class: 'pg-ligne' }, frac(a, d), ' + ', frac(c, d), ' = ', frac('?', d)) }
        : { q: 'Calcule (même dénominateur)', reponse: a, aide: 'Quand le bas est le même, on soustrait seulement les nombres du haut.', apres: `${a + c}/${d} − ${c}/${d} = ${a}/${d}`, visuel: () => el('div', { class: 'pg-ligne' }, frac(a + c, d), ' − ', frac(c, d), ' = ', frac('?', d)) };
    }
  });

  /* ---------- 🔢 Comparer les nombres (CE2 → CM2, décimaux) ---------- */
  M.quiz({
    id: 'comparer-nombres', nom: 'Le plus grand nombre', icone: '🔢', theme: 'calcul', niveaux: ['CP', 'CE1', 'CE2', 'CM1', 'CM2'], manches: 6,
    description: 'Comparer des nombres entiers et décimaux.',
    questions: kit => Array.from({ length: 10 }, () => {
      const r = niv(kit); let nb;
      if (r <= 1) { const max = r === 0 ? (kit.periode <= 2 ? 59 : 100) : 1000, a = E(10, max - 1), d = String(a).split('').reverse().join(''); nb = [a, Number(d) === a ? a + 10 : Number(d), Math.max(1, a + H([-1, 1, -10, 10]))].map(x => Math.min(max, x)); }
      else if (r <= 2) { const base = E(1000, 9000); nb = [base, base + H([10, 100, -90, 9]), Number(String(base).split('').reverse().join(''))]; }
      else if (r === 3) { const e = E(1, 9), a = E(1, 9); nb = [e + a / 10, e + E(10, 99) / 100, e + (a - 1 >= 0 ? (a - 1) : 0) / 10 + E(1, 9) / 100]; }
      else { const e = E(1, 9), a = E(1, 9); nb = [e + a / 10, e + E(100, 999) / 1000, e + E(10, 99) / 100]; }
      nb = [...new Set(nb.map(x => Math.round(x * 1000) / 1000))]; while (nb.length < 3) nb.push(nb[0] + 1);
      const max = Math.max(...nb), dec = r >= 4 ? 3 : r === 3 ? 2 : 0;
      return { q: 'Quel est le plus grand nombre ?', options: [F(max, 0), ...nb.filter(x => x !== max).map(x => F(x, 0))],
        explication: r >= 3 ? 'Compare d’abord la partie entière, puis les dixièmes, puis les centièmes… (0,5 est plus grand que 0,25).' : r <= 1 ? 'Compare d’abord les dizaines, puis les unités.' : 'Compare d’abord les milliers, puis les centaines…' };
    })
  });

  /* ---------- 📏 Les longueurs (CE2, CM1) ---------- */
  M.saisie({
    id: 'longueurs', nom: 'Les longueurs', icone: '📏', theme: 'calcul', niveaux: ['CE2', 'CM1', 'CM2'], manches: 8, virgule: true,
    description: 'Convertir mm, cm, dm, m, km.',
    generer(k, kit) {
      const avance = niv(kit) >= 3;
      const C = [['m', 'cm', 100], ['cm', 'mm', 10], ['km', 'm', 1000], ['m', 'dm', 10], ['dm', 'cm', 10], ['m', 'mm', 1000]];
      const [g, p, f] = H(C), versPetit = !avance || Math.random() < .5;
      if (versPetit) { const x = avance && Math.random() < .4 ? E(11, 99) / 10 : E(2, 9); return { q: `Convertis en ${p}`, visuel: `${F(x, 0)} ${g} = ? ${p}`, reponse: Math.round(x * f * 100) / 100, unite: p, aide: `1 ${g} = ${f} ${p}.` }; }
      const y = E(2, 9) * f + (Math.random() < .5 ? E(1, f - 1) : 0);
      return { q: `Convertis en ${g}`, visuel: `${F(y)} ${p} = ? ${g}`, reponse: y / f, unite: g, aide: `${f} ${p} = 1 ${g}. On divise par ${f}.` };
    }
  });

  /* ---------- 🧊 Les solides (CP → CE2) ---------- */
  const SOLIDES = {
    'le cube': '<polygon points="40,70 110,70 110,140 40,140" fill="#4DA3FF"/><polygon points="40,70 70,45 140,45 110,70" fill="#9FD0FF"/><polygon points="110,70 140,45 140,115 110,140" fill="#2F7FD8"/>',
    'la boule': '<circle cx="90" cy="90" r="55" fill="#FF8FC7"/><ellipse cx="72" cy="70" rx="16" ry="10" fill="#fff" opacity=".6"/>',
    'la pyramide': '<polygon points="90,30 40,140 110,150" fill="#FFD93B"/><polygon points="90,30 110,150 150,125" fill="#E0B620"/>',
    'le cylindre': '<rect x="50" y="50" width="80" height="90" fill="#5CC95C"/><ellipse cx="90" cy="140" rx="40" ry="12" fill="#5CC95C"/><ellipse cx="90" cy="50" rx="40" ry="12" fill="#A6E6A6"/>',
    'le pavé droit': '<polygon points="30,80 120,80 120,140 30,140" fill="#FF9F40"/><polygon points="30,80 55,60 145,60 120,80" fill="#FFC78A"/><polygon points="120,80 145,60 145,120 120,140" fill="#D9792A"/>',
    'le cône': '<polygon points="90,30 50,140 130,140" fill="#9B6BFF"/><ellipse cx="90" cy="140" rx="40" ry="12" fill="#7A4FE0"/>'
  };
  M.quiz({
    id: 'solides', nom: 'Les solides', icone: '🧊', theme: 'calcul', niveaux: ['CP', 'CE1', 'CE2'], manches: 6,
    description: 'Reconnaître le cube, la boule, la pyramide, le cylindre, le pavé, le cône.',
    questions: kit => {
      const noms = niv(kit) === 0 ? ['le cube', 'la boule', 'la pyramide', 'le pavé droit'] : Object.keys(SOLIDES);
      return noms.flatMap(n => [0, 1].map(() => { const o = [n, ...M.melanger(noms.filter(x => x !== n)).slice(0, 3)];
        return { q: 'Touche ' + n, options: o.map(x => e => svg('0 0 180 180', `<g stroke="#3B2F4A" stroke-width="3" stroke-linejoin="round">${SOLIDES[x]}</g>`, 'pg-solide')), explication: `Voici ${n}.` }; }));
    }
  });

  /* ---------- 📐 Les droites (CM1) : perpendiculaires, parallèles ---------- */
  M.quiz({
    id: 'droites', nom: 'Perpendiculaires ou parallèles ?', icone: '📐', theme: 'calcul', niveaux: ['CM1', 'CM2'], manches: 6,
    description: 'Reconnaître des droites perpendiculaires et parallèles.',
    questions: () => Array.from({ length: 12 }, () => {
      const t = E(0, 2), a = E(-60, 60), b = t === 0 ? a + 90 : t === 1 ? a : a + H([35, 55, -40, 120]);
      const ligne = (ang, dx, dy) => `<line x1="-120" y1="0" x2="120" y2="0" transform="translate(${100 + dx} ${80 + dy}) rotate(${ang})"/>`;
      const d = t === 1 ? [E(20, 35), -E(20, 35)] : [0, 0];
      return { q: 'Ces deux droites sont…', garderOrdre: true, bon: t,
        visuel: () => svg('0 0 200 160', `<g stroke-width="5" stroke-linecap="round"><g stroke="#E8424B">${ligne(a, 0, d[0])}</g><g stroke="#2F7FD8">${ligne(b, 0, d[1])}</g></g>`, 'pg-droites'),
        options: ['perpendiculaires', 'parallèles', 'ni l’un ni l’autre'],
        explication: ['Elles se coupent en formant un angle droit : elles sont perpendiculaires.', 'Elles ne se coupent jamais et gardent le même écart : elles sont parallèles.', 'Elles se coupent, mais pas en angle droit.'][t] };
    })
  });

  /* ---------- ⬛ L'aire (CM2) ---------- */
  M.saisie({
    id: 'aire', nom: 'L’aire', icone: '⬛', theme: 'calcul', niveaux: ['CM1', 'CM2'], manches: 6,
    description: 'Calculer l’aire d’un carré ou d’un rectangle.',
    generer(k) {
      const l = E(2, 9), L = k % 3 === 0 ? l : E(2, 12);
      if (k < 3) return { q: 'Quelle est l’aire de ce rectangle ? (1 carreau = 1 cm²)', reponse: l * L, unite: 'cm²', aide: `${L} carreaux par ligne, ${l} lignes : ${L} × ${l}.`,
        visuel: () => { let s = ''; for (let j = 0; j < l; j++) for (let i = 0; i < L; i++) s += `<rect x="${i * 20}" y="${j * 20}" width="20" height="20"/>`; return svg(`-4 -4 ${L * 20 + 8} ${l * 20 + 8}`, `<g fill="#9FD0FF" stroke="#2F7FD8" stroke-width="1.5">${s}</g>`, 'pg-grille'); } };
      return { q: L === l ? 'Quelle est l’aire de ce carré ?' : 'Quelle est l’aire de ce rectangle ?', reponse: l * L, unite: 'cm²',
        visuel: L === l ? `Un carré de côté ${l} cm` : `Un rectangle de longueur ${L} cm et de largeur ${l} cm`, aide: 'Aire du rectangle = longueur × largeur.' };
    }
  });

  /* ---------- 🦋 La symétrie (CM2) ---------- */
  function figureSym() {
    const cells = new Set(['2,2']);
    while (cells.size < E(4, 6)) { const [c, r] = H([...cells]).split(',').map(Number), [dc, dr] = H([[1, 0], [-1, 0], [0, 1], [0, -1]]); const nc = c + dc, nr = r + dr; if (nc >= 0 && nc <= 2 && nr >= 0 && nr <= 4) cells.add(nc + ',' + nr); }
    return [...cells].map(s => s.split(',').map(Number));
  }
  function grilleSym(gauche, droite) {
    let s = ''; for (let j = 0; j < 5; j++) for (let i = 0; i < 6; i++) s += `<rect x="${i * 20}" y="${j * 20}" width="20" height="20" fill="none" stroke="#DDD2C2"/>`;
    gauche.forEach(([c, r]) => s += `<rect x="${c * 20}" y="${r * 20}" width="20" height="20" fill="#4DA3FF"/>`);
    droite.forEach(([c, r]) => s += `<rect x="${c * 20}" y="${r * 20}" width="20" height="20" fill="#FF9F40"/>`);
    return svg('-3 -3 126 106', s + '<line x1="60" y1="-3" x2="60" y2="103" stroke="#E8424B" stroke-width="3" stroke-dasharray="6 4"/>', 'pg-sym');
  }
  M.quiz({
    id: 'symetrie', nom: 'La symétrie', icone: '🦋', theme: 'calcul', niveaux: ['CM1', 'CM2'], manches: 5,
    description: 'Trouver la figure symétrique par rapport à un axe.',
    questions: () => Array.from({ length: 8 }, () => {
      const g = figureSym(), miroir = g.map(([c, r]) => [5 - c, r]), translat = g.map(([c, r]) => [c + 3, r]);
      const abime = miroir.map(x => x.slice()); const k = E(0, abime.length - 1); abime[k][1] = abime[k][1] < 4 ? abime[k][1] + 1 : abime[k][1] - 1;
      const cle = t => t.map(x => x.join()).sort().join(';');
      const opts = [miroir, translat, abime].filter((t, i, a) => a.findIndex(u => cle(u) === cle(t)) === i);
      return { q: 'Quelle figure orange est le symétrique de la bleue par rapport à l’axe rouge ?', options: opts.map(d => () => grilleSym(g, d)),
        explication: 'Comme dans un miroir : chaque carreau est à la même distance de l’axe, de l’autre côté. On peut vérifier en pliant la feuille sur l’axe.' };
    })
  });

  document.head.append(el('style', {}, `
    .pg-base10{display:flex;gap:18px;align-items:flex-end;justify-content:center}
    .pg-barres{display:flex;gap:6px}.pg-barre{width:16px;height:160px;background:repeating-linear-gradient(#4DA3FF 0 14px,#2F7FD8 14px 16px);border-radius:3px}
    .pg-cubes{display:grid;grid-template-columns:repeat(3,16px);gap:4px}.pg-cube{width:16px;height:16px;background:#FF9F40;border-radius:3px}
    .pg-horloge{width:min(240px,46vw);height:auto}
    .pg-porte{min-width:min(420px,86vw);min-height:80px;border:4px dashed #CDBFAF;border-radius:24px;background:#fff;display:flex;flex-wrap:wrap;gap:8px;align-items:center;justify-content:center;padding:8px}
    .pg-caisse{display:flex;gap:10px;flex-wrap:wrap;justify-content:center}
    .pg-piece{width:70px;height:70px;border-radius:50%;border:5px solid #C9A227;background:radial-gradient(#FFE58A,#E6C24C);font:700 20px Fredoka,sans-serif;box-shadow:0 4px 0 #A8871F}
    .pg-billet{width:104px;height:60px;border-radius:8px;border:3px solid #3B2F4A;font:700 22px Fredoka,sans-serif;box-shadow:0 4px 0 var(--ombre)}
    .pg-billet[data-v="5"]{background:#C9C9C9}.pg-billet[data-v="10"]{background:#F2A7A7}.pg-billet[data-v="20"]{background:#9FC5F2}
    .pg-total{font:700 22px Fredoka,sans-serif}
    .pg-etiquette{display:flex;align-items:center;gap:14px;font-size:70px;background:#fff;border-radius:24px;padding:8px 22px;box-shadow:0 6px 0 var(--ombre)}
    .pg-etiquette span{font:700 40px Fredoka,sans-serif;background:#FFD93B;border-radius:12px;padding:4px 14px}
    .pg-ligne{display:flex;align-items:center;gap:14px;font:700 44px Fredoka,sans-serif}
    .pg-frac{display:inline-flex;flex-direction:column;align-items:center;font:700 44px/1.1 Andika,sans-serif}
    .pg-frac span:first-child{border-bottom:5px solid #3B2F4A;padding:0 8px}
    .pg-solide{width:clamp(90px,15vw,130px);height:clamp(90px,15vw,130px)}
    .pg-droites{width:min(300px,60vw);height:auto;background:#fff;border-radius:20px}
    .pg-grille{width:min(360px,70vw);height:auto;max-height:36vh}
    .pg-sym{width:clamp(130px,22vw,190px);height:auto}
  `));
})();
