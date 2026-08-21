<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        if (!Schema::hasColumn('carts', 'address_id')) {
            Schema::table('carts', function (Blueprint $table) {
                $table->foreignId('address_id')->nullable()->constrained()->nullOnDelete();
            });
        }

        if (!Schema::hasColumn('carts', 'phone')) {
            Schema::table('carts', function (Blueprint $table) {
                $table->string('phone', 30)->nullable();
            });
        }

        if (!Schema::hasColumn('carts', 'order_notes')) {
            Schema::table('carts', function (Blueprint $table) {
                $table->text('order_notes')->nullable();
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasColumn('carts', 'order_notes')) {
            Schema::table('carts', fn (Blueprint $table) => $table->dropColumn('order_notes'));
        }

        if (Schema::hasColumn('carts', 'phone')) {
            Schema::table('carts', fn (Blueprint $table) => $table->dropColumn('phone'));
        }
    }
};
