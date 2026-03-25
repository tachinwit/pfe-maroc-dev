<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reçu d'inscription - {{ $event->title }}</title>
    <style>
        :root {
            --primary: #581c87;
            --secondary: #00d9ff;
            --text: #1f2937;
            --bg: #f3f4f6;
        }
        body {
            font-family: 'Inter', system-ui, -apple-system, sans-serif;
            background: var(--bg);
            margin: 0;
            padding: 40px;
            color: var(--text);
        }
        .receipt-card {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            border-radius: 24px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.1);
            overflow: hidden;
            border: 1px solid rgba(0,0,0,0.05);
        }
        .header {
            background: linear-gradient(135deg, #1e1b4b, #581c87);
            color: white;
            padding: 40px;
            text-align: center;
            position: relative;
        }
        .logo {
            font-size: 2rem;
            font-weight: 800;
            letter-spacing: -1px;
            margin-bottom: 10px;
        }
        .logo span {
            color: var(--secondary);
        }
        .content {
            padding: 40px;
        }
        .grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 30px;
            margin-bottom: 40px;
        }
        .info-block h3 {
            font-size: 0.85rem;
            text-transform: uppercase;
            color: #6b7280;
            margin-bottom: 8px;
            letter-spacing: 0.05em;
        }
        .info-block p {
            font-size: 1.1rem;
            font-weight: 600;
            margin: 0;
        }
        .event-details {
            background: #f9fafb;
            padding: 30px;
            border-radius: 16px;
            border: 1px solid #e5e7eb;
            margin-bottom: 40px;
        }
        .event-title {
            font-size: 1.5rem;
            font-weight: 800;
            margin-bottom: 15px;
            color: var(--primary);
        }
        .footer {
            text-align: center;
            padding: 30px;
            border-top: 1px dashed #e5e7eb;
            background: #f9fafb;
        }
        .qr-placeholder {
            width: 100px;
            height: 100px;
            background: white;
            border: 1px solid #e5e7eb;
            margin: 20px auto;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.7rem;
            color: #9ca3af;
        }
        .btn-print {
            display: inline-block;
            margin-top: 20px;
            padding: 12px 24px;
            background: var(--primary);
            color: white;
            text-decoration: none;
            border-radius: 12px;
            font-weight: 700;
            transition: opacity 0.2s;
        }
        @media print {
            .btn-print { display: none; }
            body { background: white; padding: 0; }
            .receipt-card { box-shadow: none; border: none; }
        }
    </style>
</head>
<body>
    <div class="receipt-card">
        <div class="header">
            <div class="logo">Dev<span>Maroc</span></div>
            <p style="opacity: 0.8; font-weight: 500;">Confirmation Officielle d'Inscription</p>
        </div>
        
        <div class="content">
            <div class="grid">
                <div class="info-block">
                    <h3>Participant</h3>
                    <p>{{ $user->name }}</p>
                    <p style="font-weight: 400; font-size: 0.9rem; color: #6b7280;">{{ $user->email }}</p>
                </div>
                <div class="info-block" style="text-align: right;">
                    <h3>Date d'émission</h3>
                    <p>{{ now()->format('d/m/Y H:i') }}</p>
                </div>
            </div>

            <div class="event-details">
                <div class="event-title">{{ $event->title }}</div>
                <div style="display: flex; gap: 40px;">
                    <div>
                        <div style="font-size: 0.8rem; color: #6b7280; text-transform: uppercase;">Date</div>
                        <div style="font-weight: 700;">{{ \Carbon\Carbon::parse($event->date)->format('d F Y') }}</div>
                    </div>
                    <div>
                        <div style="font-size: 0.8rem; color: #6b7280; text-transform: uppercase;">Lieu</div>
                        <div style="font-weight: 700;">{{ $event->location }}</div>
                    </div>
                    <div>
                        <div style="font-size: 0.8rem; color: #6b7280; text-transform: uppercase;">Type</div>
                        <div style="font-weight: 700;">{{ $event->type }}</div>
                    </div>
                </div>
            </div>

            <div style="text-align: center; margin: 20px 0;">
                <p style="font-size: 0.9rem; color: #6b7280; line-height: 1.6;">
                    Ce document atteste de votre participation à l'événement cité ci-dessus. 
                    Veuillez le présenter à l'entrée (format numérique ou papier).
                </p>
                <div style="margin: 20px auto; width: 150px; height: 150px; background: white; border: 4px solid #f3f4f6; border-radius: 12px; padding: 10px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);">
                    <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=DEV-{{ $event->id }}-{{ $user->id }}" alt="QR Code Confirmation" style="width: 100%; height: 100%;">
                </div>
                <div style="font-family: 'Space Mono', monospace; font-size: 0.8rem; color: #9ca3af; letter-spacing: 0.1em;">
                    CODE-#{{ str_pad($event->id, 5, '0', STR_PAD_LEFT) }}-{{ $user->id }}
                </div>
            </div>
            
            <div style="text-align: center;">
                <a href="javascript:window.print()" class="btn-print">Imprimer ou Sauvegarder en PDF</a>
            </div>
        </div>

        <div class="footer">
            <p style="font-size: 0.8rem; color: #9ca3af; margin: 0;">
                Généré par la plateforme DevMaroc - La plus grande communauté tech du Maroc.
            </p>
        </div>
    </div>
</body>
</html>
