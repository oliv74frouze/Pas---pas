# 🐾 Petits Pas

Des jeux éducatifs de la petite section au CM2, sur tablette, avec un profil par enfant et un contrôle du temps d’écran, **créés par une communauté de parents**.

## Ce qu’il y a dedans

| Exercice | Thème | Niveaux |
|---|---|---|
| ✏️ Les lettres / Les chiffres : repasser avec le doigt | Écriture | PS, MS |
| 🎨 Coloriage magique (4 dessins originaux) | Coloriage | PS, MS, GS |
| 🍎 Compte ! : compter de 1 à 5 | Calcul | PS, MS |
| 🌈 Dessin libre | Dessin | PS → CP |
| 🫧 Éclate les bulles : *l’exercice modèle* | Agilité | PS, MS |
| 👂 J’entends le son… · 🎧 Quel son ? | Lecture | PS, MS, GS |
| 🖍️ Les lettres du mot · 🧩 Écris le mot | Lecture | GS, CP |
| 📖 Lis le mot | Lecture | GS, CP, CE1 |
| 📛 Mon prénom (en capitales, lettre par lettre) | Écriture | PS, MS, GS |
| 👏 Frappe les syllabes · 🏠 Ça commence comme… · 🔤 Les lettres jumelles | Lecture | MS, GS |
| 🚗 Petits problèmes · 🚂 Le petit train · 🔁 Les suites | Calcul & maths | MS, GS |
| 🔺 Les formes · ⚖️ Le plus… | Calcul & maths | PS, MS |
| 🐱 Où est le chat ? · 🐣 Remets dans l’ordre | Se repérer | PS–GS |
| 🛟 Flotte ou coule ? · 🧲 L’aimant | Découvrir le monde | MS, GS |
| 👏 Répète le rythme | Musique | PS, MS, GS |
| 🐰 L’imagier · 🌅 Le matin ou le soir ? · 🔠 Les lettres de mon prénom · 〰️ Graphisme · 🍴 Mets la table | Maternelle | PS, MS (GS) |
| ⚖️ La balance · 🍂 Les saisons · 📅 Les jours et les mois · 🦵 Les articulations | Maternelle | GS (CP) |
| 🧱 Dizaines et unités · 🔤 Nombres en lettres · ⚡ Calcul éclair · 🧮 Problèmes | Calcul & maths | CP → CM2, adaptés au niveau |
| 🕐 Lire l’heure · 💶 La monnaie · 🧊 Les solides · 📏 Les longueurs | Calcul & maths | CP → CM1 |
| 🟰 Fractions égales · 🔢 Le plus grand nombre · 📐 Droites · ⬛ Aire · 🦋 Symétrie | Calcul & maths | CE2 → CM2 |
| 👫 Féminin et pluriel · 🤝 Mots de même sens · 🔗 Accorder le verbe · 🌈 Accorder l’adjectif | Français | CP → CM2 |
| ⏳ Conjuguer à 4 temps · 🔍 Nature des mots · 🧩 Groupes de la phrase | Français | CE2 → CM2 |
| 📜 Les frises du temps · 🌍 Questionner le monde · ♻️ Tri des déchets | Se repérer / Monde | CP → CM2 |
| 🇬🇧 English words | Anglais | CP → CM2 |
| 🐍 S ou SS ? | Français | CE2, CM1 |
| ✍️ Le présent (-er), avec -cer et -ger | Français | CE2, CM1 |
| 🍕 Les fractions (formes générées) | Calcul & maths | CM1, CM2 |
| 🌦️ What’s the weather like? | Anglais | CE2, CM1, CM2 |

**Profils.** Chaque enfant a son profil : prénom, âge, niveau proposé (modifiable), personnage. Il arrive directement sur les jeux de son niveau, peut ouvrir « Autres niveaux » pour s’avancer ou revoir les bases, et ses étoiles sont gardées à part. Un mode invité permet d’essayer sans profil.

**Temps d’écran.** Pour chaque enfant, une limite par jour et/ou par semaine (du lundi au dimanche). Le temps n’est compté que quand l’enfant touche l’écran. Une minute avant la fin, un petit message prévient ; à la fin, un écran « C’est l’heure de faire une pause » s’affiche. Un parent peut prolonger de 5 minutes.

