<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('courses', function (Blueprint $table) {
            $table->renameColumn('short_description', 'summary');
            $table->renameColumn('long_description', 'description');
            $table->renameColumn('start_date', 'started_at');
            $table->renameColumn('end_date', 'completed_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('courses', function (Blueprint $table) {
            $table->renameColumn('summary', 'short_description');
            $table->renameColumn('description', 'long_description');
            $table->renameColumn('started_at', 'start_date');
            $table->renameColumn('completed_at', 'end_date');
        });
    }
};
