<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('courses', function (Blueprint $table): void {
            $table->date('start_date')->nullable()->change();

            $table
                ->string('category', 50)
                ->default('other')
                ->after('end_date');
        });

        DB::statement("ALTER TABLE `courses` MODIFY `category` VARCHAR(50) NOT NULL");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('courses', function (Blueprint $table): void {
            $table->date('start_date')->nullable(false)->change();

            $table->dropColumn('category');
        });
    }
};
