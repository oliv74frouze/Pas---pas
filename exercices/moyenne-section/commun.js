/* =====================================================================
   MOYENNE SECTION — outils et styles communs aux exercices de ce dossier
   Exercices construits à partir de la fiche du ministère
   « Ce que votre enfant va apprendre en moyenne section ».
   ===================================================================== */
(function () {
  'use strict';
  const MS = PetitsPas.ms = {};
  MS.hasard = t => t[Math.random() * t.length | 0];
  MS.melanger = t => { t = t.slice(); for (let i = t.length - 1; i > 0; i--) { const j = Math.random() * (i + 1) | 0; [t[i], t[j]] = [t[j], t[i]]; } return t; };
  MS.entre = (a, b) => a + Math.random() * (b - a + 1) | 0;
  MS.secouer = b => { b.classList.remove('non'); void b.offsetWidth; b.classList.add('non'); };
  MS.bravo = (kit, elem) => { kit.sons.bravo(); const r = elem.getBoundingClientRect(); kit.confettis(r.left + r.width / 2, r.top + r.height / 2, 45); };

  /** Consigne en haut avec bouton 🔊 pour la réentendre. */
  MS.consigne = (kit, texte, dit = texte) => kit.el('div', { class: 'ms-consigne' }, texte,
    kit.el('button', { class: 'ms-ecoute', onclick: () => kit.dire(dit) }, '🔊'));

  /**
   * Choix parmi des grandes cartes : options = [{ contenu, bon, dire? }]
   * Une bonne réponse → fini() ; une mauvaise → secousse + « boing » doux.
   */
  MS.choix = (kit, options, fini, { classe = 'ms-carte', apres } = {}) => {
    let fait = false;
    return kit.el('div', { class: 'ms-cartes' }, options.map(o => {
      const b = kit.el('button', { class: classe }, o.contenu);
      b.onclick = () => {
        if (o.dire) kit.dire(o.dire);
        if (fait) return;
        if (o.bon) { fait = true; b.classList.add('oui'); MS.bravo(kit, b); apres && apres(o); fini(); }
        else { MS.secouer(b); kit.sons.rate(); }
      };
      return b;
    }));
  };

  /** Petit dessin d'un objet répété n fois (emojis). */
  MS.groupe = (kit, emoji, n, classe = 'ms-groupe') => kit.el('div', { class: classe }, Array.from({ length: n }, () => kit.el('span', {}, emoji)));

  const CSS = `
  .ms-consigne{text-align:center;font-size:clamp(20px,3vw,28px);font-weight:700;padding:4px 16px;display:flex;align-items:center;justify-content:center;gap:14px;flex-wrap:wrap}
  .ms-ecoute{width:56px;height:56px;border-radius:50%;border:none;background:#fff;box-shadow:0 4px 0 var(--ombre);font-size:26px;flex:none}
  .ms-centre{flex:1;min-height:0;overflow:auto;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;padding:8px}
  .ms-cartes{display:flex;flex-wrap:wrap;justify-content:center;align-content:center;gap:clamp(12px,2.5vw,26px);padding:10px}
  .ms-carte{position:relative;min-width:clamp(110px,20vw,170px);min-height:clamp(110px,20vw,170px);border:none;border-radius:30px;background:#fff;box-shadow:0 6px 0 var(--ombre);
    font-size:clamp(56px,10vw,96px);line-height:1;display:flex;align-items:center;justify-content:center;padding:10px;transition:transform .15s}
  .ms-carte:active{transform:scale(.96)}
  .ms-carte.oui{box-shadow:0 0 0 7px #FFB020,0 6px 0 var(--ombre)}
  .ms-carte.oui::after{content:"✔";position:absolute;top:-10px;right:-10px;background:#5CC95C;color:#fff;border-radius:50%;width:38px;height:38px;font-size:24px;display:flex;align-items:center;justify-content:center}
  .ms-carte.non,.ms-chiffre.non{animation:pp-secoue .4s}
  .ms-carte.petite{min-width:clamp(90px,15vw,130px);min-height:clamp(90px,15vw,130px);font-size:clamp(48px,8vw,74px)}
  .ms-grande{font-size:clamp(90px,16vw,150px);line-height:1;background:#fff;border-radius:34px;padding:14px 24px;box-shadow:0 6px 0 var(--ombre);border:none}
  .ms-mot{font:700 clamp(36px,6vw,56px) Andika,sans-serif;letter-spacing:.04em}
  .ms-groupe{display:flex;flex-wrap:wrap;justify-content:center;gap:6px;font-size:clamp(44px,7vw,66px);line-height:1.1;max-width:360px}
  .ms-chiffre{width:clamp(84px,14vw,120px);height:clamp(84px,14vw,120px);border-radius:28px;border:none;background:#fff;box-shadow:0 6px 0 var(--ombre);font:700 clamp(46px,8vw,66px) Andika,sans-serif}
  .ms-chiffre.oui{background:#5CC95C;color:#fff}
  .ms-boites{display:flex;gap:clamp(14px,4vw,40px);justify-content:center;flex-wrap:wrap;padding:8px}
  .ms-boite{min-width:clamp(150px,30vw,260px);min-height:150px;border:5px dashed #CDBFAF;border-radius:30px;background:#fff;display:flex;flex-direction:column;align-items:center;gap:6px;padding:10px;font:700 22px Fredoka,sans-serif}
  .ms-boite .ms-boite-titre{font-size:clamp(20px,3vw,26px)}
  .ms-boite .ms-dedans{display:flex;flex-wrap:wrap;justify-content:center;gap:4px;font-size:40px;min-height:50px}
  .ms-boite.non{animation:pp-secoue .4s;border-color:#FF5A5F}`;
  document.head.append(PetitsPas.el('style', { id: 'ms-css' }, CSS));
})();
