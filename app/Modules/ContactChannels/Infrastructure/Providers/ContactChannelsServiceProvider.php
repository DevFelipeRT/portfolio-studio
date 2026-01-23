<?php

declare(strict_types=1);

namespace App\Modules\ContactChannels\Infrastructure\Providers;

use App\Modules\ContactChannels\Application\Capabilities\Providers\VisibleContactChannels;
use App\Modules\ContactChannels\Domain\Repositories\IContactChannelRepository;
use App\Modules\ContactChannels\Infrastructure\Repositories\ContactChannelRepository;
use App\Modules\Shared\Support\Capabilities\Traits\RegisterCapabilitiesTrait;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;

final class ContactChannelsServiceProvider extends ServiceProvider
{
    use RegisterCapabilitiesTrait;
    /**
     * Register any services.
     */
    public function register(): void
    {
        $this->app->bind(IContactChannelRepository::class, ContactChannelRepository::class);
        $this->registerCapabilitiesIfAvailable([
            VisibleContactChannels::class,
        ]);
    }

    /**
     * Bootstrap any services.
     */
    public function boot(): void
    {
        $this->registerRoutes();
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
