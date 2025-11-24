<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class DashboardController extends Controller
{

    public function index(Request $request)
    {
        return response()->json([
            'status' => true,
            'message' => 'Bienvenue sur votre dashboard',
            'user' => $request->user()
        ]);
    }
}
