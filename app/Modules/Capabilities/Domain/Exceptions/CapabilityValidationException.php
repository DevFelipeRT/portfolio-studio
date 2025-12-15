<?php

declare(strict_types=1);

namespace App\Modules\Capabilities\Domain\Exceptions;

use Exception;
use InvalidArgumentException;

/**
 * Exception thrown when the parameters provided for a capability are invalid.
 */
class CapabilityValidationException extends InvalidArgumentException
{
    /**
     * @param string $message
     */
    public function __construct(string $message)
    {
        parent::__construct($message);
    }
}
