<?php

namespace App\Notifications;

use App\Models\Post;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class NewCommentNotification extends Notification
{
    use Queueable;

    public $post;
    public $commenter;

    public function __construct(Post $post, User $commenter)
    {
        $this->post = $post;
        $this->commenter = $commenter;
    }

    public function via($notifiable)
    {
        return ['database'];
    }

    public function toArray($notifiable)
    {
        return [
            'type' => 'new_comment',
            'message' => "{$this->commenter->name} a répondu à votre question : \"{$this->post->title}\".",
            'link' => "/forum/{$this->post->id}",
            'user_id' => $this->commenter->id,
            'user_name' => $this->commenter->name,
        ];
    }
}
