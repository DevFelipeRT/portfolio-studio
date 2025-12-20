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
        Schema::table('project_images', function (Blueprint $table): void {
            $table
                ->foreignId('image_id')
                ->nullable()
                ->after('project_id')
                ->constrained('images')
                ->cascadeOnDelete();

            $table->unsignedInteger('position')->default(0)->after('image_id');
            $table->boolean('is_cover')->default(false)->after('position');
            $table->string('caption')->nullable()->after('is_cover');
        });

        DB::table('project_images')
            ->orderBy('id')
            ->chunkById(100, function ($rows): void {
                foreach ($rows as $row) {
                    if ($row->src === null || $row->src === '') {
                        continue;
                    }

                    $imageId = DB::table('images')->insertGetId([
                        'storage_disk' => config('filesystems.default'),
                        'storage_path' => $row->src,
                        'original_filename' => basename((string) $row->src),
                        'mime_type' => null,
                        'file_size_bytes' => null,
                        'image_width' => null,
                        'image_height' => null,
                        'alt_text' => $row->alt,
                        'image_title' => null,
                        'caption' => $row->alt,
                        'created_at' => $row->created_at,
                        'updated_at' => $row->updated_at,
                    ]);

                    DB::table('project_images')
                        ->where('id', $row->id)
                        ->update([
                                'image_id' => $imageId,
                                'caption' => $row->alt,
                            ]);
                }
            });

        Schema::table('project_images', function (Blueprint $table): void {
            $table->dropColumn(['src', 'alt']);
            $table->unique(['project_id', 'image_id'], 'project_images_project_id_image_id_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('project_images', function (Blueprint $table): void {
            $table->string('src')->nullable()->after('project_id');
            $table->string('alt')->nullable()->after('src');

            $table->dropUnique('project_images_project_id_image_id_unique');

            $table->dropConstrainedForeignId('image_id');
            $table->dropColumn(['position', 'is_cover', 'caption']);
        });
    }
};
