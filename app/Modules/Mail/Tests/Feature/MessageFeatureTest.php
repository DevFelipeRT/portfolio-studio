<?php

declare(strict_types=1);

namespace App\Modules\Mail\Tests\Feature;

use App\Modules\Mail\Domain\Models\Message;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

final class MessageFeatureTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_stores_a_contact_message(): void
    {
        $response = $this->from('/')->post(route('messages.store'), [
            'name' => 'Felipe',
            'email' => 'felipe@example.com',
            'message' => 'Hello from the contact form.',
        ]);

        $response
            ->assertRedirect('/')
            ->assertSessionHasNoErrors();

        $this->assertDatabaseHas('messages', [
            'name' => 'Felipe',
            'email' => 'felipe@example.com',
            'seen' => false,
            'important' => false,
        ]);
    }

    public function test_it_validates_public_contact_message_requests(): void
    {
        $response = $this->from('/')->post(route('messages.store'), [
            'name' => '',
            'email' => 'invalid',
            'message' => '',
        ]);

        $response
            ->assertRedirect('/')
            ->assertSessionHasErrors(['name', 'email', 'message']);
    }

    public function test_it_marks_a_message_as_seen_in_the_admin_area(): void
    {
        $this->actingAsAdmin();
        $message = Message::query()->create([
            'name' => 'Felipe',
            'email' => 'felipe@example.com',
            'message' => 'Hello from the contact form.',
            'seen' => false,
            'important' => false,
        ]);

        $response = $this->patch(route('messages.mark-as-seen', $message));

        $response->assertRedirect(route('messages.index', [
            'per_page' => 15,
            'sort' => 'important',
            'direction' => 'desc',
        ]));
        $this->assertDatabaseHas('messages', [
            'id' => $message->id,
            'seen' => true,
        ]);
    }
}
