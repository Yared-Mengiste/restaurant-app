<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (!Schema::hasColumn('carts', 'address_id')) {
            Schema::table('carts', fn (Blueprint $table) => $table->foreignId('address_id')->nullable()->constrained()->nullOnDelete());
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // The column may be managed by a newer checkout migration.
    }
};
