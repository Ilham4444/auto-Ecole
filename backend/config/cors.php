<?php
// config/cors.php

return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],

'allowed_methods' => ['*'],

    'allowed_origins' => ['http://localhost:5173', 'http://127.0.0.1:5173', '*'], // Autoriser localhost, 127.0.0.1 et tout pour le dev

'allowed_headers' => ['*'],

'supports_credentials' => true,

];