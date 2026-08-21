<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        if (!Schema::hasColumn('orders', 'phone')) {
            Schema::table('orders', fn (Blueprint $table) => $table->string('phone', 30)->nullable());
        }

        if (!Schema::hasColumn('orders', 'order_notes')) {
            Schema::table('orders', fn (Blueprint $table) => $table->text('order_notes')->nullable());
        }

        $hasUniqueReference = collect(Schema::getIndexes('payments'))->contains(
            fn (array $index) => $index['unique'] && $index['columns'] === ['transaction_ref']
        );

        if (!$hasUniqueReference) {
            Schema::table('payments', fn (Blueprint $table) => $table->unique('transaction_ref'));
        }
    }

    public function down(): void
    {
        $hasUniqueReference = collect(Schema::getIndexes('payments'))->contains(
            fn (array $index) => $index['name'] === 'payments_transaction_ref_unique'
        );

        if ($hasUniqueReference) {
            Schema::table('payments', fn (Blueprint $table) => $table->dropUnique(['transaction_ref']));
        }

        if (Schema::hasColumn('orders', 'order_notes')) {
            Schema::table('orders', fn (Blueprint $table) => $table->dropColumn('order_notes'));
        }

        if (Schema::hasColumn('orders', 'phone')) {
            Schema::table('orders', fn (Blueprint $table) => $table->dropColumn('phone'));
        }
    }
};
