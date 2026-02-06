<?php

declare(strict_types=1);

namespace App\Modules\Experiences\Application\Capabilities\Providers;

use App\Modules\Experiences\Application\Capabilities\Dtos\VisibleExperienceItem;
use App\Modules\Experiences\Application\Services\ExperienceTranslationResolver;
use App\Modules\Experiences\Application\UseCases\ListVisibleExperiences\ListVisibleExperiences;
use App\Modules\Experiences\Domain\Models\Experience;
use App\Modules\Shared\Contracts\Capabilities\ICapabilitiesFactory;
use App\Modules\Shared\Contracts\Capabilities\ICapabilityContext;
use App\Modules\Shared\Contracts\Capabilities\ICapabilityDefinition;
use App\Modules\Shared\Contracts\Capabilities\ICapabilityProvider;
use Illuminate\Support\Collection;

/**
 * Capability provider that exposes public visible experiences.
 */
final class VisibleExperiences implements ICapabilityProvider
{
    private ?ICapabilityDefinition $definition = null;

    public function __construct(
        private readonly ListVisibleExperiences $listVisibleExperiences,
        private readonly ExperienceTranslationResolver $translationResolver,
        private readonly ICapabilitiesFactory $capabilitiesFactory,
    ) {
    }

    public function getDefinition(): ICapabilityDefinition
    {
        if ($this->definition === null) {
            $this->definition = $this->createDefinition();
        }

        return $this->definition;
    }

    /**
     * Executes the capability and returns the resolved payload.
     *
     * @param array<string, mixed> $parameters
     */
    public function execute(array $parameters, ?ICapabilityContext $context = null): mixed
    {
        $limit = $parameters['limit'] ?? null;
        $locale = $this->resolveLocale($parameters);
        $fallbackLocale = app()->getFallbackLocale();

        /** @var Collection<int, Experience> $experiences */
        $experiences = $this->listVisibleExperiences->handle($locale, $fallbackLocale);

        if (\is_int($limit) && $limit > 0) {
            $experiences = $experiences->take($limit);
        }

        return $experiences
            ->map(
                function (Experience $experience) use ($locale, $fallbackLocale): array {
                    $position = $this->translationResolver->resolvePosition(
                        $experience,
                        $locale,
                        $fallbackLocale,
                    );
                    $company = $this->translationResolver->resolveCompany(
                        $experience,
                        $locale,
                        $fallbackLocale,
                    );
                    $summary = $this->translationResolver->resolveSummary(
                        $experience,
                        $locale,
                        $fallbackLocale,
                    );
                    $description = $this->translationResolver->resolveDescription(
                        $experience,
                        $locale,
                        $fallbackLocale,
                    );

                    return VisibleExperienceItem::fromModelWithTranslations(
                        $experience,
                        $position,
                        $company,
                        $summary,
                        $description,
                    )->toArray();
                }
            )
            ->values()
            ->all();
    }

    private function createDefinition(): ICapabilityDefinition
    {
        return $this->capabilitiesFactory->createPublicDefinition(
            'experiences.visible.v1',
            'Returns public visible experiences ordered by most recent start date.',
            [
                'locale' => [
                    'required' => false,
                    'type' => 'string',
                    'default' => null,
                ],
                'limit' => [
                    'required' => false,
                    'type' => 'int',
                    'default' => null,
                ],
            ],
            'array<VisibleExperienceItem>',
        );
    }

    /**
     * @param array<string, mixed> $parameters
     */
    private function resolveLocale(array $parameters): string
    {
        $locale = $parameters['locale'] ?? null;

        if (\is_string($locale)) {
            $trimmed = trim($locale);
            if ($trimmed !== '') {
                return $trimmed;
            }
        }

        return app()->getLocale();
    }
}
