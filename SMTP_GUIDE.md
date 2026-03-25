# Guide de Configuration SMTP - DevMaroc

Pour que l'envoi d'e-mails (confirmation de mot de passe, etc.) fonctionne réellement via SMTP, vous devez modifier votre fichier `.env` à la racine du projet.

## 1. Mise à jour du fichier .env

Actuellement, votre fichier est configuré pour écrire les e-mails dans les logs (`MAIL_MAILER=log`). Voici comment le configurer pour un vrai serveur SMTP :

### Option A : Utilisation de Mailtrap (Recommandé pour le développement)
1. Créez un compte gratuit sur [Mailtrap.io](https://mailtrap.io).
2. Copiez vos identifiants SMTP et remplacez les lignes suivantes dans votre `.env` :

```env
MAIL_MAILER=smtp
MAIL_HOST=sandbox.smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=votre_username
MAIL_PASSWORD=votre_password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS="noreply@devmaroc.com"
MAIL_FROM_NAME="${APP_NAME}"
```

### Option B : Utilisation de Gmail (Moins recommandé, nécessite un mot de passe d'application)
```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=465
MAIL_USERNAME=votre-email@gmail.com
MAIL_PASSWORD=votre-mot-de-passe-d-application
MAIL_ENCRYPTION=ssl
MAIL_FROM_ADDRESS="votre-email@gmail.com"
```

## 2. Effacer le cache de configuration
Après avoir modifié le fichier `.env`, vous **devez** vider le cache de Laravel pour que les changements soient pris en compte. Exécutez cette commande dans votre terminal :

```bash
php artisan config:clear
```

## 3. Vérification des Logs
Si vous restez en `MAIL_MAILER=log`, vous pouvez voir le contenu HTML des e-mails "envoyés" dans le fichier :
`storage/logs/laravel.log` (cherchez à la fin du fichier).
