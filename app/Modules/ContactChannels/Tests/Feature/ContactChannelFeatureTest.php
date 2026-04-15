<?php

declare(strict_types=1);

namespace App\Modules\ContactChannels\Tests\Feature;

use App\Modules\ContactChannels\Domain\Enums\ContactChannelType;
use App\Modules\ContactChannels\Domain\Models\ContactChannel;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

final class ContactChannelFeatureTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_creates_a_contact_channel(): void
    {
        $this->actingAsAdmin();

        $response = $this->post(route('contact-channels.store'), [
            'locale' => 'en',
            'channel_type' => ContactChannelType::Email->value,
            'value' => 'hello@example.com',
            'is_active' => true,
            'sort_order' => 1,
        ]);

        $response
            ->assertRedirect(route('contact-channels.index'))
            ->assertSessionHasNoErrors();

        $this->assertDatabaseHas('contact_channels', [
            'locale' => 'en',
            'channel_type' => ContactChannelType::Email->value,
            'value' => 'hello@example.com',
        ]);
    }

    public function test_it_validates_contact_channel_values_by_type(): void
    {
        $this->actingAsAdmin();

        $response = $this->from(route('contact-channels.create'))->post(route('contact-channels.store'), [
            'locale' => 'en',
            'channel_type' => ContactChannelType::Email->value,
            'value' => 'invalid-email',
        ]);

        $response
            ->assertRedirect(route('contact-channels.create'))
            ->assertSessionHasErrors(['value']);
    }

    public function test_it_creates_a_contact_channel_translation(): void
    {
        $this->actingAsAdmin();
        $channel = $this->createChannel();

        $response = $this->postJson(route('contact-channels.translations.store', $channel), [
            'locale' => 'en',
            'label' => 'Email',
        ]);

        $response
            ->assertCreated()
            ->assertJsonPath('data.locale', 'en')
            ->assertJsonPath('data.label', 'Email');

        $this->assertDatabaseHas('contact_channel_translations', [
            'contact_channel_id' => $channel->id,
            'locale' => 'en',
            'label' => 'Email',
        ]);
    }

    public function test_it_returns_not_found_when_deleting_a_missing_contact_channel_translation(): void
    {
        $this->actingAsAdmin();
        $channel = $this->createChannel();

        $response = $this->deleteJson(route('contact-channels.translations.destroy', [$channel, 'en']));

        $response->assertNotFound();
    }

    private function createChannel(array $overrides = []): ContactChannel
    {
        return ContactChannel::query()->create(array_merge([
            'locale' => 'pt_BR',
            'channel_type' => ContactChannelType::Email->value,
            'label' => 'Contato',
            'value' => 'hello@example.com',
            'is_active' => true,
            'sort_order' => 1,
        ], $overrides));
    }
}
