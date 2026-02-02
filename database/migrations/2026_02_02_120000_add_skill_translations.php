<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('skill_category_translations', function (Blueprint $table): void {
            $table->id();
            $table->unsignedBigInteger('skill_category_id');
            $table->string('locale', 20);
            $table->string('name');
            $table->timestamps();

            $table->unique(['skill_category_id', 'locale']);
            $table->index('locale');

            $table
                ->foreign('skill_category_id')
                ->references('id')
                ->on('skill_categories')
                ->onDelete('cascade');
        });

        Schema::create('skill_translations', function (Blueprint $table): void {
            $table->id();
            $table->unsignedBigInteger('skill_id');
            $table->string('locale', 20);
            $table->string('name');
            $table->timestamps();

            $table->unique(['skill_id', 'locale']);
            $table->index('locale');

            $table
                ->foreign('skill_id')
                ->references('id')
                ->on('skills')
                ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('skill_translations');
        Schema::dropIfExists('skill_category_translations');
    }
};
