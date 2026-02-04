<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('initiative_translations', function (Blueprint $table): void {
            $table->id();
            $table->unsignedBigInteger('initiative_id');
            $table->string('locale', 20);
            $table->string('name')->nullable();
            $table->string('summary')->nullable();
            $table->text('description')->nullable();
            $table->timestamps();

            $table->unique(['initiative_id', 'locale']);
            $table->index('locale');

            $table
                ->foreign('initiative_id')
                ->references('id')
                ->on('initiatives')
                ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('initiative_translations');
    }
};
