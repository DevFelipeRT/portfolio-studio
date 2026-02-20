<?php

declare(strict_types=1);

namespace App\Modules\Projects\Domain\Exceptions;

use DomainException;

final class ProjectDescriptionTooLongException extends DomainException
{
    public function __construct(
        private readonly int $limit,
        private readonly int $actual,
    ) {
        parent::__construct(sprintf(
            'Project description exceeds the maximum character limit (%d).',
            $limit,
        ));
    }

    public function limit(): int
    {
        return $this->limit;
    }

    public function actual(): int
    {
        return $this->actual;
    }
}

