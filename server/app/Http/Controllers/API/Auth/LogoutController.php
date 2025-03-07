<?php

namespace App\Http\Controllers\API\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class LogoutController extends Controller
{
    public function logout()
    {

        $user = Auth::user();
        $token = $user->tokens();
        $token->delete();
        Auth::guard('web')->logout();
        session()->invalidate();
        session()->regenerateToken();

        return response()->json([
            'status'            =>          true,
            'message'           =>          "Logout successfully",
            'data'              =>          $user,
            'id'                =>          $user->id
        ], 200);
    }
}
