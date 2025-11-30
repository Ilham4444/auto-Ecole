<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reçu d'Inscription - Drive UP</title>
    <style>
        body {
            font-family: 'Helvetica', 'Arial', sans-serif;
            color: #333;
            line-height: 1.6;
            margin: 0;
            padding: 20px;
        }
        .header-table {
            width: 100%;
            margin-bottom: 30px;
            border-bottom: 2px solid #0d6efd;
            padding-bottom: 20px;
        }
        .logo-section h1 {
            color: #0d6efd;
            margin: 0;
            font-size: 28px;
            text-transform: uppercase;
        }
        .logo-section p {
            margin: 5px 0;
            font-size: 12px;
            color: #666;
        }
        .photo-section {
            text-align: right;
            vertical-align: top;
        }
        .photo-frame {
            width: 120px;
            height: 150px;
            border: 1px solid #ddd;
            padding: 5px;
            background: #fff;
            display: inline-block;
        }
        .photo-placeholder {
            width: 100%;
            height: 100%;
            background: #f8f9fa;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            font-size: 10px;
            color: #aaa;
            line-height: 140px; /* Vertical center hack for dompdf */
        }
        .document-title {
            text-align: center;
            margin-bottom: 40px;
        }
        .document-title h2 {
            background-color: #0d6efd;
            color: #fff;
            display: inline-block;
            padding: 10px 30px;
            border-radius: 20px;
            font-size: 18px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        .section-title {
            color: #0d6efd;
            border-bottom: 1px solid #ddd;
            padding-bottom: 5px;
            margin-bottom: 15px;
            font-size: 16px;
            font-weight: bold;
            text-transform: uppercase;
        }
        .info-table {
            width: 100%;
            margin-bottom: 30px;
            border-collapse: collapse;
        }
        .info-table td {
            padding: 10px;
            border-bottom: 1px solid #eee;
            vertical-align: top;
        }
        .label {
            font-weight: bold;
            color: #555;
            width: 35%;
        }
        .value {
            color: #000;
            font-weight: 500;
        }
        .footer-section {
            margin-top: 50px;
            border-top: 1px solid #eee;
            padding-top: 20px;
        }
        .signature-table {
            width: 100%;
        }
        .signature-box {
            text-align: center;
            padding-top: 10px;
        }
        .signature-line {
            margin-top: 60px;
            border-top: 1px dashed #ccc;
            width: 80%;
            margin-left: auto;
            margin-right: auto;
        }
        .legal-text {
            font-size: 10px;
            color: #999;
            text-align: center;
            margin-top: 40px;
        }
    </style>
</head>
<body>

    <!-- En-tête avec Logo à gauche et Photo à droite -->
    <table class="header-table">
        <tr>
            <td class="logo-section" style="width: 70%;">
                <h1>Drive UP</h1>
                <p>Auto-École d'Excellence</p>
                <p>� Rue de Hassan 2, Agadir</p>
                <p>📞 0631212766 | 📧 contact@driveup.ma</p>
            </td>
            <td class="photo-section" style="width: 30%;">
                <div class="photo-frame">
                    @if(isset($user->photo_identite))
                        <img src="{{ public_path('uploads/'.$user->photo_identite) }}" alt="Photo Candidat" style="width: 100%; height: 100%; object-fit: cover;">
                    @else
                        <div class="photo-placeholder">PHOTO</div>
                    @endif
                </div>
            </td>
        </tr>
    </table>

    <!-- Titre du Document -->
    <div class="document-title">
        <h2>Reçu d'Inscription</h2>
    </div>

    <!-- Informations Candidat -->
    <div class="section-title">👤 Informations du Candidat</div>
    <table class="info-table">
        <tr>
            <td class="label">Nom & Prénom</td>
            <td class="value">{{ strtoupper($user->nom) }} {{ ucfirst($user->prenom) }}</td>
        </tr>
        <tr>
            <td class="label">Date de Naissance</td>
            <td class="value">{{ $user->date_naissance ? \Carbon\Carbon::parse($user->date_naissance)->format('d/m/Y') : 'Non renseignée' }}</td>
        </tr>
        <tr>
            <td class="label">Numéro CIN</td>
            <td class="value">{{ $user->carte_nationale ?? 'Non renseigné' }}</td>
        </tr>
        <tr>
            <td class="label">Téléphone</td>
            <td class="value">{{ $user->telephone ?? 'Non renseigné' }}</td>
        </tr>
        <tr>
            <td class="label">Adresse</td>
            <td class="value">{{ $user->adresse ?? 'Non renseignée' }}</td>
        </tr>
    </table>

    <!-- Détails de la Formation -->
    <div class="section-title">� Détails de la Formation</div>
    <table class="info-table">
        <tr>
            <td class="label">Catégorie de Permis</td>
            <td class="value" style="font-size: 18px; font-weight: bold; color: #0d6efd;">Permis {{ $user->categorie_permis ?? 'B' }}</td>
        </tr>
        <tr>
            <td class="label">Date d'Inscription</td>
            <td class="value">{{ isset($inscription_date) ? $inscription_date : now()->format('d/m/Y') }}</td>
        </tr>
        <tr>
            <td class="label">Volume Horaire</td>
            <td class="value">
                Code : {{ $heures_code ?? '20' }}h <br>
                Conduite : {{ $heures_conduite ?? '30' }}h
            </td>
        </tr>
    </table>

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
        <p>Ce document atteste de l'inscription du candidat au sein de l'auto-école Drive UP. Il ne remplace pas le permis de conduire.</p>
        <p>Généré le {{ now()->format('d/m/Y à H:i') }}</p>
    </div>

</body>
</html>
