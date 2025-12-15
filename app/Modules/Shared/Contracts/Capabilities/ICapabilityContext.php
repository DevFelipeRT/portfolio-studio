<?php

declare(strict_types=1);

namespace App\Modules\Shared\Contracts\Capabilities;

/**
 * Represents the contextual information used during capability resolution.
 */
interface ICapabilityContext
{
    /**
     * Returns a serializable representation of the context.
     *
     * @return array<string, mixed>
     */
    public function toArray(): array;
}
