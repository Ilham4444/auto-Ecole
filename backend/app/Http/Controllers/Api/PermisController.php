<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Permis;

class PermisController extends Controller {
    public function index() {
        return response()->json(Permis::all());
    }
}