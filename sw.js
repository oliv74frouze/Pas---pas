/* PETITS PAS — service worker : rend l'appli installable et jouable hors ligne.
   ⚠️ Quand tu modifies ou ajoutes un fichier, augmente VERSION
   (et ajoute le nouveau fichier à la liste) pour que les tablettes se mettent à jour. */
const VERSION = 'petits-pas-v7';
const FICHIERS = [
  './',
  'exercices/anglais-meteo/exercice.js',
  'exercices/coloriage-magique/dessins.js',
  'exercices/coloriage-magique/exercice.js',
  'exercices/compter/exercice.js',
  'exercices/dessin-libre/exercice.js',
  'exercices/eclate-bulles/exercice.js',
  'exercices/fractions/exercice.js',
  'exercices/lecture/exercices.js',
  'exercices/lecture/mots.js',
  'exercices/moyenne-section/commun.js',
  'exercices/moyenne-section/langage.js',
  'exercices/moyenne-section/maths.js',
  'exercices/moyenne-section/monde.js',
  'exercices/programmes/moteurs.js',
  'exercices/programmes/maternelle.js',
  'exercices/programmes/maths.js',
  'exercices/programmes/francais.js',
  'exercices/programmes/monde.js',
  'exercices/present-er/exercice.js',
  'exercices/s-ou-ss/exercice.js',
  'exercices/tracer-lettres/exercice.js',
  'icones/apple-touch-icon.png',
  'icones/icone-192.png',
  'icones/icone-512.png',
  'icones/icone-maskable-512.png',
  'index.html',
  'kit/app.js',
  'kit/kit.js',
  'kit/profils.js',
  'kit/style.css',
  'manifest.webmanifest'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(FICHIERS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(cles => Promise.all(cles.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
// Réseau d'abord (pour avoir les nouveautés), cache si pas de connexion
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request).then(r => {
      if (r.ok && new URL(e.request.url).origin === location.origin) { const copie = r.clone(); caches.open(VERSION).then(c => c.put(e.request, copie)); }
      return r;
    }).catch(() => caches.match(e.request).then(r => r || caches.match('./')))
  );
});
