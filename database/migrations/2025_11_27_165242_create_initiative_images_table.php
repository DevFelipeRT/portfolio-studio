<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Create the initiative_images pivot table.
     */
    public function up(): void
    {
        Schema::create('initiative_images', function (Blueprint $table): void {
            $table->id();

            $table
                ->foreignId('initiative_id')
                ->constrained('initiatives')
                ->cascadeOnDelete();

            $table
                ->foreignId('image_id')
                ->constrained('images')
                ->cascadeOnDelete();

            $table->unsignedInteger('position')->default(0);
            $table->boolean('is_cover')->default(false);
            $table->string('caption')->nullable();

            $table->timestamps();

            $table->unique(
                ['initiative_id', 'image_id'],
                'initiative_images_initiative_id_image_id_unique'
            );
        });
    }

    /**
     * Drop the initiative_images table.
     */
    public function down(): void
    {
        Schema::dropIfExists('initiative_images');
    }
};
