<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;

use App\Models\InstalledApplication;
use Illuminate\Http\Request;

class InstalledApplicationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // $applications = InstalledApplication::all();

        // if ($applications->count() > 0) {
        //     return response()->json([
        //         'status'                        =>              false,
        //         'message'                       =>              'No installed applications found.',
        //     ], 200);
        // } else {
        //     return response()->json([
        //         'status'                        =>              true,
        //         'message'                       =>              'Installed application successfully fetched.',
        //         'installed_applications'        =>              $applications
        //     ], 200);
        // }
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
    public function show(InstalledApplication $installedApplication)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(InstalledApplication $installedApplication)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, InstalledApplication $installedApplication)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(InstalledApplication $installedApplication)
    {
        //
    }
}
