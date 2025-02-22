<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;

use App\Models\Position;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\Log as PositionLog;

class PositionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $positions = Position::orderBy('position_name', 'asc')->get();

        if ($positions->count() > 0) {
            return response()->json([
                'status'                =>              true,
                'message'               =>             'Postion fetched successfully.',
                'positions'             =>              $positions,
            ], 200);
        } else {
            return response()->json([
                'status'                =>              false,
                'message'               =>             'No positions found.'
            ], 200);
        }
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
        $validation = Validator::make($request->all(), [
            'position_name'           =>              ['required', 'unique:positions,position_name'],
        ]);

        if ($validation->fails()) {
            return response()->json([
                'status'        =>          false,
                'message'       =>          'Something went wrong. Please fix.',
                'errors'        =>          $validation->errors()
            ], 422);
        }

        $position = Position::create([
            'position_name'           =>              $request->position_name
        ], 200);

        PositionLog::create([
            'user_id'           =>              auth()->user()->id,
            'log_data'          =>              'Added a position: ' . $position->position_name
        ]);

        return response()->json([
            'status'                =>              true,
            'message'               =>              $position->position_name . ' Position added successfully.',
            'id'                    =>              $position->id
        ], 200);
    }

    /**
     * Display the specified resource.
     */
    public function show(Position $position)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $position = Position::find($id);

        if (!$position) {
            return response()->json([
                'status'        =>          false,
                'message'       =>          'Position not found.'
            ], 404);
        }

        return response()->json([
            'status'                =>              true,
            'message'               =>              'Position fetched successfully.',
            'position'              =>              $position
        ], 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $position = Position::find($id);

        $validation = Validator::make($request->all(), [
            'position_name'           =>              ['required', 'unique:positions,position_name,' . $position->id],
        ]);

        if ($validation->fails()) {
            return response()->json([
                'status'        =>          false,
                'message'       =>          'Something went wrong. Please fix.',
                'errors'        =>          $validation->errors()
            ], 422);
        }

        if (!$position) {
            return response()->json([
                'status'        =>          false,
                'message'       =>          'Position not found.'
            ], 404);
        }

        $oldPositionName = $position->position_name;

        $position->update([
            'position_name'           =>              $request->position_name
        ]);

        PositionLog::create([
            'user_id'           =>              auth()->user()->id,
            'log_data'          =>              'Updated a position from: ' . $oldPositionName . ' to: ' . $position->position_name
        ]);

        return response()->json([
            'status'                =>              true,
            'message'               =>              $position->position_name . ' position updated successfully.',
            'id'                    =>              $position->id
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $position = Position::find($id);

        if (!$position) {
            return response()->json([
                'status'        =>      false,
                'message'       =>      'Position not found.'
            ], 404);
        }

        $users = $position->computerUsers()->count();

        if ($users > 0) {
            return response()->json([
                'status'        =>      false,
                'message'       =>      'You cannot delete a position that is already in used by users.'
            ], 422);
        }

        PositionLog::create([
            'user_id'           =>              auth()->user()->id,
            'log_data'          =>              'Deleted the position : ' . $position->position_name
        ]);

        $position->delete();

        return response()->json([
            'status' => true,
            'message' => 'Position deleted successfully.'
        ], 200);
    }
}
