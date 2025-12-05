<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reçu de Paiement - Drive UP</title>
    <style>
        body {
            font-family: 'Helvetica', 'Arial', sans-serif;
            color: #333;
            line-height: 1.4;
            margin: 0;
            padding: 15px;
        }
        .header-table {
            width: 100%;
            margin-bottom: 15px;
            border-bottom: 2px solid #0d6efd;
            padding-bottom: 10px;
        }
        .logo-section h1 {
            color: #0d6efd;
            margin: 0;
            font-size: 24px;
            text-transform: uppercase;
        }
        .logo-section p {
            margin: 2px 0;
            font-size: 11px;
            color: #666;
        }
        .document-title {
            text-align: center;
            margin-bottom: 20px;
        }
        .document-title h2 {
            background-color: #0d6efd;
            color: #fff;
            display: inline-block;
            padding: 8px 25px;
            border-radius: 20px;
            font-size: 16px;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin: 0;
        }
        .section-title {
            color: #0d6efd;
            border-bottom: 1px solid #ddd;
            padding-bottom: 3px;
            margin-bottom: 10px;
            font-size: 14px;
            font-weight: bold;
            text-transform: uppercase;
        }
        .info-table {
            width: 100%;
            margin-bottom: 20px;
            border-collapse: collapse;
            font-size: 12px;
        }
        .info-table td {
            padding: 6px;
            border-bottom: 1px solid #eee;
            vertical-align: top;
        }
        .label {
            font-weight: bold;
            color: #555;
            width: 40%;
        }
        .value {
            color: #000;
            font-weight: 500;
        }
        .total-amount-box {
            background-color: #f8f9fa;
            border: 2px solid #0d6efd;
            border-radius: 10px;
            padding: 15px;
            text-align: center;
            margin: 20px 0;
        }
        .total-amount-box .label {
            color: #666;
            font-size: 12px;
            margin-bottom: 5px;
        }
        .total-amount-box .amount {
            color: #0d6efd;
            font-size: 28px;
            font-weight: bold;
        }
        .footer-section {
            margin-top: 30px;
            border-top: 1px solid #eee;
            padding-top: 15px;
        }
        .signature-table {
            width: 100%;
        }
        .signature-box {
            text-align: center;
            padding-top: 5px;
            font-size: 12px;
        }
        .signature-line {
            margin-top: 40px;
            border-top: 1px dashed #ccc;
            width: 70%;
            margin-left: auto;
            margin-right: auto;
        }
        .legal-text {
            font-size: 9px;
            color: #999;
            text-align: center;
            margin-top: 20px;
        }
        .badge {
            background-color: #28a745;
            color: #fff;
            padding: 3px 10px;
            border-radius: 10px;
            font-size: 10px;
            font-weight: 600;
            text-transform: uppercase;
        }
    </style>
</head>
<body>

    <!-- En-tête avec Logo -->
    <table class="header-table">
        <tr>
            <td class="logo-section">
                <h1>Drive UP</h1>
                <p>Auto-École d'Excellence</p>
                <p>📍 Rue de Hassan 2, Agadir</p>
                <p>📞 0631212766 | 📧 contact@driveup.ma</p>
            </td>
        </tr>
    </table>

    <!-- Titre du Document -->
    <div class="document-title">
        <h2>Reçu de Paiement N° {{ str_pad($paiement->id, 6, '0', STR_PAD_LEFT) }}</h2>
    </div>

    <!-- Informations Candidat -->
    <div class="section-title">👤 Informations du Candidat</div>
    <table class="info-table">
        <tr>
            <td class="label">Nom & Prénom</td>
            <td class="value">{{ strtoupper($user->nom) }} {{ ucfirst($user->prenom) }}</td>
        </tr>
        <tr>
            <td class="label">Numéro CIN</td>
            <td class="value">{{ $user->carte_nationale }}</td>
        </tr>
        <tr>
            <td class="label">Téléphone</td>
            <td class="value">{{ $user->telephone }}</td>
        </tr>
        <tr>
            <td class="label">Adresse</td>
            <td class="value">{{ $user->adresse }}</td>
        </tr>
        <tr>
            <td class="label">Catégorie de Permis</td>
            <td class="value" style="font-weight: bold; color: #0d6efd;">Permis {{ $user->categorie_permis }}</td>
        </tr>
    </table>

    <!-- Détails du Paiement -->
    <div class="section-title">💳 Détails du Paiement</div>
    <table class="info-table">
        <tr>
            <td class="label">Date du Paiement</td>
            <td class="value">{{ \Carbon\Carbon::parse($paiement->date)->format('d/m/Y à H:i') }}</td>
        </tr>
        <tr>
            <td class="label">Méthode de Paiement</td>
            <td class="value">{{ ucfirst($user->methode_paiement ?? 'Espèces') }}</td>
        </tr>
        <tr>
            <td class="label">Motif</td>
            <td class="value">{{ $paiement->motif ?? 'Frais de formation' }}</td>
        </tr>
        <tr>
            <td class="label">Statut</td>
            <td class="value"><span class="badge">✓ PAYÉ</span></td>
        </tr>
    </table>

    <!-- Montant Total -->
    <div class="total-amount-box">
        <div class="label">Montant Total Payé</div>
        <div class="amount">{{ number_format($paiement->montant, 2, ',', ' ') }} DH</div>
    </div>

    <!-- Signatures -->
    <div class="footer-section">
        <table class="signature-table">
            <tr>
                <td class="signature-box">
                    <strong>Signature du Candidat</strong>
                    <div class="signature-line"></div>
                </td>
                <td class="signature-box">
                    <strong>Cachet de l'Établissement</strong>
                    <div class="signature-line"></div>
                </td>
            </tr>
        </table>
    </div>

    <div class="legal-text">
        <p>Ce document atteste du paiement effectué au sein de l'auto-école Drive UP.</p>
        <p>Généré le {{ \Carbon\Carbon::now()->format('d/m/Y à H:i') }}</p>
    </div>

</body>
</html>
