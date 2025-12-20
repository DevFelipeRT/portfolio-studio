<?php

declare(strict_types=1);

namespace App\Modules\Mail\Http\Controllers;

use App\Modules\Shared\Abstractions\Http\Controller;
use App\Modules\Mail\Domain\Models\Message;
use App\Modules\Mail\Application\Services\MessageService;
use App\Modules\Mail\Http\Requests\StoreMessageRequest;

use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class MessageController extends Controller
{
    /**
     * @var MessageService
     */
    private MessageService $messages;

    /**
     * Create a new controller instance.
     */
    public function __construct(MessageService $messages)
    {
        $this->messages = $messages;
    }

    /**
     * Display a listing of messages for the admin panel.
     */
    public function index(): Response
    {
        return Inertia::render('Messages/Index', [
            'messages' => $this->messages->all(),
        ]);
    }

    /**
     * Display a single message for detailed view in the admin panel.
     */
    public function show(int $id): Response
    {
        $message = $this->messages->find($id);

        return Inertia::render('Messages/Show', [
            'message' => $message,
        ]);
    }

    /**
     * Store a newly created message from the public contact form.
     */
    public function store(StoreMessageRequest $request): RedirectResponse
    {
        $this->messages->create($request->validated());

        return redirect()
            ->back()
            ->with('success', 'Your message has been sent successfully.');
    }

    /**
     * Mark a message as important.
     */
    public function markAsImportant(Message $message): RedirectResponse
    {
        $this->messages->markAsImportant($message);

        return redirect()
            ->back()
            ->with('success', 'Message marked as important.');
    }

    /**
     * Mark a message as not important.
     */
    public function markAsNotImportant(Message $message): RedirectResponse
    {
        $this->messages->markAsNotImportant($message);

        return redirect()
            ->back()
            ->with('success', 'Message marked as not important.');
    }

    /**
     * Mark a message as seen.
     */
    public function markAsSeen(Message $message): RedirectResponse
    {
        $this->messages->markAsSeen($message);

        return redirect()
            ->back()
            ->with('success', 'Message marked as seen.');
    }

    /**
     * Mark a message as unseen.
     */
    public function markAsUnseen(Message $message): RedirectResponse
    {
        $this->messages->markAsUnseen($message);

        return redirect()
            ->back()
            ->with('success', 'Message marked as unseen.');
    }

    /**
     * Remove the specified message from storage.
     */
    public function destroy(Message $message): RedirectResponse
    {
        $this->messages->delete($message);

        return redirect()
            ->back()
            ->with('success', 'Message deleted.');
    }
}
