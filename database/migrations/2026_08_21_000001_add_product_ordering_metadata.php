<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->text('ingredients')->nullable();
            $table->text('allergens')->nullable();
            $table->string('dietary_labels')->nullable();
            $table->string('portion')->nullable();
            $table->json('customization_options')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn(['ingredients', 'allergens', 'dietary_labels', 'portion', 'customization_options']);
        });
    }
};
