<?php

namespace Tests;

use App\Modules\IdentityAccess\Domain\Models\User;
use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

abstract class TestCase extends BaseTestCase
{
    protected function actingAsAdmin(?User $user = null): User
    {
        $admin = $user ?? User::factory()->create();

        $this->actingAs($admin);

        return $admin;
    }
}
