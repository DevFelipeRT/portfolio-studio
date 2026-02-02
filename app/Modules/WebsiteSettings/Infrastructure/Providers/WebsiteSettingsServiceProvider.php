<?php

declare(strict_types=1);

namespace App\Modules\WebsiteSettings\Infrastructure\Providers;

use App\Modules\Shared\Support\Capabilities\Traits\RegisterCapabilitiesTrait;
use App\Modules\WebsiteSettings\Application\Capabilities\Providers\SupportedLocales;
use App\Modules\WebsiteSettings\Domain\Repositories\IWebsiteSettingsRepository;
use App\Modules\WebsiteSettings\Infrastructure\Repositories\WebsiteSettingsRepository;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;

final class WebsiteSettingsServiceProvider extends ServiceProvider
{
    use RegisterCapabilitiesTrait;

    public function register(): void
    {
        $this->registerConfig();
        $this->app->bind(IWebsiteSettingsRepository::class, WebsiteSettingsRepository::class);
        $this->registerCapabilitiesIfAvailable([
            SupportedLocales::class,
        ]);
    }

    public function boot(): void
    {
        $this->registerRoutes();
    }

    private function registerConfig(): void
    {
        $configPath = __DIR__ . '/../../Config/website_settings.php';

        if (file_exists($configPath)) {
            $this->mergeConfigFrom($configPath, 'website_settings');
        }
    }

    private function registerRoutes(): void
    {
        Route::middleware(['web', 'auth', 'verified'])
            ->group(function (): void {
                $this->loadRoutesFrom(__DIR__ . '/../../Routes/admin.php');
            });

        Route::middleware('web')
            ->group(function (): void {
                $this->loadRoutesFrom(__DIR__ . '/../../Routes/public.php');
            });
    }
}
