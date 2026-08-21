<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->string('phone', 30)->nullable();
            $table->text('order_notes')->nullable();
        });
        Schema::table('payments', function (Blueprint $table) {
            $table->unique('transaction_ref');
        });
    }

    public function down(): void
    {
        Schema::table('payments', fn (Blueprint $table) => $table->dropUnique(['transaction_ref']));
        Schema::table('orders', fn (Blueprint $table) => $table->dropColumn(['phone', 'order_notes']));
    }
};
