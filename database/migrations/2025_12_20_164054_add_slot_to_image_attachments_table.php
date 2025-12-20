<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('image_attachments', function (Blueprint $table): void {
            $table
                ->string('slot', 100)
                ->nullable()
                ->after('owner_id');
        });

        Schema::table('image_attachments', function (Blueprint $table): void {
            $table->dropUnique('image_attachments_owner_image_unique');

            $table->unique(
                ['owner_type', 'owner_id', 'slot', 'image_id'],
                'image_attachments_owner_slot_image_unique'
            );
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('image_attachments', function (Blueprint $table): void {
            $table->dropUnique('image_attachments_owner_slot_image_unique');

            $table->unique(
                ['owner_type', 'owner_id', 'image_id'],
                'image_attachments_owner_image_unique'
            );
        });

        Schema::table('image_attachments', function (Blueprint $table): void {
            $table->dropColumn('slot');
        });
    }
};
