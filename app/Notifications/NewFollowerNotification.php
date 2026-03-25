<?php

namespace App\Notifications;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class NewFollowerNotification extends Notification
{
    use Queueable;

    public $follower;

    public function __construct(User $follower)
    {
        $this->follower = $follower;
    }

    public function via($notifiable)
    {
        return ['database'];
    }

    public function toArray($notifiable)
    {
        return [
            'type' => 'new_follower',
            'message' => "{$this->follower->name} a commencé à vous suivre !",
            'link' => "/user/{$this->follower->id}",
            'user_id' => $this->follower->id,
            'user_name' => $this->follower->name,
        ];
    }
}
