/* =====================================================================
   PETITS PAS — profils des enfants, temps d'écran, accès parent
   ---------------------------------------------------------------------
   • Un profil par enfant : prénom, âge, niveau scolaire, avatar,
     réglages (tolérance, voix, indices) et limites de temps d'écran.
   • Le temps passé est compté par enfant, seulement quand l'écran est
     allumé ET que l'enfant touche l'écran (pas quand la tablette traîne).
   • Tout reste sur la tablette (localStorage), rien n'est envoyé.
   ===================================================================== */
(function () {
  'use strict';
  const P = window.PetitsPas, el = P.el;

  P.AVATARS = ['🐣', '🦊', '🐼', '🦄', '🐸', '🐯', '🐨', '🐙', '🦁', '🐰', '🐻', '🐬', '🦋', '🐞'];
  P.AGE_NIVEAU = { 2: 'PS', 3: 'PS', 4: 'MS', 5: 'GS', 6: 'CP', 7: 'CE1', 8: 'CE2', 9: 'CM1', 10: 'CM2', 11: 'CM2' };
  P.LIMITES_JOUR = [0, 5, 10, 15, 20, 30, 45];      // minutes, 0 = aucune
  P.LIMITES_SEMAINE = [0, 30, 60, 90, 120, 180];    // minutes, 0 = aucune
  const REGLAGES_DEFAUT = { niveau: 0, indices: true, voix: true, limiteJour: 0, limiteSemaine: 0 };
  P.reglages = Object.assign({}, REGLAGES_DEFAUT);

  /* ---------- profils ---------- */
  const lire = () => P.store.get('profils', []);
  const ecrire = l => P.store.set('profils', l);
  P.profils = {
    actif: null,
    liste: lire,
    trouver: id => lire().find(p => p.id === id),
    choisir(id) {
      const p = this.trouver(id); if (!p) return null;
      p.reglages = Object.assign({}, REGLAGES_DEFAUT, p.reglages);
      this.actif = p; P.reglages = p.reglages; avertie = false; alerteOuverte = false;
      return p;
    },
    quitter() { this.actif = null; P.reglages = Object.assign({}, REGLAGES_DEFAUT); },
    enregistrer(p) {
      const l = lire(), i = l.findIndex(x => x.id === p.id);
      if (i < 0) {
        // Premier profil créé : il récupère les étoiles gagnées avant l'arrivée des profils
        if (!l.length) migrerAnciensProgres(p.id);
        l.push(p);
      } else l[i] = p;
      ecrire(l);
      if (this.actif && this.actif.id === p.id) this.choisir(p.id);
    },
    supprimer(id) {
      ecrire(lire().filter(p => p.id !== id));
      effacerCles('petitspas.progres.' + id + '.'); effacerCles('petitspas.temps.' + id);
      if (this.actif && this.actif.id === id) this.quitter();
    },
    effacerEtoiles: id => effacerCles('petitspas.progres.' + id + '.'),
    nouveau: () => ({ id: 'p' + Date.now().toString(36), prenom: '', age: 3, niveau: 'PS', avatar: P.AVATARS[0], reglages: Object.assign({}, REGLAGES_DEFAUT) })
  };
  function effacerCles(prefixe) { try { Object.keys(localStorage).filter(k => k.startsWith(prefixe)).forEach(k => localStorage.removeItem(k)); } catch (e) {} }
  function migrerAnciensProgres(pid) {
    try {
      const ids = new Set(P.exercices.map(e => e.id));
      Object.keys(localStorage).forEach(k => {
        const m = k.match(/^petitspas\.progres\.([^.]+)\.(.+)$/);
        if (m && ids.has(m[1])) { localStorage.setItem(`petitspas.progres.${pid}.${m[1]}.${m[2]}`, localStorage.getItem(k)); localStorage.removeItem(k); }
      });
    } catch (e) {}
  }

  /* ---------- temps d'écran ---------- */
  const TICK = 5; // secondes
  const jourCle = (d = new Date()) => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  function joursDeLaSemaine() { // du lundi à aujourd'hui
    const d = new Date(), n = (d.getDay() + 6) % 7, r = [];
    for (let i = n; i >= 0; i--) { const x = new Date(d); x.setDate(d.getDate() - i); r.push(jourCle(x)); }
    return r;
  }
  P.temps = {
    aujourdhui: pid => (P.store.get('temps.' + pid, {})[jourCle()] || 0) / 60,
    semaine: pid => { const t = P.store.get('temps.' + pid, {}); return joursDeLaSemaine().reduce((s, j) => s + (t[j] || 0), 0) / 60; },
    rallonge(pid) { const r = P.store.get('rallonge.' + pid, {}); return r.jour === jourCle() ? r.min : 0; },
    prolonger(pid, min) { P.store.set('rallonge.' + pid, { jour: jourCle(), min: this.rallonge(pid) + min }); },
    /** Renvoie null, ou { quoi:'jour'|'semaine', reste: minutes restantes } */
    etat(p) {
      const R = p.reglages, ext = this.rallonge(p.id), res = [];
      if (R.limiteJour) res.push({ quoi: 'jour', reste: R.limiteJour + ext - this.aujourdhui(p.id) });
      if (R.limiteSemaine) res.push({ quoi: 'semaine', reste: R.limiteSemaine + ext - this.semaine(p.id) });
      return res.sort((a, b) => a.reste - b.reste)[0] || null;
    }
  };
  const fmt = m => { m = Math.round(m); return m < 60 ? m + ' min' : Math.floor(m / 60) + ' h' + (m % 60 ? ' ' + String(m % 60).padStart(2, '0') : ''); };
  P.temps.format = fmt;

  let derniereActivite = 0, avertie = false, alerteOuverte = false;
  ['pointerdown', 'keydown'].forEach(t => document.addEventListener(t, () => { derniereActivite = Date.now(); }, true));
  setInterval(() => {
    const p = P.profils.actif;
    if (!p || alerteOuverte || document.visibilityState !== 'visible' || Date.now() - derniereActivite > 60000) return;
    const t = P.store.get('temps.' + p.id, {}), j = jourCle();
    t[j] = (t[j] || 0) + TICK;
    // on ne garde que les 14 derniers jours
    Object.keys(t).sort().slice(0, -14).forEach(k => delete t[k]);
    P.store.set('temps.' + p.id, t);
    P.verifierTemps();
  }, TICK * 1000);

  /** Vérifie la limite de l'enfant actif ; affiche l'avertissement ou l'alerte. */
  P.verifierTemps = function () {
    const p = P.profils.actif; if (!p || alerteOuverte) return;
    const e = P.temps.etat(p); if (!e) return;
    if (e.reste <= 0) alerte(p, e);
    else if (e.reste <= 1 && !avertie) { avertie = true; bulle('⏳ Plus qu’une minute !'); P.dire('Plus qu’une minute, ' + p.prenom + ' !'); }
  };

  function bulle(texte) {
    const b = el('div', { class: 'bulle-info' }, texte);
    document.body.append(b); setTimeout(() => b.remove(), 4000);
  }

  function alerte(p, e) {
    alerteOuverte = true;
    const fermer = () => { alerteOuverte = false; w.remove(); };
    const w = el('div', { class: 'voile pause' },
      el('div', { class: 'grand-em' }, '😴'),
      el('div', { class: 'pause-titre' }, 'C’est l’heure de faire une pause, ' + p.prenom + ' !'),
      el('div', { class: 'pause-texte' }, e.quoi === 'jour' ? 'Tu as bien joué aujourd’hui. À demain ! 🌙' : 'Tu as bien joué cette semaine. On se retrouve bientôt ! 🌙'),
      el('button', { class: 'carte', style: 'background:#FFD93B', onclick: () => { fermer(); P.retourAuxProfils && P.retourAuxProfils(); } }, '👋 D’accord, j’arrête'),
      el('button', { class: 'lien-parent', onclick: () => P.portailParent(() => { P.temps.prolonger(p.id, 5); avertie = false; fermer(); bulle('✔ 5 minutes de plus'); }) }, 'Parent : prolonger de 5 minutes'));
    document.body.append(w);
    P.sons.note(660, 0, .5, 'sine', .15); P.sons.note(523, .35, .8, 'sine', .15);
    setTimeout(() => P.dire('C’est l’heure de faire une pause, ' + p.prenom + ' ! Tu as bien joué.'), 400);
  }

  /* ---------- accès réservé aux parents ---------- */
  /** Petite question de calcul pour les grands avant les réglages. */
  P.portailParent = function (siOk) {
    const a = 6 + Math.random() * 4 | 0, b = 6 + Math.random() * 4 | 0;
    let saisie = '';
    const ecran = el('div', { class: 'portail-saisie' }, ' ');
    const maj = () => { ecran.textContent = saisie || ' '; };
    const touche = c => el('button', { class: 'touche', onclick: () => {
      if (c === '⌫') saisie = saisie.slice(0, -1);
      else if (c === 'OK') { if (+saisie === a * b) { w.remove(); siOk(); return; } saisie = ''; ecran.classList.remove('non'); void ecran.offsetWidth; ecran.classList.add('non'); P.sons.rate(); }
      else if (saisie.length < 3) saisie += c;
      maj();
    } }, c);
    const w = el('div', { class: 'voile', style: 'z-index:80' }, el('div', { class: 'panneau portail' },
      el('h2', {}, '🔒 Espace parents'),
      el('div', { style: 'text-align:center' }, `Combien font ${a} × ${b} ?`), ecran,
      el('div', { class: 'clavier' }, ['1', '2', '3', '4', '5', '6', '7', '8', '9', '⌫', '0', 'OK'].map(touche)),
      el('button', { class: 'tog', onclick: () => w.remove() }, 'Annuler')));
    document.body.append(w);
  };

  /* ---------- formulaire de profil (création / modification) ---------- */
  P.formulaireProfil = function (existant, quandFini) {
    const p = JSON.parse(JSON.stringify(existant || P.profils.nouveau())), R = p.reglages, creation = !existant;
    const choix = (valeurs, actuelle, libelle, quand) => {
      const s = el('div', { class: 'seg seg-wrap' });
      valeurs.forEach(v => s.append(el('button', { class: v === actuelle() ? 'on' : null, onclick: () => { quand(v); [...s.children].forEach((b, i) => b.classList.toggle('on', valeurs[i] === actuelle())); } }, libelle(v))));
      return s;
    };
    const prenom = el('input', { class: 'champ', type: 'text', maxlength: '20', placeholder: 'Prénom', value: p.prenom, autocomplete: 'off' });
    let segNiveau;
    const segAge = choix([2, 3, 4, 5, 6, 7, 8, 9, 10, 11], () => p.age, v => v + ' ans', v => {
      p.age = v; p.niveau = P.AGE_NIVEAU[v];
      [...segNiveau.children].forEach((b, i) => b.classList.toggle('on', P.NIVEAUX[i].id === p.niveau));
      if (creation) R.niveau = v <= 4 ? 0 : 1; // tolérance proposée selon l'âge
    });
    segNiveau = choix(P.NIVEAUX.map(n => n.id), () => p.niveau, v => v, v => { p.niveau = v; });
    const avatars = el('div', { class: 'avatars' }, P.AVATARS.map(a => el('button', { class: 'avatar' + (a === p.avatar ? ' on' : ''), onclick: e => { p.avatar = a; [...avatars.children].forEach(b => b.classList.toggle('on', b === e.currentTarget)); } }, a)));
    const bascule = (k, label) => { const b = el('button', { class: 'tog' + (R[k] ? ' on' : ''), onclick: () => { R[k] = !R[k]; b.classList.toggle('on', R[k]); } }, label); return b; };
    const msg = el('div', { class: 'erreur' });

    const blocs = [
      el('h2', {}, creation ? '👶 Nouvel enfant' : '✏️ ' + p.prenom),
      el('label', {}, 'Prénom'), prenom,
      el('label', {}, 'Âge'), segAge,
      el('label', {}, 'Niveau proposé (modifiable)'), segNiveau,
      el('label', {}, 'Personnage'), avatars,
      el('h3', {}, '⏰ Temps d’écran'),
      el('label', {}, 'Limite par jour'), choix(P.LIMITES_JOUR, () => R.limiteJour, v => v ? v + ' min' : 'Aucune', v => { R.limiteJour = v; }),
      el('label', {}, 'Limite par semaine (du lundi au dimanche)'), choix(P.LIMITES_SEMAINE, () => R.limiteSemaine, v => v ? fmt(v) : 'Aucune', v => { R.limiteSemaine = v; }),
      !creation ? el('div', { class: 'conso' }, `Aujourd’hui : ${fmt(P.temps.aujourdhui(p.id))} · Cette semaine : ${fmt(P.temps.semaine(p.id))}`) : null,
      el('h3', {}, '🎚️ Réglages des jeux'),
      el('label', {}, 'Tolérance (tracé, coloriage…)'), choix([0, 1, 2], () => R.niveau, v => P.DIFFICULTES[v].nom, v => { R.niveau = v; }),
      el('div', { class: 'seg' }, bascule('indices', '💡 Indices de couleur'), bascule('voix', '🔊 Voix'))
    ];
    if (!creation) {
      let confirmer = false;
      blocs.push(el('div', { class: 'seg' },
        el('button', { class: 'tog', onclick: e => { P.profils.effacerEtoiles(p.id); e.target.textContent = '✔ Étoiles effacées'; } }, '⭐ Effacer les étoiles'),
        el('button', { class: 'tog danger', onclick: e => {
          if (!confirmer) { confirmer = true; e.target.textContent = 'Confirmer la suppression ?'; return; }
          P.profils.supprimer(p.id); w.remove(); quandFini && quandFini(null);
        } }, '🗑️ Supprimer le profil')));
    }
    blocs.push(msg, el('div', { class: 'seg' },
      el('button', { class: 'tog', onclick: () => { w.remove(); quandFini && quandFini(existant || null); } }, 'Annuler'),
      el('button', { class: 'tog on', onclick: () => {
        p.prenom = prenom.value.trim().replace(/^./, c => c.toUpperCase());
        if (!p.prenom) { msg.textContent = 'Indique le prénom de l’enfant 🙂'; prenom.focus(); return; }
        P.profils.enregistrer(p); w.remove(); quandFini && quandFini(p);
      } }, creation ? 'Créer le profil' : 'Enregistrer')));
    const w = el('div', { class: 'voile', style: 'z-index:70' }, el('div', { class: 'panneau formulaire' }, blocs));
    document.body.append(w);
    if (creation) setTimeout(() => prenom.focus(), 50);
  };
})();
