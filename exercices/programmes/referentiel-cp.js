/* =====================================================================
   RÉFÉRENTIEL CP — objectifs d'apprentissage officiels (pilote)
   ---------------------------------------------------------------------
   Source : programmes de français et de mathématiques du cycle 2
   (arrêté du 22 octobre 2024, BO du 31 octobre 2024, en vigueur à la
   rentrée 2025) et repères de progression par période qu'ils contiennent.
   « officiel » résume l'objectif ; « titre » le dit simplement aux parents ;
   « enfant » le dit à l'enfant.
   periodes : périodes de l'année où l'objectif est travaillé en classe.
   exercices : les exercices de l'appli qui l'entraînent ([] = pas encore).
   ===================================================================== */
(function () {
  'use strict';
  const T = [1, 2, 3, 4, 5];
  const o = (id, domaine, titre, enfant, officiel, periodes, exercices, extra = {}) => ({ id, domaine, titre, enfant, officiel, periodes, exercices, ...extra });

  PetitsPas.suivi.ajouterReferentiel('CP', {
    nom: 'CP',
    source: 'programmes du cycle 2 (BO du 31 octobre 2024)'
  }, [
    /* ---------------- FRANÇAIS ---------------- */
    o('cp-f-cgp', 'Français · Lire', 'Connaître les sons des lettres', 'Les sons des lettres',
      'Décoder et encoder les correspondances lettres-sons : 12 à 15 en fin de période 1, 25 à 30 à mi-année', T,
      [{ id: 'lecture-quel-son' }, { id: 'lecture-son-entendu' }], { fondamental: true, icone: '🎧' }),
    o('cp-f-decoder', 'Français · Lire', 'Déchiffrer des mots', 'Lire des mots',
      'Déchiffrer des syllabes, des mots puis des phrases selon la progression des sons étudiés', T,
      [{ id: 'lecture-lis-mot' }], { fondamental: true, icone: '📖' }),
    o('cp-f-fluence', 'Français · Lire', 'Lire vite et bien à voix haute', null,
      'Fin d’année : au moins 30 mots par minute sans préparation, 50 après préparation', [3, 4, 5], [],
      { note: 'À faire à la maison : lire chaque jour quelques lignes à voix haute avec l’enfant.' }),
    o('cp-f-comprendre', 'Français · Lire', 'Comprendre un texte court', null,
      'Comprendre seul un texte d’une dizaine de lignes (récit, documentaire, consigne)', [3, 4, 5], [],
      { note: 'À la maison : après une histoire, demander « qui ? où ? que se passe-t-il ? ».' }),
    o('cp-f-encoder', 'Français · Écrire', 'Écrire des mots en assemblant les sons', 'Écrire des mots',
      'Encoder des syllabes puis des mots selon la progression des sons ; dictée de mots dès la période 2', T,
      [{ id: 'lecture-ecris-mot' }, { id: 'lecture-lettres-du-mot' }], { fondamental: true, icone: '🧩' }),
    o('cp-f-lettres', 'Français · Écrire', 'Former les lettres', 'Écrire les lettres',
      'Apprendre le geste d’écriture de chaque lettre étudiée (en classe : en cursive)', T,
      [{ id: 'tracer-lettres' }], { icone: '✏️', note: 'L’appli fait tracer les capitales ; la cursive viendra plus tard.' }),
    o('cp-f-copie', 'Français · Écrire', 'Copier sans erreur', null,
      'Fin d’année : copier trois ou quatre phrases sans erreur, lisiblement', [2, 3, 4, 5], [],
      { note: 'À faire sur papier : l’écran ne remplace pas le crayon.' }),
    o('cp-f-genre-nombre', 'Français · Grammaire', 'Masculin, féminin, singulier, pluriel', 'Un ou des ? Il ou elle ?',
      'Comprendre le genre et le nombre et la chaîne d’accord déterminant-nom-adjectif', [2, 3, 4, 5],
      [{ id: 'feminin-pluriel' }], { icone: '👫' }),
    o('cp-f-classes', 'Français · Grammaire', 'Reconnaître le nom, le verbe, le déterminant', 'Nom, verbe…',
      'Trier les mots par classe (noms, verbes, déterminants, adjectifs) et chercher des critères', [3, 4, 5],
      [{ id: 'nature-mots' }], { icone: '🔍', note: 'Exercice commun avec les plus grands : réservé aux enfants à l’aise.' }),
    o('cp-f-phrase', 'Français · Grammaire', 'La phrase : majuscule et point', null,
      'Comprendre la phrase simple et ses trois marques : majuscule, point, sens', T, []),
    o('cp-f-etre-avoir', 'Français · Grammaire', 'Le présent de être et avoir', null,
      'Mémoriser le présent de l’indicatif des verbes être et avoir', [4, 5], []),
    o('cp-f-vocabulaire', 'Français · Vocabulaire', 'Mots de même sens, mots contraires', 'Les mots qui se ressemblent',
      'Établir des relations entre les mots : synonymes, antonymes, familles, thèmes', T,
      [{ id: 'vocabulaire' }], { icone: '🤝' }),
    o('cp-f-oral', 'Français · Oral', 'Écouter, raconter, réciter', null,
      'Écouter pour comprendre, dire pour être compris, participer à des échanges, réciter', T, [],
      { note: 'Se travaille en parlant : raconter sa journée, réciter une poésie.' }),

    /* ---------------- MATHÉMATIQUES ---------------- */
    o('cp-m-nombres-59', 'Maths · Nombres', 'Les nombres jusqu’à 59', 'Les nombres jusqu’à 59',
      'Dénombrer, lire, écrire, décomposer en dizaines et unités les nombres jusqu’à 59 (au plus tard en période 2)', [1, 2],
      [{ id: 'nb-dizaines' }, { id: 'compter' }], { fondamental: true, icone: '🧱' }),
    o('cp-m-nombres-100', 'Maths · Nombres', 'Les nombres jusqu’à 100', 'Les nombres jusqu’à 100',
      'Connaître la suite écrite et orale des nombres jusqu’à 100 (au plus tard en période 3) ; valeur des chiffres selon leur position', [3, 4, 5],
      [{ id: 'nb-dizaines' }, { id: 'nb-lettres' }], { fondamental: true, icone: '💯' }),
    o('cp-m-comparer', 'Maths · Nombres', 'Comparer et ranger les nombres', 'Le plus grand nombre',
      'Comparer, encadrer, ranger des nombres ; utiliser =, < et >', T,
      [{ id: 'comparer-nombres' }], { icone: '🔢' }),
    o('cp-m-ordinaux', 'Maths · Nombres', 'Premier, deuxième, troisième…', 'Le petit train',
      'Connaître les nombres ordinaux jusqu’à « vingtième »', [2, 3, 4],
      [{ id: 'ms-train' }], { icone: '🚂', note: 'L’appli s’arrête au cinquième.' }),
    o('cp-m-tables', 'Maths · Calcul mental', 'Les tables d’addition', 'Les tables d’addition',
      'Mémoriser les tables d’addition (de 0 à 10) dans les deux sens ; objectif : 8 en une minute', T,
      [{ id: 'calcul-eclair', focus: 'tables' }], { fondamental: true, icone: '➕' }),
    o('cp-m-doubles', 'Maths · Calcul mental', 'Doubles et moitiés', 'Doubles et moitiés',
      'Connaître les doubles et les moitiés des nombres d’usage courant ; objectif : 8 en une minute', T,
      [{ id: 'calcul-eclair', focus: 'doubles' }], { icone: '👯' }),
    o('cp-m-dizaines', 'Maths · Calcul mental', 'Ajouter ou retirer 1, 2, 10', 'Plus 1, plus 10',
      'Ajouter ou soustraire 1, 2, 10 et des dizaines entières en s’appuyant sur la numération', T,
      [{ id: 'calcul-eclair', focus: 'dizaines' }], { icone: '🔟' }),
    o('cp-m-complement', 'Maths · Calcul mental', 'Compléter à la dizaine', 'Aller jusqu’à la dizaine',
      'Trouver le complément à la dizaine supérieure (37 + … = 40)', [2, 3, 4, 5],
      [{ id: 'calcul-eclair', focus: 'complement' }], { icone: '🎯' }),
    o('cp-m-ajouter', 'Maths · Calcul mental', 'Ajouter de tête', 'Additions de tête',
      'Ajouter un nombre inférieur à 9, ajouter 9, ajouter deux nombres inférieurs à 100', [3, 4, 5],
      [{ id: 'calcul-eclair', focus: 'ajouter' }], { icone: '🧠' }),
    o('cp-m-addition-posee', 'Maths · Opérations', 'L’addition posée', null,
      'Poser et calculer des additions en colonnes (introduite au plus tard en période 4 ou 5)', [4, 5], []),
    o('cp-m-problemes', 'Maths · Problèmes', 'Résoudre des problèmes', 'Petits problèmes',
      'Problèmes additifs à une étape (≤ 100), à deux étapes et multiplicatifs ou de partage (≤ 30) ; au moins 10 problèmes par semaine', T,
      [{ id: 'problemes' }], { fondamental: true, icone: '🧮' }),
    o('cp-m-monnaie', 'Maths · Grandeurs', 'La monnaie', 'La monnaie',
      'Comparer des sommes, constituer une somme donnée, simuler des achats (introduite en période 2 ou 3)', [2, 3, 4, 5],
      [{ id: 'monnaie' }], { icone: '💶' }),
    o('cp-m-heure', 'Maths · Grandeurs', 'Lire l’heure (heures entières)', 'Lire l’heure',
      'Lire les heures entières sur une horloge à aiguilles ; associer une heure à un moment de la journée', [3, 4, 5],
      [{ id: 'heure' }], { icone: '🕐' }),
    o('cp-m-masses', 'Maths · Grandeurs', 'Plus lourd, plus léger', 'La balance',
      'Comparer des masses en soupesant ou avec une balance (vocabulaire lourd, léger)', [3, 4],
      [{ id: 'gs-balance' }], { icone: '⚖️' }),
    o('cp-m-longueurs', 'Maths · Grandeurs', 'Comparer et mesurer des longueurs', 'Plus long, plus court',
      'Comparer des longueurs ; mesurer avec une règle ; connaître le mètre et le centimètre', [2, 3, 4],
      [{ id: 'ms-le-plus' }], { icone: '📏', note: 'L’appli fait comparer ; mesurer se fait avec une vraie règle.' }),
    o('cp-m-solides', 'Maths · Géométrie', 'Les solides', 'Les solides',
      'Reconnaître et nommer cube, boule, cône, cylindre, pavé ; décrire avec le mot « face »', [3, 4],
      [{ id: 'solides' }], { icone: '🧊' }),
    o('cp-m-figures', 'Maths · Géométrie', 'Carré, rectangle, triangle, disque', 'Les formes',
      'Reconnaître, nommer et décrire disque, carré, rectangle, triangle (côté, sommet)', [2, 3, 4],
      [{ id: 'ms-formes' }], { icone: '🔺' }),
    o('cp-m-espace', 'Maths · Géométrie', 'Se repérer : gauche, droite, sur, sous…', 'Où est le chat ?',
      'Utiliser le vocabulaire de position (gauche, droite, sur, sous, entre, devant, derrière)', [1, 2],
      [{ id: 'ms-ou-est-le-chat' }], { icone: '🐱' }),
    o('cp-m-donnees', 'Maths · Données', 'Lire un tableau, un diagramme', null,
      'Recueillir des données, les présenter dans un tableau ou un diagramme en barres, les interpréter', [4, 5], [])
  ]);
})();
