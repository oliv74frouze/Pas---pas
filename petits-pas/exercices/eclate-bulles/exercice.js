/* =====================================================================
   🫧 ÉCLATE LES BULLES — l'exercice « modèle »
   ---------------------------------------------------------------------
   Copie ce dossier pour créer ton propre exercice ! Il est volontairement
   court et très commenté. Il montre tout ce dont tu as besoin :
     1. dessiner dans la zone qu'on te donne,
     2. réagir au doigt de l'enfant,
     3. récompenser (son, confettis, feux d'artifice, écran Bravo),
     4. s'adapter à la rotation de la tablette,
     5. faire le ménage quand on quitte l'exercice.
   ===================================================================== */
(function () {
  'use strict';

  const OBJECTIF = 10; // nombre de bulles à éclater pour gagner

  /**
   * Fonction principale. L'application l'appelle avec :
   *  - zone : un <div> vide qui occupe l'écran sous la barre de titre
   *  - kit  : la boîte à outils (sons, voix, confettis… voir CONTRIBUER.md)
   * Elle peut renvoyer une fonction de nettoyage, appelée quand on quitte.
   */
  function lancer(zone, kit) {
    const el = kit.el;

    // 1. Construire l'écran avec les briques communes (.ecran, .scene, .barre…)
    const scene = el('div', { class: 'scene', style: 'overflow:hidden;background:linear-gradient(#CFF3F0,#9FD8F5);border-radius:28px;margin:8px' });
    const compteur = el('div', { class: 'message' }, '🫧 Touche les bulles !');
    scene.append(compteur);
    zone.append(el('div', { class: 'ecran' }, scene));

    let eclatees = 0, fini = false, bulles = [], animation, dernierAjout = 0;

    function ajouterBulle() {
      const taille = 70 + Math.random() * 70;
      const couleur = kit.arcEnCiel[Math.random() * 7 | 0];
      const b = el('div', { style: `position:absolute;left:0;top:0;width:${taille}px;height:${taille}px;border-radius:50%;
        background:radial-gradient(circle at 30% 30%,#fff 0 12%,${couleur}55 40%,${couleur}aa);
        border:3px solid ${couleur};touch-action:none;cursor:pointer` });
      const bulle = { b, taille, x: Math.random() * (scene.clientWidth - taille), y: scene.clientHeight, v: .6 + Math.random() * 1.2, phase: Math.random() * 6 };
      // 2. Réagir au doigt : pointerdown marche au doigt, au stylet et à la souris
      b.addEventListener('pointerdown', () => eclater(bulle, couleur));
      scene.append(b); bulles.push(bulle);
    }

    function eclater(bulle, couleur) {
      if (fini) return;
      // 3. Récompenser : un petit son + des confettis à l'endroit touché
      kit.sons.pop(eclatees);
      const r = bulle.b.getBoundingClientRect();
      kit.confettis(r.left + r.width / 2, r.top + r.height / 2, 25, [couleur, '#fff']);
      bulle.b.remove(); bulles = bulles.filter(x => x !== bulle);
      eclatees++;
      compteur.textContent = '🫧 ' + eclatees + ' / ' + OBJECTIF;
      if (eclatees >= OBJECTIF) gagne();
    }

    function gagne() {
      fini = true;
      kit.feuxDArtifice();                        // grand final
      kit.dire('Bravo ! Tu as éclaté toutes les bulles !');
      kit.progres.ecrire('meilleur', OBJECTIF);    // sauvegarde (facultatif)
      setTimeout(() => kit.felicitations(null, {
        encore: () => kit.remplacer('Éclate les bulles', z => lancer(z, kit))
      }), 1800);
    }

    // Boucle d'animation : les bulles montent en ondulant
    function boucle(t) {
      if (!fini && t - dernierAjout > 900 && bulles.length < 7) { ajouterBulle(); dernierAjout = t; }
      for (const bu of bulles) {
        bu.y -= bu.v * 1.6;
        const x = bu.x + Math.sin(t / 600 + bu.phase) * 18;
        bu.b.style.transform = `translate(${x}px,${bu.y}px)`;
        if (bu.y < -bu.taille) { bu.b.remove(); bu.dehors = true; }
      }
      bulles = bulles.filter(bu => !bu.dehors);
      animation = requestAnimationFrame(boucle);
    }
    animation = requestAnimationFrame(boucle);
    kit.dire('Touche les bulles pour les éclater !');

    // 4. Rotation de la tablette : ici on remet simplement les bulles dans l'écran
    kit.surRedimension(() => bulles.forEach(bu => { bu.x = Math.min(bu.x, scene.clientWidth - bu.taille); }));

    // 5. Ménage : on arrête l'animation quand l'enfant quitte l'exercice
    return () => cancelAnimationFrame(animation);
  }

  // Inscription de l'exercice dans le catalogue
  PetitsPas.ajouter({
    id: 'eclate-bulles',            // unique, en minuscules avec des tirets (= nom du dossier)
    nom: 'Éclate les bulles',       // affiché sur la carte
    icone: '🫧',                     // un emoji
    theme: 'agilite',               // voir la liste des thèmes dans CONTRIBUER.md
    niveaux: ['PS', 'MS'],          // PS, MS, GS, CP, CE1, CE2
    auteur: 'Petits Pas',           // ton prénom ou pseudo
    description: 'Toucher les bulles qui montent pour les éclater.',
    lancer
  });
})();
