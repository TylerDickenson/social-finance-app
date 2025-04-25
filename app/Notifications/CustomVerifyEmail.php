<?php

namespace App\Notifications;

use Illuminate\Auth\Notifications\VerifyEmail as LaravelVerifyEmail;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Support\Facades\Lang;

class CustomVerifyEmail extends LaravelVerifyEmail
{
    public function toMail($notifiable)
    {
        $verificationUrl = $this->verificationUrl($notifiable);

        return (new MailMessage)
            ->subject('FinSocial - Please Verify Your Email Address')
            ->greeting('Hello!')
            ->line('Welcome to FinSocial! Please click on the button below to verify your email address.')
            ->action('Verify Email Address', $verificationUrl)
            ->salutation('Thanks for using FinSocial!');
    }
}