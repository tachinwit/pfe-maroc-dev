# DevMaroc - Frontend React (Inertia.js)

Bienvenue dans le code source de **DevMaroc** ! Ce projet a été réorganisé pour être propre, modulaire et facile à comprendre pour toute l'équipe.

## 🏗️ Structure du Projet

Le projet suit une architecture standard pour les applications React propulsées par **Inertia.js** :

- **`src/pages/`** : Contient les composants "Pages". Chaque fichier correspond à une route accessible depuis le backend. Elles sont automatiquement résolues par Inertia.
- **`src/components/`** :
  - **`common/`** : Composants UI réutilisables (Toast, SkeletonLoader, etc.).
  - **`forum/`** : Composants spécifiques à la section Forum.
- **`src/Layouts/`** : Contient `MainLayout.jsx`, le layout unique qui entoure toutes les pages (Navbar, Sidebar, Thème).
- **`src/services/`** : Logique de communication externe (`api.js` pour les requêtes, `echo.js` pour les notifications en temps réel).
- **`src/styles/`** : Centralisation du design dans `App.css`. Plus de styles "inline" encombrants dans les fichiers JSX !

## 🚀 Installation & Exécution

1. Installer les dépendances :
   ```bash
   npm install
   ```
2. Lancer le serveur de développement :
   ```bash
   npm start
   ```

## 🛠️ Stack Technique
- **React** (UI)
- **Inertia.js** (Bridge entre React et le Backend)
- **Lucide React** (Icônes)
- **Axios** (Requêtes API)

---
*Organisé avec ❤️ par Antigravity pour l'équipe DevMaroc.*
