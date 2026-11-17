/* Exercice : « s » ou « ss » ? (orthographe, CE2–CM1)
   On complète chaque mot de la phrase en choisissant s ou ss.
   Règle rappelée en cas d'erreur :
     entre deux voyelles, un seul s chante [z] (une rose) ;
     pour entendre [s] entre deux voyelles, on double : ss (un poisson) ;
     après une consonne, un seul s suffit pour [s] (une personne). */
(function () {
  'use strict';

  // [s] ou [ss] entre crochets = le trou à compléter. Phrases originales.
  const PHRASES = [
    'Le poi[ss]on rouge tourne dans son bocal.',
    'Ma cou[s]ine habite dans une grande mai[s]on.',
    'La cai[ss]ière rend la monnaie au client.',
    'Le pa[ss]age piéton est juste devant l’école.',
    'Papa a repa[ss]é ma chemi[s]e bleue.',
    'Le de[ss]in de Léo est affiché dans la cla[ss]e.',
    'Mon frère a ca[ss]é le vase du salon.',
    'Nous faisons une pau[s]e après la récréation.',
    'La ro[s]e du jardin sent très bon.',
    'Le tré[s]or du pirate est caché dans une grotte.',
    'Le mu[s]ée ouvre ses portes à dix heures.',
    'Notre voi[s]ine promène son chien chaque matin.',
    'Le dino[s]aure avait de très grandes dents.',
    'N’oublie pas ta bro[ss]e à dents !',
    'Le héri[ss]on se cache sous les feuilles.',
    'Cette glace a un goût de framboi[s]e.',
    'L’oi[s]eau construit son nid au printemps.',
    'Nous avons au[ss]i un chat tigré.',
    'Il range ses chau[ss]ettes dans le tiroir.',
    'Cette per[s]onne attend le bus depuis longtemps.',
    'La boi[ss]on est bien fraîche.',
    'Un mon[s]tre gentil vit sous mon lit.',
    'La gli[ss]ade sur la neige était très drôle.',
    'Ce ca[s]ier est réservé aux cartables.',
    'Le pré[s]ent est le temps de la conjugai[s]on.',
    'Il faut ver[s]er le lait sans en renver[s]er.'
  ];
  const VOY = 'aeiouyéèêëàâîïôûù';

  const CSS = `
  .sss-phrase{font:500 clamp(24px,3.6vw,38px)/1.6 Fredoka,sans-serif;text-align:center}
  .sss-trou{display:inline-block;min-width:2.1em;padding:0 .15em;margin:0 .05em;border-bottom:4px dashed #CDBFAF;color:transparent;border-radius:6px;transition:all .2s}
  .sss-trou.actif{background:#FFF4D6;border-bottom-color:#FFB020}
  .sss-trou.bon{color:#3AA54A;border-bottom:4px solid #5CC95C;min-width:0;animation:pp-pop .35s}
  .sss-choix{display:flex;justify-content:center;gap:24px;padding:14px}
  .sss-choix .pp-bouton{font:700 46px Andika,sans-serif;width:140px;padding:14px 0}`;

  function jouerPartie(zone, kit) {
    if (!document.getElementById('sss-css')) document.head.append(kit.el('style', { id: 'sss-css' }, CSS));
    let ordre = [...PHRASES].sort(() => Math.random() - .5);
    return kit.partie(zone, {
      manches: 8, rejouer: () => kit.remplacer('S ou SS ?', z => jouerPartie(z, kit)),
      jouer(scene, fini, plusTard) {
        const el = kit.el, phrase = ordre.pop();
        const morceaux = phrase.split(/(\[s{1,2}\])/), trous = [];
        const p = el('div', { class: 'sss-phrase' }, morceaux.map((m, k) => {
          if (!/^\[s{1,2}\]$/.test(m)) return m;
          // lettres juste avant et juste après le trou, pour expliquer la règle
          const avant = (morceaux[k - 1] || '').slice(-1).toLowerCase(), apres = (morceaux[k + 1] || '').charAt(0).toLowerCase();
          const t = el('span', { class: 'sss-trou' }, m.slice(1, -1));
          trous.push({ t, rep: m.slice(1, -1), entreVoyelles: VOY.includes(avant) && VOY.includes(apres) }); return t;
        }));
        let i = 0; trous[0].t.classList.add('actif');
        const aide = el('div');
        const choisir = (rep, bouton) => {
          if (i >= trous.length) return;
          const T = trous[i];
          if (rep === T.rep) {
            T.t.classList.remove('actif'); T.t.classList.add('bon'); kit.sons.pop(i); i++;
            if (i < trous.length) trous[i].t.classList.add('actif');
            else {
              aide.replaceChildren(el('div', { class: 'pp-aide ok' }, '✔ Bravo !'));
              kit.dire(phrase.replace(/[[\]]/g, '')); plusTard(() => kit.sons.bravo(), 300); fini();
            }
          } else {
            bouton.classList.remove('non'); void bouton.offsetWidth; bouton.classList.add('non'); kit.sons.rate();
            aide.replaceChildren(el('div', { class: 'pp-aide' }, T.rep === 'ss'
              ? '💡 Ici on entend [s] entre deux voyelles. Un seul s ferait [z] (une rose) : on double, ss.'
              : T.entreVoyelles
                ? '💡 Ici on entend [z] : entre deux voyelles, un seul s suffit (une rose, une maison).'
                : '💡 Après une consonne, un seul s suffit pour faire [s] (une personne, un monstre).'));
          }
        };
        scene.append(
          el('div', { class: 'pp-consigne' }, 'Complète les mots avec s ou ss'),
          el('div', { class: 'pp-carte' }, p),
          el('div', { class: 'sss-choix' }, ['s', 'ss'].map(r => { const b = el('button', { class: 'pp-bouton', onclick: () => choisir(r, b) }, r); return b; })),
          aide);
      }
    });
  }

  PetitsPas.ajouter({
    id: 's-ou-ss', nom: 'S ou SS ?', icone: '🐍', theme: 'francais', niveaux: ['CE2', 'CM1'],
    auteur: 'Petits Pas', description: 'Compléter des mots avec s ou ss selon le son entendu.',
    lancer: jouerPartie
  });
})();
