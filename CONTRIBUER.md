# 🐾 Ajouter ton exercice à Petits Pas

Merci de vouloir enrichir Petits Pas ! Chaque exercice est un **petit dossier indépendant**. Tu n'as pas besoin de toucher au reste de l'application.

## En 5 étapes

1. **Copie le modèle.** Duplique le dossier `exercices/eclate-bulles/` et renomme-le, par exemple `exercices/memory-animaux/`.
2. **Change la fiche d'identité**, en bas de `exercice.js` :
   ```js
   PetitsPas.ajouter({
     id: 'memory-animaux',        // = nom du dossier, unique
     nom: 'Memory des animaux',   // affiché sur la carte
     icone: '🐘',
     theme: 'logique',            // voir la liste ci-dessous
     niveaux: ['PS', 'MS'],       // niveaux scolaires
     auteur: 'Ton prénom',
     description: 'Retrouver les paires d’animaux.',
     lancer                        // ta fonction principale
   });
   ```
3. **Écris ton jeu** dans la fonction `lancer(zone, kit)`. Dessine dans `zone` et utilise `kit` pour les sons, la voix et les récompenses.
4. **Ajoute une ligne** dans `index.html`, dans la partie « Les exercices » :
   ```html
   <script src="exercices/memory-animaux/exercice.js"></script>
   ```
5. **Teste sur une vraie tablette**, puis propose ton exercice (voir « Proposer son exercice »).

> 💡 Tu peux te faire aider par une IA : donne-lui ce fichier et l’exercice modèle, puis décris ton idée de jeu.

## Thèmes disponibles

| id | Thème |
|---|---|
| `ecriture` | ✏️ Écriture |
| `lecture` | 📖 Lecture |
| `francais` | 📝 Français (orthographe, conjugaison…) |
| `coloriage` | 🎨 Coloriage |
| `calcul` | 🧮 Calcul & maths |
| `anglais` | 🇬🇧 Anglais |
| `dessin` | 🖍️ Dessin |
| `agilite` | 🫧 Agilité |
| `logique` | 🧩 Logique |
| `musique` | 🎵 Musique |
| `nature` | 🌳 Nature & animaux |
| `autres` | ✨ Autres jeux |

## Niveaux scolaires

| id | Niveau | Âge indicatif | Cycle |
|---|---|---|---|
| `PS` | Petite section | 3–4 ans | 1 |
| `MS` | Moyenne section | 4–5 ans | 1 |
| `GS` | Grande section | 5–6 ans | 1 |
| `CP` | CP | 6–7 ans | 2 |
| `CE1` | CE1 | 7–8 ans | 2 |
| `CE2` | CE2 | 8–9 ans | 2 |
| `CM1` | CM1 | 9–10 ans | 3 |
| `CM2` | CM2 | 10–11 ans | 3 |

Un exercice peut convenir à plusieurs niveaux. Un niveau reste « 🔒 bientôt » tant qu’il n’a aucun exercice.
Pour bien choisir, appuie-toi sur les attendus des programmes officiels du cycle concerné.

## La boîte à outils (`kit`)

