<?php

declare(strict_types=1);

namespace App\Modules\Mail\Http\Mappers;

use App\Modules\Mail\Application\UseCases\CreateMessage\CreateMessageInput;
use App\Modules\Mail\Http\Requests\StoreMessageRequest;

final class MessageInputMapper
{
    public static function fromStoreRequest(StoreMessageRequest $request): CreateMessageInput
    {
        $data = $request->validated();

        return new CreateMessageInput(
            name: $data['name'],
            email: $data['email'],
            message: $data['message'],
        );
    }
}
