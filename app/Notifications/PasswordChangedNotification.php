<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class PasswordChangedNotification extends Notification implements \Illuminate\Contracts\Queue\ShouldQueue
{
    use Queueable;

    public function __construct()
    {
        //
    }

    public function via($notifiable): array
    {
        return ['mail'];
    }

    public function toMail($notifiable): MailMessage
    {
        return (new MailMessage)
                    ->subject('Votre mot de passe a été modifié - DevMaroc')
                    ->greeting('Bonjour ' . $notifiable->name . ' !')
                    ->line('Nous vous informons que le mot de passe de votre compte DevMaroc a été modifié avec succès.')
                    ->line('Si vous n\'êtes pas à l\'origine de cette modification, nous vous conseillons de réinitialiser votre mot de passe immédiatement.')
                    ->action('Accéder à mon compte', url('/dashboard'))
                    ->line('Merci de faire partie de la communauté DevMaroc !');
    }

    public function toArray($notifiable): array
    {
        return [
            //
        ];
    }
}
