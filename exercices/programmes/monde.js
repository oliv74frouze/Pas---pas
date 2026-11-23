/* PROGRAMMES — questionner le monde, histoire, géographie, sciences,
   enseignement moral et civique, anglais (CP → CM2).
   D'après les fiches « Ce que votre enfant va apprendre en CP … CM2 ».
   Questions et formulations originales. */
(function () {
  'use strict';
  const M = PetitsPas.moteurs;
  const rang = n => ['CP', 'CE1', 'CE2', 'CM1', 'CM2'].indexOf(n);
  const niv = kit => Math.max(0, rang(kit.niveau));
  const Q = (q, options, explication, visuel) => ({ q, options, explication, visuel });

  /* ---------- 📜 Les frises (histoire, sciences) ---------- */
  M.ordre({
    id: 'frises', nom: 'Les frises du temps', icone: '📜', theme: 'reperer', niveaux: ['CP', 'CE1', 'CE2', 'CM1', 'CM2'], manches: 3,
    description: 'Ranger dans l’ordre : les âges de la vie, les périodes de l’histoire, les grands événements.',
    consigne: 'Range du plus ancien au plus récent',
    series: kit => [
      [{ titre: 'Les âges de la vie', consigne: 'Range du plus jeune au plus âgé', etapes: [['👶', 'bébé'], ['🧒', 'enfant'], ['🧑', 'adulte'], ['👴', 'personne âgée']] },
       { titre: 'Une journée', consigne: 'Range dans l’ordre de la journée', etapes: [['🌅', 'le matin'], ['🍽️', 'le midi'], ['🌇', 'l’après-midi'], ['🌙', 'la nuit']] },
       { titre: 'L’eau qui chauffe', consigne: 'Range dans l’ordre quand on chauffe', etapes: [['🧊', 'la glace (solide)'], ['💧', 'l’eau (liquide)'], ['♨️', 'la vapeur (gaz)']] }],
      [{ titre: 'Le papillon', consigne: 'Range les étapes de sa vie', etapes: [['🥚', 'l’œuf'], ['🐛', 'la chenille'], [null, 'la chrysalide'], ['🦋', 'le papillon']] },
       { titre: 'L’eau qui chauffe', consigne: 'Range dans l’ordre quand on chauffe', etapes: [['🧊', 'la glace (solide)'], ['💧', 'l’eau (liquide)'], ['♨️', 'la vapeur (gaz)']] },
       { titre: 'Les âges de la vie', consigne: 'Range du plus jeune au plus âgé', etapes: [['👶', 'bébé'], ['🧒', 'enfant'], ['🧑', 'adulte'], ['👴', 'personne âgée']] }],
      [{ titre: 'Les grandes périodes', etapes: [['🦣', 'la Préhistoire'], ['🏛️', 'l’Antiquité'], ['🏰', 'le Moyen Âge'], ['⛵', 'les Temps modernes'], ['🏭', 'l’époque contemporaine']], apres: 'Préhistoire, Antiquité, Moyen Âge, Temps modernes, époque contemporaine.' },
       { titre: 'Les unités de temps', consigne: 'Range de la plus courte à la plus longue', etapes: [['⏱️', 'la minute'], ['🕐', 'l’heure'], ['📅', 'le jour'], ['🗓️', 'l’année'], ['🏺', 'le siècle'], ['🗿', 'le millénaire']] },
       { titre: 'La plante', consigne: 'Range les étapes de sa vie', etapes: [['🌰', 'la graine'], ['🌱', 'la germination'], ['🌿', 'la croissance'], ['🌸', 'la fleur'], ['🍎', 'le fruit']] }],
      [{ titre: 'Du Moyen Âge à la Révolution', etapes: [['🏰', 'les châteaux forts du Moyen Âge'], ['🎨', 'François Ier et la Renaissance (1515)'], ['📜', 'Henri IV et l’édit de Nantes (1598)'], ['👑', 'Louis XIV et Versailles'], ['🇫🇷', 'la Révolution française (1789)']] },
       { titre: 'Du champ à l’assiette', consigne: 'Range les étapes du pain', etapes: [['🌾', 'on récolte le blé'], ['⚙️', 'le moulin fait la farine'], ['🥖', 'le boulanger cuit le pain'], ['🍽️', 'on le mange']] },
       { titre: 'Les grandes périodes', etapes: [['🦣', 'la Préhistoire'], ['🏛️', 'l’Antiquité'], ['🏰', 'le Moyen Âge'], ['⛵', 'les Temps modernes'], ['🏭', 'l’époque contemporaine']] }],
      [{ titre: 'De la Révolution à nos jours', etapes: [['🇫🇷', 'la Révolution française (1789)'], ['🏫', 'l’école gratuite, laïque et obligatoire (1881-1882)'], ['🪖', 'la Première Guerre mondiale (1914-1918)'], ['✊', 'la Seconde Guerre mondiale et la Résistance (1939-1945)']] },
       { titre: 'Les phases de la Lune', consigne: 'Range de la nouvelle lune à la pleine lune', etapes: [['🌑', 'nouvelle lune'], ['🌒', 'premier croissant'], ['🌓', 'premier quartier'], ['🌔', 'lune gibbeuse'], ['🌕', 'pleine lune']] },
       { titre: 'Les planètes', consigne: 'Range de la plus proche à la plus lointaine du Soleil', etapes: [['⚫', 'Mercure'], ['🟡', 'Vénus'], ['🌍', 'la Terre'], ['🔴', 'Mars'], ['🪐', 'Jupiter']] },
       { titre: 'La digestion', consigne: 'Range le trajet des aliments', etapes: [['👄', 'la bouche'], [null, 'l’œsophage'], [null, 'l’estomac'], [null, 'l’intestin grêle'], [null, 'le gros intestin']] }]
    ][niv(kit)]
  });

  /* ---------- 🌍 Questionner le monde : sciences, géographie, histoire ---------- */
  const SCIENCES = [
    // CP
    [Q('Le glaçon est…', ['solide', 'liquide'], 'Le glaçon, c’est de l’eau solide.', '🧊'), Q('L’eau du robinet est…', ['liquide', 'solide'], 'L’eau qui coule est liquide.', '🚰'),
     Q('À quoi sert le marteau ?', ['à planter un clou', 'à couper du papier', 'à mesurer'], 'Le marteau sert à enfoncer des clous.', '🔨'),
     Q('À quoi servent les ciseaux ?', ['à couper', 'à coller', 'à visser'], 'Les ciseaux servent à couper.', '✂️'),
     Q('Pour être en forme, il faut…', ['bien dormir', 'manger des bonbons', 'regarder des écrans le soir'], 'Le sommeil est très important pour grandir et apprendre.', '😴'),
     Q('Quand se lave-t-on les mains ?', ['avant de manger', 'jamais', 'seulement le dimanche'], 'On se lave les mains avant de manger et après être allé aux toilettes.', '🧼'),
     Q('Quel est le drapeau de la France ?', ['🇫🇷', '🇮🇹', '🇧🇪', '🇩🇪'], 'Le drapeau français est bleu, blanc, rouge.'),
     Q('Quand fait-il nuit ?', ['quand notre côté de la Terre ne voit plus le Soleil', 'quand le Soleil s’éteint', 'quand la Lune cache le Soleil'], 'La Terre tourne sur elle-même : le jour et la nuit alternent.', '🌗')],
    // CE1
    [Q('La vapeur d’eau est…', ['un gaz', 'un solide', 'un liquide'], 'La vapeur, c’est l’eau à l’état de gaz.', '♨️'),
     Q('Que se passe-t-il quand on met de l’eau au congélateur ?', ['elle devient de la glace', 'elle s’évapore', 'elle devient chaude'], 'Au froid, l’eau devient solide : c’est de la glace.', '🥶'),
     Q('Complète la devise de la République : Liberté, Égalité, …', ['Fraternité', 'Amitié', 'Solidarité'], 'La devise est : Liberté, Égalité, Fraternité.', '🇫🇷'),
     Q('Comment s’appelle l’hymne national français ?', ['La Marseillaise', 'Frère Jacques', 'Au clair de la lune'], 'L’hymne national est La Marseillaise.', '🎶'),
     Q('Quel paysage est-ce ?', ['la montagne', 'la mer', 'la ville'], 'Des sommets enneigés : c’est la montagne.', '🏔️'),
     Q('Quel paysage est-ce ?', ['la ville', 'la campagne', 'la montagne'], 'Des immeubles : c’est la ville.', '🏙️'),
     Q('Quel paysage est-ce ?', ['la campagne', 'la ville', 'la mer'], 'Des champs : c’est la campagne.', '🌾'),
     Q('Le Soleil est…', ['une étoile', 'une planète', 'un satellite'], 'Le Soleil est une étoile. La Terre est une planète qui tourne autour.', '☀️'),
     Q('Avant de devenir un papillon, il est…', ['une chenille', 'un ver de terre', 'un têtard'], 'La chenille se transforme en papillon.', '🦋')],
    // CE2
    [Q('Quand la glace devient de l’eau liquide, c’est…', ['la fusion', 'la solidification', 'l’évaporation'], 'Solide → liquide : c’est la fusion.', '🧊'),
     Q('Quand l’eau liquide devient de la glace, c’est…', ['la solidification', 'la fusion', 'la condensation'], 'Liquide → solide : c’est la solidification.', '❄️'),
     Q('Le caillou appartient au monde…', ['minéral', 'végétal', 'animal'], 'Le caillou n’est pas vivant : il est minéral.', '🪨'),
     Q('Le chêne appartient au monde…', ['végétal', 'minéral', 'animal'], 'L’arbre est un végétal.', '🌳'),
     Q('Qui élit le président de la République ?', ['les citoyens', 'les maires', 'le roi'], 'Les citoyens votent pour élire le président.', '🗳️'),
     Q('Qui élit le maire ?', ['le conseil municipal', 'le président', 'les enfants de l’école'], 'Les habitants élisent le conseil municipal, qui élit le maire.', '🏛️'),
     Q('Lequel est un service public ?', ['l’hôpital', 'un magasin de jouets', 'un cinéma'], 'L’hôpital, l’école, les pompiers… sont des services publics, pour tous.', '🏥'),
     Q('Pour rester en bonne santé, il faut…', ['manger varié et bouger', 'manger toujours la même chose', 'ne jamais faire de sport'], 'Alimentation variée, activité physique, sommeil et hygiène.', '🥗'),
     Q('Sur quel continent se trouve la France ?', ['l’Europe', 'l’Afrique', 'l’Asie'], 'La France est en Europe.', '🌍'),
     Q('Quel est le plus grand océan ?', ['l’océan Pacifique', 'l’océan Atlantique', 'l’océan Indien'], 'Le Pacifique est le plus grand océan du monde.', '🌊')],
    // CM1
    [Q('Quel organe commande nos mouvements et nos pensées ?', ['le cerveau', 'le cœur', 'l’estomac'], 'Le cerveau reçoit les informations des sens et commande les mouvements.', '🧠'),
     Q('À midi, en été, notre ombre est…', ['courte', 'très longue', 'invisible'], 'Le Soleil est haut : l’ombre est courte. Le matin et le soir, elle est longue.', '☀️'),
     Q('Lequel est un mammifère ?', ['le dauphin', 'le requin', 'le saumon'], 'Le dauphin respire de l’air et allaite ses petits : c’est un mammifère.', '🐬'),
     Q('Qu’a fait Henri IV en 1598 ?', ['l’édit de Nantes, pour la paix entre catholiques et protestants', 'il a construit Versailles', 'il a découvert l’Amérique'], 'L’édit de Nantes autorise les protestants à pratiquer leur religion.', '📜'),
     Q('Quel roi a fait construire le château de Versailles ?', ['Louis XIV', 'François Ier', 'Henri IV'], 'Louis XIV, le « Roi-Soleil », s’installe à Versailles.', '👑'),
     Q('Que fête-t-on le 14 juillet ?', ['la prise de la Bastille et la fête de la Fédération', 'Noël', 'la fin de l’école'], 'Le 14 juillet 1789, les Parisiens prennent la Bastille. C’est notre fête nationale.', '🎆'),
     Q('François Ier a invité en France un grand artiste italien. Lequel ?', ['Léonard de Vinci', 'Picasso', 'Mozart'], 'Léonard de Vinci a fini sa vie en France, près d’Amboise.', '🎨'),
     Q('Au Moyen Âge, qui vit dans le château fort ?', ['le seigneur', 'le président', 'les astronautes'], 'Le seigneur protège les paysans et vit dans le château fort.', '🏰'),
     Q('Les discriminations, c’est…', ['interdit par la loi', 'permis', 'obligatoire'], 'Tous les êtres humains sont égaux en dignité et en droits.', '⚖️')],
    // CM2
    [Q('Pourquoi voit-on la Lune changer de forme ?', ['on voit plus ou moins sa partie éclairée par le Soleil', 'elle grossit et maigrit', 'les nuages la cachent'], 'La Lune ne change pas : on voit seulement une partie plus ou moins grande de sa face éclairée.', '🌓'),
     Q('La météo, c’est…', ['le temps qu’il fait sur quelques jours', 'le temps moyen sur 30 ans', 'la saison'], 'La météo : quelques jours. Le climat : la moyenne sur de longues années.', '🌦️'),
     Q('Dans un circuit électrique, la lampe s’allume quand…', ['le circuit est fermé', 'le circuit est ouvert', 'il n’y a pas de pile'], 'Le courant ne passe que si le circuit est fermé, sans interruption.', '💡'),
     Q('Que rappelle un monument aux morts ?', ['les soldats de la commune morts pendant les guerres', 'les rois de France', 'les anciens maires'], 'Les monuments aux morts honorent les soldats morts, surtout pendant la guerre de 1914-1918.', '🕊️'),
     Q('Pendant la Seconde Guerre mondiale, les résistants…', ['luttaient contre l’occupation allemande', 'aidaient l’occupant', 'étaient en vacances'], 'La Résistance s’oppose à l’occupation et au régime de Vichy.', '✊'),
     Q('Quel est le symbole de la République représenté par une femme ?', ['Marianne', 'Jeanne', 'Charlotte'], 'Marianne est le symbole de la République française.', '🇫🇷'),
     Q('La laïcité, c’est…', ['l’État ne favorise aucune religion et respecte toutes les croyances', 'une religion', 'interdire de croire'], 'Chacun est libre de croire ou de ne pas croire.', '🤝'),
     Q('Quel moyen de transport pollue le moins ?', ['le vélo', 'la voiture', 'l’avion'], 'Le vélo et la marche ne rejettent pas de gaz polluants.', '🚲'),
     Q('Quel organe fait passer les aliments dans le sang ?', ['l’intestin grêle', 'le poumon', 'le cerveau'], 'Dans l’intestin grêle, les aliments digérés passent dans le sang.', '〰️'),
     Q('L’âge industriel, c’est l’époque…', ['des usines, des machines à vapeur et du train', 'des châteaux forts', 'des dinosaures'], 'Au XIXᵉ siècle, les usines et le chemin de fer transforment la France.', '🏭')]
  ];
  M.quiz({
    id: 'questionner-monde', nom: 'Questionner le monde', icone: '🌍', theme: 'monde', niveaux: ['CP', 'CE1', 'CE2', 'CM1', 'CM2'], manches: 6,
    description: 'Sciences, histoire, géographie et vivre ensemble, selon le niveau.',
    questions: kit => SCIENCES[niv(kit)].map(q => ({ ...q, bon: 0 }))
  });

  /* ---------- ♻️ Le tri des déchets (CE2 → CM2) ---------- */
  M.tri({
    id: 'tri-dechets', nom: 'Le tri des déchets', icone: '♻️', theme: 'monde', niveaux: ['CE2', 'CM1', 'CM2'], manches: 8,
    description: 'Trier ses déchets pour mieux habiter la planète (les consignes peuvent varier selon les communes).',
    question: 'Dans quelle poubelle va {nom} ?',
    bacs: [{ id: 'jaune', nom: 'Bac jaune (emballages, papiers)', visuel: '🟨', couleur: '#E0B620' }, { id: 'verre', nom: 'Verre', visuel: '🟩', couleur: '#3AA54A' },
      { id: 'compost', nom: 'Compost (restes de repas)', visuel: '🟫', couleur: '#A86B3C' }, { id: 'ordures', nom: 'Ordures ménagères', visuel: '⬛', couleur: '#555' }],
    objets: [['🧴', 'la bouteille en plastique', 'jaune'], ['🥫', 'la boîte de conserve', 'jaune'], ['📦', 'le carton', 'jaune'], ['📰', 'le journal', 'jaune'], ['🥛', 'la brique de lait', 'jaune'],
      ['🍾', 'la bouteille en verre', 'verre'], ['🫙', 'le pot de confiture en verre', 'verre', 'Le pot en verre va dans le conteneur à verre (sans le couvercle).'],
      ['🍌', 'la peau de banane', 'compost'], ['🍎', 'le trognon de pomme', 'compost'], ['🥚', 'les coquilles d’œuf', 'compost'], ['🥕', 'les épluchures de carottes', 'compost'],
      ['🤧', 'le mouchoir usagé', 'ordures', 'Un mouchoir sale ne se recycle pas : ordures ménagères.'], ['🩹', 'le pansement', 'ordures'],
      ['🍽️', 'l’assiette cassée', 'ordures', 'Attention : la vaisselle cassée ne va pas dans le verre ! Elle va aux ordures ménagères.']]
  });

  /* ---------- 🇬🇧 English words (CP → CM2) ---------- */
  const EN = [
    // CP : bonjour, merci, couleurs, nombres
    [['Hello', 'Bonjour'], ['Goodbye', 'Au revoir'], ['Thank you', 'Merci'], ['Please', 'S’il te plaît'], ['Yes', 'Oui'], ['No', 'Non'],
     ['Red', '🔴'], ['Blue', '🔵'], ['Green', '🟢'], ['Yellow', '🟡'], ['One', '1'], ['Three', '3'], ['Five', '5']],
    // CE1 : se présenter, animaux
    [['What’s your name?', 'Comment tu t’appelles ?'], ['How old are you?', 'Quel âge as-tu ?'], ['I’m eight.', 'J’ai huit ans.'], ['My name is Tom.', 'Je m’appelle Tom.'],
     ['A cat', '🐱'], ['A dog', '🐶'], ['A bird', '🐦'], ['A fish', '🐟'], ['A rabbit', '🐰'], ['A horse', '🐴']],
    // CE2 : jours, mois, date
    [['Monday', 'lundi'], ['Tuesday', 'mardi'], ['Wednesday', 'mercredi'], ['Thursday', 'jeudi'], ['Friday', 'vendredi'], ['Saturday', 'samedi'], ['Sunday', 'dimanche'],
     ['January', 'janvier'], ['April', 'avril'], ['July', 'juillet'], ['December', 'décembre'], ['What’s the date today?', 'Quelle est la date aujourd’hui ?']],
    // CM1 : nouvelles, description
    [['How are you?', 'Comment vas-tu ?'], ['I’m fine, thank you.', 'Je vais bien, merci.'], ['I’m tired.', 'Je suis fatigué.'], ['She has got long hair.', 'Elle a les cheveux longs.'],
     ['He is tall.', 'Il est grand.'], ['It’s a big elephant.', 'C’est un gros éléphant.'], ['My sister', 'Ma sœur'], ['My grandfather', 'Mon grand-père']],
    // CM2 : heure, annonce, histoire
    [['It’s three o’clock.', 'Il est trois heures.'], ['It’s half past six.', 'Il est six heures et demie.'], ['The party is on Saturday.', 'La fête est samedi.'],
     ['See you at the park!', 'Rendez-vous au parc !'], ['Once upon a time…', 'Il était une fois…'], ['Where do you live?', 'Où habites-tu ?'], ['I live in France.', 'J’habite en France.'], ['The end', 'Fin']]
  ];
  M.quiz({
    id: 'english-words', nom: 'English words', icone: '🇬🇧', theme: 'anglais', niveaux: ['CP', 'CE1', 'CE2', 'CM1', 'CM2'], manches: 8,
    description: 'Écouter des mots et des phrases en anglais et trouver leur sens.',
    questions: kit => {
      const liste = EN[niv(kit)];
      return liste.map(([en, fr]) => {
        const memeType = liste.filter(([, f]) => (/[A-Za-zÀ-ÿ]/.test(f)) === (/[A-Za-zÀ-ÿ]/.test(fr)) && f !== fr);
        return { q: `🔊 « ${en} » : qu’est-ce que ça veut dire ?`, dire: en, langue: 'en-GB', options: [fr, ...M.melanger(memeType).slice(0, 2).map(x => x[1])],
          explication: `${en} = ${fr}`, direExplication: en, langueExplication: 'en-GB' };
      });
    }
  });
})();
