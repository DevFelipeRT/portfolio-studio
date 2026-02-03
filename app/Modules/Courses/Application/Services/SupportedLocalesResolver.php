<?php

declare(strict_types=1);

namespace App\Modules\Courses\Application\Services;

use App\Modules\Shared\Contracts\Capabilities\ICapabilitiesFactory;
use App\Modules\Shared\Contracts\Capabilities\ICapabilityDataResolver;

final class SupportedLocalesResolver
{
    private const CAPABILITY_KEY = 'website.locales.supported.v1';

    public function __construct(
        private readonly ICapabilitiesFactory $capabilitiesFactory,
        private readonly ICapabilityDataResolver $resolver,
    ) {
    }

    /**
     * @return array<int,string>
     */
    public function resolve(): array
    {
        try {
            $key = $this->capabilitiesFactory->createKey(self::CAPABILITY_KEY);
            $result = $this->resolver->resolve($key);
        } catch (\Throwable) {
            return [app()->getLocale()];
        }

        if (!is_array($result)) {
            return [app()->getLocale()];
        }

        $values = array_values(array_filter(array_map('trim', $result)));

        return $values !== [] ? $values : [app()->getLocale()];
    }
}
