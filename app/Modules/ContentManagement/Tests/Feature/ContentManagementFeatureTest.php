<?php

declare(strict_types=1);

namespace App\Modules\ContentManagement\Tests\Feature;

use App\Modules\ContentManagement\Domain\Models\Page;
use App\Modules\ContentManagement\Domain\Models\PageSection;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

final class ContentManagementFeatureTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_creates_a_page(): void
    {
        $this->actingAsAdmin();

        $response = $this->post(route('admin.content.pages.store'), [
            'slug' => 'home',
            'internal_name' => 'landing_home',
            'title' => 'Home',
            'locale' => 'pt_BR',
            'layout_key' => 'landing_full',
            'is_published' => true,
            'is_indexable' => true,
        ]);

        $page = Page::query()->first();

        $response
            ->assertRedirect(route('admin.content.pages.edit', $page))
            ->assertSessionHasNoErrors();

        $this->assertNotNull($page);
        $this->assertSame('home', $page?->slug);
    }

    public function test_it_creates_a_page_section(): void
    {
        $this->actingAsAdmin();
        $page = $this->createPage();

        $response = $this->post(route('admin.content.sections.store'), [
            'page_id' => $page->id,
            'template_key' => 'rich_text',
            'slot' => 'main',
            'position' => 1,
            'data' => [
                'body' => 'Conteudo principal',
            ],
        ]);

        $response
            ->assertRedirect(route('admin.content.pages.edit', $page))
            ->assertSessionHasNoErrors();

        $this->assertDatabaseHas('page_sections', [
            'page_id' => $page->id,
            'template_key' => 'rich_text',
            'slot' => 'main',
        ]);
    }

    public function test_it_returns_validation_errors_for_unknown_template_keys(): void
    {
        $this->actingAsAdmin();
        $page = $this->createPage();

        $response = $this->from(route('admin.content.pages.edit', $page))->post(route('admin.content.sections.store'), [
            'page_id' => $page->id,
            'template_key' => 'unknown_template',
            'slot' => 'main',
        ]);

        $response
            ->assertRedirect(route('admin.content.pages.edit', $page))
            ->assertSessionHasErrors(['template_key']);
    }

    public function test_it_redirects_back_with_errors_when_hero_sections_are_reordered_after_non_hero_sections(): void
    {
        $this->actingAsAdmin();
        $page = $this->createPage();
        $hero = $this->createSection($page, [
            'template_key' => 'hero_primary',
            'slot' => 'hero',
            'position' => 1,
        ]);
        $main = $this->createSection($page, [
            'template_key' => 'rich_text',
            'slot' => 'main',
            'position' => 2,
            'data' => ['body' => 'Corpo'],
        ]);

        $response = $this->from(route('admin.content.pages.edit', $page))->post(route('admin.content.sections.reorder'), [
            'page_id' => $page->id,
            'ordered_ids' => [$main->id, $hero->id],
        ]);

        $response
            ->assertRedirect(route('admin.content.pages.edit', $page))
            ->assertSessionHasErrors(['page_section']);
    }

    private function createPage(array $overrides = []): Page
    {
        return Page::query()->create(array_merge([
            'slug' => 'page-base',
            'internal_name' => 'page_base',
            'title' => 'Pagina Base',
            'locale' => 'pt_BR',
            'layout_key' => 'landing_full',
            'is_published' => false,
            'is_indexable' => true,
        ], $overrides));
    }

    private function createSection(Page $page, array $overrides = []): PageSection
    {
        return PageSection::query()->create(array_merge([
            'page_id' => $page->id,
            'template_key' => 'rich_text',
            'slot' => 'main',
            'position' => 1,
            'data' => ['body' => 'Conteudo'],
            'is_active' => true,
            'locale' => null,
        ], $overrides));
    }
}
