<?php

declare(strict_types=1);

namespace App\Modules\Experiences\Tests\Feature;

use App\Modules\Experiences\Domain\Models\Experience;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

final class ExperienceFeatureTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_creates_an_experience(): void
    {
        $this->actingAsAdmin();

        $response = $this->post(route('experiences.store'), [
            'locale' => 'en',
            'position' => 'Senior Engineer',
            'company' => 'OpenAI',
            'summary' => 'Resumo da experiencia',
            'description' => 'Descricao da experiencia',
            'start_date' => '2024-01-01',
            'end_date' => '2025-01-01',
            'display' => true,
        ]);

        $response
            ->assertRedirect(route('experiences.index'))
            ->assertSessionHasNoErrors();

        $this->assertDatabaseHas('experiences', [
            'position' => 'Senior Engineer',
            'company' => 'OpenAI',
            'locale' => 'en',
        ]);
    }

    public function test_it_validates_experience_dates(): void
    {
        $this->actingAsAdmin();

        $response = $this->from(route('experiences.create'))->post(route('experiences.store'), [
            'locale' => 'en',
            'position' => 'Senior Engineer',
            'company' => 'OpenAI',
            'summary' => 'Resumo da experiencia',
            'description' => 'Descricao da experiencia',
            'start_date' => '2025-01-01',
            'end_date' => '2024-01-01',
            'display' => true,
        ]);

        $response
            ->assertRedirect(route('experiences.create'))
            ->assertSessionHasErrors(['end_date']);
    }

    public function test_it_creates_an_experience_translation(): void
    {
        $this->actingAsAdmin();
        $experience = $this->createExperience();

        $response = $this->postJson(route('experiences.translations.store', $experience), [
            'locale' => 'en',
            'position' => 'Senior Engineer',
            'company' => 'OpenAI',
        ]);

        $response
            ->assertCreated()
            ->assertJsonPath('data.locale', 'en')
            ->assertJsonPath('data.position', 'Senior Engineer');

        $this->assertDatabaseHas('experience_translations', [
            'experience_id' => $experience->id,
            'locale' => 'en',
            'position' => 'Senior Engineer',
        ]);
    }

    public function test_it_returns_not_found_when_deleting_a_missing_experience_translation(): void
    {
        $this->actingAsAdmin();
        $experience = $this->createExperience();

        $response = $this->deleteJson(route('experiences.translations.destroy', [$experience, 'en']));

        $response->assertNotFound();
    }

    private function createExperience(array $overrides = []): Experience
    {
        return Experience::query()->create(array_merge([
            'locale' => 'pt_BR',
            'position' => 'Cargo Base',
            'company' => 'Empresa Base',
            'summary' => 'Resumo base',
            'description' => 'Descricao base',
            'start_date' => '2024-01-01',
            'end_date' => '2025-01-01',
            'display' => true,
        ], $overrides));
    }
}
