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
        Schema::table('experiences', function (Blueprint $table) {
            $table->renameColumn('short_description', 'summary');
            $table->renameColumn('long_description', 'description');
        });

        Schema::table('experiences', function (Blueprint $table) {
            $table->string('summary')->nullable()->change();
            $table->longText('description')->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::table('experiences')
            ->whereNull('summary')
            ->update(['summary' => '']);

        Schema::table('experiences', function (Blueprint $table) {
            $table->string('summary')->change();
            $table->text('description')->change();
        });

        Schema::table('experiences', function (Blueprint $table) {
            $table->renameColumn('summary', 'short_description');
            $table->renameColumn('description', 'long_description');
        });
    }
};
