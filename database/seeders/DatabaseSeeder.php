<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Use updateOrCreate to ensure the admin exists and has the right password/role
        User::updateOrCreate(
            ['email' => 'yaredmengiste01@gmail.com'], // Find by this
            [
                'name' => 'Yared Mengiste',
                'password' => bcrypt('0922415744'),
                'role' => 'admin',
                'email_verified_at' => now(), // Good for production to avoid verification locks
            ]
        );

        // Uncomment these when you're ready to seed products/settings
//         $this->call(ProductSeeder::class);
         $this->call( SettingSeeder::class);
    }
}
