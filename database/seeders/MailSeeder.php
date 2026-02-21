<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Modules\Mail\Domain\Models\Message;
use Database\Seeders\Concerns\PreventsProductionSeeding;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

class MailSeeder extends Seeder
{
    use PreventsProductionSeeding;

    /**
     * Seed mail messages with deterministic data for admin inbox testing.
     */
    public function run(): void
    {
        $this->assertNotProduction();

        // Keep this seeder deterministic: remove previous messages first.
        Message::query()->delete();

        $messages = [
            [
                'name' => 'Alex Johnson',
                'email' => 'alex.johnson@example.com',
                'message' => 'Hello, I would like to discuss a backend architecture consulting opportunity.',
                'important' => true,
                'seen' => false,
                'created_at' => '2026-02-20 09:15:00',
            ],
            [
                'name' => 'Camila Santos',
                'email' => 'camila.santos@example.com',
                'message' => 'I enjoyed your projects. Are you available for a freelance collaboration in March?',
                'important' => true,
                'seen' => true,
                'created_at' => '2026-02-18 14:22:00',
            ],
            [
                'name' => 'Daniel Lee',
                'email' => 'daniel.lee@example.com',
                'message' => 'We are hiring senior full stack engineers. Please let me know if you are open to new opportunities.',
                'important' => false,
                'seen' => false,
                'created_at' => '2026-02-17 11:03:00',
            ],
            [
                'name' => 'Fernanda Alves',
                'email' => 'fernanda.alves@example.com',
                'message' => 'Could you share your availability for a technical mentorship session next week?',
                'important' => false,
                'seen' => true,
                'created_at' => '2026-02-16 16:40:00',
            ],
            [
                'name' => 'Morgan Patel',
                'email' => 'morgan.patel@example.com',
                'message' => 'Interested in your DevOps toolkit project. Is there public documentation available?',
                'important' => false,
                'seen' => false,
                'created_at' => '2026-02-15 10:08:00',
            ],
            [
                'name' => 'Rafaela Lima',
                'email' => 'rafaela.lima@example.com',
                'message' => 'I found a small typo in your portfolio homepage. Happy to report details if useful.',
                'important' => false,
                'seen' => true,
                'created_at' => '2026-02-14 08:31:00',
            ],
            [
                'name' => 'Sofia Kim',
                'email' => 'sofia.kim@example.com',
                'message' => 'Could we schedule a quick call regarding a potential partnership on educational content?',
                'important' => true,
                'seen' => false,
                'created_at' => '2026-02-13 13:55:00',
            ],
            [
                'name' => 'Victor Nguyen',
                'email' => 'victor.nguyen@example.com',
                'message' => 'Great work on the accessibility initiative. I would like to invite you to speak at our meetup.',
                'important' => false,
                'seen' => false,
                'created_at' => '2026-02-12 19:10:00',
            ],
        ];

        foreach ($messages as $messageData) {
            Message::query()->create([
                'name' => $messageData['name'],
                'email' => $messageData['email'],
                'message' => $messageData['message'],
                'important' => $messageData['important'],
                'seen' => $messageData['seen'],
                'created_at' => Carbon::parse($messageData['created_at']),
                'updated_at' => Carbon::parse($messageData['created_at']),
            ]);
        }
    }
}
