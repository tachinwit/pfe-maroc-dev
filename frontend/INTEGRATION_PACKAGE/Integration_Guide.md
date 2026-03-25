# Guide d'Intégration Backend - DevMaroc 🚀

Ce dossier contient l'interface frontend complète structurée pour **Laravel + Inertia.js**.

## Structure des Dossiers
- `resources/js/Pages` : Toutes les pages React (Login, Register, Forum, etc.).
- `resources/js/Components` : Composants réutilisables (Navbar, Tooltips, etc.).
- `resources/js/Layouts` : Le layout principal (`MainLayout.jsx`).
- `resources/css` : Fichiers Styles (App.css).

## Données Attendues (Props)
Chaque page s'attend à recevoir des données spécifiques depuis vos contrôleurs Laravel :

### 1. Navbar / Layout Global
- `auth.user` : Doit contenir `name` et `points`.

### 2. Dashboard (`Dashboard.jsx`)
- `stats` : `{ posts, replies }`
- `activities` : Liste d'objets `{ id, type, content, time }`
- `notifications` : Liste d'objets `{ id, text, time }`

### 3. Forum (`ForumPage.jsx`)
- `posts` : Collection (ou pagination) de posts avec `user`, `replies_count`, `created_at_human`.

### 4. Développeurs (`DevelopersPage.jsx`)
- `developers` : Liste de tous les utilisateurs (`name`, `title`, `location`, `points`).

## Installation Rapide
1. Copiez le contenu de `resources/js` dans votre dossier `resources/js` Laravel.
2. Copiez le contenu de `resources/css` dans `resources/css`.
3. Assurez-vous d'avoir installé : `npm install @inertiajs/react lucide-react axios`.
4. Configurez votre `vite.config.js` pour inclure `resources/js/app.js`.

Bonne intégration !
