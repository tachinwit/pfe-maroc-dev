<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Message;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MessageController extends Controller
{
    public function index(Request $request)
    {
        $userId = $request->user()->id;
        $activeUserId = $request->query('user_id');

        // Fetch list of users the authenticated user has chatted with
        $messages = Message::where('sender_id', $userId)
            ->orWhere('receiver_id', $userId)
            ->with(['sender', 'receiver'])
            ->latest()
            ->get();

        $contactsMap = [];
        foreach ($messages as $msg) {
            $otherUser = $msg->sender_id === $userId ? $msg->receiver : $msg->sender;
            if ($otherUser && !isset($contactsMap[$otherUser->id])) {
                $contactsMap[$otherUser->id] = [
                    'user' => clone $otherUser,
                    'last_message' => clone $msg,
                ];
            }
        }

        if ($activeUserId && !isset($contactsMap[$activeUserId])) {
            $newContact = User::find($activeUserId);
            if ($newContact) {
                $contactsMap[$activeUserId] = [
                    'user' => clone $newContact,
                    'last_message' => null,
                ];
            }
        }

        $contacts = array_values($contactsMap);

        $activeChat = [];
        if ($activeUserId) {
            $activeChat = Message::where(function($q) use ($userId, $activeUserId) {
                $q->where('sender_id', $userId)->where('receiver_id', $activeUserId);
            })->orWhere(function($q) use ($userId, $activeUserId) {
                $q->where('sender_id', $activeUserId)->where('receiver_id', $userId);
            })->orderBy('created_at', 'asc')->get();
            
            foreach($activeChat as $msg) {
                $msg->time_human = $msg->created_at->format('H:i');
                $msg->date_human = $msg->created_at->format('M d, Y');
            }
        }

        return Inertia::render('MessagesPage', [
            'contacts' => $contacts,
            'activeUserId' => $activeUserId ? (int)$activeUserId : null,
            'activeChat' => $activeChat,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'receiver_id' => 'required|exists:users,id',
            'content' => 'required|string',
        ]);

        $message = Message::create([
            'sender_id' => $request->user()->id,
            'receiver_id' => $request->receiver_id,
            'content' => $request->content,
        ]);

        $receiver = User::findOrFail($request->receiver_id);
        $receiver->notify(new \App\Notifications\NewMessageNotification($request->user()));

        return redirect()->back();
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'content' => 'required|string',
        ]);

        $message = Message::findOrFail($id);

        if ($message->sender_id !== $request->user()->id) {
            abort(403);
        }

        $message->update([
            'content' => $request->content,
        ]);

        return redirect()->back();
    }

    public function destroy($id)
    {
        $message = Message::findOrFail($id);

        if ($message->sender_id !== request()->user()->id) {
            abort(403);
        }

        $message->delete();

        return redirect()->back();
    }

    public function destroyConversation($userId)
    {
        $authUserId = request()->user()->id;

        Message::where(function($q) use ($authUserId, $userId) {
            $q->where('sender_id', $authUserId)->where('receiver_id', $userId);
        })->orWhere(function($q) use ($authUserId, $userId) {
            $q->where('sender_id', $userId)->where('receiver_id', $authUserId);
        })->delete();

        return redirect()->route('messages.index');
    }
}
