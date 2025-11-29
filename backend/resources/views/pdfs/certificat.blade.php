<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Certificat de Réussite - Auto-École Drive Up</title>
    <style>
        body {
            font-family: 'Times New Roman', serif;
            margin: 40px;
            color: #1a1a1a;
            background-color: #f9f9f9;
        }
        .certificat-container {
            width: 750px;
            height: 550px;
            margin: 0 auto;
            border: 5px double #004d99;
            padding: 40px;
            background: #ffffff;
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
            position: relative;
            text-align: center;
        }
        .certificat-container::before {
            content: 'DRIVE UP';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-15deg);
            font-size: 8em;
            color: rgba(0, 77, 153, 0.08);
            z-index: 0;
            font-weight: bold;
        }
        .header {
            color: #f90;
            font-size: 1.5em;
            margin-bottom: 5px;
        }
        h1 {
            font-family: Georgia, serif;
            color: #004d99;
            font-size: 2.8em;
            margin: 10px 0 30px 0;
            border-bottom: 4px solid #f90;
            display: inline-block;
            padding-bottom: 5px;
            z-index: 1;
            position: relative;
        }
        .corps {
            margin-top: 30px;
            font-size: 1.3em;
            line-height: 1.6;
            z-index: 1;
            position: relative;
        }
        .titre-reussite {
            font-size: 1.8em;
            font-weight: bold;
            color: #333;
            margin-bottom: 15px;
        }
        .nom-candidat {
            font-size: 2.2em;
            font-weight: bold;
            color: #cc0000;
            text-transform: uppercase;
            margin: 10px 0 30px 0;
            padding: 5px 20px;
            border: 1px dashed #ccc;
            display: inline-block;
        }
        .date-categorie {
            font-style: italic;
            color: #004d99;
            margin-top: 20px;
        }
        .signatures {
            margin-top: 50px;
            display: flex;
            justify-content: space-around;
            font-size: 1.1em;
            z-index: 1;
            position: relative;
        }
        .signature-box {
            width: 40%;
            text-align: center;
        }
        .signature-line {
            height: 2px;
            background-color: #004d99;
            margin-bottom: 5px;
        }
    </style>
</head>
<body>

<div class="certificat-container">

    <div class="header">Auto-École Drive Up</div>

    <h1>CERTIFICAT DE RÉUSSITE</h1>

    <div class="corps">

        <div class="titre-reussite">Est décerné(e) à</div>

        <div class="nom-candidat">
            {{ strtoupper($user->nom . ' ' . $user->prenom) }}
        </div>

        <p>En reconnaissance de sa réussite et de son engagement au cours de sa formation.</p>

        <div class="date-categorie">
            Pour l'obtention du Permis de Conduire  
            <strong>Catégorie {{ $user->categorie_permis }}</strong>
        </div>

        <p>
            Délivré à {{ $ville ?? 'Casablanca' }}  
            le {{ ($date_delivrance ?? now())->format('d/m/Y') }}
        </p>

    </div>

    <div class="signatures">
        <div class="signature-box">
            <div class="signature-line"></div>
            Le Candidat(e)
        </div>

        <div class="signature-box">
            <div class="signature-line"></div>
            Le Directeur de l'Auto-École Drive Up
        </div>
    </div>

</div>

</body>
</html>
