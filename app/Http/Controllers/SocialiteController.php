<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Laravel\Socialite\Facades\Socialite;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class SocialiteController extends Controller
{
    public function googleLogin()
    {
        return Socialite::driver('google')->redirect();
    }

    public function googleAuthentication()
    {
        try {
            $googleUser = Socialite::driver('google')->user();

            // 1. Check by google_id
            $user = User::where('google_id', $googleUser->getId())->first();

            // 2. If not found, check by email
            if (!$user) {
                $user = User::where('email', $googleUser->getEmail())->first();

                if ($user) {
                    // Link google account
                    $user->update([
                        'google_id' => $googleUser->getId(),
                    ]);
                }
            }

            // 3. If still no user → create
            if (!$user) {
                $user = User::create([
                    'name' => $googleUser->getName(),
                    'email' => $googleUser->getEmail(),
                    'google_id' => $googleUser->getId(),
                    'password' => bcrypt(Str::random(16)), // dummy password
                    'role' => 'customer',
                ]);
            }

            // 4. Login user
            Auth::login($user);

            // 5. Redirect
            return redirect()->route('home');

        } catch (\Exception $e) {
            Log::error('Google Auth Error: ' . $e->getMessage());
            return redirect()->route('login')->with('error', 'Google login failed');
        }
    }
}
