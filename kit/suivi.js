/* =====================================================================
   PETITS PAS — suivi par objectif d'apprentissage (programmes officiels)
   ---------------------------------------------------------------------
   « Où en est mon enfant en classe ? » sans rien demander à l'enseignant :
     1. le CALENDRIER : la période de l'année (1 à 5) est estimée d'après la
        date ; le référentiel indique ce qui se travaille à chaque période ;
     2. le CAHIER : le parent coche ce que la classe travaille en ce moment ;
     3. le LIVRET / les évaluations : le parent signale ce qui est « fragile » ;
     4. l'APPLI : chaque séance d'exercice est enregistrée (réussites, erreurs).
   Tout reste sur la tablette.
   ===================================================================== */
(function () {
  'use strict';
  const P = window.PetitsPas, el = P.el;
  const REF = {};
  const JOUR = 864e5, RECENT = 21; // « en classe » reste actif 3 semaines

  const S = P.suivi = {
    STATUTS: {
      decouvrir: { nom: 'À découvrir', enfant: '✨ Nouveau', couleur: '#E9E1D5', pastille: '⚪' },
      encours: { nom: 'En cours', enfant: '💪 On s’entraîne', couleur: '#FFE08A', pastille: '🟡' },
      acquis: { nom: 'Acquis', enfant: '⭐ Bravo, tu sais !', couleur: '#BFEBB8', pastille: '🟢' },
      revoir: { nom: 'À revoir', enfant: '🔁 À revoir', couleur: '#FFC4C4', pastille: '🔴' }
    },
    /** Un fichier de référentiel déclare les objectifs d'un niveau. */
    ajouterReferentiel(niveau, meta, objectifs) { REF[niveau] = { ...meta, objectifs }; },
    referentiel: niveau => REF[niveau] || null,

    /** Période de l'année scolaire estimée d'après la date (vacances : zone moyenne). */
    periodeAuto(d = new Date()) {
      const m = d.getMonth() + 1, j = d.getDate(), md = m * 100 + j;
      if (md >= 901 && md <= 1031) return 1;
      if (md >= 1101) return 2;
      if (md <= 220) return 3;
      if (md <= 425) return 4;
      if (md <= 831 && m >= 4) return 5;
      return 3;
    },
    periode(profil) { const d = profil && donnees(profil.id); return (d && d.periode) || S.periodeAuto(); },

    enregistrer(pid, exId, focus, manches, erreurs) {
      const d = donnees(pid), cle = exId + (focus ? '#' + focus : '');
      (d.seances[cle] = d.seances[cle] || []).push({ t: Date.now(), m: manches, e: erreurs });
      d.seances[cle] = d.seances[cle].slice(-12);
      sauver(pid, d);
    },

    /** Statut d'un objectif pour un enfant. */
    statut(profil, o) {
      if (!o.exercices.length) return null;
      const d = donnees(profil.id);
      const ses = o.exercices.flatMap(x => d.seances[x.id + (x.focus ? '#' + x.focus : '')] || []).sort((a, b) => a.t - b.t);
      const score = s => s.m / (s.m + s.e);
      const fragile = d.fragile[o.id], dernier = ses[ses.length - 1];
      if (!ses.length) return fragile ? 'revoir' : 'decouvrir';
      if (score(dernier) < .6) return 'revoir';
      const bonsJours = new Set(ses.filter(s => score(s) >= .8).map(s => new Date(s.t).toDateString()));
      const acquis = bonsJours.size >= 2 && score(dernier) >= .8 && (!fragile || dernier.t > fragile);
      if (acquis) return 'acquis';
      return fragile && dernier.t < fragile ? 'revoir' : 'encours';
    },
    derniereSeance(profil, o) {
      const d = donnees(profil.id);
      return Math.max(0, ...o.exercices.flatMap(x => (d.seances[x.id + (x.focus ? '#' + x.focus : '')] || []).map(s => s.t)));
    },
    enClasse: (profil, o) => { const t = donnees(profil.id).classe[o.id]; return t && Date.now() - t < RECENT * JOUR; },

    /** Les 5 objectifs à proposer en priorité à l'enfant. */
    suggestions(profil, n = 5) {
      const R = REF[profil.niveau]; if (!R) return [];
      const per = S.periode(profil), d = donnees(profil.id);
      const tri = R.objectifs.filter(o => o.exercices.length && P.exercices.some(e => e.id === o.exercices[0].id)).map(o => {
        const st = S.statut(profil, o), debut = Math.min(...o.periodes), vieux = Date.now() - S.derniereSeance(profil, o) > RECENT * JOUR;
        let sc = 0;
        if (S.enClasse(profil, o)) sc += 100;
        if (d.fragile[o.id]) sc += 60;
        if (st === 'revoir') sc += 50;
        if (debut === per) sc += 40;
        if (o.periodes.includes(per)) sc += 20;
        if (st === 'encours') sc += 15;
        if (st === 'decouvrir' && debut <= per) sc += 10;
        if (st === 'acquis') sc += vieux ? 12 : -60;
        if (o.fondamental) sc += 25; // lire, écrire, compter : les priorités du programme
        if (debut > per && !S.enClasse(profil, o)) sc -= 100;
        return { ...o, exercice: o.exercices[0], sc };
      }).filter(o => o.sc > 0).sort((a, b) => b.sc - a.sc);
      // On alterne les matières (français, maths…) pour garder une séance variée
      const parMatiere = {}, ordre = [];
      tri.forEach(o => { const m = o.domaine.split(' ')[0]; (parMatiere[m] = parMatiere[m] || []).push(o); if (!ordre.includes(m)) ordre.push(m); });
      const res = [];
      while (res.length < n && ordre.some(m => parMatiere[m].length)) ordre.forEach(m => { if (res.length < n && parMatiere[m].length) res.push(parMatiere[m].shift()); });
      return res;
    },

    /* ---------- l'écran « Où en est … ? » pour les parents ---------- */
    panneau(profil, fermer) {
      const R = REF[profil.niveau]; if (!R) return;
      const d = donnees(profil.id);
      const w = el('div', { class: 'voile', style: 'z-index:72' });
      const rendre = () => {
        const per = S.periode(profil), auto = !d.periode;
        const objs = R.objectifs, couverts = objs.filter(o => o.exercices.length);
        const compte = { decouvrir: 0, encours: 0, acquis: 0, revoir: 0 };
        couverts.forEach(o => compte[S.statut(profil, o)]++);
        const choixPeriode = el('div', { class: 'seg seg-wrap' },
          el('button', { class: auto ? 'on' : '', onclick: () => { d.periode = null; sauver(profil.id, d); rendre(); } }, `Auto (P${S.periodeAuto()})`),
          [1, 2, 3, 4, 5].map(k => el('button', { class: !auto && d.periode === k ? 'on' : '', onclick: () => { d.periode = k; sauver(profil.id, d); rendre(); } }, 'P' + k)));
        const domaines = [...new Set(objs.map(o => o.domaine))];
        const ligne = o => {
          const st = o.exercices.length ? S.statut(profil, o) : null, classe = S.enClasse(profil, o), fragile = !!d.fragile[o.id];
          const futur = Math.min(...o.periodes) > per;
          return el('div', { class: 'sv-ligne' + (futur ? ' futur' : '') + (o.periodes.includes(per) ? ' maintenant' : '') },
            el('div', { class: 'sv-titre' },
              el('span', { class: 'sv-statut', style: `background:${st ? S.STATUTS[st].couleur : '#F1ECE4'}` }, st ? S.STATUTS[st].nom : 'Pas dans l’appli'),
              el('b', {}, o.titre),
              el('small', {}, o.officiel + ' · ' + periodesTexte(o.periodes)),
              o.note ? el('small', { class: 'sv-note' }, o.note) : null),
            el('div', { class: 'sv-actions' },
              el('button', { class: 'sv-tog' + (classe ? ' on' : ''), title: 'Vu en classe ces jours-ci', onclick: () => { if (classe) delete d.classe[o.id]; else d.classe[o.id] = Date.now(); sauver(profil.id, d); rendre(); } }, '📒 En classe'),
              el('button', { class: 'sv-tog fragile' + (fragile ? ' on' : ''), title: 'Signalé fragile (livret, évaluation, devoirs)', onclick: () => { if (fragile) delete d.fragile[o.id]; else d.fragile[o.id] = Date.now(); sauver(profil.id, d); rendre(); } }, '⚠️ Fragile')));
        };
        w.replaceChildren(el('div', { class: 'panneau sv-panneau' },
          el('h2', {}, `📚 Où en est ${profil.prenom} ?`),
          el('div', { class: 'sv-resume' },
            Object.entries(compte).map(([k, v]) => el('span', { style: `background:${S.STATUTS[k].couleur}` }, `${S.STATUTS[k].nom} : ${v}`))),
          el('small', { class: 'astuce' }, `${couverts.length} objectifs du ${R.nom} sur ${objs.length} se travaillent déjà dans l’appli. Source : ${R.source}.`),
          el('label', {}, 'Période de l’année'), choixPeriode,
          el('small', { class: 'astuce' }, 'P1 : rentrée → Toussaint · P2 : → Noël · P3 : → février · P4 : → avril · P5 : → juillet. « Auto » suit la date.'),
          el('details', { class: 'sv-aide' }, el('summary', {}, 'Comment l’utiliser (2 minutes par semaine)'),
            el('ol', {},
              el('li', {}, 'Le week-end, feuilletez le cahier du jour ou le cahier de leçons, et cochez « 📒 En classe » pour ce qui a été travaillé. Cela reste actif 3 semaines.'),
              el('li', {}, 'Après un bilan (livret scolaire sur EduConnect, évaluations nationales, remarque de l’enseignant), cochez « ⚠️ Fragile » pour ce qui est à consolider.'),
              el('li', {}, 'Sans rien cocher, l’appli suit le calendrier officiel : elle propose ce qui se travaille habituellement à cette période.'),
              el('li', {}, '« Acquis » demande deux séances réussies, à deux jours différents. Ce n’est pas une note : c’est un repère pour choisir quoi réviser.'))),
          domaines.map(dom => el('div', { class: 'sv-domaine' }, el('h3', {}, dom), objs.filter(o => o.domaine === dom).map(ligne))),
          el('button', { class: 'carte', style: 'background:#FFD93B;padding:14px', onclick: () => { w.remove(); fermer && fermer(); } }, 'Fermer')));
      };
      rendre(); document.body.append(w);
    }
  };

  function periodesTexte(p) {
    if (p.length === 5) return 'toute l’année';
    if (p.length === 1) return 'période ' + p[0];
    return `périodes ${p[0]} à ${p[p.length - 1]}`;
  }
  function donnees(pid) { return Object.assign({ seances: {}, classe: {}, fragile: {}, periode: null }, P.store.get('suivi.' + pid, {})); }
  function sauver(pid, d) { P.store.set('suivi.' + pid, d); }

  document.head.append(el('style', {}, `
    .revisions-carte{padding:0 26px}
    .carte.revisions{width:100%;background:linear-gradient(135deg,#FFE08A,#FFC4A8);flex-direction:row;justify-content:center;gap:16px;flex-wrap:wrap;padding:16px}
    .carte.revisions .em{font-size:48px}
    .sv-panneau{width:min(96vw,860px)}
    .sv-resume{display:flex;gap:8px;flex-wrap:wrap;justify-content:center}
    .sv-resume span{border-radius:14px;padding:6px 12px;font-size:16px;font-weight:700}
    .sv-aide{background:#F6F0E7;border-radius:16px;padding:10px 14px;font-size:16px}
    .sv-aide summary{font-weight:700;cursor:pointer}
    .sv-aide li{margin:4px 0}
    .sv-domaine h3{margin:14px 0 6px}
    .sv-ligne{display:flex;gap:10px;align-items:center;justify-content:space-between;border-bottom:1px solid #EEE5D8;padding:8px 2px;flex-wrap:wrap}
    .sv-ligne.futur{opacity:.55}
    .sv-ligne.maintenant .sv-titre b::before{content:"● ";color:#FF9F40}
    .sv-titre{display:flex;flex-direction:column;gap:2px;flex:1;min-width:240px}
    .sv-titre b{font-size:18px}
    .sv-titre small{font-size:14px;opacity:.7}
    .sv-note{font-style:italic}
    .sv-statut{align-self:flex-start;border-radius:10px;padding:2px 10px;font-size:13px;font-weight:700}
    .sv-actions{display:flex;gap:6px}
    .sv-tog{border:2px solid var(--ombre);background:#fff;border-radius:14px;padding:8px 10px;font:700 15px Fredoka,sans-serif}
    .sv-tog.on{background:#4DA3FF;border-color:#4DA3FF;color:#fff}
    .sv-tog.fragile.on{background:#FF8A5B;border-color:#FF8A5B}
  `));
})();
