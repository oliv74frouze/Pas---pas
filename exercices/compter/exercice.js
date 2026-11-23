/* Exercice : compter de 1 à 5 objets et toucher le bon chiffre.
   On peut toucher les objets pour les compter à voix haute. */
(function () {
  'use strict';

  // Le style propre à cet exercice reste dans son dossier
  const CSS = `
  .cpt-boite{flex:1;min-height:0;display:flex;flex-wrap:wrap;align-content:center;justify-content:center;gap:clamp(10px,3vw,34px);padding:16px}
  .cpt-objet{font-size:clamp(70px,13vw,130px);line-height:1;transition:transform .2s;animation:pp-pop .5s backwards;cursor:pointer}
  .cpt-boite.nombreux .cpt-objet{font-size:clamp(52px,8vw,84px)}
  .cpt-objet.on{transform:scale(1.2);filter:drop-shadow(0 0 12px #FFD93B)}
  .cpt-chiffre{width:clamp(90px,15vw,130px);height:clamp(90px,15vw,130px);border-radius:30px;border:none;background:#fff;box-shadow:0 6px 0 var(--ombre);font:700 clamp(48px,8vw,70px) Andika,sans-serif}
  .cpt-chiffre.ok{background:#5CC95C;color:#fff}
  .cpt-chiffre.non{animation:pp-secoue .4s;opacity:.35}
  .cpt-points{display:flex;justify-content:center;gap:10px;font-size:34px;padding-top:6px}`;

  const OBJETS = [['🍎', 'pommes'], ['🐟', 'poissons'], ['⭐', 'étoiles'], ['🐞', 'coccinelles'], ['🌸', 'fleurs'], ['🐣', 'poussins'], ['🍓', 'fraises'], ['🚗', 'voitures']];
  const NOMBRES = ['zéro', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf', 'dix'];
  const MANCHES = 5;

  function compter(zone, kit) {
    if (!document.getElementById('cpt-css')) document.head.append(kit.el('style', { id: 'cpt-css' }, CSS));
    const el = kit.el, points = el('div', { class: 'cpt-points' }), boite = el('div', { class: 'cpt-boite' }), reponses = el('div', { class: 'barre' });
    zone.append(el('div', { class: 'ecran' }, points, boite, reponses));
    // PS : jusqu'à 4 (fiche PS) · MS : 6 · GS et plus : 10 (fiche GS)
    const MAX = { PS: 4, MS: 6 }[kit.niveau] || (kit.niveau ? 10 : 5);
    let manche = 0, precedent = 0;
    const minuteurs = [];
    const plusTard = (f, ms) => minuteurs.push(setTimeout(f, ms));

    function suivante() {
      points.textContent = '⭐'.repeat(manche) + '⚪'.repeat(MANCHES - manche);
      if (manche === MANCHES) {
        kit.feuxDArtifice(); plusTard(() => kit.dire('Bravo ! Tu sais compter !'), 600);
        plusTard(() => kit.felicitations(null, { encore: () => kit.remplacer('Compte !', z => compter(z, kit)) }), 2000);
        return;
      }
      let n; do { n = 1 + Math.random() * MAX | 0; } while (n === precedent); precedent = n;
      const [objet, nom] = OBJETS[Math.random() * OBJETS.length | 0];
      boite.innerHTML = ''; boite.classList.toggle('nombreux', n > 6); let comptes = 0;
      for (let q = 0; q < n; q++) {
        const s = el('span', { class: 'cpt-objet', style: `animation-delay:${q * .12}s` }, objet);
        s.onclick = () => { if (s.classList.contains('on')) return; s.classList.add('on'); comptes++; kit.sons.pop(comptes); kit.dire(NOMBRES[comptes]); };
        boite.append(s);
      }
      const choix = new Set([n]); while (choix.size < 3) choix.add(1 + Math.random() * MAX | 0);
      reponses.innerHTML = '';
      [...choix].sort(() => Math.random() - .5).forEach(v => {
        const b = el('button', { class: 'cpt-chiffre' }, String(v));
        b.onclick = () => {
          if (v === n) {
            b.classList.add('ok'); kit.sons.bravo(); kit.dire(NOMBRES[n] + ' ! Bravo !');
            const r = b.getBoundingClientRect(); kit.confettis(r.left + r.width / 2, r.top + r.height / 2, 40);
            manche++; reponses.querySelectorAll('button').forEach(x => x.disabled = true); plusTard(suivante, 1500);
          } else { b.classList.add('non'); b.disabled = true; kit.sons.rate(); }
        };
        reponses.append(b);
      });
      plusTard(() => kit.dire(`Combien de ${nom} ?`), 400);
    }
    suivante();
    // Appelé quand on quitte l'écran : on arrête les minuteurs en cours
    return () => minuteurs.forEach(clearTimeout);
  }

  PetitsPas.ajouter({
    id: 'compter', nom: 'Compte !', icone: '🍎', theme: 'calcul', niveaux: ['PS', 'MS', 'GS'],
    auteur: 'Petits Pas', description: 'Compter des objets (jusqu’à 4 en PS, 6 en MS, 10 en GS).',
    lancer: compter
  });
})();
