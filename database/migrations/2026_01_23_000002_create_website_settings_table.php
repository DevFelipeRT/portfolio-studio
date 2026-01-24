<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('website_settings', function (Blueprint $table): void {
            $table->id();
            $table->json('site_name')->nullable();
            $table->json('site_description')->nullable();
            $table->string('owner_name')->nullable();
            $table->json('supported_locales')->nullable();
            $table->string('default_locale')->nullable();
            $table->string('fallback_locale')->nullable();
            $table->string('canonical_base_url')->nullable();
            $table->string('meta_title_template')->nullable();
            $table->json('default_meta_title')->nullable();
            $table->json('default_meta_description')->nullable();
            $table->foreignId('default_meta_image_id')
                ->nullable()
                ->constrained('images')
                ->nullOnDelete();
            $table->foreignId('default_og_image_id')
                ->nullable()
                ->constrained('images')
                ->nullOnDelete();
            $table->foreignId('default_twitter_image_id')
                ->nullable()
                ->constrained('images')
                ->nullOnDelete();
            $table->json('robots')->nullable();
            $table->json('system_pages')->nullable();
            $table->json('institutional_links')->nullable();
            $table->boolean('public_scope_enabled')->default(true);
            $table->boolean('private_scope_enabled')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('website_settings');
    }
};
