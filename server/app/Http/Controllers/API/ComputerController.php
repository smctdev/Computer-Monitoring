<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;

use App\Models\Computer;
use App\Models\ComputerUser;
use App\Models\InstalledApplication;
use App\Models\Notification;
use App\Models\Remark;
use App\Models\TransferUnit;
use App\Models\Unit;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\Log as ComputerLog;
use Illuminate\Support\Facades\Log;

class ComputerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $computers = Computer::orderBy('id', 'desc')->with('unit', 'computerUser', 'unit.category', 'unit.supplier')->get();

        if ($computers->count() > 0) {
            return response()->json([
                'status'            =>              true,
                'message'           =>              'Successfully fetched all computer set.',
                'data'              =>              $computers
            ], 200);
        } else {
            return response()->json([
                'status'            =>              false,
                'message'           =>              'No computer set found.'
            ], 400);
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
        $authUser = auth()->user();

        $validation = Validator::make($request->all(), [
            'checkedRows'                    =>              ['required'],
            'checkedRows.*'                  =>              ['exists:units,id'],
            'computer_user'                  =>              ['required', 'exists:computer_users,id'],
        ]);

        if ($validation->fails()) {
            return response()->json([
                'status'                =>          false,
                'message'               =>          'Something went wrong. Please fix.',
                'errors'                =>          $validation->errors()
            ], 422);
        }

        $computer = Computer::where('computer_user_id', $request->computer_user)->first();

        if (!$computer) {
            $computer = Computer::create([
                'computer_user_id'          =>              $request->computer_user,
                'date_cleaning'             =>              now()
            ]);

            $computer->units()->attach($request->checkedRows);

            $units = Unit::with('category')
                ->whereIn('id', $request->checkedRows)
                ->get();

            $unitDetails = $units->map(function ($unit) {
                return $unit->unit_code . ' - ' . $unit->category->category_name . ' - ' . $unit->serial_number;
            })->implode(', ');

            ComputerLog::create([
                'user_id'                   =>              $authUser->id,
                'computer_user_id'          =>              $request->computer_user,
                'log_data'                  =>              'Added and Installed a unit ' . $unitDetails  . ' on ' . $computer->computerUser->name
            ]);
        } else {
            $computer->units()->attach($request->checkedRows);

            $units = Unit::with('category')
                ->whereIn('id', $request->checkedRows)
                ->get();

            $unitDetails = $units->map(function ($unit) {
                return $unit->unit_code . ' - ' . $unit->category->category_name . ' - ' . $unit->serial_number;
            })->implode(', ');

            ComputerLog::create([
                'user_id'                   =>              $authUser->id,
                'computer_user_id'          =>              $request->computer_user,
                'log_data'                  =>              'Installed a unit ' . $unitDetails  . ' on ' . $computer->computerUser->name . '\'s computer'
            ]);
        }

        foreach ($request->checkedRows as $unitId) {
            $unit = Unit::find($unitId);
            if ($unit) {
                $unit->status = 'Used';
                $unit->save();

                $transfer = TransferUnit::create([
                    'unit_id'                   =>              $unitId,
                    'computer_user_id'          =>              $request->computer_user,
                    'date'                      =>              now(),
                    'status'                    =>              'Transfer',
                ]);

                ComputerLog::create([
                    'user_id'                   =>              auth()->user()->id,
                    'computer_user_id'          =>              $request->computer_user,
                    'log_data'                  =>              $transfer->unit->category->category_name . ' transfered' . ' to ' . $transfer->computerUser->name . '\'s computer'
                ]);
            }
        }

        $user = ComputerUser::find($request->computer_user);

        $title = $authUser->firstName . ' ' . $authUser->lastName . " added computer unit to " . '(' . $user->name . ').';

        Notification::create([
            'user_id'   =>      $authUser->id,
            'title'     =>      $title
        ]);

        return response()->json([
            'status'                =>              true,
            'message'               =>              $user ? $user->name . " computer added successfully." : "Computer added successfully.",
            'data'                  =>              $computer,
            'id'                    =>              $computer->id
        ], 200);
    }

    /**
     * Display the specified resource.
     */
    public function show(Computer $computer, $id)
    {

        $computer = Computer::with('units', 'computerUser', 'computerUser.branchCode', 'computerUser.position', 'units.category', 'units.supplier', 'installedApplications', 'remarks', 'remarks.user')->find($id);

        if (!$computer) {
            return response()->json([
                'status'                =>              false,
                'message'               =>              'No computer found.',
            ], 200);
        } else {
            return response()->json([
                'status'                =>              true,
                'message'               =>              'Successfully fetched computer data.',
                'computer'              =>              $computer,
                'id'                    =>              $computer->id
            ], 200);
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Computer $computer)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Computer $computer)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, Computer $computer, $computerId, $unitId)
    {
        //
    }

    public function installAndRemark(Request $request, $computerId)
    {
        $validation = Validator::make($request->all(), [
            'application_content'           =>              ['required', 'array'],
            'application_content.*'         =>              ['string'],
            'remark_content'                =>              ['required'],
            'date'                          =>              ['required'],
            'format'                        =>              ['required']
        ]);

        if ($validation->fails()) {
            return response([
                'status'            =>          false,
                'message'           =>          'Something went wrong. Please fix.',
                'errors'            =>          $validation->errors()
            ], 422);
        }

        $computer = Computer::find($computerId);

        if (!$computer) {

            return response()->json([
                'status'            =>              false,
                'message'           =>              'No computers found'
            ], 422);
        } else {
            // InstalledApplication::where('computer_id', $computerId)->delete();
            $installedApplications = [];
            foreach ($request->application_content as $content) {
                $installed = InstalledApplication::updateOrCreate(
                    ['computer_id' => $computerId, 'application_content' => $content],
                    ['application_content' => $content]
                );
                $installedApplications[] = $installed;
                $installedContent[] = $content;
            }

            $remark = Remark::create([
                'computer_id'                   =>                  $computerId,
                'user_id'                       =>                  auth()->user()->id,
                'date'                          =>                  $request->date,
                'remark_content'                =>                  $request->remark_content,
            ]);

            if ($request->format === 'Yes') {
                $computer->increment('formatted_status');
            }
            $computer->increment('remarks');
            $computer->save();

            ComputerLog::create([
                'user_id'                   =>              auth()->user()->id,
                'computer_user_id'          =>              $computer->computer_user_id,
                'log_data'                  =>              'Installed ' . implode(', ', $installedContent) . ' and added a remark: ' . $remark->remark_content . ($request->format === 'Yes' ? ', and formatted the computer.' : '.')
            ]);

            return response()->json([
                'status'                    =>          true,
                'message'                   =>          'Successfully installed ' . implode(', ', $installedContent) . ', and added a remark: ' . $remark->remark_content . ($request->format === 'Yes' ? ', and formatted the computer.' : '.'),
                'computer'                  =>          $computer
            ], 201);
        }
    }

    public function unitAction(Request $request, $computerId)
    {

        $validation = Validator::make($request->all(), [
            'action' => ['required'],
        ]);

        if ($validation->fails()) {
            return response()->json([
                'status'  => false,
                'message' => 'Something went wrong. Please fix.',
                'errors'  => $validation->errors(),
            ], 422);
        }

        $computer = Computer::findOrFail($computerId);
        $units = Unit::whereIn('id', $request->checkRows)->get();

        if ($units->isEmpty()) {
            return response()->json([
                'status'  => false,
                'message' => 'Units not found.',
            ], 404);
        }

        foreach ($units as $unit) {
            switch ($request->action) {
                case 'Transfer':
                    $validation = Validator::make($request->all(), [
                        'computer_user' => ['required', 'exists:computer_users,id'],
                        'date'          => ['required'],
                    ]);

                    if ($validation->fails()) {
                        return response()->json([
                            'status'  => false,
                            'message' => 'Something went wrong. Please fix.',
                            'errors'  => $validation->errors(),
                        ], 422);
                    }

                    $oldComputerUser = $computer->computerUser->name;
                    $unit->status = 'Used';
                    $unit->save();

                    $computer->units()->detach($unit->id);
                    if ($computer->units()->count() === 0) {
                        $computer->delete();
                    }

                    $newUser = ComputerUser::find($request->computer_user);
                    $newComputer = Computer::firstOrCreate([
                        'computer_user_id' => $newUser->id,
                    ]);
                    $newComputer->units()->attach($unit->id);

                    $transfer = TransferUnit::create([
                        'unit_id'          => $unit->id,
                        'computer_user_id' => $request->computer_user,
                        'date'             => $request->date,
                        'status'           => 'Transfer',
                    ]);

                    ComputerLog::create([
                        'user_id'          => auth()->user()->id,
                        'computer_user_id' => $request->computer_user,
                        'log_data'         => $transfer->unit->category->category_name . ' unit transferred from: ' . $oldComputerUser . ' to: ' . $transfer->computerUser->name . '\'s computer',
                    ]);

                    break;

                case 'Defective':
                    $unit->status = 'Defective';
                    $unit->save();
                    $unitsToProcess[] = $unit;

                    ComputerLog::create([
                        'user_id'          => auth()->user()->id,
                        'computer_user_id' => $computer->computer_user_id,
                        'log_data'         => 'Removed ' . $unit->category->category_name . ' unit and automatically marked as defective',
                    ]);

                    break;

                case 'Delete':
                    if ($unit->status === 'Defective') {
                        ComputerLog::create([
                            'user_id'          => auth()->user()->id,
                            'computer_user_id' => $computer->computer_user_id,
                            'log_data'         => $unit->category->category_name . ' marked as defective',
                        ]);
                        $unit->status = 'Defective';
                    } else {
                        ComputerLog::create([
                            'user_id'          => auth()->user()->id,
                            'computer_user_id' => $computer->computer_user_id,
                            'log_data'         => $unit->category->category_name . ' marked as vacant',
                        ]);
                        $unit->status = 'Vacant';
                    }

                    $computer->units()->detach($unit->id);
                    $unit->save();

                    if ($computer->units()->count() === 0) {
                        ComputerLog::create([
                            'user_id'          => auth()->user()->id,
                            'computer_user_id' => $computer->computer_user_id,
                            'log_data'         => 'Computer automatically deleted due to no units left',
                        ]);
                        $computer->delete();
                    }

                    $unitsToProcess[] = $unit;
                    break;
            }
        }

        $message = '';

        if ($request->action === 'Transfer') {
            $message = $units->count() . ' unit(s) successfully transferred to ' .  $newUser->name . '\'s computer';
        } elseif ($request->action === 'Delete') {
            $message = $units->count() . ' unit(s) successfully removed from ' . $computer->computerUser->name . '\'s computer';
        } elseif ($request->action === 'Defective') {
            $message = $units->count() . ' unit(s) successfully marked as defective from ' . $computer->computerUser->name . '\'s computer.';
        }

        return response()->json([
            'status'  => true,
            'message' => $message,
        ], 200);
    }

    public function updateApplicationAndUserDetails(Request $request, $computerId, $computerUserId)
    {
        $validation = Validator::make($request->all(), [
            'application_content'               =>              ['required', 'array'],
            'application_content.*'             =>              ['string'],
            'position'                          =>              ['required', 'exists:positions,id'],
            'email'                             =>              ['required', 'email', 'unique:computer_users,email,' . $computerUserId, 'regex:/^\S+@\S+\.\S+$/'],
            'branch_code'                       =>              ['required', 'exists:branch_codes,id']
        ]);

        if ($validation->fails()) {
            return response([
                'status'            => false,
                'message'           => 'Something went wrong. Please fix.',
                'errors'            => $validation->errors()
            ], 422);
        }

        $computer = Computer::find($computerId);

        if (!$computer) {
            return response()->json([
                'status'            => false,
                'message'           => 'No computers found'
            ], 422);
        } else {
            if ($request->has('application_content')) {
                $existingApplications = InstalledApplication::where('computer_id', $computerId)->get();
                $existingApplications->whereNotIn('application_content', $request->application_content)->each(function ($app) use ($computer) {
                    ComputerLog::create([
                        'user_id'                   =>              auth()->user()->id,
                        'computer_user_id'          =>              $computer->computer_user_id,
                        'log_data'                  =>              'Uninstalled ' . $app->application_content . ' application' . ' from ' . $app->computer->computerUser->name . ' \'s computer'
                    ]);
                    $app->delete();
                });

                foreach ($request->application_content as $content) {
                    $installedApp = InstalledApplication::updateOrCreate(
                        ['computer_id' => $computerId, 'application_content' => $content],
                        ['application_content' => $content]
                    );
                    ComputerLog::create([
                        'user_id'                   =>              auth()->user()->id,
                        'computer_user_id'          =>              $computer->computer_user_id,
                        'log_data'                  =>              'Installed ' . $content . ' application ' . ' to ' . $installedApp->computer->computerUser->name . ' \'s computer'
                    ]);
                }
            }

            $computerUser = ComputerUser::find($computerUserId);

            if (!$computerUser) {
                return response([
                    'status'            => false,
                    'message'           => 'No computer user found.',
                    'errors'            => $validation->errors()
                ], 400);
            } else {
                $computerUser->update([
                    'email'                   =>          $request->email,
                    'position_id'             =>          $request->position,
                    'branch_code_id'          =>          $request->branch_code
                ]);

                ComputerLog::create([
                    'user_id'                   =>              auth()->user()->id,
                    'computer_user_id'          =>              $computer->computerUser->id,
                    'log_data'                  =>              'Updated : ' . $computerUser->name . '\'s branch to: ' . $computerUser->branchCode->branch_name . ' and position to: ' . $computerUser->position->position_name
                ]);
            }

            return response()->json([
                'status'            =>          true,
                'message'           =>          'Updated successfully.',
                'computer'          =>          $computer
            ], 200);
        }
    }

    public function doneCleaning($id)
    {
        $cleaning = Computer::find($id);

        if (!$cleaning) {
            return response()->json([
                'status'                        =>                  false,
                'message'                       =>                  'Computer not found.'
            ], 422);
        }

        $dateCleaning = Carbon::parse($cleaning->date_cleaning);

        if ($dateCleaning->isFuture()) {
            return response()->json([
                'status'                =>                  false,
                'message'               =>                  $cleaning->computerUser->name . '`s computer is already cleaned.'
            ], 422);
        } else {
            $cleaning->update([
                'date_cleaning' => now()->addMonth(3)->format('Y-m-d'),
            ]);

            ComputerLog::create([
                'user_id'                   =>              auth()->user()->id,
                'computer_user_id'          =>              $cleaning->computerUser->id,
                'log_data'                  =>              'Marking ' . $cleaning->computerUser->name . '\'s computer as cleaned'
            ]);

            return response()->json([
                'status'                    =>                  true,
                'message'                   =>                  $cleaning->computerUser->name . '`s computer is completely cleaned.'
            ], 200);
        }
    }
}
