<?php

declare(strict_types=1);

namespace App\Modules\Shared\Contracts\Capabilities;

/**
 * Contract for a capability provider implemented by domain modules.
 */
interface ICapabilityProvider
{
    /**
     * Returns the definition associated with this provider.
     */
    public function getDefinition(): ICapabilityDefinition;

    /**
     * Executes the capability with the given parameters and context.
     *
     * @param array<string, mixed> $parameters
     */
    public function execute(array $parameters, ?ICapabilityContext $context = null): mixed;
}
