<?php

declare(strict_types=1);

namespace App\Modules\ContentManagement\Presentation\Builders;

use App\Modules\ContentManagement\Application\Mappers\TemplateDefinitionMapper;
use App\Modules\ContentManagement\Application\Services\Templates\TemplateTranslationService;
use App\Modules\ContentManagement\Domain\Templates\TemplateDefinition;
use App\Modules\ContentManagement\Domain\Templates\TemplateRegistry;
use App\Modules\Shared\Support\Data\DataTransformer;
use Illuminate\Support\Facades\App;

/**
 * Builds template-definition metadata for the administrative editor.
 */
final class AdminTemplateDefinitionsBuilder
{
    public function __construct(
        private readonly TemplateRegistry $templateRegistry,
        private readonly TemplateTranslationService $templateTranslations,
    ) {
    }

    /**
     * @return array<int,array<string,mixed>>
     */
    public function build(): array
    {
        /** @var array<int,TemplateDefinition> $definitions */
        $definitions = $this->templateRegistry->all();

        $templates = [];
        $locale = App::getLocale();

        foreach ($definitions as $definition) {
            $templates[] = TemplateDefinitionMapper::toDto(
                $definition,
                $this->templateTranslations,
                $locale,
            );
        }

        return DataTransformer::transform($templates)
            ->toArray()
            ->toSnakeCase()
            ->result();
    }
}
