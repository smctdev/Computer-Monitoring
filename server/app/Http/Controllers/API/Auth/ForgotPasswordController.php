<?php

namespace App\Http\Controllers\API\Auth;

use App\Http\Controllers\Controller;
use App\Mail\NewPasswordEmail;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class ForgotPasswordController extends Controller
{
    public function forgotPassword(Request $request)
    {
        $validation = Validator::make($request->all(), [
            'email'         =>          ['required', 'email', 'max:255', 'regex:/^\S+@\S+\.\S+$/']
        ]);

        if ($validation->fails()) {
            return response()->json([
                'status'        =>          false,
                'message'       =>          "Fix the fields first",
                'errors'        =>          $validation->errors()
            ], 400);
        }

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json([
                'status'        =>          false,
                'message'       =>          "Email does not exists."
            ], 400);
        } else {

            $newPassword = Str::random(10);

            $user->update([
                'password'                  =>          bcrypt($newPassword),
                'request_new_password'      =>          true
            ]);

            // $firstName = $user->firstName;
            // $lastName = $user->lastName;

            // Mail::to($user->email)->send(new NewPasswordEmail($firstName, $lastName, $newPassword));

            return response()->json([
                'status'        =>      true,
                'message'       =>      "We sent a new password to your email " . $user->email . ". Please check your inbox."
            ], 200);
        }
    }
}
