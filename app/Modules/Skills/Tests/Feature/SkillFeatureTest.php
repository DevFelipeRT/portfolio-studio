<?php

declare(strict_types=1);

namespace App\Modules\Skills\Tests\Feature;

use App\Modules\Skills\Domain\Models\Skill;
use App\Modules\Skills\Domain\Models\SkillCategory;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

final class SkillFeatureTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_creates_a_skill_category(): void
    {
        $this->actingAsAdmin();

        $response = $this->post(route('skill-categories.store'), [
            'locale' => 'en',
            'name' => 'Backend',
            'slug' => 'backend',
        ]);

        $response
            ->assertRedirect(route('skill-categories.index'))
            ->assertSessionHasNoErrors();

        $this->assertDatabaseHas('skill_categories', [
            'name' => 'Backend',
            'slug' => 'backend',
            'locale' => 'en',
        ]);
    }

    public function test_it_creates_a_skill(): void
    {
        $this->actingAsAdmin();
        $category = $this->createCategory();

        $response = $this->post(route('skills.store'), [
            'locale' => 'en',
            'name' => 'Laravel',
            'skill_category_id' => $category->id,
        ]);

        $response
            ->assertRedirect(route('skills.index'))
            ->assertSessionHasNoErrors();

        $this->assertDatabaseHas('skills', [
            'name' => 'Laravel',
            'locale' => 'en',
            'skill_category_id' => $category->id,
        ]);
    }

    public function test_it_validates_duplicate_skill_names(): void
    {
        $this->actingAsAdmin();
        $this->createSkill(['name' => 'Laravel']);

        $response = $this->from(route('skills.create'))->post(route('skills.store'), [
            'locale' => 'en',
            'name' => 'Laravel',
        ]);

        $response
            ->assertRedirect(route('skills.create'))
            ->assertSessionHasErrors(['name']);
    }

    public function test_it_creates_a_skill_translation(): void
    {
        $this->actingAsAdmin();
        $skill = $this->createSkill();

        $response = $this->postJson(route('skills.translations.store', $skill), [
            'locale' => 'en',
            'name' => 'Laravel',
        ]);

        $response
            ->assertCreated()
            ->assertJsonPath('data.locale', 'en')
            ->assertJsonPath('data.name', 'Laravel');

        $this->assertDatabaseHas('skill_translations', [
            'skill_id' => $skill->id,
            'locale' => 'en',
            'name' => 'Laravel',
        ]);
    }

    public function test_it_returns_not_found_when_deleting_a_missing_skill_translation(): void
    {
        $this->actingAsAdmin();
        $skill = $this->createSkill();

        $response = $this->deleteJson(route('skills.translations.destroy', [$skill, 'en']));

        $response->assertNotFound();
    }

    public function test_it_creates_a_skill_category_translation(): void
    {
        $this->actingAsAdmin();
        $category = $this->createCategory();

        $response = $this->postJson(route('skill-categories.translations.store', $category), [
            'locale' => 'en',
            'name' => 'Backend',
        ]);

        $response
            ->assertCreated()
            ->assertJsonPath('data.locale', 'en')
            ->assertJsonPath('data.name', 'Backend');

        $this->assertDatabaseHas('skill_category_translations', [
            'skill_category_id' => $category->id,
            'locale' => 'en',
            'name' => 'Backend',
        ]);
    }

    public function test_it_returns_not_found_when_deleting_a_missing_skill_category_translation(): void
    {
        $this->actingAsAdmin();
        $category = $this->createCategory();

        $response = $this->deleteJson(route('skill-categories.translations.destroy', [$category, 'en']));

        $response->assertNotFound();
    }

    private function createCategory(array $overrides = []): SkillCategory
    {
        return SkillCategory::query()->create(array_merge([
            'name' => 'Categoria Base',
            'slug' => 'categoria-base',
            'locale' => 'pt_BR',
        ], $overrides));
    }

    private function createSkill(array $overrides = []): Skill
    {
        $category = $this->createCategory();

        return Skill::query()->create(array_merge([
            'name' => 'Skill Base',
            'locale' => 'pt_BR',
            'skill_category_id' => $category->id,
        ], $overrides));
    }
}
