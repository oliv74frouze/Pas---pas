/* =====================================================================
   PETITS PAS — la boîte à outils commune (« le kit »)
   ---------------------------------------------------------------------
   Ce fichier ne contient AUCUN exercice. Il fournit ce que tous les
   exercices partagent : sons, voix, confettis, feux d'artifice,
   couleurs, sauvegarde des progrès, et le registre des exercices.
   Les exercices l'utilisent via l'objet `kit` qu'ils reçoivent.
   ===================================================================== */
(function () {
  'use strict';
  const P = (window.PetitsPas = window.PetitsPas || {});
  P.version = '0.3';
  P.exercices = [];

  /* ---------- catalogue : niveaux scolaires et thèmes ---------- */
  P.NIVEAUX = [
    { id: 'PS',  nom: 'Petite section',  ages: '3–4 ans', cycle: 1, icone: '🐣', couleur: '#FFE3A3' },
    { id: 'MS',  nom: 'Moyenne section', ages: '4–5 ans', cycle: 1, icone: '🐥', couleur: '#C9F0C2' },
    { id: 'GS',  nom: 'Grande section',  ages: '5–6 ans', cycle: 1, icone: '🦉', couleur: '#CFE3FF' },
    { id: 'CP',  nom: 'CP',              ages: '6–7 ans', cycle: 2, icone: '🦊', couleur: '#FFD6E8' },
    { id: 'CE1', nom: 'CE1',             ages: '7–8 ans', cycle: 2, icone: '🐬', couleur: '#D8F0FF' },
    { id: 'CE2', nom: 'CE2',             ages: '8–9 ans', cycle: 2, icone: '🦁', couleur: '#FFE6C7' },
    { id: 'CM1', nom: 'CM1',             ages: '9–10 ans', cycle: 3, icone: '🦅', couleur: '#E2F5D8' },
    { id: 'CM2', nom: 'CM2',             ages: '10–11 ans', cycle: 3, icone: '🐺', couleur: '#E6E1FF' }
  ];
  // Pour les anciens exercices qui indiquaient des âges
  const AGE_VERS_NIVEAU = { 3: 'PS', 4: 'MS', 5: 'GS', 6: 'CP', 7: 'CE1', 8: 'CE2', 9: 'CM1', 10: 'CM2' };
  P.THEMES = {
    ecriture:  { nom: 'Écriture',          icone: '✏️', couleur: '#FFD6C9' },
    lecture:   { nom: 'Lecture',           icone: '📖', couleur: '#FFE9B8' },
    francais:  { nom: 'Français',          icone: '📝', couleur: '#FFDCCF' },
    coloriage: { nom: 'Coloriage',         icone: '🎨', couleur: '#D6E8FF' },
    calcul:    { nom: 'Calcul & maths',    icone: '🧮', couleur: '#D9F5D0' },
    anglais:   { nom: 'Anglais',           icone: '🇬🇧', couleur: '#DCE6FF' },
    dessin:    { nom: 'Dessin',            icone: '🖍️', couleur: '#F1DDFF' },
    agilite:   { nom: 'Agilité',           icone: '🫧', couleur: '#CFF3F0' },
    logique:   { nom: 'Logique',           icone: '🧩', couleur: '#FFE0C2' },
    musique:   { nom: 'Musique',           icone: '🎵', couleur: '#E3E0FF' },
    reperer:   { nom: 'Se repérer',        icone: '🧭', couleur: '#FFF0C7' },
    monde:     { nom: 'Découvrir le monde', icone: '🔬', couleur: '#DDF2C8' },
    autres:    { nom: 'Autres jeux',       icone: '✨', couleur: '#EEE7DD' }
  };

  /* ---------- registre : c'est ici qu'un exercice s'inscrit ---------- */
  P.ajouter = function (ex) {
    if (!ex.niveaux && ex.ages) ex.niveaux = ex.ages.map(a => AGE_VERS_NIVEAU[a]).filter(Boolean);
    const manque = ['id', 'nom', 'icone', 'theme', 'niveaux', 'lancer'].filter(k => ex[k] == null);
    if (manque.length) { console.error('[Petits Pas] Exercice refusé, il manque : ' + manque.join(', '), ex); return; }
    const inconnus = ex.niveaux.filter(n => !P.NIVEAUX.some(N => N.id === n));
    if (inconnus.length) console.warn('[Petits Pas] Niveau inconnu : ' + inconnus.join(', ') + ' (utilise PS, MS, GS, CP, CE1, CE2, CM1, CM2).');
    if (P.exercices.some(e => e.id === ex.id)) { console.error('[Petits Pas] Identifiant déjà utilisé : ' + ex.id); return; }
    if (!P.THEMES[ex.theme]) { console.warn('[Petits Pas] Thème inconnu « ' + ex.theme + ' », rangé dans « autres ».'); ex.theme = 'autres'; }
    P.exercices.push(ex);
  };

  /* ---------- petits outils DOM ---------- */
  P.el = function el(tag, props = {}, ...kids) {
    const e = document.createElement(tag);
    for (const [k, v] of Object.entries(props)) {
      if (v == null) continue;
      if (k === 'class') e.className = v;
      else if (k === 'style') e.style.cssText = v;
      else if (k.startsWith('on')) e.addEventListener(k.slice(2), v);
      else e.setAttribute(k, v);
    }
    for (const c of kids.flat()) if (c != null) e.append(c.nodeType ? c : document.createTextNode(c));
    return e;
  };

  /* ---------- sauvegarde locale (sur la tablette uniquement) ---------- */
  P.store = {
    get(k, d) { try { const v = localStorage.getItem('petitspas.' + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem('petitspas.' + k, JSON.stringify(v)); } catch (e) {} }
  };

  /* ---------- réglages parents ---------- */
  P.DIFFICULTES = [
    // trace : largeur de la marge autorisée autour du trait
    // couverture : part de la lettre à repasser ; parties : part minimale de CHAQUE morceau de la lettre
    { nom: 'Très facile', trace: 1.5, couverture: .75, parties: .35, horsTrait: .55, coloriage: .55 },
    { nom: 'Normal',      trace: 1.1, couverture: .85, parties: .45, horsTrait: .45, coloriage: .70 },
    { nom: 'Difficile',   trace: .8,  couverture: .92, parties: .6,  horsTrait: .30, coloriage: .85 }
  ];
  // Les réglages appartiennent au profil de l'enfant actif (voir profils.js)
  P.reglages = { niveau: 0, indices: true, voix: true };

  /* ---------- couleurs ---------- */
  P.COULEURS = {
    1: { nom: 'jaune',  hex: '#FFD93B' }, 2: { nom: 'bleu',   hex: '#4DA3FF' },
    3: { nom: 'rouge',  hex: '#FF5A5F' }, 4: { nom: 'vert',   hex: '#5CC95C' },
    5: { nom: 'orange', hex: '#FF9F40' }, 6: { nom: 'rose',   hex: '#FF8FC7' },
    7: { nom: 'marron', hex: '#A86B3C' }, 8: { nom: 'violet', hex: '#9B6BFF' }
  };
  P.ARCENCIEL = ['#FF5A5F', '#FF9F40', '#FFD93B', '#5CC95C', '#4DA3FF', '#9B6BFF', '#FF8FC7'];
  P.ENCRE = '#3B2F4A';

  /* ---------- sons (synthétisés, aucun fichier audio) ---------- */
  let AC = null;
  function audio() {
    if (!AC) { try { AC = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) {} }
    if (AC && AC.state === 'suspended') AC.resume().catch(() => {});
    return AC;
  }
  document.addEventListener('pointerdown', audio);
  function note(f, t0, d, type = 'triangle', g = .25, f2) {
    const a = audio(); if (!a) return;
    const o = a.createOscillator(), gn = a.createGain(), t = a.currentTime + t0;
    o.type = type; o.frequency.setValueAtTime(f, t);
    if (f2) o.frequency.exponentialRampToValueAtTime(f2, t + d);
    gn.gain.setValueAtTime(.0001, t); gn.gain.exponentialRampToValueAtTime(g, t + .02); gn.gain.exponentialRampToValueAtTime(.0001, t + d);
    o.connect(gn).connect(a.destination); o.start(t); o.stop(t + d + .05);
  }
  P.sons = {
    note,
    bravo()   { [523, 659, 784, 1047].forEach((f, i) => note(f, i * .09, .55, 'triangle', .22)); },
    pop(i = 0){ const f = 520 + (i % 7) * 80; note(f, 0, .16, 'sine', .3, f * 2); note(f * 1.5, .07, .22, 'triangle', .12); },
    rate()    { note(320, 0, .35, 'sine', .22, 130); },
    clic()    { note(880, 0, .06, 'sine', .08); },
    fanfare() { [523, 659, 784, 659, 784, 1047].forEach((f, i) => note(f, i * .13, .4, 'square', .06)); [523, 659, 784, 1047].forEach(f => note(f, .82, 1.3, 'triangle', .13)); },
    boum() {
      const a = audio(); if (!a) return;
      const len = a.sampleRate * .45 | 0, b = a.createBuffer(1, len, a.sampleRate), d = b.getChannelData(0);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3);
      const s = a.createBufferSource(), g = a.createGain(), fl = a.createBiquadFilter();
      s.buffer = b; g.gain.value = .22; fl.type = 'lowpass'; fl.frequency.value = 1600;
      s.connect(fl).connect(g).connect(a.destination); s.start();
    }
  };

  /* ---------- voix ---------- */
  /** Lit un texte à voix haute. langue : 'fr-FR' par défaut, 'en-GB' pour l'anglais… */
  P.dire = function (texte, langue = 'fr-FR') {
    if (!P.reglages.voix) return;
    try {
      const s = window.speechSynthesis; if (!s) return;
      s.cancel();
      const u = new SpeechSynthesisUtterance(texte);
      u.lang = langue; u.rate = .85; u.pitch = 1.15;
      const code = langue.slice(0, 2).toLowerCase(), voix = s.getVoices().filter(v => v.lang && v.lang.replace('_', '-').toLowerCase().startsWith(code));
      const v = voix.find(v => v.lang.replace('_', '-').toLowerCase() === langue.toLowerCase()) || voix[0];
      if (v) u.voice = v;
      s.speak(u);
    } catch (e) {}
  };
  P.silence = () => { try { speechSynthesis.cancel(); } catch (e) {} };

  /* ---------- confettis & feux d'artifice ---------- */
  let fx, fxc, parts = [], fxRun = false;
  function preparerFx() {
    if (!fx) {
      fx = P.el('canvas', { style: 'position:fixed;inset:0;pointer-events:none;z-index:60' });
      document.body.append(fx); fxc = fx.getContext('2d');
      addEventListener('resize', taille);
    }
    taille();
  }
  function taille() { const d = devicePixelRatio || 1; fx.width = innerWidth * d; fx.height = innerHeight * d; fxc.setTransform(d, 0, 0, d, 0, 0); }
  function boucle() {
    fxc.clearRect(0, 0, innerWidth, innerHeight);
    parts = parts.filter(p => p.vie > 0);
    for (const p of parts) {
      p.x += p.vx; p.y += p.vy; p.vy += .12; p.vx *= .985; p.vie -= .013;
      fxc.globalAlpha = Math.max(p.vie, 0); fxc.fillStyle = p.c;
      fxc.beginPath(); fxc.arc(p.x, p.y, p.r, 0, 7); fxc.fill();
    }
    fxc.globalAlpha = 1;
    if (parts.length) requestAnimationFrame(boucle); else fxRun = false;
  }
  /** Gerbe de confettis en (x, y) — coordonnées écran (clientX/clientY). */
  P.confettis = function (x, y, n = 40, couleurs = P.ARCENCIEL) {
    preparerFx();
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2, s = 2 + Math.random() * 6;
      parts.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, vie: 1, c: couleurs[i % couleurs.length], r: 2 + Math.random() * 3.5 });
    }
    if (!fxRun) { fxRun = true; requestAnimationFrame(boucle); }
  };
  /** Grand final : fanfare + feux d'artifice pendant `ms` millisecondes. */
  P.feuxDArtifice = function (ms = 3800) {
    P.sons.fanfare();
    const fin = Date.now() + ms, r = () => P.ARCENCIEL[Math.random() * 7 | 0];
    (function tir() {
      if (Date.now() > fin) return;
      P.confettis(innerWidth * (.12 + Math.random() * .76), innerHeight * (.12 + Math.random() * .45), 80, [r(), r(), '#fff']);
      P.sons.boum();
      setTimeout(tir, 300 + Math.random() * 250);
    })();
  };

  /** Raccourcis pour écrire des formes SVG (chemins « d ») dans un repère 400 × 400. */
  P.formes = {
    rectArrondi: (x, y, w, h, r) => `M${x + r} ${y}H${x + w - r}Q${x + w} ${y} ${x + w} ${y + r}V${y + h - r}Q${x + w} ${y + h} ${x + w - r} ${y + h}H${x + r}Q${x} ${y + h} ${x} ${y + h - r}V${y + r}Q${x} ${y} ${x + r} ${y}Z`,
    ellipse: (cx, cy, rx, ry = rx) => `M${cx - rx} ${cy}a${rx} ${ry} 0 1 0 ${2 * rx} 0a${rx} ${ry} 0 1 0 ${-2 * rx} 0Z`
  };

  /** Prépare un <canvas> net sur écran Retina. Renvoie { ctx, dpr }. */
  P.preparerToile = function (canvas, largeur, hauteur) {
    const dpr = devicePixelRatio || 1;
    canvas.width = largeur * dpr; canvas.height = hauteur * dpr;
    canvas.style.width = largeur + 'px'; canvas.style.height = hauteur + 'px';
    const ctx = canvas.getContext('2d'); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { ctx, dpr };
  };
})();
