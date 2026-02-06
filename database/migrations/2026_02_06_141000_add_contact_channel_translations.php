<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('contact_channel_translations', function (Blueprint $table): void {
            $table->id();
            $table->unsignedBigInteger('contact_channel_id');
            $table->string('locale', 20);
            $table->string('label')->nullable();
            $table->timestamps();

            $table->unique(['contact_channel_id', 'locale']);
            $table->index('locale');

            $table
                ->foreign('contact_channel_id')
                ->references('id')
                ->on('contact_channels')
                ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('contact_channel_translations');
    }
};
