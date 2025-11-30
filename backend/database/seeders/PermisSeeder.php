<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PermisSeeder extends Seeder
{
    public function run(): void
    {
        $permis = [
            [
                'id' => 1,
                'title' => 'Permis B - Véhicules Légers',
                'price' => '4500 Dh',
                'hours' => '30 heures',
                'description' => 'Formation complète pour conduire les voitures, camionnettes et véhicules légers (PTAC ≤ 3,5 tonnes)',
                'features' => json_encode([
                    '20h de code de la route',
                    '30h de conduite pratique',
                    'Véhicule à double commande',
                    'Examen code et conduite inclus',
                    'Dossier administratif complet'
                ]),
            ],
            [
                'id' => 2,
                'title' => 'Permis A - Motocycles',
                'price' => '3800 Dh',
                'hours' => '20 heures',
                'description' => 'Formation pour conduire les motos et motocyclettes de toutes cylindrées',
                'features' => json_encode([
                    '15h de code spécifique moto',
                    '20h de conduite pratique',
                    'Équipement de sécurité fourni',
                    'Piste de maniabilité',
                    'Circulation en conditions réelles'
                ]),
            ],
            [
                'id' => 3,
                'title' => 'Permis C - Poids Lourds',
                'price' => '8500 Dh',
                'hours' => '40 heures',
                'description' => 'Formation pour conduire les camions et véhicules de transport de marchandises (PTAC > 3,5 tonnes)',
                'features' => json_encode([
                    '25h de code professionnel',
                    '40h de conduite poids lourds',
                    'Manoeuvres spécifiques',
                    'Formation FIMO/FCO',
                    'Stage en conditions réelles'
                ]),
            ],
            [
                'id' => 4,
                'title' => 'Permis D - Transport de Personnes',
                'price' => '9000 Dh',
                'hours' => '35 heures',
                'description' => 'Formation pour conduire les autobus et véhicules de transport en commun (>9 places)',
                'features' => json_encode([
                    'Code transport de personnes',
                    '35h de conduite autobus',
                    'Sécurité des passagers',
                    'Gestion d\'urgences',
                    'Carte de qualification obligatoire'
                ]),
            ],
            [
                'id' => 5,
                'title' => 'Permis A1 - Motos Légères',
                'price' => '2500 Dh',
                'hours' => '12 heures',
                'description' => 'Formation pour conduire les motocyclettes légères jusqu\'à 125cc (dès 16 ans)',
                'features' => json_encode([
                    '10h de code de la route',
                    '12h de conduite pratique',
                    'Équipement inclus',
                    'Âge minimum: 16 ans',
                    'Maniabilité et circulation'
                ]),
            ],
            [
                'id' => 6,
                'title' => 'Permis EB - Remorque',
                'price' => '2000 Dh',
                'hours' => '8 heures',
                'description' => 'Extension du permis B pour tracter une remorque ou caravane (PTAC > 750 kg)',
                'features' => json_encode([
                    'Formation aux manœuvres',
                    '8h de conduite spécifique',
                    'Attelage et dételage',
                    'Marche arrière',
                    'Permis B requis'
                ]),
            ],
        ];

        DB::table('permis')->insert($permis);
    }
}
