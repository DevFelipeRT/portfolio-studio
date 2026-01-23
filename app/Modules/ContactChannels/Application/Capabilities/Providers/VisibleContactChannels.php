<?php

declare(strict_types=1);

namespace App\Modules\ContactChannels\Application\Capabilities\Providers;

use App\Modules\ContactChannels\Application\Capabilities\Dtos\VisibleContactChannelItem;
use App\Modules\ContactChannels\Domain\Repositories\IContactChannelRepository;
use App\Modules\ContactChannels\Domain\Services\ContactChannelHrefBuilder;
use App\Modules\Shared\Contracts\Capabilities\ICapabilitiesFactory;
use App\Modules\Shared\Contracts\Capabilities\ICapabilityContext;
use App\Modules\Shared\Contracts\Capabilities\ICapabilityDefinition;
use App\Modules\Shared\Contracts\Capabilities\ICapabilityProvider;

/**
 * Capability provider that exposes active contact channels.
 */
final class VisibleContactChannels implements ICapabilityProvider
{
    private ?ICapabilityDefinition $definition = null;

    public function __construct(
        private readonly IContactChannelRepository $repository,
        private readonly ContactChannelHrefBuilder $hrefBuilder,
        private readonly ICapabilitiesFactory $capabilitiesFactory,
    ) {
    }

    public function getDefinition(): ICapabilityDefinition
    {
        if ($this->definition !== null) {
            return $this->definition;
        }

        $this->definition = $this->capabilitiesFactory->createPublicDefinition(
            'contact-channels.visible.v1',
            'Returns active contact channels ordered by sort order.',
            [
                'limit' => [
                    'required' => false,
                    'type' => 'int',
                    'default' => null,
                ],
            ],
            'array<VisibleContactChannelItem>',
        );

        return $this->definition;
    }

    /**
     * @param array<string, mixed> $parameters
     */
    public function execute(array $parameters, ?ICapabilityContext $context = null): array
    {
        $limit = $this->extractLimit($parameters);

        $channels = $this->repository->activeOrdered();

        if ($limit !== null) {
            $channels = $channels->take($limit);
        }

        return $channels
            ->map(
                fn($channel) => VisibleContactChannelItem::fromModel($channel, $this->hrefBuilder)->toArray(),
            )
            ->values()
            ->all();
    }

    /**
     * @param array<string, mixed> $parameters
     */
    private function extractLimit(array $parameters): ?int
    {
        if (!array_key_exists('limit', $parameters)) {
            return null;
        }

        $rawLimit = $parameters['limit'];

        if ($rawLimit === null) {
            return null;
        }

        if (is_int($rawLimit)) {
            return $rawLimit > 0 ? $rawLimit : null;
        }

        if (is_numeric($rawLimit)) {
            $value = (int) $rawLimit;

            return $value > 0 ? $value : null;
        }

        return null;
    }
}
