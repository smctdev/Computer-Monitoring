<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class ProfileController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = auth()->user()->load('branchCode');

        return response()->json([
            'status'        =>          true,
            'message'       =>          'Profile Information',
            'data'          =>          $user,
            'id'            =>          auth()->user()->id
        ], 200);
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
    public function update(Request $request)
    {
        $user = $request->user();

        $validation = Validator::make($request->all(), [
            'firstName'                 =>                  ['required',],
            'branch_code_id'            =>                  ['required', 'exists:branch_codes,id'],
            'lastName'                  =>                  ['required'],
            'email'                     =>                  ['required', 'email', 'unique:users,email,' . $user->id],
            'contactNumber'             =>                  ['required', 'numeric', 'digits:11'],
            'username'                  =>                  ['required'],
            'oldPassword'               =>                  ['nullable', 'required_with:newPassword'],
            'newPassword'               =>                  ['nullable', 'required_with:oldPassword', 'different:oldPassword', 'min:8', 'confirmed'],
        ]);

        if ($validation->fails()) {
            return response()->json([
                'status'            =>          false,
                'message'           =>          'Something went wrong. Please fix.',
                'errors'            =>          $validation->errors()
            ], 422);
        }

        if ($request->filled('newPassword')) {
            if (!Hash::check($request->oldPassword, $user->password)) {
                return response()->json([
                    'status'  => false,
                    'message' => 'Old password is incorrect.',
                    'errors'  => ['oldPassword' => ['Old password is incorrect.']]
                ], 422);
            }

            $user->password = Hash::make($request->newPassword);
        }

        $userData = $request->only(['firstName', 'branch_code_id', 'lastName', 'email', 'contactNumber', 'username']);
        $user->fill($userData);

        if ($request->hasFile('profile_picture')) {
            $hadProfilePicture = $user->profile_picture != null;

            if ($hadProfilePicture) {
                $fullPath = public_path($user->profile_picture);
                if (file_exists($fullPath)) {
                    unlink($fullPath);
                }
            }

            $image = $request->file('profile_picture');
            $name = $user->firstName . ' ' . $user->LastName . '-' . time() . '.' . $image->getClientOriginalExtension();
            $path = 'users-profile/';
            $image->move($path, $name);

            $user->profile_picture = $path . $name;

        }


        $user->save();

        return response()->json([
            'status'        =>          true,
            'message'       =>          'Profile updated successfully',
            'data'          =>          $user,
        ], 200);
    }
    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
