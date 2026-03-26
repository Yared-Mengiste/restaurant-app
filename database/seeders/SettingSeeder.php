<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Setting;

class SettingSeeder extends Seeder
{
    public function run()
    {
        Setting::updateOrCreate(
            ['key' => 'base_delivery_fee'],
            ['value' => '200']
        );
        Setting::updateOrCreate(
            ['key' => 'per_km_price'],
            ['value' => '80']
        );
    }
}
