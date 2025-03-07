<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\TransferUnit;
use App\Models\Unit;
use App\Models\Log as UnitLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class UnitController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $sortColumn = $request->query('sort_column', 'id');
        $sortOrder = $request->query('sort_order', 'asc');

        $validColumns = [
            'id',
            'unit_code',
            'date_of_purchase',
            'category.category_name',
            'description',
            'supplier.supplier_name',
            'serial_number',
            'status'
        ];

        if (!in_array($sortColumn, $validColumns)) {
            $sortColumn = 'id';
        }

        $allUnitsQuery = Unit::with(['category', 'supplier', 'transferUnits.computerUser', 'transferBranchUnits.branchOldDataUnit.branchCode', 'transferBranchUnits.branchOldDataUnit.department']);

        if (in_array($sortColumn, ['category_name', 'supplier_name'])) {
            $allUnitsQuery->join('categories', 'units.category_id', '=', 'categories.id')
                ->join('suppliers', 'units.supplier_id', '=', 'suppliers.id');
        }

        $allUnits = $allUnitsQuery->orderBy($sortColumn, $sortOrder)->get();

        $vacantDefectiveUnits = Unit::where('status', 'Vacant')
            ->orWhere('status', 'Defective')
            ->with(['category', 'supplier'])
            ->orderBy($sortColumn, $sortOrder)
            ->get();

        $vacantUnits = Unit::where('status', 'Vacant')
            ->with(['category', 'supplier'])
            ->orderBy($sortColumn, $sortOrder)
            ->get();

        if ($allUnits->count() > 0) {
            return response()->json([
                'status'                =>          true,
                'message'               =>          "Successfully fetched all units data",
                'data'                  =>          $allUnits,
                'vacantDefective'       =>          $vacantDefectiveUnits,
                'vacant'                =>          $vacantUnits
            ], 200);
        } else {
            return response()->json([
                'status'        =>      true,
                'message'       =>      "No units found.",
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
            '*.category'                        =>              ['required', 'exists:categories,id'],
            '*.supplier'                        =>              ['required', 'exists:suppliers,id'],
            '*.date_of_purchase'                =>              ['nullable'],
            '*.description'                     =>              ['required', 'max:5000'],
            '*.serial_number'                   =>              ['required'],
            '*.status'                          =>              ['required', 'in:Used,Vacant,Defective,Used (Transfer)']
        ]);

        if ($validation->fails()) {
            return response()->json([
                'status'                =>              false,
                'message'               =>              'Something went wrong. Please fix.',
                'errors'                =>              $validation->errors()
            ], 422);
        }

        $createdUnits = [];

        foreach ($request->all() as $unitData) {
            $createdUnit = Unit::create([
                'category_id'                   =>                  $unitData['category'],
                'supplier_id'                   =>                  $unitData['supplier'],
                'date_of_purchase'              =>                  $unitData['date_of_purchase'],
                'description'                   =>                  $unitData['description'],
                'serial_number'                 =>                  $unitData['serial_number'],
                'status'                        =>                  $unitData['status']
            ]);

            // $createdUnit->unit_code = '00000' . $createdUnit->id;
            $createdUnit->save();

            $createdUnits[] = $createdUnit;
        }

        foreach ($createdUnits as $unit) {
            UnitLog::create([
                'user_id'                   =>              auth()->user()->id,
                'log_data'                  =>              'Added a unit with the category name: ' . $unit->category->category_name . ' and the serial number: ' . $unit->serial_number
            ]);
        }

        return response()->json([
            'status'                    =>                  true,
            'message'                   =>                  count($createdUnits) . (count($createdUnits) <= 1 ? " Unit" : " Units") . " added successfully.",
            'data'                      =>                  $createdUnits
        ], 200);
    }


    /**
     * Display the specified resource.
     */
    public function show(Unit $unit)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Unit $unit)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $unit = Unit::find($id);

        if ($unit) {
            $validation = Validator::make($request->all(), [
                'category'                        =>              ['required', 'exists:categories,id'],
                'supplier'                        =>              ['required', 'exists:suppliers,id'],
                'description'                     =>              ['required', 'max:5000'],
                'serial_number'                   =>              ['required'],
                'status'                          =>              ['required', 'in:Used,Vacant,Defective,Used (Transfer)']
            ]);

            if ($validation->fails()) {
                return response()->json([
                    'status'                =>              false,
                    'message'               =>              'Something went wrong. Please fix.',
                    'errors'                =>              $validation->errors()
                ], 422);
            }

            $unit->update([
                'category_id'               =>              $request->category,
                'supplier_id'               =>              $request->supplier,
                'date_of_purchase'          =>              $request->date_of_purchase,
                'description'               =>              $request->description,
                'serial_number'             =>              $request->serial_number,
                'status'                    =>              $request->status
            ]);

            $unit->save();

            UnitLog::create([
                'user_id'           =>              auth()->user()->id,
                'log_data'          =>              'Updated a unit with the category name: ' . $unit->category->category_name . ' and the serial number: ' . $unit->serial_number
            ]);

            return response()->json([
                'status'            =>              true,
                'message'           =>              'Unit ' . $unit->category->category_name . ' updated successfully',
                'id'                =>              $unit->id
            ], 200);
        } else {
            return response()->json([
                'status'            =>              false,
                'message'           =>              'Unit not found'
            ], 422);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $unit = Unit::find($id);

        if (!$unit) {
            return response()->json([
                'status' => false,
                'message' => 'Unit not found/Already deleted'
            ], 422);
        }

        $isAssigned = $unit->computers()->exists();

        if ($isAssigned) {
            return response()->json([
                'status' => false,
                'message' => 'Cannot delete unit. It is assigned to one or more computers.'
            ], 422);
        }

        $isReferenced = TransferUnit::where('unit_id', $id)->exists();

        if ($isReferenced) {
            return response()->json([
                'status' => false,
                'message' => 'Cannot delete unit. It is referenced in transfer records.'
            ], 422);
        }

        $unit->delete();

        UnitLog::create([
            'user_id'           =>              auth()->user()->id,
            'log_data'          =>              'Deleted the unit with the category name: ' . $unit->category->category_name . ' and the serial number: ' . $unit->serial_number
        ]);

        return response()->json([
            'status' => true,
            'message' => $unit->category->category_name . ' deleted successfully'
        ], 200);
    }
}
