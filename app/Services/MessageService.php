<?php

declare(strict_types=1);

namespace App\Services;

use App\Mail\ContactMessageReceived;
use App\Models\Message;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Mail;

/**
 * Service responsible for managing contact messages.
 */
class MessageService
{
    /**
     * List all messages ordered by most recent and flagged important first.
     *
     * @return Collection<int,Message>
     */
    public function all(): Collection
    {
        return Message::query()
            ->orderByDesc('important')
            ->orderByDesc('created_at')
            ->get();
    }


    /**
     * Find a single message by its primary key.
     *
     * @throws \Illuminate\Database\Eloquent\ModelNotFoundException
     */
    public function find(int $id): Message
    {
        return Message::query()->findOrFail($id);
    }

    /**
     * Create a new message and notify the host by email.
     *
     * @param array{name:string,email:string,message:string} $data
     */
    public function create(array $data): Message
    {
        $message = Message::query()->create([
            'name'      => $data['name'],
            'email'     => $data['email'],
            'message'   => $data['message'],
            'important' => false,
            'seen'      => false,
        ]);

        $this->sendHostNotification($message);

        return $message;
    }

    /**
     * Mark a message as important.
     */
    public function markAsImportant(Message $message): Message
    {
        $message->important = true;
        $message->save();

        return $message;
    }

    /**
     * Mark a message as not important.
     */
    public function markAsNotImportant(Message $message): Message
    {
        $message->important = false;
        $message->save();

        return $message;
    }

    /**
     * Mark a message as seen.
     */
    public function markAsSeen(Message $message): Message
    {
        $message->seen = true;
        $message->save();

        return $message;
    }

    /**
     * Mark a message as unseen.
     */
    public function markAsUnseen(Message $message): Message
    {
        $message->seen = false;
        $message->save();

        return $message;
    }

    /**
     * Delete a message.
     */
    public function delete(Message $message): void
    {
        $message->delete();
    }

    /**
     * Send host notification email for a newly created message.
     */
    private function sendHostNotification(Message $message): void
    {
        $recipient = config('mail.to.address');

        if (empty($recipient)) {
            return;
        }

        Mail::to($recipient)->send(
            new ContactMessageReceived($message)
        );
    }
}
