<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('image_attachments', function (Blueprint $table): void {
            $table->id();

            $table
                ->foreignId('image_id')
                ->constrained('images')
                ->cascadeOnDelete();

            $table->string('owner_type');
            $table->unsignedBigInteger('owner_id');

            $table->unsignedInteger('position')->default(0);
            $table->boolean('is_cover')->default(false);
            $table->string('caption')->nullable();

            $table->timestamps();

            $table->index(
                ['owner_type', 'owner_id'],
                'image_attachments_owner_index'
            );

            $table->unique(
                ['owner_type', 'owner_id', 'image_id'],
                'image_attachments_owner_image_unique'
            );
        });

        // Migrate project_images -> image_attachments
        if (Schema::hasTable('project_images')) {
            DB::table('project_images')
                ->orderBy('id')
                ->chunkById(100, static function ($rows): void {
                    foreach ($rows as $row) {
                        if ($row->image_id === null) {
                            continue;
                        }

                        DB::table('image_attachments')->insert([
                            'image_id' => $row->image_id,
                            'owner_type' => 'project',
                            'owner_id' => $row->project_id,
                            'position' => $row->position ?? 0,
                            'is_cover' => (bool) ($row->is_cover ?? false),
                            'caption' => $row->caption,
                            'created_at' => $row->created_at,
                            'updated_at' => $row->updated_at,
                        ]);
                    }
                });

            Schema::dropIfExists('project_images');
        }

        // Migrate initiative_images -> image_attachments
        if (Schema::hasTable('initiative_images')) {
            DB::table('initiative_images')
                ->orderBy('id')
                ->chunkById(100, static function ($rows): void {
                    foreach ($rows as $row) {
                        DB::table('image_attachments')->insert([
                            'image_id' => $row->image_id,
                            'owner_type' => 'initiative',
                            'owner_id' => $row->initiative_id,
                            'position' => $row->position ?? 0,
                            'is_cover' => (bool) ($row->is_cover ?? false),
                            'caption' => $row->caption,
                            'created_at' => $row->created_at,
                            'updated_at' => $row->updated_at,
                        ]);
                    }
                });

            Schema::dropIfExists('initiative_images');
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Recreate project_images with the latest structure
        Schema::create('project_images', function (Blueprint $table): void {
            $table->id();

            $table
                ->foreignId('project_id')
                ->constrained('projects')
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
                ['project_id', 'image_id'],
                'project_images_project_id_image_id_unique'
            );
        });

        // Recreate initiative_images with the latest structure
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

        if (!Schema::hasTable('image_attachments')) {
            return;
        }

        // Restore project_images and initiative_images from image_attachments
        DB::table('image_attachments')
            ->orderBy('id')
            ->chunkById(100, static function ($rows): void {
                foreach ($rows as $row) {
                    if ($row->owner_type === 'App\\Modules\\Projects\\Domain\\Models\\Project') {
                        DB::table('project_images')->insert([
                            'project_id' => $row->owner_id,
                            'image_id' => $row->image_id,
                            'position' => $row->position ?? 0,
                            'is_cover' => (bool) ($row->is_cover ?? false),
                            'caption' => $row->caption,
                            'created_at' => $row->created_at,
                            'updated_at' => $row->updated_at,
                        ]);
                    }

                    if ($row->owner_type === 'App\\Modules\\Initiatives\\Domain\\Models\\Initiative') {
                        DB::table('initiative_images')->insert([
                            'initiative_id' => $row->owner_id,
                            'image_id' => $row->image_id,
                            'position' => $row->position ?? 0,
                            'is_cover' => (bool) ($row->is_cover ?? false),
                            'caption' => $row->caption,
                            'created_at' => $row->created_at,
                            'updated_at' => $row->updated_at,
                        ]);
                    }
                }
            });

        Schema::dropIfExists('image_attachments');
    }
};
