<?php

declare(strict_types=1);

namespace App\Modules\Mail\Http\Controllers;

use App\Modules\Mail\Application\UseCases\CreateMessage\CreateMessage;
use App\Modules\Mail\Application\UseCases\DeleteMessage\DeleteMessage;
use App\Modules\Mail\Application\UseCases\DeleteMessage\DeleteMessageInput;
use App\Modules\Mail\Application\UseCases\ListMessages\ListMessages;
use App\Modules\Mail\Application\UseCases\SetMessageImportant\SetMessageImportant;
use App\Modules\Mail\Application\UseCases\SetMessageImportant\SetMessageImportantInput;
use App\Modules\Mail\Application\UseCases\SetMessageSeen\SetMessageSeen;
use App\Modules\Mail\Application\UseCases\SetMessageSeen\SetMessageSeenInput;
use App\Modules\Shared\Abstractions\Http\Controller;
use App\Modules\Mail\Domain\Models\Message;
use App\Modules\Mail\Http\Mappers\ListMessagesInputMapper;
use App\Modules\Mail\Http\Mappers\MessageInputMapper;
use App\Modules\Mail\Http\Requests\StoreMessageRequest;
use App\Modules\Mail\Presentation\Presenters\MessagePagePresenter;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MessageController extends Controller
{
    public function __construct(
        private readonly ListMessages $listMessages,
        private readonly CreateMessage $createMessage,
        private readonly SetMessageSeen $setMessageSeen,
        private readonly SetMessageImportant $setMessageImportant,
        private readonly DeleteMessage $deleteMessage,
        private readonly ListMessagesInputMapper $listMessagesInputMapper,
        private readonly MessagePagePresenter $messagePagePresenter,
    ) {
    }

    /**
     * Display a listing of messages for the admin panel.
     */
    public function index(Request $request): Response|RedirectResponse
    {
        $input = $this->listMessagesInputMapper->fromRequest($request);
        $messages = $this->listMessages->handle($input);

        if ($messages->shouldClampPage()) {
            return redirect()->route(
                'messages.index',
                $this->buildIndexQueryParams(
                    perPage: $input->perPage,
                    search: $input->search,
                    seen: $input->seen,
                    important: $input->important,
                    sort: $input->sort,
                    direction: $input->direction,
                    page: $messages->lastPage,
                ),
            );
        }

        $viewModel = $this->messagePagePresenter->buildIndexViewModel(
            messages: $messages,
            filters: [
                'per_page' => $input->perPage,
                'search' => $input->search,
                'seen' => $input->seen,
                'important' => $input->important,
                'sort' => $input->sort,
                'direction' => $input->direction,
            ],
        );

        return Inertia::render('messages/admin/Index', $viewModel->toProps());
    }

    /**
     * Store a newly created message from the public contact form.
     */
    public function store(StoreMessageRequest $request): RedirectResponse
    {
        $input = MessageInputMapper::fromStoreRequest($request);

        $this->createMessage->handle($input);

        return redirect()
            ->back()
            ->with('success', 'Your message has been sent successfully.');
    }

    /**
     * Mark a message as important.
     */
    public function markAsImportant(
        Request $request,
        Message $message,
    ): RedirectResponse
    {
        $this->setMessageImportant->handle(new SetMessageImportantInput(
            messageId: $message->id,
            important: true,
        ));

        return redirect()
            ->route('messages.index', $this->buildIndexQueryParamsFromRequest($request))
            ->with('success', 'Message marked as important.');
    }

    /**
     * Mark a message as not important.
     */
    public function markAsNotImportant(
        Request $request,
        Message $message,
    ): RedirectResponse
    {
        $this->setMessageImportant->handle(new SetMessageImportantInput(
            messageId: $message->id,
            important: false,
        ));

        return redirect()
            ->route('messages.index', $this->buildIndexQueryParamsFromRequest($request))
            ->with('success', 'Message marked as not important.');
    }

    /**
     * Mark a message as seen.
     */
    public function markAsSeen(
        Request $request,
        Message $message,
    ): RedirectResponse
    {
        $this->setMessageSeen->handle(new SetMessageSeenInput(
            messageId: $message->id,
            seen: true,
        ));

        return redirect()
            ->route('messages.index', $this->buildIndexQueryParamsFromRequest($request))
            ->with('success', 'Message marked as seen.');
    }

    /**
     * Mark a message as unseen.
     */
    public function markAsUnseen(
        Request $request,
        Message $message,
    ): RedirectResponse
    {
        $this->setMessageSeen->handle(new SetMessageSeenInput(
            messageId: $message->id,
            seen: false,
        ));

        return redirect()
            ->route('messages.index', $this->buildIndexQueryParamsFromRequest($request))
            ->with('success', 'Message marked as unseen.');
    }

    /**
     * Remove the specified message from storage.
     */
    public function destroy(
        Request $request,
        Message $message,
    ): RedirectResponse
    {
        $this->deleteMessage->handle(new DeleteMessageInput(
            messageId: $message->id,
        ));

        return redirect()
            ->route('messages.index', $this->buildIndexQueryParamsFromRequest($request))
            ->with('success', 'Message deleted.');
    }

    /**
     * @return array<string,int|string>
     */
    private function buildIndexQueryParams(
        int $perPage,
        ?string $search,
        ?string $seen,
        ?string $important,
        ?string $sort,
        ?string $direction,
        int $page,
    ): array {
        $query = [
            'per_page' => $perPage,
        ];

        if ($search !== null) {
            $query['search'] = $search;
        }

        if ($seen !== null) {
            $query['seen'] = $seen;
        }

        if ($important !== null) {
            $query['important'] = $important;
        }

        if ($sort !== null) {
            $query['sort'] = $sort;

            if ($direction !== null) {
                $query['direction'] = $direction;
            }
        }

        if ($page > 1) {
            $query['page'] = $page;
        }

        return $query;
    }

    /**
     * @return array<string,int|string>
     */
    private function buildIndexQueryParamsFromRequest(Request $request): array
    {
        $input = $this->listMessagesInputMapper->fromRequest($request);

        return $this->buildIndexQueryParams(
            perPage: $input->perPage,
            search: $input->search,
            seen: $input->seen,
            important: $input->important,
            sort: $input->sort,
            direction: $input->direction,
            page: $input->page,
        );
    }
}
