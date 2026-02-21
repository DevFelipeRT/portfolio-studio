<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Modules\ContactChannels\Domain\Models\ContactChannel;
use App\Modules\ContactChannels\Domain\Models\ContactChannelTranslation;
use Illuminate\Database\Seeder;

class ContactChannelsSeeder extends Seeder
{
    /**
     * Seed contact channels base data and translations.
     */
    public function run(): void
    {
        // Keep this seeder deterministic: remove previous contact channels first.
        ContactChannel::query()->delete();

        $channels = [
            [
                'locale' => 'en',
                'channel_type' => 'email',
                'label' => 'Email',
                'value' => 'hello@example.com',
                'is_active' => true,
                'sort_order' => 1,
                'translations' => [
                    'pt_BR' => 'E-mail',
                ],
            ],
            [
                'locale' => 'en',
                'channel_type' => 'phone',
                'label' => 'Phone',
                'value' => '+5511999998888',
                'is_active' => true,
                'sort_order' => 2,
                'translations' => [
                    'pt_BR' => 'Telefone',
                ],
            ],
            [
                'locale' => 'en',
                'channel_type' => 'whatsapp',
                'label' => 'WhatsApp',
                'value' => '+5511999997777',
                'is_active' => true,
                'sort_order' => 3,
                'translations' => [
                    'pt_BR' => 'WhatsApp',
                ],
            ],
            [
                'locale' => 'en',
                'channel_type' => 'linkedin',
                'label' => 'LinkedIn',
                'value' => 'dev-profile',
                'is_active' => true,
                'sort_order' => 4,
                'translations' => [
                    'pt_BR' => 'LinkedIn',
                ],
            ],
            [
                'locale' => 'en',
                'channel_type' => 'github',
                'label' => 'GitHub',
                'value' => 'dev-profile',
                'is_active' => true,
                'sort_order' => 5,
                'translations' => [
                    'pt_BR' => 'GitHub',
                ],
            ],
            [
                'locale' => 'en',
                'channel_type' => 'custom',
                'label' => 'Portfolio',
                'value' => 'https://portfolio.example.com',
                'is_active' => true,
                'sort_order' => 6,
                'translations' => [
                    'pt_BR' => 'Portfolio',
                ],
            ],
            [
                'locale' => 'en',
                'channel_type' => 'custom',
                'label' => 'Calendly',
                'value' => 'https://calendly.com/dev-profile',
                'is_active' => false,
                'sort_order' => 7,
                'translations' => [
                    'pt_BR' => 'Calendly',
                ],
            ],
        ];

        foreach ($channels as $channelData) {
            $channel = ContactChannel::query()->create(
                [
                    'channel_type' => $channelData['channel_type'],
                    'value' => $channelData['value'],
                    'locale' => $channelData['locale'],
                    'label' => $channelData['label'],
                    'is_active' => $channelData['is_active'],
                    'sort_order' => $channelData['sort_order'],
                ],
            );

            $this->seedChannelTranslations($channel, $channelData['translations'] ?? []);
        }
    }

    /**
     * @param array<string,string> $translations
     */
    private function seedChannelTranslations(ContactChannel $channel, array $translations): void
    {
        foreach ($translations as $locale => $label) {
            if ($locale === $channel->locale) {
                continue;
            }

            ContactChannelTranslation::query()->updateOrCreate(
                [
                    'contact_channel_id' => $channel->id,
                    'locale' => $locale,
                ],
                [
                    'label' => $label,
                ],
            );
        }
    }
}
