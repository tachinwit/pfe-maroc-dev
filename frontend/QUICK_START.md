# 🚀 Guide de Démarrage Rapide - DevMaroc

## ⚡ Installation en 5 minutes

### Étape 1 : Créer le projet React
```bash
npx create-react-app devmaroc-frontend
cd devmaroc-frontend
```

### Étape 2 : Installer les dépendances
```bash
npm install react-router-dom lucide-react
```

### Étape 3 : Organiser les fichiers

1. **Créer le dossier pages** :
```bash
mkdir src/pages
```

2. **Copier les fichiers** dans les bons emplacements :

```
src/
├── pages/
│   ├── LandingPage.jsx
│   ├── ProfilePage.jsx
│   ├── ForumPage.jsx
│   ├── AIAssistantPage.jsx
│   └── EventsOpportunitiesPage.jsx
├── App.js          (remplacer le fichier existant)
└── index.js        (remplacer le fichier existant)

public/
└── index.html      (remplacer le fichier existant)
```

### Étape 4 : Lancer l'application
```bash
npm start
```

Votre application sera disponible sur **http://localhost:3000** 🎉

## 📱 Pages Disponibles

Une fois l'application lancée, vous pouvez naviguer vers :

- **/** - Page d'accueil (Landing Page)
- **/profile** - Profil développeur
- **/forum** - Forum Q&A
- **/events** - Événements & Opportunités
- **/ai-assistant** - Assistant IA

## 🎨 Personnalisation des Couleurs

Pour changer les couleurs de votre charte graphique, modifiez les variables CSS dans chaque page :

```css
:root {
  --midnight: #0F2027;   /* Background principal */
  --steel: #4A6070;      /* Elements secondaires */
  --indigo: #4B0082;     /* Accentuation principale */
  --cyan: #00D9FF;       /* Liens & highlights */
  --lime: #CCFF00;       /* Tags & badges */
}
```

## 🔧 Intégration avec Laravel Backend

### Configuration de base

1. **Installer Axios** :
```bash
npm install axios
```

2. **Créer le fichier de configuration API** (`src/services/api.js`) :
```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api', // URL de votre backend Laravel
  headers: {
    'Content-Type': 'application/json',
  }
});

// Ajouter le token JWT automatiquement
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

3. **Utiliser dans vos composants** :
```javascript
import api from '../services/api';

// Exemple : Récupérer les projets
const fetchProjects = async () => {
  try {
    const response = await api.get('/projects');
    console.log(response.data);
  } catch (error) {
    console.error('Erreur:', error);
  }
};
```

## 📦 Build pour Production

Quand vous êtes prêt à déployer :

```bash
npm run build
```

Cela créera un dossier `build/` optimisé pour la production.

## 🐛 Résolution de Problèmes Courants

### Erreur : "Module not found"
```bash
npm install
```

### Port 3000 déjà utilisé
Modifiez le port dans `package.json` :
```json
"scripts": {
  "start": "PORT=3001 react-scripts start"
}
```

### Les icônes ne s'affichent pas
Vérifiez que `lucide-react` est bien installé :
```bash
npm install lucide-react
```

## 📚 Ressources Complémentaires

- **React Docs** : https://react.dev
- **React Router** : https://reactrouter.com
- **Lucide Icons** : https://lucide.dev
- **Laravel Docs** : https://laravel.com/docs

## ✅ Checklist Avant de Commencer le Backend

- [ ] Toutes les pages s'affichent correctement
- [ ] La navigation fonctionne entre les pages
- [ ] Le design est responsive (mobile/tablet/desktop)
- [ ] Pas d'erreurs dans la console

## 🎯 Prochaines Fonctionnalités à Implémenter

### Frontend React
- [ ] Authentification (Login/Register)
- [ ] Gestion d'état global (Context API ou Redux)
- [ ] Formulaires de création (projets, questions, événements)
- [ ] Upload d'images
- [ ] Notifications temps réel
- [ ] Recherche globale
- [ ] Pagination

### Backend Laravel
- [ ] API REST complète
- [ ] Authentification JWT
- [ ] Base de données MySQL
- [ ] Validation des données
- [ ] Upload de fichiers
- [ ] Système de notifications
- [ ] WebSockets (Laravel Echo + Pusher)
- [ ] Assistant IA (OpenAI/Claude API)

## 💡 Conseils pour le Développement

1. **Commencez par le backend Laravel** - Créez toutes vos APIs d'abord
2. **Testez avec Postman** - Vérifiez que vos endpoints fonctionnent
3. **Connectez progressivement** - Intégrez une page à la fois
4. **Utilisez Git** - Faites des commits réguliers
5. **Documentez votre code** - Ajoutez des commentaires clairs

## 🤝 Besoin d'Aide ?

Si vous rencontrez des problèmes :
1. Vérifiez la console du navigateur (F12)
2. Consultez le README.md complet
3. Vérifiez que toutes les dépendances sont installées
4. Essayez de supprimer `node_modules` et refaire `npm install`

---

**Bon développement ! 🚀 N'hésitez pas si vous avez des questions !**
