<?php

namespace App\Http\Controllers\API\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class RegisterController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validation = Validator::make($request->all(), [
            'firstName'         =>          ['required', 'max:255'],
            'lastName'          =>          ['required', 'max:255'],
            'contactNumber'     =>          ['required', 'numeric', 'digits:11'],
            'branchCode'        =>          ['required', 'exists:branch_codes,id'],
            'username'          =>          ['required', 'max:255', 'unique:users,username'],
            'email'             =>          ['required', 'email', 'max:255', 'unique:users,email', 'regex:/^\S+@\S+\.\S+$/'],
            'password'          =>          ['required', 'confirmed', 'min:8']
        ]);

        if ($validation->fails()) {
            return response()->json([
                'status'        =>          false,
                'message'       =>          "Something went wrong please fix.",
                'errors'        =>          $validation->errors()
            ], 422);
        }

        $user = User::create([
            'firstName'         =>          $request->firstName,
            'lastName'          =>          $request->lastName,
            'contactNumber'     =>          $request->contactNumber,
            'branch_code_id'    =>          $request->branchCode,
            'username'          =>          $request->username,
            'email'             =>          $request->email,
            'password'          =>          bcrypt($request->password)
        ]);

        return response()->json([
            'status'        =>          true,
            'message'       =>          "User " . $user->email . " registered successfully.",
            'user'          =>          $user
        ], 200);
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
}
