<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Add the category column to the technologies table.
     */
    public function up(): void
    {
        Schema::table('technologies', function (Blueprint $table): void {
            $table
                ->string('category', 50)
                ->after('name');
        });
    }

    /**
     * Remove the category column from the technologies table.
     */
    public function down(): void
    {
        Schema::table('technologies', function (Blueprint $table): void {
            $table->dropColumn('category');
        });
    }
};
