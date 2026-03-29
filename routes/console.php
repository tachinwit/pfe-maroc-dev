<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Mail;
use App\Mail\OtpMail;
use App\Models\User;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Artisan::command('send-mail', function () {
    // Créer ou récupérer un utilisateur de test
    $user = User::firstOrCreate(
        ['email' => 'islamoulhassane@gmail.com'],
        [
            'name' => 'Islam Oulhassane',
            'password' => bcrypt('password'),
            'google_id' => 'test123',
        ]
    );

    // Générer un code OTP de test
    $otpCode = '123456';

    try {
        Mail::to($user->email)->send(new OtpMail($user, $otpCode));
        $this->info('✅ Email OTP envoyé avec succès à ' . $user->email);
        $this->info('📧 Vérifiez votre boîte Mailtrap pour voir la belle template !');
    } catch (\Exception $e) {
        $this->error('❌ Échec de l\'envoi : ' . $e->getMessage());
    }
})->purpose('Send test OTP email with beautiful template');
