<?php

namespace App\Http\Controllers\API\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class PasswordChangeController extends Controller
{
    public function update(Request $request, $id)
    {

        $user = User::find($id);

        if ($user) {
            $validation = Validator::make($request->all(), [
                'new_password'          =>          ['required', 'confirmed', 'min:8']
            ]);

            if ($validation->fails()) {
                return response()->json([
                    'status'        =>          false,
                    'message'       =>          'Something went wrong. Please fix.',
                    'errors'        =>          $validation->errors(),
                ], 400);
            }
            if ($user->request_new_password == false) {
                return response()->json([
                    'status'            =>          true,
                    'message'           =>          'This user is not requesting a new password.',
                    'data'              =>          $user,
                    'id'                =>          $user->id
                ], 200);
            }

            if (Hash::check($request->new_password, $user->password)) {
                return response()->json([
                    'status'            =>          true,
                    'message'           =>          'You cannot use the old password. Please choose a different one.',
                ], 400);
            }

            $user->update([
                'password'                  =>          bcrypt($request->new_password),
                'request_new_password'      =>          false
            ]);

            $user->save();

            return response()->json([
                'status'            =>          true,
                'message'           =>          'Password change successfully',
                'data'              =>          $user,
                'id'                =>          $user->id
            ], 200);
        } else {

            return response()->json([
                'status'            =>          false,
                'message'           =>          'No users found.'
            ], 400);
        }
    }
}
