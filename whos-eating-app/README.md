# 🍽️ Who's Eating App

Application web moderne en Angular pour gérer les participants aux repas du midi et du soir avec un thème médiéval élégant.

## ✨ Fonctionnalités

### 🎯 Gestion des repas
- **Midi & Soir séparés** : Gérez indépendamment les participants pour le déjeuner (☀️) et le dîner (🌙)
- **Bascule jour/nuit** : Passez facilement entre les deux repas avec un bouton interactif
- **Compte en temps réel** : Visualisez le nombre de convives avec des assiettes positionnées dynamiquement autour d'une table
- **Membres de la famille** : 6 membres prédéfinis (Papa, Maman, David, Apo, Clovis, Julien)
- **Invités** : Chaque membre peut ajouter ses propres invités

### 🛒 Liste de courses
- **Interface médiévale** : Design parchemin avec bordures dorées et effets visuels
- **Gestion d'items** : Ajouter, cocher et supprimer des articles
- **Tri automatique** : Les articles non cochés remontent en haut de la liste
- **Animation magique** : Effet d'étoiles scintillantes lors de la suppression
- **Tornade bleue** : Animation spectaculaire lors de l'effacement complet (4 secondes)
- **Effets de barrage** : Ligne tracée à la main pour les articles cochés
- **Mode sombre** : Thème médiéval nocturne chaleureux avec couleurs orangées

### 🎨 Design & Animations
- **Thème médiéval** : Château, torches, bannières, parchemins, ornements
- **Responsive** : Adapté aux écrans mobiles et desktop
- **Easter Egg** : Bougie cliquable avec musique surprise (Kaamelott)
- **Animations CSS** : Transitions fluides, effets de hover, explosions de particules
- **Police médiévale** : MedievalSharp pour une immersion totale

### 🔥 Synchronisation Firebase
- **Temps réel** : Tous les changements sont synchronisés instantanément
- **Persistance** : Les données sont sauvegardées dans Firebase Realtime Database
- **Multi-appareil** : Accessible depuis n'importe quel appareil connecté
- **Structure optimisée** : Séparation lunch/dinner avec suffixes de date

## 🚀 Installation

### Prérequis
- Node.js (v18 ou supérieur)
- npm ou yarn
- Angular CLI (v19.2.9)

### Installation des dépendances

```bash
npm install
```

### Configuration Firebase

Le projet utilise Firebase Realtime Database. La configuration est déjà incluse dans le code.

**Règles Firebase nécessaires** :
```json
{
  "rules": {
    "lunches": {
      "$date": {
        ".read": true,
        ".write": true
      }
    }
  }
}
```

## 💻 Développement

### Serveur de développement

```bash
ng serve
```

Ouvrez votre navigateur sur `http://localhost:4200/`

### Build de production

```bash
ng build
```

Les fichiers compilés seront dans le dossier `dist/`

### Tests

```bash
ng test
```

## 📁 Structure du projet

```
src/
├── app/
│   ├── components/
│   │   ├── shopping-list/          # Liste de courses
│   │   │   ├── shopping-list.component.ts
│   │   │   ├── shopping-list.component.html
│   │   │   └── shopping-list.component.css  (1300+ lignes CSS)
│   │   ├── header/
│   │   ├── family-selector/
│   │   └── counter/
│   ├── services/
│   │   ├── data.service.ts         # Service Firebase
│   │   └── theme.service.ts        # Gestion du thème
│   ├── app.component.ts            # Composant principal
│   ├── app.component.html
│   └── app.component.css
├── assets/
│   └── perceval-cheque-de-caution.mp3  # Easter egg audio
└── environments/
    └── environment.ts
```

## 🎯 Utilisation

### Ajouter un participant
1. Cliquez sur le bouton d'un membre de la famille
2. Le membre est ajouté à la liste des participants
3. Son assiette apparaît autour de la table

### Ajouter un invité
1. Après avoir ajouté un membre, cliquez sur le bouton 🎭+
2. Entrez le nom de l'invité
3. L'invité est associé au membre qui l'a ajouté

### Basculer entre midi et soir
- Cliquez sur le bouton ☀️/🌙 en haut à droite
- Les deux listes sont complètement indépendantes

### Utiliser la liste de courses
1. Cliquez sur l'icône 🛒 en haut à droite
2. Ajoutez des articles avec le formulaire
3. Cochez les articles achetés (ils descendent automatiquement)
4. Supprimez un article avec le bouton 🪄 (animation magique)
5. Videz toute la liste avec le bouton 🧙🏻‍ (tornade bleue + étoiles)

### Easter Egg
Cliquez sur la bougie 🕯️ pour activer une surprise musicale de Kaamelott !

## 🛠️ Technologies

- **Framework** : Angular 19.2.9
- **Langage** : TypeScript 5.7
- **Backend** : Firebase Realtime Database
- **Animations** : Angular Animations + CSS3
- **Style** : CSS pur (pas de framework CSS)
- **Police** : MedievalSharp (Google Fonts)

## 🎨 Personnalisation

### Modifier les membres de la famille
Éditez le tableau dans `app.component.ts` :
```typescript
familyMembers = ['Papa', 'Maman', 'David', 'Apo', 'Clovis', 'Julien'];
```

### Changer les couleurs du thème
Modifiez les variables CSS dans `shopping-list.component.css` :
- Mode jour : couleurs dorées (#d4af37, #B8941F)
- Mode nuit : couleurs orangées (#ff8c42, #ffb347)

### Ajuster les animations
- Vitesse des étoiles : `animation: magicSparkle 3s` (ligne ~489)
- Durée de la tornade : `animation: tornadoSpin 4s` (ligne ~515)

## 🐛 Dépannage

### Les participants ne s'ajoutent pas
- Vérifiez la console (F12) pour voir les logs Firebase
- Vérifiez que les règles Firebase sont correctes
- Vérifiez votre connexion Internet

### L'animation ne fonctionne pas
- Rechargez la page (Ctrl+F5)
- Vérifiez que JavaScript est activé
- Essayez dans un autre navigateur

### La musique ne se lance pas
- Certains navigateurs bloquent l'autoplay audio
- Cliquez sur OK dans l'alerte qui apparaît
- Vérifiez que le fichier MP3 existe dans `public/assets/`

## 📝 Changelog

### Version actuelle
- ✅ Séparation midi/soir avec Firebase
- ✅ Liste de courses avec thème médiéval
- ✅ Animation de tornade bleue (4s)
- ✅ 8 étoiles magiques randomisées
- ✅ Mode sombre chaleureux
- ✅ Easter egg musical
- ✅ Responsive design complet

## 👨‍💻 Développement

Projet généré avec [Angular CLI](https://github.com/angular/angular-cli) version 19.2.9

## 📄 Licence

Ce projet est privé et à usage personnel.

---

**Bon appétit ! 🍽️**
