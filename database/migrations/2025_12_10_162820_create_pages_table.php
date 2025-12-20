<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class () extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('pages', function (Blueprint $table): void {
            $table->id();

            $table->string('slug', 191);
            $table->string('internal_name', 191);
            $table->string('title', 255);

            $table->string('meta_title', 255)->nullable();
            $table->text('meta_description')->nullable();

            $table->foreignId('meta_image_id')
                ->nullable()
                ->constrained('images')
                ->nullOnDelete();

            $table->string('layout_key', 191)->nullable();

            $table->string('locale', 10);

            $table->boolean('is_published')->default(false);
            $table->timestamp('published_at')->nullable();

            $table->boolean('is_indexable')->default(true);

            $table->timestamps();

            $table->unique(['slug', 'locale'], 'pages_slug_locale_unique');

            $table->index('internal_name', 'pages_internal_name_index');
            $table->index('locale', 'pages_locale_index');
            $table->index('is_published', 'pages_is_published_index');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pages');
    }
};
