<?php

declare(strict_types=1);

namespace App\Modules\WebsiteSettings\Application\Capabilities\Providers;

use App\Modules\Shared\Contracts\Capabilities\ICapabilitiesFactory;
use App\Modules\Shared\Contracts\Capabilities\ICapabilityContext;
use App\Modules\Shared\Contracts\Capabilities\ICapabilityDefinition;
use App\Modules\Shared\Contracts\Capabilities\ICapabilityProvider;
use App\Modules\WebsiteSettings\Application\Services\WebsiteSettingsService;

final class SupportedLocales implements ICapabilityProvider
{
    private ?ICapabilityDefinition $definition = null;

    public function __construct(
        private readonly WebsiteSettingsService $websiteSettingsService,
        private readonly ICapabilitiesFactory $capabilitiesFactory,
    ) {
    }

    public function getDefinition(): ICapabilityDefinition
    {
        if ($this->definition !== null) {
            return $this->definition;
        }

        $this->definition = $this->capabilitiesFactory->createPublicDefinition(
            'website.locales.supported.v1',
            'Returns supported locales configured for the website.',
            [],
            'array<string>',
        );

        return $this->definition;
    }

    /**
     * @param array<string, mixed> $parameters
     * @return array<int,string>
     */
    public function execute(
        array $parameters,
        ?ICapabilityContext $context = null,
    ): array {
        return $this->websiteSettingsService->getSupportedLocales();
    }
}
