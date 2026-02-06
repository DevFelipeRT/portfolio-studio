<?php

declare(strict_types=1);

namespace App\Modules\ContactChannels\Application\UseCases\ListActiveContactChannels;

use App\Modules\ContactChannels\Application\Dtos\ContactChannelDto;
use App\Modules\ContactChannels\Application\Services\ContactChannelTranslationResolver;
use App\Modules\ContactChannels\Domain\Repositories\IContactChannelRepository;
use App\Modules\ContactChannels\Domain\Services\ContactChannelHrefBuilder;

final class ListActiveContactChannels
{
    public function __construct(
        private readonly IContactChannelRepository $repository,
        private readonly ContactChannelHrefBuilder $hrefBuilder,
        private readonly ContactChannelTranslationResolver $translationResolver,
    ) {
    }

    /**
     * @return array<int,ContactChannelDto>
     */
    public function handle(?string $locale = null, ?string $fallbackLocale = null): array
    {
        $fallbackLocale ??= app()->getFallbackLocale();
        $channels = $locale === null
            ? $this->repository->activeOrdered()
            : $this->repository->activeOrderedWithTranslations($locale, $fallbackLocale);

        return $channels
            ->map(function ($channel) use ($locale, $fallbackLocale): ContactChannelDto {
                $label = $locale !== null
                    ? $this->translationResolver->resolveLabel($channel, $locale, $fallbackLocale)
                    : null;

                return ContactChannelDto::fromModel($channel, $this->hrefBuilder, $label);
            })
            ->all();
    }
}
