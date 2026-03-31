<?php

declare(strict_types=1);

namespace App\Modules\Mail\Presentation\ViewModels\Admin;

use App\Modules\Mail\Application\UseCases\ListMessages\ListMessageItem;

final readonly class MessageViewModel
{
    public function __construct(
        public int $id,
        public string $name,
        public string $email,
        public string $message,
        public bool $important,
        public bool $seen,
        public ?string $createdAt,
    ) {
    }

    public static function fromListItem(ListMessageItem $item): self
    {
        return new self(
            id: $item->id,
            name: $item->name,
            email: $item->email,
            message: $item->message,
            important: $item->important,
            seen: $item->seen,
            createdAt: $item->createdAt,
        );
    }

    /**
     * @return array{
     *     id:int,
     *     name:string,
     *     email:string,
     *     message:string,
     *     important:bool,
     *     seen:bool,
     *     created_at:?string
     * }
     */
    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'message' => $this->message,
            'important' => $this->important,
            'seen' => $this->seen,
            'created_at' => $this->createdAt,
        ];
    }
}
