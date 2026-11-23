/* =====================================================================
   PROGRAMMES — moteurs d'exercices réutilisables
   ---------------------------------------------------------------------
   Pour créer un exercice, on n'écrit que des DONNÉES (questions,
   objets à trier, étapes à ranger…) et on appelle un moteur :

     PetitsPas.moteurs.quiz({ id, nom, icone, theme, niveaux, questions: [...] })
     PetitsPas.moteurs.saisie({ ..., generer: (n, kit) => ({ q, reponse }) })
     PetitsPas.moteurs.tri({ ..., bacs: [...], objets: [...] })
     PetitsPas.moteurs.ordre({ ..., series: [...] })

   Chaque moteur inscrit lui-même l'exercice dans le catalogue.
   ===================================================================== */
(function () {
  'use strict';
  const P = PetitsPas, M = P.moteurs = {};
  const hasard = t => t[Math.random() * t.length | 0];
  const melanger = t => { t = t.slice(); for (let i = t.length - 1; i > 0; i--) { const j = Math.random() * (i + 1) | 0; [t[i], t[j]] = [t[j], t[i]]; } return t; };
  const secouer = b => { b.classList.remove('non'); void b.offsetWidth; b.classList.add('non'); };
  const bravo = (kit, elem) => { kit.sons.bravo(); const r = elem.getBoundingClientRect(); kit.confettis(r.left + r.width / 2, r.top + r.height / 2, 45); };
  const estImage = s => typeof s === 'string' && !/[A-Za-zÀ-ÿ0-9]/.test(s);
  M.hasard = hasard; M.melanger = melanger; M.entre = (a, b) => a + Math.random() * (b - a + 1) | 0;
  // Nombres en français (jusqu'à 999 999 999), utile à plusieurs exercices
  M.enLettres = function enLettres(n) {
    const U = ['zéro', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf', 'dix', 'onze', 'douze', 'treize', 'quatorze', 'quinze', 'seize'];
    const D = { 20: 'vingt', 30: 'trente', 40: 'quarante', 50: 'cinquante', 60: 'soixante' };
    function cent(n) { // 0..99
      if (n <= 16) return U[n];
      if (n < 20) return 'dix-' + U[n - 10];
      if (n < 70) { const d = n - n % 10, u = n % 10; return D[d] + (u === 0 ? '' : u === 1 ? ' et un' : '-' + U[u]); }
      if (n < 80) return n === 71 ? 'soixante et onze' : 'soixante-' + cent(n - 60);
      if (n === 80) return 'quatre-vingts';
      return 'quatre-vingt-' + cent(n - 80);
    }
    function mille(n, fin) { // 0..999 ; fin = le nombre se termine ici (pour « cents »)
      const c = n / 100 | 0, r = n % 100; let s = '';
      if (c) s = (c > 1 ? U[c] + ' ' : '') + (c > 1 && r === 0 && fin ? 'cents' : 'cent');
      if (r) s += (s ? ' ' : '') + (r === 80 && !fin ? 'quatre-vingt' : cent(r));
      return s;
    }
    if (n === 0) return 'zéro';
    const mi = n / 1e6 | 0, k = (n / 1000 | 0) % 1000, r = n % 1000, p = [];
    if (mi) p.push(mille(mi, true) + (mi > 1 ? ' millions' : ' million'));
    if (k) p.push(k === 1 ? 'mille' : mille(k, false) + ' mille');
    if (r) p.push(mille(r, true));
    return p.join(' ');
  };
  M.formater = (x, dec = 0) => x.toLocaleString('fr-FR', { minimumFractionDigits: dec, maximumFractionDigits: 3 }).replace(/ /g, ' ');

  /** Déroulé commun + consigne + bouton 🔊 */
  function consigne(kit, texte, dit, langue) {
    return kit.el('div', { class: 'mo-consigne' }, texte, kit.el('button', { class: 'mo-ecoute', onclick: () => kit.dire(dit || texte, langue) }, '🔊'));
  }
  M.consigne = consigne;
  function inscrire(cfg, lancer) {
    P.ajouter({ id: cfg.id, nom: cfg.nom, icone: cfg.icone, theme: cfg.theme, niveaux: cfg.niveaux, auteur: cfg.auteur || 'Petits Pas', description: cfg.description, lancer });
  }
  const liste = (src, kit) => typeof src === 'function' ? src(kit) : src;

  /* =====================================================================
     QUIZ — une question, plusieurs réponses à toucher
     question : { q, dire?, visuel?, options: [...], bon: indice (0 par défaut), explication? }
     Le visuel peut être un emoji, un texte, ou une fonction (el) => élément.
     ===================================================================== */
  M.quiz = function (cfg) {
    const lancer = (zone, kit) => {
      const pool = melanger(liste(cfg.questions, kit)), n = Math.min(cfg.manches || 6, pool.length);
      return kit.partie(zone, {
        manches: n, rejouer: () => kit.remplacer(cfg.nom, z => lancer(z, kit)), pause: cfg.pause || 2200,
        jouer(scene, fini, plusTard, k) {
          const Q = pool[k], el = kit.el, bon = Q.bon || 0, aide = el('div');
          let fait = false, erreurs = 0;
          const opts = (Q.garderOrdre ? Q.options.map((o, i) => [o, i]) : melanger(Q.options.map((o, i) => [o, i])));
          const images = opts.every(([o]) => estImage(o));
          const boutons = opts.map(([o, i]) => {
            const b = el('button', { class: images ? 'mo-carte' : 'mo-texte' }, typeof o === 'function' ? o(el) : o);
            b.onclick = () => {
              if (fait) return;
              if (i === bon) {
                fait = true; b.classList.add('oui'); bravo(kit, b);
                if (Q.explication) { aide.replaceChildren(el('div', { class: 'pp-aide ok' }, '✔ ' + Q.explication)); kit.dire(Q.direExplication || Q.explication, Q.langueExplication || cfg.langue); }
                else if (cfg.direReponse !== false && !images && typeof o === 'string') kit.dire(o, Q.langueReponse || cfg.langue);
                fini();
              } else {
                secouer(b); kit.sons.rate(); erreurs++;
                if (erreurs >= 2) { fait = true; boutons.find(x => x.idx === bon).classList.add('oui');
                  aide.replaceChildren(el('div', { class: 'pp-aide' }, '💡 ' + (Q.explication || 'La bonne réponse est en jaune.'))); fini(); }
              }
            };
            b.idx = i; return b;
          });
          const vis = Q.visuel == null ? null : el('div', { class: 'mo-visuel' + (estImage(Q.visuel) ? ' image' : '') }, typeof Q.visuel === 'function' ? Q.visuel(el) : Q.visuel);
          scene.append(consigne(kit, Q.q, Q.dire, Q.langue || cfg.langue), el('div', { class: 'mo-centre' }, vis, el('div', { class: images ? 'mo-cartes' : 'mo-textes' }, boutons), aide));
          plusTard(() => kit.dire(Q.dire || Q.q, Q.langue || cfg.langue), 350);
        }
      });
    };
    inscrire(cfg, lancer); return lancer;
  };

  /* =====================================================================
     SAISIE — l'élève tape un nombre (pavé numérique)
     generer(n, kit) → { q, dire?, visuel?, reponse: nombre, unite?, aide? }
     chrono: true → « calcul éclair » : on affiche le temps à la fin.
     ===================================================================== */
  M.saisie = function (cfg) {
    const lancer = (zone, kit) => {
      const debut = Date.now(), manches = cfg.manches || 8, deja = new Set();
      const stop = kit.partie(zone, {
        manches, rejouer: () => kit.remplacer(cfg.nom, z => lancer(z, kit)), pause: cfg.chrono ? 900 : 1900,
        jouer(scene, fini, plusTard, k) {
          let Q, essai = 0; do { Q = cfg.generer(k, kit); } while (deja.has(Q.q + Q.visuel) && ++essai < 20); deja.add(Q.q + Q.visuel);
          const el = kit.el, aide = el('div');
          let saisie = '', fait = false, erreurs = 0;
          const ecran = el('div', { class: 'mo-saisie', 'data-r': String(Q.reponse).replace('.', ',') }, '');
          const maj = () => { ecran.textContent = saisie || '…'; ecran.classList.toggle('vide', !saisie); };
          const lire = s => parseFloat(s.replace(',', '.'));
          function valider() {
            if (fait || !saisie) return;
            if (Math.abs(lire(saisie) - Q.reponse) < 1e-9) {
              fait = true; ecran.classList.add('bon'); kit.sons.bravo();
              if (!cfg.chrono) { bravo(kit, ecran); if (Q.apres) aide.replaceChildren(el('div', { class: 'pp-aide ok' }, '✔ ' + Q.apres)); }
              fini(); return;
            }
            erreurs++; kit.sons.rate(); secouer(ecran);
            if (erreurs >= 3) {
              fait = true; saisie = M.formater(Q.reponse); maj();
              aide.replaceChildren(el('div', { class: 'pp-aide' }, `La réponse était ${M.formater(Q.reponse)}${Q.unite ? ' ' + Q.unite : ''}.` + (Q.aide ? ' ' + Q.aide : '')));
              plusTard(fini, 1500);
            } else { aide.replaceChildren(el('div', { class: 'pp-aide' }, '💡 ' + (Q.aide || 'Essaie encore !'))); saisie = ''; maj(); }
          }
          const touches = ['7', '8', '9', '4', '5', '6', '1', '2', '3', cfg.virgule ? ',' : '⌫', '0', cfg.virgule ? '⌫' : '✔'];
          const pave = el('div', { class: 'mo-pave' }, touches.map(t => el('button', { class: t === '✔' ? 'ok' : '', onclick: () => {
            if (fait) return;
            if (t === '⌫') saisie = saisie.slice(0, -1);
            else if (t === '✔') return valider();
            else if (t === ',' && saisie.includes(',')) return;
            else if (saisie.length < 12) saisie += t;
            maj();
          } }, t)));
          maj();
          const vis = Q.visuel == null ? null : el('div', { class: 'mo-visuel' + (estImage(Q.visuel) ? ' image' : '') }, typeof Q.visuel === 'function' ? Q.visuel(el) : Q.visuel);
          scene.append(consigne(kit, Q.q, Q.dire),
            el('div', { class: 'mo-centre' }, vis,
              el('div', { class: 'mo-ligne' }, ecran, Q.unite ? el('span', { class: 'mo-unite' }, Q.unite) : null),
              el('div', { class: 'mo-ligne' }, pave, cfg.virgule ? el('button', { class: 'pp-bouton principal', onclick: valider }, '✔') : null), aide));
          if (!cfg.chrono) plusTard(() => kit.dire(Q.dire || Q.q), 300);
          // clavier physique (ordinateur)
          scene.tabIndex = -1;
        }
      });
      if (cfg.chrono) {
        // Afficher le temps total à la fin
        const obs = new MutationObserver(() => {
          const g = document.querySelector('.voile .grand'); if (!g || g.dataset.temps) return;
          const s = Math.round((Date.now() - debut) / 1000), meilleur = kit.progres.lire('record', null);
          if (!meilleur || s < meilleur) kit.progres.ecrire('record', s);
          g.dataset.temps = 1; g.after(kit.el('div', { class: 'mo-chrono' }, `⏱️ ${manches} calculs en ${s} s` + (meilleur ? (s < meilleur ? ' — nouveau record ! 🏆' : ` (record : ${meilleur} s)`) : '')));
        });
        obs.observe(document.querySelector('main'), { childList: true, subtree: true });
        return () => { obs.disconnect(); stop && stop(); };
      }
      return stop;
    };
    inscrire(cfg, lancer); return lancer;
  };

  /* =====================================================================
     TRI — ranger chaque objet dans la bonne boîte
     bacs : [{ id, nom, visuel, couleur? }] ; objets : [[emoji, nom, idBac, explication?]]
     ===================================================================== */
  M.tri = function (cfg) {
    const lancer = (zone, kit) => {
      const objets = melanger(liste(cfg.objets, kit)).slice(0, cfg.manches || 8);
      return kit.partie(zone, {
        manches: objets.length, rejouer: () => kit.remplacer(cfg.nom, z => lancer(z, kit)), pause: 1700,
        jouer(scene, fini, plusTard) {
          const [emoji, nom, bonBac, expl] = objets.pop(), el = kit.el, aide = el('div');
          const q = (cfg.question || 'Où va {nom} ?').replace('{nom}', nom);
          let fait = false, erreurs = 0;
          const bacs = cfg.bacs.map(B => {
            const b = el('button', { class: 'mo-bac', style: B.couleur ? `border-color:${B.couleur};background:${B.couleur}22` : '' },
              el('span', { class: 'mo-bac-visuel' }, B.visuel), el('span', {}, B.nom));
            b.onclick = () => {
              if (fait) return;
              if (B.id === bonBac) {
                fait = true; b.classList.add('oui'); bravo(kit, b); objet.classList.add('range');
                const txt = expl || `${nom.charAt(0).toUpperCase() + nom.slice(1)} : ${B.nom.toLowerCase()}.`;
                aide.replaceChildren(el('div', { class: 'pp-aide ok' }, '✔ ' + txt)); kit.dire(txt); fini();
              } else {
                secouer(b); kit.sons.rate(); erreurs++;
                if (erreurs >= 2) { aide.replaceChildren(el('div', { class: 'pp-aide' }, '💡 ' + (expl || 'Ce n’est pas cette boîte. Regarde bien !'))); }
              }
            };
            return b;
          });
          const objet = el('div', { class: 'mo-objet' }, emoji, el('small', {}, nom));
          scene.append(consigne(kit, q), el('div', { class: 'mo-centre' }, objet, el('div', { class: 'mo-bacs' }, bacs), aide));
          plusTard(() => kit.dire(q), 300);
        }
      });
    };
    inscrire(cfg, lancer); return lancer;
  };

  /* =====================================================================
     ORDRE — remettre des étapes dans l'ordre (frise, cycle, recette…)
     series : [{ titre, consigne?, etapes: [[visuel, texte], ...] }]
     ===================================================================== */
  M.ordre = function (cfg) {
    const lancer = (zone, kit) => {
      const series = melanger(liste(cfg.series, kit)).slice(0, cfg.manches || 4);
      return kit.partie(zone, {
        manches: series.length, rejouer: () => kit.remplacer(cfg.nom, z => lancer(z, kit)), pause: 3000,
        jouer(scene, fini, plusTard) {
          const S = series.pop(), el = kit.el, et = S.etapes; let pos = 0;
          const cases = et.map((_, i) => el('div', { class: 'mo-case' }, el('small', {}, String(i + 1))));
          let ordreCartes; do { ordreCartes = melanger(et.map((e, i) => [e, i])); } while (et.length > 1 && ordreCartes.every(([, i], k) => i === k));
          const cartes = el('div', { class: 'mo-cartes' }, ordreCartes.map(([[vis, txt], i]) => {
            const b = el('button', { class: 'mo-etape' }, vis ? el('span', { class: 'mo-etape-vis' }, vis) : null, el('span', {}, txt));
            b.onclick = () => {
              if (b.disabled) return;
              if (i === pos) {
                cases[pos].replaceChildren(vis ? el('span', { class: 'mo-etape-vis' }, vis) : null, el('span', {}, txt)); cases[pos].classList.add('pleine');
                b.disabled = true; b.style.visibility = 'hidden'; kit.sons.pop(pos); pos++;
                if (pos === et.length) { plusTard(() => bravo(kit, cases[0].parentNode), 300); if (S.apres) kit.dire(S.apres); fini(); }
              } else { secouer(b); kit.sons.rate(); }
            };
            return b;
          }));
          const c = S.consigne || cfg.consigne || 'Remets dans l’ordre';
          scene.append(consigne(kit, (S.titre ? S.titre + ' : ' : '') + c),
            el('div', { class: 'mo-centre' }, el('div', { class: 'mo-cases' }, cases), cartes));
          plusTard(() => kit.dire((S.titre ? S.titre + '. ' : '') + c), 300);
        }
      });
    };
    inscrire(cfg, lancer); return lancer;
  };

  document.head.append(P.el('style', { id: 'mo-css' }, `
    .mo-consigne{text-align:center;font-size:clamp(19px,2.8vw,27px);font-weight:700;padding:4px 16px;display:flex;align-items:center;justify-content:center;gap:12px;flex-wrap:wrap}
    .mo-ecoute{width:52px;height:52px;border-radius:50%;border:none;background:#fff;box-shadow:0 4px 0 var(--ombre);font-size:24px;flex:none}
    .mo-centre{flex:1;min-height:0;overflow:auto;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;padding:8px 12px}
    .mo-visuel{background:#fff;border-radius:28px;box-shadow:0 6px 0 var(--ombre);padding:14px 24px;font:500 clamp(22px,3.4vw,34px)/1.5 Fredoka,sans-serif;text-align:center;max-width:900px}
    .mo-visuel.image{font-size:clamp(80px,14vw,130px);line-height:1}
    .mo-cartes{display:flex;flex-wrap:wrap;justify-content:center;gap:clamp(10px,2.2vw,22px)}
    .mo-textes{display:flex;flex-wrap:wrap;justify-content:center;gap:12px;max-width:900px}
    .mo-carte{position:relative;min-width:clamp(100px,17vw,150px);min-height:clamp(100px,17vw,150px);border:none;border-radius:28px;background:#fff;box-shadow:0 6px 0 var(--ombre);font-size:clamp(52px,9vw,84px);line-height:1;display:flex;align-items:center;justify-content:center;padding:8px}
    .mo-texte{position:relative;min-width:120px;border:none;border-radius:22px;background:#fff;box-shadow:0 5px 0 var(--ombre);font:700 clamp(19px,2.8vw,26px) Fredoka,sans-serif;padding:16px 22px}
    .mo-carte.oui,.mo-texte.oui{box-shadow:0 0 0 6px #FFB020,0 6px 0 var(--ombre);background:#FFF7E0}
    .mo-carte.non,.mo-texte.non,.mo-bac.non,.mo-etape.non,.mo-saisie.non{animation:pp-secoue .4s}
    .mo-saisie{min-width:170px;height:76px;border:4px solid var(--ombre);border-radius:20px;background:#fff;font:700 46px/68px Andika,sans-serif;text-align:center;padding:0 14px}
    .mo-saisie.vide{color:#CDBFAF}
    .mo-saisie.bon{border-color:#5CC95C;background:#E3F7DF;color:#2E8B3A}
    .mo-ligne{display:flex;align-items:center;gap:14px;flex-wrap:wrap;justify-content:center}
    .mo-unite{font:700 32px Fredoka,sans-serif}
    .mo-pave{display:grid;grid-template-columns:repeat(3,64px);gap:8px}
    .mo-pave button{height:56px;border:none;border-radius:16px;background:#fff;box-shadow:0 4px 0 var(--ombre);font:700 26px Fredoka,sans-serif}
    .mo-pave button.ok{background:#5CC95C;color:#fff;box-shadow:0 4px 0 #3E9A3E}
    .mo-pave button:active{transform:translateY(3px);box-shadow:0 1px 0 var(--ombre)}
    .mo-chrono{font:700 clamp(22px,3.4vw,32px) Fredoka,sans-serif;background:#fff;border-radius:20px;padding:10px 22px;box-shadow:0 5px 0 var(--ombre)}
    .mo-objet{display:flex;flex-direction:column;align-items:center;font-size:clamp(80px,14vw,120px);line-height:1;background:#fff;border-radius:30px;padding:14px 26px;box-shadow:0 6px 0 var(--ombre);transition:transform .4s,opacity .4s}
    .mo-objet small{font:700 20px Fredoka,sans-serif;margin-top:6px}
    .mo-objet.range{transform:scale(.6) translateY(80px);opacity:.3}
    .mo-bacs{display:flex;flex-wrap:wrap;justify-content:center;gap:12px}
    .mo-bac{min-width:clamp(120px,20vw,170px);border:5px solid #CDBFAF;border-radius:24px;background:#fff;padding:12px;font:700 clamp(17px,2.4vw,21px) Fredoka,sans-serif;display:flex;flex-direction:column;align-items:center;gap:6px}
    .mo-bac-visuel{font-size:44px;line-height:1}
    .mo-bac.oui{box-shadow:0 0 0 6px #FFB020}
    .mo-cases{display:flex;gap:8px;flex-wrap:wrap;justify-content:center}
    .mo-case{min-width:clamp(90px,14vw,130px);min-height:84px;border:4px dashed #CDBFAF;border-radius:20px;background:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:6px;font:700 15px Fredoka,sans-serif;text-align:center}
    .mo-case small{font-size:24px;color:#CDBFAF}
    .mo-case.pleine{border-style:solid;border-color:#5CC95C;animation:pp-pop .35s}
    .mo-etape{border:none;border-radius:20px;background:#fff;box-shadow:0 5px 0 var(--ombre);padding:10px 14px;font:700 clamp(15px,2.2vw,19px) Fredoka,sans-serif;display:flex;flex-direction:column;align-items:center;gap:4px;max-width:200px}
    .mo-etape-vis{font-size:clamp(36px,6vw,50px);line-height:1}
  `));
})();
