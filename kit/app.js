/* =====================================================================
   PETITS PAS — l'application (profils, menus, navigation)
   ---------------------------------------------------------------------
   Construit les menus à partir des exercices inscrits avec
   PetitsPas.ajouter(...), puis lance l'exercice choisi en lui donnant
   une zone d'écran et un objet `kit`. Rien à modifier ici pour
   ajouter un exercice.
   ===================================================================== */
(function () {
  'use strict';
  const P = window.PetitsPas, el = P.el, $ = s => document.querySelector(s);

  /* ---------- navigation (pile d'écrans) ---------- */
  const pile = [];
  let nettoyage = null, surRedim = null, rT;
  addEventListener('resize', () => { clearTimeout(rT); rT = setTimeout(() => surRedim && surRedim(), 250); });

  function afficher() {
    if (nettoyage) { try { nettoyage(); } catch (e) { console.error(e); } }
    nettoyage = null; surRedim = null; P.silence();
    const haut = pile[pile.length - 1];
    $('#titre').textContent = haut.titre;
    $('#retour').classList.toggle('cache', pile.length < 2);
    const main = $('main'); main.innerHTML = '';
    const zone = el('div', { class: 'zone' }); main.append(zone);
    try {
      const r = haut.rendu(zone);
      if (typeof r === 'function') nettoyage = r;
    } catch (e) {
      console.error(e);
      zone.innerHTML = '';
      zone.append(el('div', { class: 'oups' }, el('div', { class: 'em' }, '🙈'), 'Oups, cet exercice a un petit souci.', el('small', {}, String(e && e.message || e))));
    }
  }
  const ouvrir = (titre, rendu) => { pile.push({ titre, rendu }); afficher(); };
  const remplacer = (titre, rendu) => { pile[pile.length - 1] = { titre, rendu }; afficher(); };
  const retour = () => { if (pile.length > 1) { pile.pop(); afficher(); } };
  P.retourAuxProfils = () => { pile.length = 1; afficher(); };
  $('#retour').onclick = retour;
  $('#reglages').onclick = () => P.portailParent(espaceParents);

  /* ---------- le kit remis à chaque exercice ---------- */
  function kitPour(ex) {
    const pid = P.profils.actif ? P.profils.actif.id : 'invite';
    const cle = k => 'progres.' + pid + '.' + ex.id + '.' + k;
    const prenom = P.profils.actif ? P.profils.actif.prenom : '';
    const kit = {
      /**
       * Déroulé « en manches » prêt à l'emploi : étoiles ⭐⚪ en haut, une
       * manche après l'autre, grand final et écran Bravo à la fin.
       * jouer(scene, fini, plusTard, numero) dessine une manche dans `scene`
       * et appelle fini() quand elle est réussie.
       */
      partie(zone, { manches, jouer, rejouer, pause = 1900 }) {
        const points = el('div', { class: 'pp-points' }), scene = el('div', { class: 'ecran' });
        zone.append(el('div', { class: 'ecran' }, points, scene));
        let n = 0; const minuteurs = [];
        const plusTard = (f, ms) => minuteurs.push(setTimeout(f, ms));
        function suivante() {
          points.textContent = '⭐'.repeat(n) + '⚪'.repeat(manches - n); scene.innerHTML = '';
          if (n === manches) {
            kit.feuxDArtifice(); kit.progres.ecrire('parties', kit.progres.lire('parties', 0) + 1);
            plusTard(() => kit.dire(prenom ? `Bravo ${prenom} !` : 'Bravo !'), 600);
            plusTard(() => kit.felicitations(null, { encore: rejouer }), 2000);
            return;
          }
          jouer(scene, () => { n++; plusTard(suivante, pause); }, plusTard, n);
        }
        suivante();
        return () => minuteurs.forEach(clearTimeout);
      }
    };
    return Object.assign(kit, {
      // outils
      el, couleurs: P.COULEURS, arcEnCiel: P.ARCENCIEL, encre: P.ENCRE,
      sons: P.sons, dire: P.dire, confettis: P.confettis, feuxDArtifice: P.feuxDArtifice,
      preparerToile: P.preparerToile,
      // l'enfant qui joue (prénom vide en mode invité)
      prenom, niveau: P.profils.actif ? P.profils.actif.niveau : null,
      // navigation
      ouvrir, remplacer, retour,
      titre: t => { $('#titre').textContent = t; pile[pile.length - 1].titre = t; },
      // réglages parents (lecture seule)
      difficulte: () => P.DIFFICULTES[P.reglages.niveau],
      indices: () => P.reglages.indices,
      // progrès, rangés à part pour chaque enfant et chaque exercice
      progres: { lire: (k, d) => P.store.get(cle(k), d), ecrire: (k, v) => P.store.set(cle(k), v) },
      // à appeler quand l'écran change de taille (rotation de la tablette…)
      surRedimension: fn => { surRedim = fn; },
      // écran « Bravo ! » avec boutons Encore / Menu
      felicitations(message, { encore } = {}) {
        message = message || (prenom ? `Bravo ${prenom} ! 🎉` : 'Bravo ! 🎉');
        const boutons = [];
        if (encore) boutons.push(['🔁 Encore', encore]);
        boutons.push(['🏠 Menu', retour]);
        const w = el('div', { class: 'voile' },
          el('div', { class: 'grand' }, message),
          el('div', { class: 'rang' }, boutons.map(([l, f]) => el('button', { class: 'carte', onclick: () => { w.remove(); f(); } }, l))));
        $('main').append(w);
      }
    });
  }

  /* ---------- écrans ---------- */
  const exosPour = niveau => P.exercices.filter(e => e.niveaux.includes(niveau));
  const niveau = id => P.NIVEAUX.find(n => n.id === id) || P.NIVEAUX[0];

  // 1. Qui joue ?
  function quiJoue(zone) {
    P.profils.quitter();
    const profils = P.profils.liste();
    if (!profils.length) {
      zone.append(el('div', { class: 'bienvenue' },
        el('div', { class: 'em' }, '🐾'),
        el('h2', {}, 'Bienvenue dans Petits Pas !'),
        el('p', {}, 'Crée un profil pour chaque enfant : les jeux s’adaptent à son niveau, ses étoiles sont gardées et tu peux limiter son temps d’écran.'),
        el('button', { class: 'carte', style: 'background:#FFD93B', onclick: ajouterEnfant }, '👶 Créer un profil'),
        el('button', { class: 'lien-parent', onclick: () => ouvrir('Tous les niveaux', niveaux) }, 'Essayer sans profil')));
      return;
    }
    const g = el('div', { class: 'grille' });
    for (const p of profils) {
      const N = niveau(p.niveau);
      g.append(el('button', { class: 'carte', style: `background:${N.couleur}`, onclick: () => entrer(p.id) },
        el('span', { class: 'em' }, p.avatar), p.prenom, el('small', {}, N.nom)));
    }
    g.append(el('button', { class: 'carte ajout', onclick: ajouterEnfant }, el('span', { class: 'em' }, '➕'), 'Ajouter', el('small', {}, 'un enfant')));
    zone.append(el('p', { class: 'intro' }, 'Qui joue ?'), g,
      el('button', { class: 'lien-parent', onclick: () => ouvrir('Tous les niveaux', niveaux) }, '👀 Jouer en invité'));
  }

  function ajouterEnfant() {
    P.portailParent(() => P.formulaireProfil(null, p => { afficher(); if (p) entrer(p.id); }));
  }

  function entrer(id) {
    const p = P.profils.choisir(id); if (!p) return;
    ouvrir(p.avatar + ' ' + p.prenom, accueilEnfant);
    P.dire('Bonjour ' + p.prenom + ' !');
    setTimeout(P.verifierTemps, 300);
  }

  // 2. Accueil de l'enfant : les thèmes de SON niveau + accès aux autres
  function accueilEnfant(zone) {
    const p = P.profils.actif; if (!p) return P.retourAuxProfils();
    const N = niveau(p.niveau), g = grilleThemes(N);
    zone.append(el('p', { class: 'intro' }, `${N.icone} ${N.nom}`));
    if (g.children.length) zone.append(g);
    else zone.append(el('p', { class: 'intro' }, 'Pas encore de jeux pour ce niveau… Essaie les autres niveaux !'));
    zone.append(el('div', { class: 'rang-bas' },
      el('button', { class: 'carte petite', onclick: () => ouvrir('Tous les niveaux', niveaux) }, '🧭 Autres niveaux')));
  }

  // 3. Tous les niveaux (pour s'avancer ou revoir les bases)
  function niveaux(zone) {
    const monNiveau = P.profils.actif && P.profils.actif.niveau;
    const g = el('div', { class: 'grille' });
    for (const N of P.NIVEAUX) {
      const n = exosPour(N.id).length, moi = N.id === monNiveau;
      g.append(el('button', {
        class: 'carte' + (n ? '' : ' verrou') + (moi ? ' mien' : ''), style: `background:${N.couleur}`,
        onclick: () => n ? ouvrir(N.nom + ' ' + N.icone, z => z.append(grilleThemes(N))) : P.sons.rate()
      }, el('span', { class: 'em' }, N.icone), N.nom,
         el('small', {}, moi ? '⭐ ton niveau' : N.ages + ' · ' + (n ? n + ' jeu' + (n > 1 ? 'x' : '') : '🔒 bientôt'))));
    }
    zone.append(el('p', { class: 'intro' }, monNiveau ? 'Revoir les bases ou t’avancer ?' : 'Choisis un niveau'), g);
  }

  function grilleThemes(N) {
    const g = el('div', { class: 'grille' });
    for (const [id, T] of Object.entries(P.THEMES)) {
      const exos = exosPour(N.id).filter(e => e.theme === id);
      if (!exos.length) continue;
      g.append(el('button', { class: 'carte', style: `background:${T.couleur}`, onclick: () => ouvrir(T.nom, z => liste(z, exos, T)) },
        el('span', { class: 'em' }, T.icone), T.nom));
    }
    return g;
  }

  function liste(zone, exos, T) {
    const g = el('div', { class: 'grille' });
    for (const ex of exos)
      g.append(el('button', { class: 'carte', style: `background:${T.couleur}`, onclick: () => lancer(ex) },
        el('span', { class: 'em' }, ex.icone), ex.nom, ex.auteur ? el('small', {}, 'par ' + ex.auteur) : null));
    zone.append(g);
  }

  function lancer(ex) {
    ouvrir(ex.nom, z => ex.lancer(z, kitPour(ex)));
  }

  /* ---------- espace parents (après la question de calcul) ---------- */
  function espaceParents() {
    // Dans le profil d'un enfant : on modifie directement son profil
    if (P.profils.actif) return P.formulaireProfil(P.profils.actif, p => { if (!p) P.retourAuxProfils(); else { P.profils.choisir(p.id); afficher(); } });
    const profils = P.profils.liste(), nb = P.exercices.length;
    const w = el('div', { class: 'voile', style: 'z-index:70' }, el('div', { class: 'panneau' },
      el('h2', {}, '⚙️ Espace parents'),
      profils.length ? el('label', {}, 'Profils') : null,
      profils.map(p => el('button', { class: 'tog ligne', onclick: () => { w.remove(); P.formulaireProfil(p, () => afficher()); } },
        `${p.avatar} ${p.prenom} · ${p.niveau}`, el('small', {}, `aujourd’hui ${P.temps.format(P.temps.aujourdhui(p.id))} · semaine ${P.temps.format(P.temps.semaine(p.id))}  ✏️`))),
      el('button', { class: 'tog', onclick: () => { w.remove(); P.formulaireProfil(null, () => afficher()); } }, '➕ Ajouter un enfant'),
      el('small', { style: 'text-align:center;opacity:.6' }, `Petits Pas v${P.version} · ${nb} exercice${nb > 1 ? 's' : ''} installé${nb > 1 ? 's' : ''}`),
      el('button', { class: 'carte', style: 'background:#FFD93B;padding:14px', onclick: () => w.remove() }, 'Fermer')));
    document.body.append(w);
  }

  /* ---------- démarrage ---------- */
  addEventListener('DOMContentLoaded', () => ouvrir('Petits Pas 🐾', quiJoue));
})();
