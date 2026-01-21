<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class () extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('page_sections', function (Blueprint $table): void {
            $table->string('navigation_label', 191)->nullable()->after('anchor');
        });

        DB::table('page_sections')
            ->whereNull('navigation_label')
            ->whereRaw(
                "JSON_UNQUOTE(JSON_EXTRACT(data, '$.navigation_label')) IS NOT NULL",
            )
            ->whereRaw(
                "JSON_UNQUOTE(JSON_EXTRACT(data, '$.navigation_label')) <> ''",
            )
            ->update([
                'navigation_label' => DB::raw(
                    "JSON_UNQUOTE(JSON_EXTRACT(data, '$.navigation_label'))",
                ),
            ]);

        Schema::table('page_sections', function (Blueprint $table): void {
            $table->unique(
                ['page_id', 'locale', 'anchor'],
                'page_sections_page_id_locale_anchor_unique',
            );

            $table->unique(
                ['page_id', 'locale', 'navigation_label'],
                'page_sections_page_id_locale_navigation_label_unique',
            );
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('page_sections', function (Blueprint $table): void {
            $table->dropUnique('page_sections_page_id_locale_anchor_unique');
            $table->dropUnique('page_sections_page_id_locale_navigation_label_unique');
            $table->dropColumn('navigation_label');
        });
    }
};
