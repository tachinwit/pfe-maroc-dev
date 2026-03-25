<?php

namespace App\Notifications;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class NewMessageNotification extends Notification
{
    use Queueable;

    public $sender;

    public function __construct(User $sender)
    {
        $this->sender = $sender;
    }

    public function via($notifiable)
    {
        return ['database'];
    }

    public function toArray($notifiable)
    {
        return [
            'type' => 'new_message',
            'message' => "{$this->sender->name} vous a envoyé un nouveau message privé.",
            'link' => "/messages?user_id={$this->sender->id}",
            'user_id' => $this->sender->id,
            'user_name' => $this->sender->name,
        ];
    }
}
