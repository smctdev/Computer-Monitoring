<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Department;
use App\Models\Log;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class DepartmentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $departments = Department::with('branchCode')->orderBy('created_at', 'desc')->get();

        if ($departments->count() > 0) {

            return response()->json([
                'status'                =>              true,
                'message'               =>              'Departments fetched successfully.',
                'departments'            =>              $departments
            ], 200);
        } else {
            return response()->json([
                'status'        =>          false,
                'message'       =>          'No departments found.',
            ], 404);
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
            'department_name'       =>          ['required', 'max:255', Rule::unique('departments')->where(function ($query) use ($request) {
                return $query->where('branch_code_id', $request->branch_code_id);
            })],
            'branch_code_id'        =>          ['required', 'max:255', 'exists:branch_codes,id'],
        ]);

        if ($validation->fails()) {
            return response()->json([
                'status'        =>          false,
                'message'       =>          "Something went wrong please fix.",
                'errors'        =>          $validation->errors()
            ], 422);
        }

        $department = Department::create([
            'department_name'       =>          $request->department_name,
            "branch_code_id"        =>          $request->branch_code_id
        ]);

        Log::create([
            'user_id'           =>              Auth::id(),
            'log_data'          =>              'Added a department: ' . $department->department_name . ' and branch code: ' . $department->branchCode->branch_name
        ]);

        return response()->json([
            'status'            =>              true,
            'message'           =>              $department->department_name . " department added successfully.",
        ], 201);
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
        $department = Department::with('branchCode')->find($id);

        if (!$department) {
            return response()->json([
                'status'        =>          false,
                'message'       =>          'Department not found.'
            ], 404);
        }

        return response()->json([
            'status'                =>              true,
            'message'               =>              'Department fetched successfully.',
            'department'            =>              $department
        ], 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $department = Department::find($id);

        $validation = Validator::make($request->all(), [
            'department_name'           =>              ['required', Rule::unique('departments')->where(fn($query) => $query->where('branch_code_id', $request->branch_code_id))->ignore($department->id)],
            'branch_code_id'            =>              ['required', 'exists:branch_codes,id'],
        ]);

        if ($validation->fails()) {
            return response()->json([
                'status'        =>          false,
                'message'       =>          'Something went wrong. Please fix.',
                'errors'        =>          $validation->errors()
            ], 422);
        }

        if (!$department) {
            return response()->json([
                'status'        =>          false,
                'message'       =>          'Department not found.'
            ], 404);
        }

        $oldDepartmentName = $department->department_name;
        $oldBranchCode = $department->branchCode->branch_name;

        $department->update([
            'department_name'           =>              $request->department_name,
            'branch_code_id'            =>              $request->branch_code_id
        ]);

        Log::create([
            'user_id'           =>              Auth::id(),
            'log_data'          =>              'Updated a department from: ' . $oldDepartmentName . ' to: ' . $department->department_name . ' and branch code from: ' . $oldBranchCode . ' to: ' . $department->branchCode->branch_name
        ]);

        return response()->json([
            'status'                =>              true,
            'message'               =>              $department->department_name . ' department updated successfully.',
            'id'                    =>              $department->id
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $department = Department::find($id);

        if (!$department) {
            return response()->json([
                'status'            =>          false,
                'message'           =>          'Department not found.'
            ], 404);
        }

        $branches = $department->branchUnits()->count();

        if ($branches > 0) {
            return response()->json([
                'status'        =>          false,
                'message'       =>          'You cannot delete a department that is already in used by branches.'
            ], 422);
        }

        Log::create([
            'user_id'           =>              Auth::id(),
            'log_data'          =>              'Deleted the department : ' . $department->department_name . ' that has the branch code: ' . $department->branchCode->branch_name
        ]);

        $department->delete();

        return response()->json([
            'status'            =>          true,
            'message'           =>          'Department deleted successfully.'
        ], 200);
    }
}