| Outil | À quoi ça sert |
|---|---|
| `kit.el(tag, props, ...enfants)` | Créer un élément HTML. |
| `kit.sons.bravo()` | Petit carillon de réussite. |
| `kit.sons.pop(n)` | « Pop » ; `n` fait varier la note. |
| `kit.sons.rate()` | « Boing » doux pour une erreur, jamais punitif. |
| `kit.sons.clic()` | Petit clic discret. |
| `kit.sons.note(freq, delai, duree)` | Jouer une note (pour un jeu de musique). |
| `kit.dire(texte, langue)` | Lire un texte à voix haute ; en français par défaut, `'en-GB'` pour l’anglais. |
| `kit.partie(zone, { manches, jouer, rejouer })` | Déroulé « en manches » tout prêt : étoiles ⭐⚪, une manche après l’autre, grand final. `jouer(scene, fini, plusTard, numero)` dessine une manche et appelle `fini()` quand elle est réussie. Voir `exercices/s-ou-ss/`. |
| `kit.confettis(x, y, n, couleurs)` | Lancer des confettis en coordonnées écran. |
| `kit.feuxDArtifice()` | Grand final : fanfare et feux d'artifice. |
| `kit.felicitations(null, { encore })` | Écran « Bravo Léa ! » avec les boutons Encore et Menu (`null` = message par défaut avec le prénom). |
| `kit.prenom` | Le prénom de l’enfant qui joue (vide en mode invité). |
| `kit.niveau` | Son niveau (`'PS'`… `'CE2'`), pour adapter la difficulté ; `null` en invité. |
| `kit.ouvrir(titre, rendu)` | Ouvrir un sous-écran, avec retour automatique. |
| `kit.remplacer(titre, rendu)` | Remplacer l’écran actuel (exercice suivant, recommencer). |
| `kit.retour()` | Revenir à l’écran précédent. |
| `kit.titre(texte)` | Changer le titre en haut. |
| `kit.difficulte()` | Tolérance choisie par le parent : `{ trace, couverture, horsTrait, coloriage }`. |
| `kit.indices()` | `true` si le parent veut des aides visuelles. |
| `kit.progres.lire(cle, defaut)` | Lire les progrès de ton exercice, **pour l’enfant qui joue**. |
| `kit.progres.ecrire(cle, valeur)` | Écrire les progrès de ton exercice. |
| `kit.surRedimension(fn)` | Être prévenu quand la tablette tourne. |
| `kit.preparerToile(canvas, l, h)` | Préparer un canvas net sur écran Retina ; renvoie `{ ctx, dpr }`. |
| `kit.couleurs` | Les 8 couleurs numérotées (1 jaune … 8 violet). |
| `kit.arcEnCiel` | 7 couleurs vives. |
| `kit.encre` | La couleur des traits. |

Les classes CSS communes : `.pp-consigne`, `.pp-carte`, `.pp-aide` (`.ok` en vert), `.pp-bouton` (`.principal`), `.ecran`, `.ecran.lateral` (palette sur le côté en paysage), `.scene`, `.cadre`, `.barre`, `.bouton-rond`, `.pastille`, `.message`, `.tuiles`/`.tuile`, `.grille`/`.carte`. Si ton exercice a besoin de son propre style, garde-le dans ton fichier en préfixant tes classes (voir `exercices/compter/`).

## Plusieurs exercices dans un même dossier

Un dossier peut inscrire plusieurs exercices qui partagent des données. C’est le cas de `exercices/lecture/` : `mots.js` contient la banque de mots (mot, emoji, sons entendus) et les outils de couleur, et `exercices.js` inscrit 5 exercices. Pour enrichir la lecture, il suffit souvent d’**ajouter des mots** dans `mots.js`.

## Les règles de la communauté

**Pour les enfants**
- Pas de publicité, pas d’achat, pas de lien vers l’extérieur.
- Pas de son agressif ni de message négatif : une erreur donne un « boing » doux et on réessaie.
- De gros boutons (au moins 60 px), peu de texte et une consigne lue à voix haute.
- Toujours une récompense à la fin.

**Sécurité et vie privée**
- Aucune connexion réseau (`fetch`, images ou scripts externes) : tout doit être dans ton dossier.
- Aucune donnée personnelle collectée. Le prénom et les progrès restent sur la tablette ; utilise `kit.prenom` et `kit.progres`, jamais `localStorage` directement.
- Ne contourne pas l’alerte de temps d’écran (elle est gérée par l’application).
- Ne touche pas aux autres exercices ni au kit. Si le kit doit évoluer, propose-le à part.

**Droits d’auteur**
- Uniquement des dessins, sons et personnages **originaux**, ou du domaine public.
- Pas de personnages de dessins animés, de livres ou de marques (Stitch, Petit Ours Brun, Pat’Patrouille…), même redessinés.

## Proposer son exercice

Les exercices sont relus avant d’être publiés :

1. Tu proposes ton dossier, par exemple par une *pull request* sur GitHub.
2. Un ou deux parents relecteurs vérifient le code, testent sur tablette et contrôlent le respect des règles.
3. Une fois accepté, l’exercice apparaît pour tout le monde.

Merci ! 🌈
