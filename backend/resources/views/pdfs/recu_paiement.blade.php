<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reçu de Paiement - Auto-École Drive Up</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: #f5f7fa;
            padding: 20px 15px;
            color: #333;
            line-height: 1.6;
        }

        .container {
            max-width: 800px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
        }

        .header {
            background: linear-gradient(135deg, #1e3a8a 0%, #0d6efd 100%);
            color: #ffffff;
            padding: 20px 15px;
            text-align: center;
            position: relative;
        }

        .header::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: linear-gradient(90deg, #ffc107, #ff9800, #ffc107);
        }

        .header h1 {
            font-size: 20px;
            font-weight: 700;
            margin-bottom: 8px;
            letter-spacing: 0.5px;
        }

        .header .subtitle {
            font-size: 14px;
            opacity: 0.9;
            font-weight: 400;
        }

        .receipt-number {
            background: rgba(255, 255, 255, 0.15);
            display: inline-block;
            padding: 8px 20px;
            border-radius: 20px;
            margin-top: 15px;
            font-size: 13px;
            font-weight: 600;
            letter-spacing: 1px;
        }

        .content {
            padding: 15px 20px;
        }

        .section {
            margin-bottom: 15px;
        }

        .section-title {
            color: #1e3a8a;
            font-size: 14px;
            font-weight: 700;
            margin-bottom: 15px;
            padding-bottom: 8px;
            border-bottom: 2px solid #e8eaf0;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .section-title .icon {
            font-size: 20px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 12px;
        }

        table tr {
            border-bottom: 1px solid #f0f2f5;
        }

        table tr:last-child {
            border-bottom: none;
        }

        table td {
            padding: 12px 0;
            font-size: 14px;
        }

        table td:first-child {
            font-weight: 600;
            color: #555;
            width: 40%;
        }

        table td:last-child {
            color: #333;
        }

        .total-amount {
            background: linear-gradient(135deg, #1e3a8a 0%, #0d6efd 100%);
            color: #ffffff;
            padding: 20px;
            border-radius: 10px;
            text-align: center;
            margin: 25px 0;
        }

        .total-amount .label {
            font-size: 14px;
            opacity: 0.9;
            margin-bottom: 5px;
        }

        .total-amount .amount {
            font-size: 36px;
            font-weight: 700;
            letter-spacing: 1px;
        }

        .signature-section {
            display: flex;
            justify-content: space-between;
            margin-top: 50px;
            padding-top: 30px;
            border-top: 2px dashed #e0e0e0;
        }

        .signature-box {
            text-align: center;
            width: 45%;
        }

        .signature-box .label {
            font-size: 13px;
            color: #666;
            margin-bottom: 40px;
        }

        .signature-box .line {
            border-top: 2px solid #333;
            margin-top: 10px;
            padding-top: 8px;
            font-size: 12px;
            color: #888;
        }

        .footer {
            background: #f8f9fa;
            padding: 25px 30px;
            text-align: center;
            color: #666;
            font-size: 13px;
            border-top: 1px solid #e0e0e0;
        }

        .footer .company-info {
            margin-bottom: 10px;
            font-weight: 600;
            color: #1e3a8a;
        }

        .footer .thank-you {
            margin-top: 12px;
            font-size: 14px;
            color: #0d6efd;
            font-weight: 600;
        }

        .badge {
            display: inline-block;
            padding: 4px 12px;
            background: #28a745;
            color: #ffffff;
            border-radius: 12px;
            font-size: 11px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
    </style>
</head>
<body>

<div class="container">
    <div class="header">
        <h1>🚗 AUTO-ÉCOLE DRIVE UP</h1>
        <div class="subtitle">Reçu de Paiement Officiel</div>
        <div class="receipt-number">N° {{ str_pad($paiement->id, 6, '0', STR_PAD_LEFT) }}</div>
    </div>

    <div class="content">
        <div class="section">
            <div class="section-title">
                <span class="icon">👤</span>
                Informations du Candidat
            </div>
            <table>
                <tr>
                    <td>Nom et Prénom</td>
                    <td><strong>{{ $user->nom }} {{ $user->prenom }}</strong></td>
                </tr>
                <tr>
                    <td>Carte Nationale (CIN)</td>
                    <td>{{ $user->carte_nationale }}</td>
                </tr>
                <tr>
                    <td>Téléphone</td>
                    <td>{{ $user->telephone }}</td>
                </tr>
                <tr>
                    <td>Adresse</td>
                    <td>{{ $user->adresse }}</td>
                </tr>
                <tr>
                    <td>Catégorie de Permis</td>
                    <td><strong>Permis {{ $user->categorie_permis }}</strong></td>
                </tr>
            </table>
        </div>

        <div class="section">
            <div class="section-title">
                <span class="icon">💳</span>
                Détails du Paiement
            </div>
            <table>
                <tr>
                    <td>Date du Paiement</td>
                    <td>{{ \Carbon\Carbon::parse($paiement->date)->format('d/m/Y à H:i') }}</td>
                </tr>
                <tr>
                    <td>Méthode de Paiement</td>
                    <td>{{ ucfirst($user->methode_paiement ?? 'Espèces') }}</td>
                </tr>
                <tr>
                    <td>Motif</td>
                    <td>{{ $paiement->motif ?? 'Frais de formation' }}</td>
                </tr>
                <tr>
                    <td>Statut</td>
                    <td><span class="badge">✓ PAYÉ</span></td>
                </tr>
            </table>
        </div>

        <div class="total-amount">
            <div class="label">Montant Total Payé</div>
            <div class="amount">{{ number_format($paiement->montant, 2, ',', ' ') }} DH</div>
        </div>

        <div class="signature-section">
            <div class="signature-box">
                <div class="label">Signature du Candidat</div>
                <div class="line">{{ $user->nom }} {{ $user->prenom }}</div>
            </div>
            <div class="signature-box">
                <div class="label">Cachet et Signature Drive Up</div>
                <div class="line">Auto-École Drive Up</div>
            </div>
        </div>
    </div>

    <div class="footer">
        <div class="company-info">AUTO-ÉCOLE DRIVE UP</div>
        <div>Reçu généré automatiquement le {{ \Carbon\Carbon::now()->format('d/m/Y à H:i') }}</div>
        <div class="thank-you">✨ Merci pour votre confiance ! Bonne route avec Drive Up 🚗</div>
    </div>
</div>

</body>
</html>

