# Candidature au stage Alpha to Omega, Léo Arnaud

Site de présentation réalisé pour candidater au stage **Développement web, IA et gouvernance numérique** d'Alpha to Omega (Toulouse). Il tient lieu de CV et de lettre de motivation, comme demandé dans le document de candidature.

- Site en ligne : à compléter après le déploiement (adresse `*.pages.dev` de Cloudflare Pages)
- Dépôt : https://github.com/leoarnaud-rodez/a2o-candidature

## Contenu du site

| Page | Rôle |
|---|---|
| `index.html` | Accueil : l'essentiel et le plan du site |
| `stage.html` | Ma lecture des quatre axes de l'offre : ce que je comprends, ce que je sais faire, ce que je dois apprendre |
| `parcours.html` | Formation, engagements, expériences, compétences avec leur vrai niveau |
| `projets.html` | Projets et ce qu'ils montrent |
| `ia.html` | Outils d'IA utilisés, qui a fait quoi, limites, difficultés |
| `contact.html` | Motivation, calendrier, Toulouse, coordonnées |
| `mentions-legales.html` | Mentions légales et données personnelles |

## Choix techniques

- **HTML et CSS, sans framework ni étape de construction.** L'offre mentionne Astro, que je ne connais pas : j'ai gardé des langages que je connais pour garder la maîtrise du projet.
- **Un seul fichier JavaScript** (`public/assets/js/main.js`), écrit avec l'aide de Claude : thème clair ou sombre, menu sur téléphone et animations légères de l'accueil (particules en canvas, forme liquide en SVG). Le site reste lisible sans lui.
- **Animations** : discrètes, mises en pause hors écran et dans un onglet masqué, et adoucies si le visiteur a limité les animations dans son navigateur ou son système (particules trois fois plus lentes et moins nombreuses, sans réaction à la souris, forme liquide trois fois plus lente).
- **Aucun traceur, aucun cookie, aucun appel à un service tiers.** La police (Plus Jakarta Sans, licence SIL OFL 1.1) est hébergée dans le dépôt, sans Google Fonts. Il n'y a donc pas de bandeau de consentement.
- **Sécurité** : en-têtes HTTP et politique de sécurité du contenu (CSP) stricte, définis dans `public/_headers`. Cette politique interdit les scripts et styles écrits dans les pages : tout est dans les fichiers `.css` et `.js`.
- **Accessibilité** : lien d'évitement, navigation au clavier, contrastes vérifiés dans les deux thèmes, un seul `h1` par page, texte de remplacement sur l'image.
- **Thème** : clair par défaut, thème sombre au choix du visiteur.

## Structure du dépôt

```
public/                     tout ce que Cloudflare Pages publie
  *.html                    les pages
  assets/css/main.css       la feuille de style unique
  assets/js/main.js         le seul script
  assets/fonts/             la police
  assets/img/               l'icône
  docs/CV-Leo-Arnaud.pdf    le CV public (sans numéro de téléphone)
  _headers                  en-têtes HTTP et CSP
  _redirects                raccourci /cv vers le PDF
  robots.txt
```

## Voir le site en local

```bash
cd public
python -m http.server 8080
```

Puis ouvrir http://localhost:8080. Les liens internes commencent par `/` : il faut donc un petit serveur, l'ouverture directe du fichier ne suffit pas.

## Déploiement sur Cloudflare Pages

1. Cloudflare, Workers et Pages, Créer, Pages, Se connecter à Git, puis choisir ce dépôt.
2. Branche de production : `main`.
3. Commande de build : laisser vide.
4. Répertoire de sortie : `public`.
5. Chaque envoi sur `main` redéploie le site.

## Vérifications effectuées avant la mise en ligne

- Affichage contrôlé en 5 largeurs d'écran (de 320 à 1440 px), en thème clair et sombre, avec et sans « réduire les animations ».
- Aucun débordement horizontal, aucune erreur dans la console du navigateur.
- Tous les liens internes testés, page 404 vérifiée, en-têtes de sécurité présents.
- Audit d'accessibilité automatique (axe-core) sans erreur sur toutes les pages, dans les deux thèmes.
- Un audit automatique ne remplace pas un test manuel : relecture et navigation au clavier à faire avant l'envoi.

## Usage de l'IA

Ce site a été développé avec **Claude** (Anthropic) : analyse de l'offre, structure, premières versions du code et des textes, tests, adaptation du CV. Le détail de ce qui vient de moi, de ce qui vient de l'outil et de ce que je ne maîtrise pas encore est publié sur la page [Comment j'ai utilisé l'IA](public/ia.html).

## Méthode de travail Git

- `main` contient la version en ligne.
- Une branche par chantier : `feat/...` pour une fonctionnalité ou une page, `fix/...` pour une correction, `docs/...` pour la documentation.
- Des messages de commit courts, au présent, qui disent ce qui change : `feat: ajoute la page projets`.
