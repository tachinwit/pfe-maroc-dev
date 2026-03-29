{{-- resources/views/emails/otp.blade.php --}}
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Code de vérification MarocDev</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            background-color: #f4f4f4;
            padding: 20px;
        }
        .email-container {
            background-color: #ffffff;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px 20px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 600;
        }
        .content {
            padding: 40px 30px;
            text-align: center;
        }
        .otp-code {
            background-color: #f8f9fa;
            border: 2px dashed #667eea;
            border-radius: 8px;
            padding: 20px;
            margin: 30px 0;
            font-size: 32px;
            font-weight: bold;
            color: #667eea;
            letter-spacing: 4px;
            font-family: 'Courier New', monospace;
        }
        .message {
            font-size: 16px;
            margin-bottom: 20px;
            color: #666;
        }
        .warning {
            background-color: #fff3cd;
            border: 1px solid #ffeaa7;
            border-radius: 6px;
            padding: 15px;
            margin: 20px 0;
            font-size: 14px;
            color: #856404;
        }
        .footer {
            background-color: #f8f9fa;
            padding: 20px 30px;
            text-align: center;
            font-size: 12px;
            color: #666;
            border-top: 1px solid #e9ecef;
        }
        .brand {
            color: #667eea;
            font-weight: bold;
            font-size: 18px;
        }
        .social-links {
            margin-top: 15px;
        }
        .social-links a {
            display: inline-block;
            margin: 0 10px;
            color: #667eea;
            text-decoration: none;
            font-weight: 500;
        }
        @media only screen and (max-width: 600px) {
            body {
                padding: 10px;
            }
            .content {
                padding: 30px 20px;
            }
            .otp-code {
                font-size: 28px;
                padding: 15px;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <h1>🔐 MarocDev</h1>
            <p>Vérification de sécurité</p>
        </div>

        <div class="content">
            <h2>Bonjour {{ $user->name ?? 'Utilisateur' }},</h2>

            <p class="message">
                Pour finaliser votre connexion à MarocDev, veuillez utiliser le code de vérification ci-dessous :
            </p>

            <div class="otp-code">
                {{ $otp_code }}
            </div>

            <div class="warning">
                ⚠️ <strong>Important :</strong> Ce code expire dans <strong>10 minutes</strong> pour des raisons de sécurité.
                Ne partagez jamais ce code avec qui que ce soit.
            </div>

            <p>
                Si vous n'avez pas demandé ce code, vous pouvez ignorer cet email en toute sécurité.
            </p>

            <p>
                Besoin d'aide ? Contactez notre équipe de support.
            </p>
        </div>

        <div class="footer">
            <div class="brand">MarocDev</div>
            <p>
                Plateforme de développement collaborative<br>
                © {{ date('Y') }} MarocDev. Tous droits réservés.
            </p>

            <div class="social-links">
                <a href="#">À propos</a> |
                <a href="#">Support</a> |
                <a href="#">Confidentialité</a>
            </div>
        </div>
    </div>
</body>
</html>