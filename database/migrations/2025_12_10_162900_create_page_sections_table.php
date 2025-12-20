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
        Schema::create('page_sections', function (Blueprint $table): void {
            $table->id();

            $table->foreignId('page_id')
                ->constrained('pages')
                ->cascadeOnDelete();

            $table->string('template_key', 191);

            $table->string('slot', 191)->nullable();

            $table->unsignedInteger('position')->nullable();

            $table->string('anchor', 191)->nullable();

            $table->json('data')->nullable();

            $table->boolean('is_active')->default(true);

            $table->timestamp('visible_from')->nullable();
            $table->timestamp('visible_until')->nullable();

            $table->string('locale', 10)->nullable();

            $table->timestamps();

            $table->unique(
                ['page_id', 'position'],
                'page_sections_page_id_position_unique',
            );

            $table->index(
                ['page_id', 'is_active'],
                'page_sections_page_id_is_active_index',
            );

            $table->index(
                ['page_id', 'visible_from', 'visible_until'],
                'page_sections_visibility_window_index',
            );
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('page_sections');
    }
};
