<?php

declare(strict_types=1);

namespace App\Modules\Mail\Application\UseCases\ListMessages;

final readonly class ListMessageItem
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
