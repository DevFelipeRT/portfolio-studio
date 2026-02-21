<?php

namespace Database\Seeders;

use App\Modules\IdentityAccess\Domain\Models\User;
use Database\Seeders\Concerns\PreventsProductionSeeding;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;
    use PreventsProductionSeeding;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->assertNotProduction();

        User::query()->firstOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'Admin',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ],
        );

        $this->call([
            WebsiteSettingsSeeder::class,
            SkillsSeeder::class,
            CoursesSeeder::class,
            ContactChannelsSeeder::class,
            ExperiencesSeeder::class,
            ImagesSeeder::class,
            ProjectsSeeder::class,
            InitiativesSeeder::class,
            ContentManagementSeeder::class,
            MailSeeder::class,
        ]);
    }
}
