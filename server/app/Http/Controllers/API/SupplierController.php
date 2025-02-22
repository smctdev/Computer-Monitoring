<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;

use App\Models\Supplier;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\Log as SupplierLog;

class SupplierController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $allSuppliers = Supplier::all();

        if ($allSuppliers->count() > 0) {
            return response()->json([
                'status'                =>              true,
                'message'               =>              "Successfully fetch all suppliers data",
                'data'                  =>              $allSuppliers
            ], 200);
        } else {
            return response()->json([
                'status'                =>              false,
                'message'               =>              "No suppliers found.",
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
            'supplier_name'         =>              ['required', 'max:5000', 'unique:suppliers,supplier_name']
        ]);

        if ($validation->fails()) {
            return response()->json([
                'status'                =>          false,
                'message'               =>          'Something went wrong. Please fix.',
                'errors'                =>          $validation->errors()
            ], 422);
        }


        $supplier = Supplier::create([
            'supplier_name'          =>          $request->supplier_name
        ]);

        SupplierLog::create([
            'user_id'           =>              auth()->user()->id,
            'log_data'          =>              'Added a supplier: ' . $supplier->supplier_name
        ]);

        return response()->json([
            'status'                =>              true,
            'message'               =>              $supplier->supplier_name . " supplier added successfully.",
            'data'                  =>              $supplier,
            'id'                    =>              $supplier->id
        ], 200);
    }

    /**
     * Display the specified resource.
     */
    public function show(Supplier $supplier)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        $supplier = Supplier::find($id);

        if (!$supplier) {
            return response()->json([
                'status'        =>          false,
                'message'       =>          'Supplier not found.'
            ], 404);
        }

        return response()->json([
            'status'                =>              true,
            'message'               =>              'Supplier fetched successfully.',
            'supplier'              =>              $supplier
        ], 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $supplier = Supplier::find($id);

        $validation = Validator::make($request->all(), [
            'supplier_name'           =>              ['required', 'unique:suppliers,supplier_name,' . $supplier->id],
        ]);

        if ($validation->fails()) {
            return response()->json([
                'status'        =>          false,
                'message'       =>          'Something went wrong. Please fix.',
                'errors'        =>          $validation->errors()
            ], 422);
        }

        if (!$supplier) {
            return response()->json([
                'status'        =>          false,
                'message'       =>          'Supplier not found.'
            ], 404);
        }

        $oldSupplierName = $supplier->supplier_name;

        $supplier->update([
            'supplier_name'           =>              $request->supplier_name
        ]);

        SupplierLog::create([
            'user_id'           =>              auth()->user()->id,
            'log_data'          =>              'Updated a supplier from: ' . $oldSupplierName . ' to: ' . $supplier->supplier_name
        ]);

        return response()->json([
            'status'                =>              true,
            'message'               =>              $supplier->supplier_name . ' supplier updated successfully.',
            'id'                    =>              $supplier->id
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $supplier = Supplier::find($id);

        if (!$supplier) {
            return response()->json([
                'status'            =>          false,
                'message'           =>          'Supplier not found.'
            ], 404);
        }

        $units = $supplier->units()->count();

        if ($units > 0) {
            return response()->json([
                'status'                =>              false,
                'message'               =>              'You cannot delete a supplier that is already in used by units.'
            ], 422);
        }

        SupplierLog::create([
            'user_id'           =>              auth()->user()->id,
            'log_data'          =>              'Deleted the supplier : ' . $supplier->supplier_name
        ]);

        $supplier->delete();

        return response()->json([
            'status'                =>              true,
            'message'               =>              'Supplier  deleted successfully.'
        ], 200);
    }
}
