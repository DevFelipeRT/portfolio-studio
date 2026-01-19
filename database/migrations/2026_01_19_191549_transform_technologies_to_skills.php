<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::disableForeignKeyConstraints();

        Schema::create('skill_categories', function (Blueprint $table): void {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->timestamps();
        });

        Schema::table('technologies', function (Blueprint $table): void {
            $table
                ->unsignedBigInteger('skill_category_id')
                ->nullable()
                ->after('category');
        });

        $this->seedSkillCategoriesFromTechnologies();

        Schema::rename('technologies', 'skills');

        Schema::table('skills', function (Blueprint $table): void {
            $table
                ->foreign('skill_category_id')
                ->references('id')
                ->on('skill_categories')
                ->nullOnDelete();
        });

        Schema::create('project_skill', function (Blueprint $table): void {
            $table->unsignedBigInteger('project_id');
            $table->unsignedBigInteger('skill_id');
            $table->timestamps();

            $table->primary(['project_id', 'skill_id']);

            $table
                ->foreign('project_id')
                ->references('id')
                ->on('projects')
                ->onDelete('cascade');

            $table
                ->foreign('skill_id')
                ->references('id')
                ->on('skills')
                ->onDelete('cascade');
        });

        if (Schema::hasTable('project_technology')) {
            DB::table('project_skill')->insertUsing(
                ['project_id', 'skill_id', 'created_at', 'updated_at'],
                DB::table('project_technology')->select(
                    'project_id',
                    'technology_id',
                    'created_at',
                    'updated_at',
                ),
            );
        }

        Schema::dropIfExists('project_technology');

        Schema::table('skills', function (Blueprint $table): void {
            $table->dropColumn('category');
        });

        Schema::enableForeignKeyConstraints();
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::disableForeignKeyConstraints();

        Schema::table('skills', function (Blueprint $table): void {
            $table
                ->string('category', 50)
                ->nullable()
                ->after('name');
        });

        if (Schema::hasTable('skill_categories')) {
            $categoryLookup = DB::table('skill_categories')
                ->pluck('slug', 'id')
                ->all();

            foreach ($categoryLookup as $categoryId => $slug) {
                DB::table('skills')
                    ->where('skill_category_id', $categoryId)
                    ->update(['category' => $slug]);
            }
        }

        Schema::rename('skills', 'technologies');

        Schema::create('project_technology', function (Blueprint $table): void {
            $table->unsignedBigInteger('project_id');
            $table->unsignedBigInteger('technology_id');
            $table->timestamps();

            $table->primary(['project_id', 'technology_id']);

            $table
                ->foreign('project_id')
                ->references('id')
                ->on('projects')
                ->onDelete('cascade');

            $table
                ->foreign('technology_id')
                ->references('id')
                ->on('technologies')
                ->onDelete('cascade');
        });

        if (Schema::hasTable('project_skill')) {
            DB::table('project_technology')->insertUsing(
                ['project_id', 'technology_id', 'created_at', 'updated_at'],
                DB::table('project_skill')->select(
                    'project_id',
                    'skill_id',
                    'created_at',
                    'updated_at',
                ),
            );
        }

        Schema::dropIfExists('project_skill');

        Schema::table('technologies', function (Blueprint $table): void {
            $table->dropColumn('skill_category_id');
        });

        Schema::dropIfExists('skill_categories');

        Schema::enableForeignKeyConstraints();
    }

    private function seedSkillCategoriesFromTechnologies(): void
    {
        if (!Schema::hasTable('technologies')) {
            return;
        }

        $labelMap = [
            'frontend' => 'Front-end',
            'backend' => 'Back-end',
            'devops' => 'DevOps',
            'database' => 'Database',
            'testing' => 'Testing',
            'tooling' => 'Tooling',
        ];

        $categories = DB::table('technologies')
            ->select('category')
            ->distinct()
            ->pluck('category')
            ->filter()
            ->all();

        $categoryMap = [];

        foreach ($categories as $category) {
            if (!\is_string($category) || $category === '') {
                continue;
            }

            $slug = Str::slug($category);
            $name = $labelMap[$category] ?? Str::title(\str_replace('-', ' ', $category));

            DB::table('skill_categories')->insertOrIgnore([
                'name' => $name,
                'slug' => $slug,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            $categoryMap[$category] = $slug;
        }

        if ($categoryMap === []) {
            return;
        }

        $categoryIds = DB::table('skill_categories')
            ->pluck('id', 'slug')
            ->all();

        foreach ($categoryMap as $rawCategory => $slug) {
            $categoryId = $categoryIds[$slug] ?? null;

            if ($categoryId === null) {
                continue;
            }

            DB::table('technologies')
                ->where('category', $rawCategory)
                ->update(['skill_category_id' => $categoryId]);
        }
    }
};
