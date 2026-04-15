<?php

declare(strict_types=1);

namespace App\Modules\Initiatives\Tests\Feature;

use App\Modules\Initiatives\Domain\Models\Initiative;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

final class InitiativeFeatureTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_lists_initiatives_for_verified_admins(): void
    {
        $this->actingAsAdmin();

        $response = $this->get(route('initiatives.index'));

        $response->assertOk();
    }

    public function test_it_creates_an_initiative(): void
    {
        $this->actingAsAdmin();

        $response = $this->post(route('initiatives.store'), [
            'locale' => 'en',
            'name' => 'Open Source Sprint',
            'summary' => 'Mutirao colaborativo.',
            'description' => 'Descricao da iniciativa.',
            'display' => true,
            'start_date' => '2026-01-01',
            'end_date' => '2026-01-05',
        ]);

        $response
            ->assertRedirect(route('initiatives.index'))
            ->assertSessionHasNoErrors();

        $this->assertDatabaseHas('initiatives', [
            'name' => 'Open Source Sprint',
            'locale' => 'en',
        ]);
    }

    public function test_it_creates_an_initiative_translation(): void
    {
        $this->actingAsAdmin();
        $initiative = $this->createInitiative();

        $response = $this->postJson(route('initiatives.translations.store', $initiative), [
            'locale' => 'en',
            'name' => 'Open Source Sprint',
            'summary' => 'Collaborative sprint.',
        ]);

        $response
            ->assertCreated()
            ->assertJsonPath('data.locale', 'en')
            ->assertJsonPath('data.name', 'Open Source Sprint');

        $this->assertDatabaseHas('initiative_translations', [
            'initiative_id' => $initiative->id,
            'locale' => 'en',
            'name' => 'Open Source Sprint',
        ]);
    }

    public function test_it_returns_not_found_when_deleting_a_missing_initiative_translation(): void
    {
        $this->actingAsAdmin();
        $initiative = $this->createInitiative();

        $response = $this->deleteJson(route('initiatives.translations.destroy', [$initiative, 'en']));

        $response->assertNotFound();
    }

    private function createInitiative(array $overrides = []): Initiative
    {
        return Initiative::query()->create(array_merge([
            'locale' => 'pt_BR',
            'name' => 'Iniciativa Base',
            'summary' => 'Resumo base',
            'description' => 'Descricao base',
            'display' => true,
            'start_date' => '2026-02-01',
            'end_date' => '2026-02-10',
        ], $overrides));
    }
}
