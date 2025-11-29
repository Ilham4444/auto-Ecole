<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Fiche Candidat - Auto-École Drive Up</title>

    <style>
        body {
            font-family: DejaVu Sans, Arial, sans-serif;
            margin: 40px;
            color: #333;
        }
        .container {
            width: 800px;
            margin: 0 auto;
            border: 2px solid #004d99;
            padding: 30px;
        }
        h1 {
            text-align: center;
            color: #004d99;
            border-bottom: 3px solid #f90;
            padding-bottom: 10px;
        }
        h2 {
            margin-top: 30px;
            color: #004d99;
            border-bottom: 1px solid #bbb;
            padding-bottom: 6px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
        }
        td, th {
            padding: 10px;
            border: 1px solid #ddd;
            text-align: left;
        }
        .label-cell {
            font-weight: bold;
            width: 30%;
            background: #f4f7f9;
        }
        .photo-cell {
            text-align: center;
            vertical-align: middle;
            width: 150px;
            height: 180px;
            border: 2px dashed #777;
            background: #fafafa;
            font-size: 0.9em;
            color: #555;
        }
        .engagement {
            margin-top: 30px;
            padding: 15px;
            background-color: #eaf3f8;
            border-left: 5px solid #004d99;
            font-style: italic;
        }
        .validation-section {
            margin-top: 50px;
            display: flex;
            justify-content: space-between;
        }
        .signature-box {
            width: 45%;
            text-align: center;
        }
        .signature-line {
            height: 80px;
            border: 1px dashed #666;
            margin-bottom: 5px;
        }
    </style>

</head>
<body>

<div class="container">

    <h1>🚗 Fiche Candidat – Auto-École Drive Up 📝</h1>

    {{-- Informations personnelles --}}
    <h2>👤 Informations Personnelles du Candidat</h2>

    <table>
        <tr>
            <td class="label-cell">Nom</td>
            <td>{{ $user->nom ?? '...............................' }}</td>
            <td rowspan="5" class="photo-cell">
                @if(isset($user->photo_identite))
                    <img src="{{ public_path('uploads/'.$user->photo_identite) }}" alt="Photo" style="width:140px;height:170px;">
                @else
                    Photo d'identité<br>(35x45 mm)
                @endif
            </td>
        </tr>
        <tr>
            <td class="label-cell">Prénom</td>
            <td>{{ $user->prenom ?? '...............................' }}</td>
        </tr>
        <tr>
            <td class="label-cell">Date de naissance</td>
            <td>{{ $user->date_naissance ?? '...............................' }}</td>
        </tr>
        <tr>
            <td class="label-cell">CIN</td>
            <td>{{ $user->carte_nationale ?? '...............................' }}</td>
        </tr>
        <tr>
            <td class="label-cell">Téléphone</td>
            <td>{{ $user->telephone ?? '...............................' }}</td>
        </tr>
        <tr>
            <td class="label-cell">Adresse</td>
            <td colspan="2">{{ $user->adresse ?? '............................................................................' }}</td>
        </tr>
    </table>


    {{-- Forfait --}}
    <h2>📅 Détails de l’Inscription</h2>

    <table>
        <tr>
            <td class="label-cell">Date d'inscription</td>
            <td>{{ $inscription_date ?? now()->format('d/m/Y') }}</td>
        </tr>
        <tr>
            <td class="label-cell">Type de permis</td>
            <td>{{ $user->categorie_permis ?? '...............................' }}</td>
        </tr>
    </table>


    {{-- Forfait durée --}}
    <h2>📚 Forfait de Formation</h2>

    <table>
        <tr>
            <td class="label-cell">Séances théoriques</td>
            <td>{{ $heures_code ?? '20' }} heures</td>
        </tr>
        <tr>
            <td class="label-cell">Séances pratiques</td>
            <td>{{ $heures_conduite ?? '30' }} heures</td>
        </tr>
    </table>


    {{-- Engagement --}}
    <div class="engagement">
        Je soussigné(e),
        <strong>{{ $user->nom.' '.$user->prenom ?? '........................................' }}</strong>,
        certifie l'exactitude des informations fournies ci-dessus et
        m'engage à respecter le règlement intérieur de l'Auto-École Drive Up.
    </div>


    {{-- Signatures --}}
    <h2>🤝 Validation du Dossier</h2>

    <div class="validation-section">
        <div class="signature-box">
            <div class="signature-line"></div>
            <div>Signature du candidat</div>
        </div>

        <div class="signature-box">
            <div class="signature-line"></div>
            <div>Cachet de la Direction Drive Up</div>
        </div>
    </div>

</div>

</body>
</html>
