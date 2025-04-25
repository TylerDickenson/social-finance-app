<?php

namespace App\Notifications;

use Illuminate\Auth\Notifications\ResetPassword as LaravelResetPassword;
use Illuminate\Notifications\Messages\MailMessage;

class CustomResetPassword extends LaravelResetPassword
{

    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('FinSocial - Reset Your Password')
            ->greeting('Hello!')
            ->line('To reset your password, please click the button below:')
            ->action('Reset Password', $this->resetUrl($notifiable))
            ->line('This password reset link will expire in '.config('auth.passwords.'.config('auth.defaults.passwords').'.expire').' minutes.')
            ->salutation('Thanks for using FinSocial!');
    }
}