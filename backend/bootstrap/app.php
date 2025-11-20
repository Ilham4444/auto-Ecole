<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        // Configuration CORS pour l'API
        $middleware->api(prepend: [
            \Illuminate\Http\Middleware\HandleCors::class,
        ]);

        // Configuration CORS pour les routes web si nécessaire
        $middleware->web(append: [
            \Illuminate\Http\Middleware\HandleCors::class,
        ]);

        // Désactiver CSRF pour l'API
        $middleware->validateCsrfTokens(except: [
            'api/*',
            'sanctum/csrf-cookie',
            'login',
            'register',
            'logout'
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();
