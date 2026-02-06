<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        $defaultLocale = config('app.locale', 'en');

        Schema::table('skills', function (Blueprint $table) use ($defaultLocale): void {
            $table->string('locale', 20)->default($defaultLocale)->after('id');
            $table->index('locale');
        });

        Schema::table('skill_categories', function (Blueprint $table) use ($defaultLocale): void {
            $table->string('locale', 20)->default($defaultLocale)->after('id');
            $table->index('locale');
        });

        DB::table('skills')->whereNull('locale')->update(['locale' => $defaultLocale]);
        DB::table('skill_categories')->whereNull('locale')->update(['locale' => $defaultLocale]);
    }

    public function down(): void
    {
        Schema::table('skill_categories', function (Blueprint $table): void {
            $table->dropIndex(['locale']);
            $table->dropColumn('locale');
        });

        Schema::table('skills', function (Blueprint $table): void {
            $table->dropIndex(['locale']);
            $table->dropColumn('locale');
        });
    }
};
