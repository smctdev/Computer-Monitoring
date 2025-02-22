<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Mail\SendEmail;
use Illuminate\Support\Facades\Mail;
use Illuminate\Http\Request;

class EmailController extends Controller
{
    public function sendNotificationToAllUsers()
    {
        $users = User::all();
        $content = "This is an important email for all users.";

        foreach ($users as $user) {
            Mail::to($user->email)->send(new SendEMail($content));
        }

        return response()->json([
            'status' => true,
            'message' => 'Notification sent to all users.'
        ], 200);
    }
}
