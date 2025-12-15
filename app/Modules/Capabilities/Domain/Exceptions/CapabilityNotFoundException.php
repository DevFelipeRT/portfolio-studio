<?php

declare(strict_types=1);

namespace App\Modules\Capabilities\Domain\Exceptions;

use Exception;
use App\Modules\Shared\Contracts\Capabilities\ICapabilityKey;

/**
 * Exception thrown when a requested capability is not found in the catalog.
 */
class CapabilityNotFoundException extends Exception
{
    /**
     * @param ICapabilityKey $key
     */
    public function __construct(ICapabilityKey $key)
    {
        parent::__construct(
            sprintf('Capability with key "%s" not found in the catalog.', $key->value())
        );
    }
}
