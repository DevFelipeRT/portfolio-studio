<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Modules\WebsiteSettings\Domain\Models\WebsiteSettings;
use Database\Seeders\Concerns\PreventsProductionSeeding;
use Illuminate\Database\Seeder;

class WebsiteSettingsSeeder extends Seeder
{
    use PreventsProductionSeeding;

    /**
     * Seed global website settings with deterministic data.
     */
    public function run(): void
    {
        $this->assertNotProduction();

        // Keep this seeder deterministic: remove previous settings first.
        WebsiteSettings::query()->delete();

        $canonicalBaseUrl = 'https://portfolio.studio';
        $supportedLocales = array_values(array_filter(
            (array) config('localization.supported_locales', []),
            static fn($locale): bool => is_string($locale) && trim($locale) !== '',
        ));

        $defaultLocale = in_array('pt_BR', $supportedLocales, true) ? 'pt_BR' : ((string) config('app.locale', 'en'));
        $fallbackLocale = in_array('en', $supportedLocales, true) ? 'en' : ((string) config('app.fallback_locale', $defaultLocale));

        WebsiteSettings::query()->create([
            'site_name' => [
                'pt_BR' => 'Portfolio Studio',
                'en' => 'Portfolio Studio',
            ],
            'site_description' => [
                'pt_BR' => 'Plataforma profissional para apresentar projetos, experiencias e iniciativas com conteudo gerenciavel.',
                'en' => 'Professional platform to showcase projects, experience, and initiatives with manageable content.',
            ],
            'owner_name' => 'Portfolio Studio Team',
            'default_locale' => $defaultLocale,
            'fallback_locale' => $fallbackLocale,
            'canonical_base_url' => $canonicalBaseUrl,
            'meta_title_template' => '{page_title} | {owner} | {site}',
            'default_meta_title' => [
                'pt_BR' => 'Portfolio Studio',
                'en' => 'Portfolio Studio',
            ],
            'default_meta_description' => [
                'pt_BR' => 'Portfolio Studio e uma plataforma modular com CMS, SEO e gerenciamento completo de conteudo de portfolio.',
                'en' => 'Portfolio Studio is a modular platform with CMS, SEO, and full portfolio content management.',
            ],
            'default_meta_image_id' => null,
            'default_og_image_id' => null,
            'default_twitter_image_id' => null,
            'robots' => [
                'public' => [
                    'index' => true,
                    'follow' => true,
                ],
                'private' => [
                    'index' => false,
                    'follow' => false,
                ],
            ],
            'system_pages' => [
                'not_found' => '/404',
                'maintenance' => '/maintenance',
                'policies' => '/policies',
            ],
            'institutional_links' => [
                [
                    'label' => 'Documentation',
                    'url' => $canonicalBaseUrl . '/docs',
                ],
                [
                    'label' => 'Privacy Policy',
                    'url' => $canonicalBaseUrl . '/privacy',
                ],
                [
                    'label' => 'Terms of Service',
                    'url' => $canonicalBaseUrl . '/terms',
                ],
            ],
            'public_scope_enabled' => true,
            'private_scope_enabled' => true,
        ]);
    }
}
