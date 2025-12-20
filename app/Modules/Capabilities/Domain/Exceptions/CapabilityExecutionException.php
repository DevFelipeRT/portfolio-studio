<?php

declare(strict_types=1);

namespace App\Modules\Capabilities\Domain\Exceptions;

use Exception;
use Throwable;

/**
 * Exception thrown when an error occurs while executing the provider of a capability.
 */
class CapabilityExecutionException extends Exception
{
    /**
     * @param string $message
     * @param Throwable|null $previous
     */
    public function __construct(string $message, ?Throwable $previous = null)
    {
        parent::__construct($message, 0, $previous);
    }
}
