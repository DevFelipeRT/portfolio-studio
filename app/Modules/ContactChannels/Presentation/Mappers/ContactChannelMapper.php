<?php

declare(strict_types=1);

namespace App\Modules\ContactChannels\Presentation\Mappers;

use App\Modules\ContactChannels\Application\Dtos\ContactChannelDto;

final class ContactChannelMapper
{
    /**
     * @return array<string,mixed>
     */
    public static function map(ContactChannelDto $dto): array
    {
        return $dto->toArray();
    }

    /**
     * @param array<int,ContactChannelDto> $items
     * @return array<int,array<string,mixed>>
     */
    public static function collection(array $items): array
    {
        return array_map(static fn(ContactChannelDto $dto): array => $dto->toArray(), $items);
    }
}
