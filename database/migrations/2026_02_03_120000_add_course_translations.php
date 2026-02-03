<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('course_translations', function (Blueprint $table): void {
            $table->id();
            $table->unsignedBigInteger('course_id');
            $table->string('locale', 20);
            $table->string('name')->nullable();
            $table->string('institution')->nullable();
            $table->string('summary')->nullable();
            $table->text('description')->nullable();
            $table->timestamps();

            $table->unique(['course_id', 'locale']);
            $table->index('locale');

            $table
                ->foreign('course_id')
                ->references('id')
                ->on('courses')
                ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('course_translations');
    }
};
