/* Exercice : quelle fraction est coloriée ? (CM1–CM2)
   Les formes sont dessinées par le programme : disque, polygone,
   quadrillage, bandes, triangle découpé. L'élève tape le numérateur
   et le dénominateur sur un pavé numérique.
   Une fraction égale est acceptée (2/4 pour 1/2), avec un mot d'explication. */
(function () {
  'use strict';
  const NS = 'http://www.w3.org/2000/svg';
  const pgcd = (a, b) => b ? pgcd(b, a % b) : a;
  const hasard = (a, b) => a + Math.random() * (b - a + 1) | 0;

  /* ---------- formes : chacune renvoie une liste de « parts » (points) ---------- */
  const C = 100, R = 88; // centre et rayon dans un carré 200 × 200
  const pt = (a, r = R) => [C + r * Math.cos(a), C + r * Math.sin(a)];
  const FORMES = [
    function disque() {
      const n = [2, 3, 4, 5, 6, 8, 10, 12, 16][hasard(0, 8)], parts = [];
      for (let i = 0; i < n; i++) {
        const a0 = -Math.PI / 2 + i * 2 * Math.PI / n, a1 = a0 + 2 * Math.PI / n, [x0, y0] = pt(a0), [x1, y1] = pt(a1);
        parts.push(`M${C} ${C}L${x0} ${y0}A${R} ${R} 0 0 1 ${x1} ${y1}Z`);
      }
      return parts;
    },
    function polygone() {
      const m = [5, 6, 8][hasard(0, 2)], double = Math.random() < .4, parts = [];
      const sommets = Array.from({ length: m }, (_, i) => pt(-Math.PI / 2 + i * 2 * Math.PI / m));
      for (let i = 0; i < m; i++) {
        const a = sommets[i], b = sommets[(i + 1) % m];
        if (!double) parts.push(`M${C} ${C}L${a}L${b}Z`);
        else { const mi = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]; parts.push(`M${C} ${C}L${a}L${mi}Z`, `M${C} ${C}L${mi}L${b}Z`); }
      }
      return parts;
    },
    function quadrillage() {
      const c = hasard(2, 6), r = hasard(2, 4), w = 180 / c, h = 120 / r, parts = [];
      for (let j = 0; j < r; j++) for (let i = 0; i < c; i++) parts.push(`M${10 + i * w} ${40 + j * h}h${w}v${h}h${-w}Z`);
      return parts;
    },
    function bandes() {
      const n = hasard(2, 8), w = 180 / n, parts = [];
      for (let i = 0; i < n; i++) parts.push(`M${10 + i * w} 40h${w}v120h${-w}Z`);
      return parts;
    },
    function triangle() {
      const n = hasard(2, 3), cote = 184, H = cote * Math.sqrt(3) / 2, top = 100 - H / 2, w = cote / n, h = H / n, parts = [];
      for (let i = 0; i < n; i++) {
        const yh = top + i * h, yb = yh + h, haut = j => [C - i * w / 2 + j * w, yh], bas = j => [C - (i + 1) * w / 2 + j * w, yb];
        for (let j = 0; j <= i; j++) parts.push(`M${haut(j)}L${bas(j)}L${bas(j + 1)}Z`);
        for (let j = 0; j < i; j++) parts.push(`M${haut(j)}L${haut(j + 1)}L${bas(j + 1)}Z`);
      }
      return parts;
    }
  ];

  const CSS = `
  .fr-zone{flex:1;min-height:0;display:flex;align-items:center;justify-content:center;gap:clamp(16px,4vw,50px);flex-wrap:wrap;padding:8px 16px}
  .fr-forme{width:clamp(200px,34vw,330px);aspect-ratio:1;background:#fff;border-radius:28px;box-shadow:0 6px 0 var(--ombre);padding:10px}
  .fr-forme path{stroke:#3B2F4A;stroke-width:2;stroke-linejoin:round;fill:#fff}
  .fr-forme path.colore{fill:#7FB8FF}
  .fr-reponse{display:flex;flex-direction:column;align-items:center;gap:12px}
  .fr-fraction{display:flex;flex-direction:column;align-items:center;gap:6px}
  .fr-case{width:110px;height:84px;border:4px solid var(--ombre);border-radius:20px;background:#fff;font:700 52px/1 Andika,sans-serif;display:flex;align-items:center;justify-content:center}
  .fr-case.active{border-color:#FFB020;background:#FFF7E0}
  .fr-barre{width:130px;height:6px;border-radius:3px;background:#3B2F4A}
  .fr-pave{display:grid;grid-template-columns:repeat(3,64px);gap:8px}
  .fr-pave button{height:58px;border:none;border-radius:16px;background:#fff;box-shadow:0 4px 0 var(--ombre);font:700 26px Fredoka,sans-serif}
  .fr-pave button:active{transform:translateY(3px);box-shadow:0 1px 0 var(--ombre)}`;

  function jouerPartie(zone, kit) {
    if (!document.getElementById('fr-css')) document.head.append(kit.el('style', { id: 'fr-css' }, CSS));
    return kit.partie(zone, {
      manches: 8, rejouer: () => kit.remplacer('Les fractions', z => jouerPartie(z, kit)),
      jouer(scene, fini, plusTard, numero) {
        const el = kit.el;
        const parts = FORMES[hasard(0, FORMES.length - 1)]();
        const d = parts.length, n = hasard(1, d - 1);
        const colorees = new Set([...Array(d).keys()].sort(() => Math.random() - .5).slice(0, n));
        const svg = document.createElementNS(NS, 'svg'); svg.setAttribute('viewBox', '0 0 200 200'); svg.setAttribute('class', 'fr-forme');
        parts.forEach((dd, i) => { const p = document.createElementNS(NS, 'path'); p.setAttribute('d', dd); if (colorees.has(i)) p.setAttribute('class', 'colore'); svg.append(p); });

        let haut = '', bas = '', cible = 'haut', fait = false, essais = 0;
        const cHaut = el('div', { class: 'fr-case active' }), cBas = el('div', { class: 'fr-case' });
        const maj = () => { cHaut.textContent = haut; cBas.textContent = bas; cHaut.classList.toggle('active', cible === 'haut'); cBas.classList.toggle('active', cible === 'bas'); };
        cHaut.onclick = () => { cible = 'haut'; maj(); }; cBas.onclick = () => { cible = 'bas'; maj(); };
        const aide = el('div');
        const touche = t => el('button', { onclick: () => {
          if (fait) return;
          if (t === '⌫') { if (cible === 'bas' && !bas) cible = 'haut'; else if (cible === 'bas') bas = bas.slice(0, -1); else haut = haut.slice(0, -1); }
          else if (t === '⇩') cible = 'bas';
          else if (cible === 'haut') { haut += t; if (haut.length >= 2) cible = 'bas'; }
          else if (bas.length < 2) bas += t;
          maj();
        } }, t);
        const valider = el('button', { class: 'pp-bouton principal', onclick: () => verifier() }, 'Vérifier');
        function verifier() {
          if (fait) return;
          const a = +haut, b = +bas;
          if (!haut) { cible = 'haut'; maj(); return; }
          if (!bas) { cible = 'bas'; maj(); return; }
          if (b && a * d === n * b) {
            fait = true; kit.sons.bravo();
            const r = svg.getBoundingClientRect(); kit.confettis(r.left + r.width / 2, r.top + r.height / 2, 45);
            const g = pgcd(n, d);
            aide.replaceChildren(el('div', { class: 'pp-aide ok' }, a === n && b === d
              ? `✔ Bravo ! ${n} part${n > 1 ? 's' : ''} coloriée${n > 1 ? 's' : ''} sur ${d} : ${n}/${d}` + (g > 1 ? ` (c’est aussi ${n / g}/${d / g})` : '')
              : `✔ Bravo ! ${a}/${b} est égal à ${n}/${d}.`));
            kit.dire(`${n} sur ${d}`); fini(); return;
          }
          essais++; kit.sons.rate();
          valider.classList.remove('non'); void valider.offsetWidth; valider.classList.add('non');
          let conseil;
          if (a === d && b === n) conseil = '💡 C’est à l’envers ! En haut : le nombre de parts coloriées. En bas : le nombre total de parts.';
          else if (b !== d) conseil = '💡 Compte d’abord toutes les parts de la figure : c’est le nombre du bas (le dénominateur).';
          else conseil = '💡 Compte les parts coloriées en bleu : c’est le nombre du haut (le numérateur).';
          if (essais >= 3) conseil = `La réponse était ${n}/${d} : ${n} part${n > 1 ? 's' : ''} coloriée${n > 1 ? 's' : ''} sur ${d} parts en tout.`;
          aide.replaceChildren(el('div', { class: 'pp-aide' }, conseil));
          if (essais >= 3) { fait = true; haut = String(n); bas = String(d); maj(); plusTard(fini, 1500); }
        }
        maj();
        scene.append(
          el('div', { class: 'pp-consigne' }, 'Quelle fraction de la figure est coloriée ?'),
          el('div', { style: 'text-align:center;opacity:.65;font-size:16px' }, 'Touche une case pour la remplir · ⇩ pour passer en bas'),
          el('div', { class: 'fr-zone' }, svg, el('div', { class: 'fr-reponse' },
            el('div', { class: 'fr-fraction' }, cHaut, el('div', { class: 'fr-barre' }), cBas),
            el('div', { class: 'fr-pave' }, ['7', '8', '9', '4', '5', '6', '1', '2', '3', '⌫', '0', '⇩'].map(touche)),
            valider)),
          aide);
      }
    });
  }

  PetitsPas.ajouter({
    id: 'fractions', nom: 'Les fractions', icone: '🍕', theme: 'calcul', niveaux: ['CM1', 'CM2'],
    auteur: 'Petits Pas', description: 'Écrire la fraction qui correspond à la partie coloriée.',
    lancer: jouerPartie
  });
})();
