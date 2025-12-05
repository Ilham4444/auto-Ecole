<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reçus - Drive UP</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Helvetica', 'Arial', sans-serif;
            background: #f5f7fa;
            padding: 20px;
            color: #333;
            line-height: 1.6;
        }

        .page {
            max-width: 800px;
            margin: 0 auto 30px;
            background: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
            page-break-after: always;
        }

        /* En-tête commun */
        .header {
            background: linear-gradient(135deg, #1e3a8a 0%, #0d6efd 100%);
            color: #ffffff;
            padding: 30px;
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

        .header-content {
            display: table;
            width: 100%;
        }

        .logo-section {
            display: table-cell;
            width: 70%;
            vertical-align: middle;
        }

        .logo-section h1 {
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 8px;
            letter-spacing: 0.5px;
        }

        .logo-section p {
            font-size: 13px;
            opacity: 0.9;
            margin: 3px 0;
        }

        .photo-section {
            display: table-cell;
            width: 30%;
            text-align: right;
            vertical-align: middle;
        }

        .photo-frame {
            width: 100px;
            height: 120px;
            border: 2px solid rgba(255, 255, 255, 0.3);
            padding: 5px;
            background: rgba(255, 255, 255, 0.1);
            display: inline-block;
            border-radius: 8px;
        }

        .photo-frame img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 4px;
        }

        .photo-placeholder {
            width: 100%;
            height: 100%;
            background: rgba(255, 255, 255, 0.2);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 10px;
            color: rgba(255, 255, 255, 0.7);
            border-radius: 4px;
        }

        /* Titre du document */
        .document-title {
            text-align: center;
            padding: 25px 30px;
            background: #f8f9fa;
            border-bottom: 2px solid #e0e0e0;
        }

        .document-title h2 {
            color: #1e3a8a;
            font-size: 22px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        .document-number {
            display: inline-block;
            background: #0d6efd;
            color: white;
            padding: 5px 15px;
            border-radius: 15px;
            font-size: 12px;
            font-weight: 600;
            margin-top: 8px;
        }

        /* Contenu */
        .content {
            padding: 30px;
        }

        .section {
            margin-bottom: 25px;
        }

        .section-title {
            color: #1e3a8a;
            font-size: 16px;
            font-weight: 700;
            margin-bottom: 15px;
            padding-bottom: 8px;
            border-bottom: 2px solid #e8eaf0;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .section-title .icon {
            font-size: 18px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }

        table tr {
            border-bottom: 1px solid #f0f2f5;
        }

        table tr:last-child {
            border-bottom: none;
        }

        table td {
            padding: 10px 0;
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

        /* Montant total */
        .total-amount {
            background: linear-gradient(135deg, #1e3a8a 0%, #0d6efd 100%);
            color: #ffffff;
            padding: 20px;
            border-radius: 10px;
            text-align: center;
            margin: 20px 0;
        }

        .total-amount .label {
            font-size: 14px;
            opacity: 0.9;
            margin-bottom: 5px;
        }

        .total-amount .amount {
            font-size: 32px;
            font-weight: 700;
            letter-spacing: 1px;
        }

        /* Badge */
        .badge {
            display: inline-block;
            padding: 5px 12px;
            background: #28a745;
            color: #ffffff;
            border-radius: 12px;
            font-size: 11px;
            font-weight: 600;
            text-transform: uppercase;
        }

        /* Signatures */
        .signature-section {
            display: table;
            width: 100%;
            margin-top: 40px;
            padding-top: 25px;
            border-top: 2px dashed #e0e0e0;
        }

        .signature-box {
            display: table-cell;
            width: 50%;
            text-align: center;
            padding: 10px;
        }

        .signature-box .label {
            font-size: 13px;
            color: #666;
            margin-bottom: 35px;
            font-weight: 600;
        }

        .signature-box .line {
            border-top: 2px solid #333;
            margin: 0 auto;
            width: 80%;
            padding-top: 8px;
            font-size: 12px;
            color: #888;
        }

        /* Pied de page */
        .footer {
            background: #f8f9fa;
            padding: 20px 30px;
            text-align: center;
            color: #666;
            font-size: 12px;
            border-top: 1px solid #e0e0e0;
        }

        .footer .company-info {
            margin-bottom: 8px;
            font-weight: 600;
            color: #1e3a8a;
        }

        .footer .thank-you {
            margin-top: 10px;
            font-size: 13px;
            color: #0d6efd;
            font-weight: 600;
        }

        /* Print styles */
        @media print {
            body {
                background: white;
                padding: 0;
            }

            .page {
                box-shadow: none;
                margin: 0;
                page-break-after: always;
            }
        }
    </style>
</head>
<body>

    <!-- ==================== REÇU D'INSCRIPTION ==================== -->
    <div class="page">
        <div class="header">
            <div class="header-content">
                <div class="logo-section">
                    <h1>🚗 DRIVE UP</h1>
                    <p>Auto-École d'Excellence</p>
                    <p>📍 Rue de Hassan 2, Agadir</p>
                    <p>📞 0631212766 | 📧 contact@driveup.ma</p>
                </div>
                <div class="photo-section">
                    <div class="photo-frame">
                        @if(isset($user->photo_identite))
                            <img src="{{ public_path('uploads/'.$user->photo_identite) }}" alt="Photo Candidat">
                        @else
                            <div class="photo-placeholder">PHOTO</div>
                        @endif
                    </div>
                </div>
            </div>
        </div>

        <div class="document-title">
            <h2>📋 Reçu d'Inscription</h2>
            <div class="document-number">N° {{ str_pad($user->id, 6, '0', STR_PAD_LEFT) }}</div>
        </div>

        <div class="content">
            <div class="section">
                <div class="section-title">
                    <span class="icon">👤</span>
                    Informations du Candidat
                </div>
                <table>
                    <tr>
                        <td>Nom & Prénom</td>
                        <td><strong>{{ strtoupper($user->nom) }} {{ ucfirst($user->prenom) }}</strong></td>
                    </tr>
                    <tr>
                        <td>Date de Naissance</td>
                        <td>{{ $user->date_naissance ? \Carbon\Carbon::parse($user->date_naissance)->format('d/m/Y') : 'Non renseignée' }}</td>
                    </tr>
                    <tr>
                        <td>Numéro CIN</td>
                        <td>{{ $user->carte_nationale ?? 'Non renseigné' }}</td>
                    </tr>
                    <tr>
                        <td>Téléphone</td>
                        <td>{{ $user->telephone ?? 'Non renseigné' }}</td>
                    </tr>
                    <tr>
                        <td>Adresse</td>
                        <td>{{ $user->adresse ?? 'Non renseignée' }}</td>
                    </tr>
                    <tr>
                        <td>Email</td>
                        <td>{{ $user->email }}</td>
                    </tr>
                </table>
            </div>

            <div class="section">
                <div class="section-title">
                    <span class="icon">🎓</span>
                    Détails de la Formation
                </div>
                <table>
                    <tr>
                        <td>Catégorie de Permis</td>
                        <td><strong style="font-size: 16px; color: #0d6efd;">Permis {{ $user->categorie_permis ?? 'B' }}</strong></td>
                    </tr>
                    <tr>
                        <td>Date d'Inscription</td>
                        <td>{{ isset($inscription_date) ? $inscription_date : now()->format('d/m/Y') }}</td>
                    </tr>
                    <tr>
                        <td>Volume Horaire</td>
                        <td>
                            Code : {{ $heures_code ?? '20' }}h<br>
                            Conduite : {{ $heures_conduite ?? '30' }}h
                        </td>
                    </tr>
                    <tr>
                        <td>Méthode de Paiement</td>
                        <td>{{ ucfirst($user->methode_paiement ?? 'Carte') }}</td>
                    </tr>
                </table>
            </div>

            <div class="signature-section">
                <div class="signature-box">
                    <div class="label">Signature du Candidat</div>
                    <div class="line">{{ $user->nom }} {{ $user->prenom }}</div>
                </div>
                <div class="signature-box">
                    <div class="label">Cachet de l'Établissement</div>
                    <div class="line">Auto-École Drive UP</div>
                </div>
            </div>
        </div>

        <div class="footer">
            <div class="company-info">AUTO-ÉCOLE DRIVE UP</div>
            <div>Ce document atteste de l'inscription du candidat au sein de l'auto-école Drive UP.</div>
            <div>Généré le {{ now()->format('d/m/Y à H:i') }}</div>
        </div>
    </div>

    <!-- ==================== REÇU DE PAIEMENT ==================== -->
    @if(isset($paiement))
    <div class="page">
        <div class="header">
            <div class="header-content">
                <div class="logo-section">
                    <h1>🚗 DRIVE UP</h1>
                    <p>Auto-École d'Excellence</p>
                    <p>📍 Rue de Hassan 2, Agadir</p>
                    <p>📞 0631212766 | 📧 contact@driveup.ma</p>
                </div>
                <div class="photo-section">
                    <div class="photo-frame">
                        @if(isset($user->photo_identite))
                            <img src="{{ public_path('uploads/'.$user->photo_identite) }}" alt="Photo Candidat">
                        @else
                            <div class="photo-placeholder">PHOTO</div>
                        @endif
                    </div>
                </div>
            </div>
        </div>

        <div class="document-title">
            <h2>💳 Reçu de Paiement</h2>
            <div class="document-number">N° {{ str_pad($paiement->id, 6, '0', STR_PAD_LEFT) }}</div>
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
    @endif

</body>
</html>
