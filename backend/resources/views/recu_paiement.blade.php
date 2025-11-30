<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reçu de Paiement - Auto-École Drive Up</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 40px;
            color: #333;
        }
        .container {
            width: 800px;
            margin: 0 auto;
            border: 2px solid #004d99;
            padding: 30px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }
        h1 {
            text-align: center;
            color: #004d99;
            border-bottom: 3px solid #f90;
            padding-bottom: 10px;
        }
        h2 {
            color: #004d99;
            margin-top: 25px;
            border-bottom: 1px solid #ccc;
            padding-bottom: 5px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
        }
        td, th {
            padding: 10px;
            border: 1px solid #ddd;
        }
        .info-table td:first-child {
            font-weight: bold;
            width: 35%;
            background-color: #f4f7f9;
        }
        .total {
            font-size: 1.2em;
            font-weight: bold;
            background-color: #eaf3f8;
        }
        .footer {
            margin-top: 40px;
            text-align: center;
            color: #666;
            font-size: 0.9em;
        }
        .signature {
            margin-top: 50px;
            text-align: right;
            font-weight: bold;
        }
    </style>
</head>
<body>

<div class="container">

    <h1>🧾 Reçu de Paiement - Auto-École Drive Up</h1>

    <h2>👤 Informations du Candidat</h2>
    <table class="info-table">
        <tr>
            <td>Nom et Prénom</td>
            <td>{{ $user->nom }} {{ $user->prenom }}</td>
        </tr>
        <tr>
            <td>CIN</td>
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
    </table>

    <h2>💳 Détails du Paiement</h2>
    <table class="info-table">
        <tr>
            <td>Date du Paiement</td>
            <td>{{ \Carbon\Carbon::parse($paiement->date)->format('d/m/Y') }}</td>
        </tr>
        <tr>
            <td>Mode de Paiement</td>
            <td>{{ ucfirst($user->methode_paiement ?? 'Non spécifié') }}</td>
        </tr>
        <tr>
            <td>Type de Permis</td>
            <td>{{ $user->categorie_permis }}</td>
        </tr>
        <tr>
            <td>Motif</td>
            <td>{{ $paiement->motif ?? 'Paiement' }}</td>
        </tr>
        <tr>
            <td class="total">Montant Payé</td>
            <td class="total">{{ number_format($paiement->montant, 2) }} MAD</td>
        </tr>
    </table>

    <div class="signature">
        Signature & Cachet Drive Up<br>
        ___________________________
    </div>

    <div class="footer">
        Auto-École Drive Up – Reçu généré automatiquement<br>
        Merci pour votre confiance 🚗
    </div>

</div>

</body>
</html>
