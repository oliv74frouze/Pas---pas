/* Exercice : What's the weather like? — la météo en anglais (CE2–CM2)
   Une image (emoji) → l'élève reconstitue le mot avec des lettres.
   La voix lit la phrase en anglais (« It's sunny! »). */
(function () {
  'use strict';

  const METEO = [
    ['sunny', '☀️', 'il fait beau / ensoleillé'], ['rainy', '🌧️', 'il pleut'], ['windy', '🌬️', 'il y a du vent'],
    ['cloudy', '☁️', 'c’est nuageux'], ['snowy', '🌨️', 'il neige'], ['stormy', '⛈️', 'il y a de l’orage'],
    ['foggy', '🌫️', 'il y a du brouillard'], ['hot', '🥵', 'il fait chaud'], ['cold', '🥶', 'il fait froid']
  ];

  const CSS = `
  .ang-centre{flex:1;min-height:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;padding:6px}
  .ang-image{font-size:clamp(100px,18vw,160px);line-height:1;background:#fff;border-radius:34px;padding:18px 30px;box-shadow:0 6px 0 var(--ombre);border:none}
  .ang-ligne{display:flex;align-items:center;gap:12px;flex-wrap:wrap;justify-content:center;font:700 clamp(30px,5vw,46px) Fredoka,sans-serif}
  .ang-cases{display:flex;gap:6px}
  .ang-case{width:clamp(48px,8vw,70px);aspect-ratio:1;border:3px solid #CDBFAF;border-radius:12px;background:#fff;font:700 clamp(30px,5.5vw,46px)/1 Andika,sans-serif;display:flex;align-items:center;justify-content:center;
    background-image:repeating-linear-gradient(transparent 0 23%,#EEE5D8 23% 25%)}
  .ang-case.pleine{color:#2F7FD8;animation:pp-pop .3s}
  .ang-tuiles{display:flex;gap:10px;justify-content:center;flex-wrap:wrap;padding:6px 12px 18px}
  .ang-tuile{width:clamp(58px,9vw,78px);aspect-ratio:1;border:none;border-radius:18px;background:#fff;box-shadow:0 5px 0 var(--ombre);font:700 clamp(32px,5.5vw,46px)/1 Andika,sans-serif}
  .ang-tuile.utilisee{visibility:hidden}
  .ang-tuile.non{animation:pp-secoue .4s}
  .ang-fr{opacity:.6;font-size:17px}`;

  function jouerPartie(zone, kit) {
    if (!document.getElementById('ang-css')) document.head.append(kit.el('style', { id: 'ang-css' }, CSS));
    const ordre = [...METEO].sort(() => Math.random() - .5);
    const anglais = t => kit.dire(t, 'en-GB');
    return kit.partie(zone, {
      manches: 7, rejouer: () => kit.remplacer('What’s the weather like?', z => jouerPartie(z, kit)),
      jouer(scene, fini, plusTard) {
        const el = kit.el, [mot, emoji, fr] = ordre.pop();
        const lettres = mot.split(''); let pos = 0;
        const cases = lettres.map(() => el('div', { class: 'ang-case' }));
        const pieges = 'abcdefghiklmnoprstuwy'.split('').filter(c => !mot.includes(c)).sort(() => Math.random() - .5).slice(0, 3);
        const aide = el('div');
        const tuiles = el('div', { class: 'ang-tuiles' }, [...lettres, ...pieges].sort(() => Math.random() - .5).map(c => {
          const b = el('button', { class: 'ang-tuile' }, c);
          b.onclick = () => {
            if (b.classList.contains('utilisee') || pos >= lettres.length) return;
            if (c === lettres[pos]) {
              cases[pos].textContent = c; cases[pos].classList.add('pleine'); b.classList.add('utilisee'); kit.sons.pop(pos); pos++;
              if (pos === lettres.length) {
                kit.sons.bravo(); anglais(`It's ${mot}!`);
                const r = cases[0].parentNode.getBoundingClientRect(); kit.confettis(r.left + r.width / 2, r.top + r.height / 2, 40);
                aide.replaceChildren(el('div', { class: 'pp-aide ok' }, `✔ It’s ${mot}! — ${fr.charAt(0).toUpperCase() + fr.slice(1)}.`));
                fini();
              }
            } else { b.classList.remove('non'); void b.offsetWidth; b.classList.add('non'); kit.sons.rate(); }
          };
          return b;
        }));
        scene.append(
          el('div', { class: 'pp-consigne' }, 'What’s the weather like?'),
          el('div', { class: 'ang-centre' },
            el('button', { class: 'ang-image', onclick: () => anglais(`It's ${mot}.`) }, emoji),
            el('div', { class: 'ang-ligne' }, 'It’s', el('div', { class: 'ang-cases' }, cases), '!'),
            el('div', { class: 'ang-fr' }, '🔊 Touche l’image pour entendre la phrase')),
          tuiles, aide);
        plusTard(() => anglais('What\'s the weather like?'), 300);
      }
    });
  }

  PetitsPas.ajouter({
    id: 'anglais-meteo', nom: 'What’s the weather like?', icone: '🌦️', theme: 'anglais', niveaux: ['CE2', 'CM1', 'CM2'],
    auteur: 'Petits Pas', description: 'Le vocabulaire de la météo en anglais.',
    lancer: jouerPartie
  });
})();
