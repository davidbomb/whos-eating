# Qui Mange Ce Midi ? 🍽️

Application web familiale pour gérer les inscriptions aux repas du midi avec synchronisation en temps réel.

## ✨ Fonctionnalités

- 🔄 **Synchronisation en temps réel** entre tous les appareils via Firebase
- 🍽️ Table à manger interactive avec assiettes qui apparaissent
- 👨‍👩‍👧‍👦 Liste des membres de la famille (Papa, Maman, David, Apo, Clovis, Julien)
- 👤 Possibilité d'ajouter des invités
- 📱 Design responsive optimisé pour mobile
- 🎨 Interface rétro et colorée
- 🔄 Réinitialisation automatique chaque jour

## 🚀 DÉPLOIEMENT SUR GITHUB PAGES (PRODUCTION)

### Méthode simple (recommandée)

**Une seule commande pour tout déployer :**

```bash
cd whos-eating-app
npm run deploy
```

Cette commande va :
1. ✅ Compiler l'application en mode production
2. ✅ Optimiser les fichiers (minification, compression)
3. ✅ Déployer automatiquement sur GitHub Pages
4. ✅ Créer/mettre à jour la branche `gh-pages`

### Méthode manuelle (étape par étape)

Si vous préférez contrôler chaque étape :

```bash
# 1. Aller dans le dossier de l'application
cd whos-eating-app

# 2. Compiler en mode production
ng build --configuration production --base-href 'https://davidbomb.github.io/whos-eating/'

# 3. Déployer sur GitHub Pages
npx angular-cli-ghpages --dir=dist/whos-eating-app/browser
```

### ⏱️ Délais

- **Compilation** : 30 secondes
- **Déploiement** : 10 secondes
- **Mise en ligne sur GitHub Pages** : 2-3 minutes
- **Videz le cache du navigateur** : Ctrl+Shift+R (ou Cmd+Shift+R sur Mac)

### 🌐 Accès au site

Votre site sera disponible sur :
**https://davidbomb.github.io/whos-eating/**

## 🔥 Configuration Firebase (OBLIGATOIRE)

L'application utilise Firebase Realtime Database pour la synchronisation en temps réel.

### Configuration déjà faite ✅

- ✅ Firebase installé
- ✅ Configuration intégrée dans le code
- ✅ Service de synchronisation créé

### Vérification des règles Firebase

**Important** : Assurez-vous que les règles Firebase sont configurées correctement :

1. Allez sur https://console.firebase.google.com/project/whos-eating/database/whos-eating-default-rtdb/rules
2. Vérifiez que les règles sont :

```json
{
  "rules": {
    "lunches": {
      ".read": true,
      ".write": true
    }
  }
}
```

3. Cliquez sur **Publier** si nécessaire

### 🧪 Tester la synchronisation

1. Ouvrez le site sur **deux appareils différents** (ou deux navigateurs)
2. Inscrivez-vous sur le premier appareil
3. Regardez le deuxième → l'assiette apparaît instantanément ! ✨

## 💻 Installation locale (développement)

### Prérequis

- Node.js 22.x ou supérieur
- Angular CLI 19.x

### Installation

```bash
# 1. Cloner le dépôt
git clone https://github.com/davidbomb/whos-eating.git
cd whos-eating/whos-eating-app

# 2. Installer les dépendances
npm install

# 3. Lancer le serveur de développement
ng serve
```

### Accès local

Ouvrez votre navigateur à l'adresse : **http://localhost:4200**

## 📋 Workflow complet pour une mise à jour

```bash
# 1. Faire vos modifications dans le code
# (éditer les fichiers dans src/)

# 2. Sauvegarder dans Git (optionnel mais recommandé)
git add .
git commit -m "Description de vos modifications"
git push origin main

# 3. Déployer sur GitHub Pages
npm run deploy

# 4. Attendre 2-3 minutes puis tester
# Ouvrir https://davidbomb.github.io/whos-eating/
# Ctrl+Shift+R pour vider le cache
```

## 🎯 Utilisation de l'application

1. **S'inscrire** : Cliquez sur votre nom pour vous inscrire au repas
   - Une assiette apparaît sur la table
   - Tous les appareils connectés voient le changement instantanément

2. **Ajouter un invité** : 
   - Après vous être inscrit, cliquez sur le bouton "👤+" sous votre nom
   - Saisissez le nom de l'invité
   - L'invité apparaît dans la liste de tous les participants

3. **Se désinscrire** :
   - Cliquez sur le bouton "✕" sous votre nom
   - Vous et vos invités serez retirés automatiquement

4. **Voir les participants** : 
   - La liste complète s'affiche en bas de page
   - Le compteur sur la table indique le nombre total

5. **Réinitialiser** : 
   - Le bouton "🔄 Réinitialiser" efface toutes les inscriptions
   - Les données se réinitialisent automatiquement chaque jour à minuit

## 🛠️ Technologies utilisées

- **Angular 19** - Framework frontend
- **TypeScript** - Langage de programmation
- **Firebase Realtime Database** - Synchronisation en temps réel
- **CSS3** - Design et animations
- **GitHub Pages** - Hébergement gratuit

## 🎨 Design

Design rétro inspiré des années 80-90 avec :
- 🪵 Table en bois vue du dessus (effet 3D)
- 🍽️ Assiettes qui apparaissent progressivement en cercle
- 🎨 Couleurs vives et joyeuses
- ✏️ Police Comic Sans MS pour un effet fun et familial
- ✨ Animations et effets au survol
- 📱 Responsive pour une utilisation mobile optimale

## 📁 Structure du projet

```
whos-eating/
├── whos-eating-app/          # Application Angular
│   ├── src/
│   │   ├── app/
│   │   │   ├── services/
│   │   │   │   └── data.service.ts    # Service Firebase
│   │   │   ├── app.component.ts       # Composant principal
│   │   │   ├── app.component.html     # Template
│   │   │   └── app.component.css      # Styles
│   │   └── index.html
│   ├── package.json
│   └── angular.json
├── FIREBASE_SETUP.md         # Guide détaillé Firebase
└── README.md                 # Ce fichier
```

## 🔒 Sécurité

Les règles Firebase actuelles permettent à tout le monde de lire/écrire dans la base de données.
C'est acceptable pour une application familiale privée, mais pour une meilleure sécurité vous pouvez :

1. Restreindre l'accès par domaine dans Firebase Console
2. Ajouter une authentification simple
3. Utiliser des règles Firebase plus restrictives

## 📞 Support

Pour plus de détails sur la configuration Firebase, consultez **FIREBASE_SETUP.md**

## 📝 Logs de débogage

Pour voir les logs de synchronisation Firebase, ouvrez la console du navigateur (F12) :
- ✅ Firebase initialisé avec succès
- 🔍 Écoute des changements
- 📡 Données reçues de Firebase
- 💾 Sauvegarde dans Firebase

---

**Bon appétit ! 🍽️**
