<?php

declare(strict_types=1);

namespace App\Modules\ContentManagement\Presentation\ViewModels\Admin;

/**
 * View model representing the administrative page edit screen.
 */
final class PageEditViewModel
{
    /**
     * @param array<int,array> $sections
     * @param array<int,array> $availableTemplates
     * @param array<string,mixed> $extraPayload
     */
    public function __construct(
        public readonly array $page,
        public readonly array $sections,
        public readonly array $availableTemplates,
        public readonly array $extraPayload = [],
    ) {
    }
}
