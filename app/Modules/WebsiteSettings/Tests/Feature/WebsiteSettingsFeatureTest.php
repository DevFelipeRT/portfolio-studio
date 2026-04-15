<?php

declare(strict_types=1);

namespace App\Modules\WebsiteSettings\Tests\Feature;

use App\Modules\ContentManagement\Domain\Models\Page;
use App\Modules\WebsiteSettings\Domain\Models\WebsiteSettings;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

final class WebsiteSettingsFeatureTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_updates_website_settings(): void
    {
        $this->actingAsAdmin();

        $response = $this->put(route('website-settings.update'), [
            'site_name' => [
                'pt_BR' => 'Portfolio',
                'en' => 'Portfolio',
            ],
            'owner_name' => 'Felipe',
            'default_locale' => 'pt_BR',
            'fallback_locale' => 'en',
            'canonical_base_url' => 'https://example.com',
            'public_scope_enabled' => true,
            'private_scope_enabled' => true,
        ]);

        $response
            ->assertRedirect(route('website-settings.edit'))
            ->assertSessionHasNoErrors();

        $settings = WebsiteSettings::query()->first();

        $this->assertNotNull($settings);
        $this->assertSame('Felipe', $settings?->owner_name);
        $this->assertSame('https://example.com', $settings?->canonical_base_url);
    }

    public function test_it_validates_website_settings_requests(): void
    {
        $this->actingAsAdmin();

        $response = $this->from(route('website-settings.edit'))->put(route('website-settings.update'), [
            'canonical_base_url' => 'invalid-url',
        ]);

        $response
            ->assertRedirect(route('website-settings.edit'))
            ->assertSessionHasErrors(['canonical_base_url']);
    }

    public function test_it_returns_supported_locales_for_the_admin_settings_screen(): void
    {
        $this->actingAsAdmin();

        $response = $this->getJson(route('website-settings.locales'));

        $response
            ->assertOk()
            ->assertJsonStructure(['data']);
    }

    public function test_it_falls_back_when_the_requested_public_locale_is_not_available(): void
    {
        WebsiteSettings::query()->create([
            'site_name' => ['pt_BR' => 'Portfolio', 'en' => 'Portfolio'],
            'default_locale' => 'pt_BR',
            'fallback_locale' => 'en',
        ]);

        Page::query()->create([
            'slug' => 'home-pt',
            'internal_name' => 'home_pt',
            'title' => 'Home PT',
            'locale' => 'pt_BR',
            'layout_key' => 'landing_full',
            'is_published' => true,
            'is_indexable' => true,
        ]);

        Page::query()->create([
            'slug' => 'home-en',
            'internal_name' => 'home_en',
            'title' => 'Home EN',
            'locale' => 'en',
            'layout_key' => 'landing_full',
            'is_published' => true,
            'is_indexable' => true,
        ]);

        $response = $this->postJson('/set-locale', [
            'locale' => 'es',
        ]);

        $response
            ->assertOk()
            ->assertJson(['locale' => 'en'])
            ->assertCookie('public_locale', 'en');
    }
}
