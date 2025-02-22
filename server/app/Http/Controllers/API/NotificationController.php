<?php

namespace App\Http\Controllers\API;


use App\Http\Controllers\Controller;
use App\Models\Notification;
use App\Models\User;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {

        $user = auth()->user();

        $unreadNotifications = Notification::whereDoesntHave('users', function ($query) use ($user) {
            $query->where('user_id', $user->id);
        })
            ->orderBy('created_at', 'desc')
            ->with('user')
            ->get();

        $notificationCount = $unreadNotifications->count();

        if ($unreadNotifications->isEmpty()) {
            return response()->json([
                'status'                    =>                  true,
                'message'                   =>                  'No unread notifications found for this user.',
                'empty'                     =>                  true
            ], 200);
        }

        return response()->json([
            'status'                =>              true,
            'message'               =>              'Successfully fetched unread notifications.',
            'unread'                =>              $unreadNotifications,
            'notificationCount'     =>              $notificationCount,
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
    public function show(Notification $notification)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Notification $notification)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Notification $notification)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Notification $notification)
    {
        //
    }

    public function read(Request $request, $notifId)
    {

        $user = auth()->user();

        $notification = Notification::findOrFail($notifId);

        $notification->users()->attach($user->id, ['read_at' => now()]);

        $notification->save();

        return response()->json([
            'status'            =>          true,
            'message'           =>          'Notification successfully marked as read.'
        ], 200);
    }
    public function markedAllAsRead()
    {
        $user = auth()->user();

        $notifications = Notification::whereDoesntHave('users', function ($query) use ($user) {
            $query->where('user_id', $user->id);
        })->orderBy('id', 'desc')->get();

        foreach ($notifications as $notification) {
            $notification->users()->attach($user->id, ['read_at' => now()]);
        }

        $notification->save();

        return response()->json([
            'status'            =>          true,
            'message'           =>          'Notification successfully marked all as read.'
        ], 200);
    }
}
