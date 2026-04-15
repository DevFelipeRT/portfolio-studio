<?php

declare(strict_types=1);

namespace App\Modules\SystemLocale\Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

final class SystemLocaleFeatureTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_persists_a_supported_system_locale(): void
    {
        $this->actingAsAdmin();

        $response = $this->postJson('/system/locale', [
            'locale' => 'en',
        ]);

        $response
            ->assertOk()
            ->assertJson(['locale' => 'en'])
            ->assertCookie('system_locale', 'en');
    }

    public function test_it_falls_back_to_the_default_system_locale_when_the_locale_is_not_supported(): void
    {
        $this->actingAsAdmin();

        $response = $this->postJson('/system/locale', [
            'locale' => 'es',
        ]);

        $response
            ->assertOk()
            ->assertJson(['locale' => config('app.locale')])
            ->assertCookie('system_locale', (string) config('app.locale'));
    }
}
