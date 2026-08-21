<?php

use App\Models\User;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Artisan::command('app:create-admin {--name=} {--email=} {--password=}', function () {
    $name = $this->option('name') ?: $this->ask('Name');
    $email = $this->option('email') ?: $this->ask('Email address');
    $password = $this->option('password') ?: $this->secret('Password');

    $validator = Validator::make(compact('name', 'email', 'password'), [
        'name' => ['required', 'string', 'max:255'],
        'email' => ['required', 'email', 'max:255'],
        'password' => ['required', 'string', 'min:12'],
    ]);

    if ($validator->fails()) {
        foreach ($validator->errors()->all() as $error) {
            $this->error($error);
        }

        return self::FAILURE;
    }

    $admin = User::updateOrCreate(
        ['email' => $email],
        [
            'name' => $name,
            'password' => Hash::make($password),
            'role' => 'admin',
            'email_verified_at' => now(),
        ],
    );

    $this->info("Admin account ready for {$admin->email}.");

    return self::SUCCESS;
})->purpose('Create or update an administrator account');
