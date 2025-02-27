<?php

namespace App\Http\Controllers\API\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class LoginController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }

    public function login(Request $request)
    {
        $validation = Validator::make($request->all(), [
            'username_or_email'         =>          ['required'],
            'password'                  =>          ['required', 'min:8']
        ]);

        if ($validation->fails()) {
            return response()->json([
                'status'        =>      false,
                'message'       =>      "Something went wrong please fix.",
                'errors'        =>      $validation->errors()
            ], 400);
        }

        $user = User::where('email', $request->username_or_email)
            ->orWhere('username', $request->username_or_email)
            ->first();

        if (!$user) {
            return response()->json([
                'status'        =>      false,
                'message'       =>      "This email or username does not exist or is not verified yet",
            ], 400);
        }

        $login = auth()->attempt([
            'email'         =>          filter_var($request->username_or_email, FILTER_VALIDATE_EMAIL) ? $request->username_or_email : $user->email,
            'password'      =>          $request->password
        ]);

        if (!$login) {
            \Log::error('wow error');
            return response()->json([
                'status'        =>          false,
                'message'       =>          'Invalid Credentials'
            ], 400);
        } elseif ($user->request_new_password == true) {

            auth()->user()->tokens()->delete();

            return response()->json([
                'status'            =>          true,
                'message'           =>          'You need to change your password first',
                'token'             =>          $user->createToken("API TOKEN")->plainTextToken,
                'data'              =>          $user,
                'id'                =>          auth()->user()->id
            ], 409);
        } else {

            auth()->user()->tokens()->delete();

            session()->regenerate();

            return response()->json([
                'status'        =>      true,
                'message'       =>      "Welcome " . $user->email . " you are now login",
                'token'         =>      $user->createToken("API TOKEN")->plainTextToken,
                'user'          =>      $user
            ], 200);
        }
    }
}
