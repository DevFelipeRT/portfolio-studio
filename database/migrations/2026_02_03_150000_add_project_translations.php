<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('project_translations', function (Blueprint $table): void {
            $table->id();
            $table->unsignedBigInteger('project_id');
            $table->string('locale', 20);
            $table->string('name')->nullable();
            $table->string('short_description')->nullable();
            $table->text('long_description')->nullable();
            $table->string('repository_url', 2048)->nullable();
            $table->string('live_url', 2048)->nullable();
            $table->timestamps();

            $table->unique(['project_id', 'locale']);
            $table->index('locale');

            $table
                ->foreign('project_id')
                ->references('id')
                ->on('projects')
                ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('project_translations');
    }
};
