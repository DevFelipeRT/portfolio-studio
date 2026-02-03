<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('experience_translations', function (Blueprint $table): void {
            $table->id();
            $table->unsignedBigInteger('experience_id');
            $table->string('locale', 20);
            $table->string('position')->nullable();
            $table->string('company')->nullable();
            $table->string('summary')->nullable();
            $table->text('description')->nullable();
            $table->timestamps();

            $table->unique(['experience_id', 'locale']);
            $table->index('locale');

            $table
                ->foreign('experience_id')
                ->references('id')
                ->on('experiences')
                ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('experience_translations');
    }
};
