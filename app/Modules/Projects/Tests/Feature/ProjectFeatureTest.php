<?php

declare(strict_types=1);

namespace App\Modules\Projects\Tests\Feature;

use App\Modules\Projects\Domain\Models\Project;
use App\Modules\Projects\Domain\ValueObjects\ProjectStatus;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

final class ProjectFeatureTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_creates_a_project(): void
    {
        $this->actingAsAdmin();

        $response = $this->post(route('projects.store'), [
            'locale' => 'en',
            'name' => 'Portfolio Studio',
            'summary' => 'Studio modular em Laravel.',
            'description' => 'Descricao completa do projeto.',
            'status' => ProjectStatus::scalarValues()[0],
            'repository_url' => 'https://example.com/repo',
            'live_url' => 'https://example.com/live',
            'display' => true,
        ]);

        $response
            ->assertRedirect(route('projects.index'))
            ->assertSessionHasNoErrors();

        $this->assertDatabaseHas('projects', [
            'name' => 'Portfolio Studio',
            'locale' => 'en',
            'display' => true,
        ]);
    }

    public function test_it_validates_project_creation_requests(): void
    {
        $this->actingAsAdmin();

        $response = $this->from(route('projects.create'))->post(route('projects.store'), [
            'locale' => 'xx',
            'name' => '',
            'summary' => '',
            'description' => '',
            'status' => 'invalid',
            'repository_url' => 'not-a-url',
            'live_url' => 'not-a-url',
        ]);

        $response
            ->assertRedirect(route('projects.create'))
            ->assertSessionHasErrors([
                'locale',
                'name',
                'summary',
                'description',
                'status',
                'repository_url',
                'live_url',
            ]);
    }

    public function test_it_creates_a_project_translation(): void
    {
        $this->actingAsAdmin();
        $project = $this->createProject();

        $response = $this->postJson(route('projects.translations.store', $project), [
            'locale' => 'en',
            'name' => 'Portfolio Studio',
            'summary' => 'Modular Laravel studio.',
        ]);

        $response
            ->assertCreated()
            ->assertJsonPath('data.locale', 'en')
            ->assertJsonPath('data.name', 'Portfolio Studio');

        $this->assertDatabaseHas('project_translations', [
            'project_id' => $project->id,
            'locale' => 'en',
            'name' => 'Portfolio Studio',
        ]);
    }

    public function test_it_returns_not_found_when_updating_a_missing_project_translation(): void
    {
        $this->actingAsAdmin();
        $project = $this->createProject();

        $response = $this->putJson(
            route('projects.translations.update', [$project, 'en']),
            ['name' => 'Updated translation'],
        );

        $response->assertNotFound();
    }

    private function createProject(array $overrides = []): Project
    {
        return Project::query()->create(array_merge([
            'locale' => 'pt_BR',
            'name' => 'Projeto Base',
            'summary' => 'Resumo base',
            'description' => 'Descricao base',
            'status' => ProjectStatus::scalarValues()[0],
            'repository_url' => 'https://example.com/base-repo',
            'live_url' => 'https://example.com/base-live',
            'display' => true,
        ], $overrides));
    }
}
