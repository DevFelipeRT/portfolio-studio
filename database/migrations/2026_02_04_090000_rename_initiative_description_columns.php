<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('initiatives', function (Blueprint $table): void {
            $table->renameColumn('short_description', 'summary');
            $table->renameColumn('long_description', 'description');
        });
    }

    public function down(): void
    {
        Schema::table('initiatives', function (Blueprint $table): void {
            $table->renameColumn('summary', 'short_description');
            $table->renameColumn('description', 'long_description');
        });
    }
};
