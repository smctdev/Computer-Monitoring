<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Log;

class LogController extends Controller
{

    public function index()
    {
        $per_page = request('per_page') ?: 10;

        $logs = Log::with('user', 'computerUser')
            ->orderBy('created_at', 'desc')
            ->paginate($per_page);


        if ($logs->count() > 0) {
            return response()->json([
                'status'                =>              true,
                'message'               =>             'Logs fetched successfully.',
                'logs'                  =>              $logs
            ], 200);
        } else {
            return response()->json([
                'status'                =>              false,
                'message'               =>             'No logs found.'
            ], 404);
        }
    }
    /**
     * Show the form for creating the resource.
     */
    public function create(): never
    {
        abort(404);
    }

    /**
     * Store the newly created resource in storage.
     */
    public function store(Request $request): never
    {
        abort(404);
    }

    /**
     * Display the resource.
     */
    public function show()
    {
        //
    }

    /**
     * Show the form for editing the resource.
     */
    public function edit()
    {
        //
    }

    /**
     * Update the resource in storage.
     */
    public function update(Request $request)
    {
        //
    }

    /**
     * Remove the resource from storage.
     */
    public function destroy(): never
    {
        abort(404);
    }
}
