# Qui Mange Ce Midi ? 🍽️

Application web familiale pour gérer les inscriptions aux repas du midi.

## Fonctionnalités

- ✅ Compteur de participants en temps réel
- 👨‍👩‍👧‍👦 Liste des membres de la famille (Papa, Maman, David, Apo, Clovis, Julien)
- 👤 Possibilité d'ajouter des invités
- 📱 Design responsive optimisé pour mobile
- 🎨 Interface rétro et colorée
- 💾 Sauvegarde automatique dans le navigateur (localStorage)
- 🔄 Réinitialisation automatique chaque jour

## Installation locale

1. Installer les dépendances :
```bash
cd whos-eating-app
npm install
```

2. Lancer le serveur de développement :
```bash
npm start
```

3. Ouvrir votre navigateur à l'adresse : `http://localhost:4200`

## Déploiement sur GitHub Pages

### Méthode automatique (GitHub Actions)

Le déploiement est automatique à chaque push sur la branche `main`. Le workflow GitHub Actions se charge de :
- Installer les dépendances
- Construire l'application
- Déployer sur GitHub Pages

### Méthode manuelle

1. Construire l'application :
```bash
cd whos-eating-app
npm run build -- --base-href=/whos-eating/
```

2. Installer angular-cli-ghpages :
```bash
npm install -g angular-cli-ghpages
```

3. Déployer :
```bash
npx angular-cli-ghpages --dir=dist/whos-eating-app/browser
```

## Configuration GitHub Pages

1. Aller dans **Settings** > **Pages** de votre dépôt GitHub
2. Dans **Source**, sélectionner **Deploy from a branch**
3. Sélectionner la branche **gh-pages** et le dossier **/ (root)**
4. Cliquer sur **Save**

Votre site sera disponible à : `https://[votre-username].github.io/whos-eating/`

## Utilisation

1. **S'inscrire** : Cliquez sur votre nom pour vous inscrire au repas
2. **Ajouter un invité** : Après vous être inscrit, cliquez sur le bouton avec votre nom + 👤
3. **Voir les participants** : La liste s'affiche automatiquement en bas de page
4. **Retirer un participant** : Cliquez sur le ✕ à côté du nom
5. **Réinitialiser** : Le bouton en bas permet de recommencer (les données se réinitialisent automatiquement chaque jour)

## Technologies utilisées

- Angular 19
- TypeScript
- CSS3
- LocalStorage API

## Design

Design rétro inspiré des années 80-90 avec :
- Couleurs vives et joyeuses
- Police Comic Sans MS pour un effet fun
- Animations et effets au survol
- Responsive pour une utilisation mobile optimale

