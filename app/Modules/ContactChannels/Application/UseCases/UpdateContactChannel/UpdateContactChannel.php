<?php

declare(strict_types=1);

namespace App\Modules\ContactChannels\Application\UseCases\UpdateContactChannel;

use App\Modules\ContactChannels\Application\Dtos\ContactChannelDto;
use App\Modules\ContactChannels\Application\Services\ContactChannelLocaleSwapService;
use App\Modules\ContactChannels\Application\Services\ContactChannelValueNormalizer;
use App\Modules\ContactChannels\Domain\Models\ContactChannel;
use App\Modules\ContactChannels\Domain\Repositories\IContactChannelRepository;
use App\Modules\ContactChannels\Domain\Repositories\IContactChannelTranslationRepository;
use App\Modules\ContactChannels\Domain\Services\ContactChannelHrefBuilder;
use Illuminate\Support\Facades\DB;

final class UpdateContactChannel
{
    public function __construct(
        private readonly IContactChannelRepository $repository,
        private readonly IContactChannelTranslationRepository $translations,
        private readonly ContactChannelValueNormalizer $normalizer,
        private readonly ContactChannelHrefBuilder $hrefBuilder,
        private readonly ContactChannelLocaleSwapService $localeSwapService,
    ) {
    }

    public function handle(
        ContactChannel $channel,
        UpdateContactChannelInput $input,
    ): ContactChannelDto {
        $normalizedValue = $this->normalizer->normalize(
            $input->channelType,
            $input->value,
        );

        $updated = DB::transaction(function () use ($channel, $input, $normalizedValue): ContactChannel {
            $localeChanged = $input->locale !== $channel->locale;
            $shouldSwap = false;

            if ($localeChanged) {
                $existing = $this->translations->findByChannelAndLocale(
                    $channel,
                    $input->locale,
                );
                $shouldSwap = $existing !== null && $input->confirmSwap;
            }

            if ($shouldSwap) {
                $channel = $this->localeSwapService->swap($channel, $input->locale);
            }

            $attributes = [
                'channel_type' => $input->channelType,
                'value' => $normalizedValue,
                'is_active' => $input->isActive,
                'sort_order' => $input->sortOrder,
            ];

            if (!$shouldSwap) {
                $attributes['label'] = $input->label;
                $attributes['locale'] = $input->locale;
            }

            return $this->repository->update($channel, $attributes);
        });

        return ContactChannelDto::fromModel($updated, $this->hrefBuilder);
    }
}
