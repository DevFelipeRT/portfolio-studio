<?php

declare(strict_types=1);

namespace App\Modules\ContactChannels\Http\Controllers\Public;

use App\Modules\ContactChannels\Application\UseCases\ListActiveContactChannels\ListActiveContactChannels;
use App\Modules\ContactChannels\Presentation\Mappers\ContactChannelMapper;
use App\Modules\Shared\Abstractions\Http\Controller;
use Illuminate\Http\JsonResponse;

final class ContactChannelController extends Controller
{
    public function __construct(
        private readonly ListActiveContactChannels $listActiveContactChannels,
    ) {
    }

    public function index(): JsonResponse
    {
        $channels = $this->listActiveContactChannels->handle();

        return response()->json([
            'data' => ContactChannelMapper::collection($channels),
        ]);
    }
}