**Espace parents (⚙️).** Il est protégé par une petite multiplication. On y gère les profils, les limites, la tolérance (très facile, normal ou difficile), les indices de couleur, la voix et les étoiles.

**Lecture.** Les exercices utilisent un code couleur : voyelles en rouge, consonnes en bleu, sons à plusieurs lettres (ou, on, ch…) en vert, lettres muettes en gris.

Tout reste sur la tablette : rien n’est envoyé sur Internet.

## Installer sur tablette ou téléphone

L'appli est une « PWA » : elle s'installe depuis le navigateur et marche ensuite **sans connexion**.
- **Android (Chrome)** : menu ⋮ → **Installer l'application** (ou « Ajouter à l'écran d'accueil »).
- **iPad / iPhone (Safari)** : bouton Partager → **Sur l'écran d'accueil**.

Après une mise à jour du site, l'appli installée se met à jour à la prochaine ouverture avec Internet.

## Organisation

```
index.html                ← la page ; liste les exercices à charger
manifest.webmanifest      ← nom, icônes, plein écran (installation)
sw.js                     ← fonctionnement hors ligne (liste des fichiers + VERSION)
icones/                   ← icônes de l'appli
kit/
  kit.js                  ← boîte à outils commune (sons, voix, confettis…)
  profils.js              ← profils des enfants, temps d’écran, espace parents
  app.js                  ← menus, navigation, réglages parents
  style.css               ← styles communs
exercices/
  eclate-bulles/          ← 🌟 le modèle à copier
  tracer-lettres/
  coloriage-magique/      ← exercice.js + dessins.js
  compter/
  lecture/                ← mots.js (banque de mots) + 5 exercices
  moyenne-section/        ← 13 exercices d’après la fiche officielle de MS
  programmes/             ← moteurs.js (quiz, saisie, tri, ordre) + exercices PS, GS, CP → CM2
  s-ou-ss/  present-er/  fractions/  anglais-meteo/   ← CE2–CM2
  dessin-libre/
CONTRIBUER.md             ← comment ajouter ton exercice
```

Chaque exercice est **indépendant** : il s’inscrit avec `PetitsPas.ajouter({...})` et reçoit une zone d’écran et un `kit`. Les menus se construisent tout seuls. Si un exercice plante, seul son écran affiche « Oups », le reste de l’application continue.

## Lancer en local

Ouvre `index.html` dans un navigateur, sans serveur ni installation.
Pour la tablette, publie le dossier (par exemple avec GitHub Pages), ouvre l’adresse, puis choisis « Ajouter à l’écran d’accueil » pour jouer en plein écran.

## Feuille de route

- [ ] **Isolement des exercices** : chaque exercice dans un cadre « sandbox » sans accès au réseau ni aux autres exercices. C’est indispensable avant d’ouvrir les contributions au grand public.
- [ ] Exercices pour la GS, le CP et le CE1 : minuscules, mots simples, additions.
- [ ] Relier chaque exercice à une compétence des programmes (utile aux enseignants).
- [ ] Sens du tracé des lettres (flèches de départ).
- [ ] Éditeur visuel de coloriages magiques.
- [ ] Page « Découvrir les nouveaux exercices » avec le nom des contributeurs.

## Contribuer

Lis **[CONTRIBUER.md](CONTRIBUER.md)**, copie `exercices/eclate-bulles/`, et à toi de jouer !

## Où en est mon enfant ? (pilote CP)

Pour un enfant de CP, **⚙️ › son profil › 📚 Où en est … ?** montre les objectifs officiels du programme (BO du 31 octobre 2024), période par période, avec un statut calculé à partir de ses parties. Le parent peut cocher « 📒 En classe » (ce que la maîtresse travaille en ce moment, vu dans le cahier) ou « ⚠️ Fragile ». L'enfant retrouve sur son accueil **⭐ Mes révisions du moment** : cinq activités choisies d'après tout cela. Aucune démarche demandée à l'enseignant, aucune donnée ne quitte la tablette.

## Une voix plus naturelle

⚙️ › profil › Voix › **📖 Comment avoir une voix plus naturelle ?** : guide pas à pas pour iPad, Android et ordinateur.
