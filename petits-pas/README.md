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
| 🐍 S ou SS ? | Français | CE2, CM1 |
| ✍️ Le présent (-er), avec -cer et -ger | Français | CE2, CM1 |
| 🍕 Les fractions (formes générées) | Calcul & maths | CM1, CM2 |
| 🌦️ What’s the weather like? | Anglais | CE2, CM1, CM2 |

**Profils.** Chaque enfant a son profil : prénom, âge, niveau proposé (modifiable), personnage. Il arrive directement sur les jeux de son niveau, peut ouvrir « Autres niveaux » pour s’avancer ou revoir les bases, et ses étoiles sont gardées à part. Un mode invité permet d’essayer sans profil.

**Temps d’écran.** Pour chaque enfant, une limite par jour et/ou par semaine (du lundi au dimanche). Le temps n’est compté que quand l’enfant touche l’écran. Une minute avant la fin, un petit message prévient ; à la fin, un écran « C’est l’heure de faire une pause » s’affiche. Un parent peut prolonger de 5 minutes.

**Espace parents (⚙️).** Il est protégé par une petite multiplication. On y gère les profils, les limites, la tolérance (très facile, normal ou difficile), les indices de couleur, la voix et les étoiles.

**Lecture.** Les exercices utilisent un code couleur : voyelles en rouge, consonnes en bleu, sons à plusieurs lettres (ou, on, ch…) en vert, lettres muettes en gris.

Tout reste sur la tablette : rien n’est envoyé sur Internet.

## Organisation

```
index.html                ← la page ; liste les exercices à charger
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
