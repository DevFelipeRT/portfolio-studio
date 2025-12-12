<?php

declare(strict_types=1);

namespace App\Modules\Mail\Domain\Models;

use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    /**
     * Mass assignable attributes.
     *
     * @var array<int,string>
     */
    protected $fillable = [
        'name',
        'email',
        'message',
        'important',
        'seen',
    ];

    /**
     * Attribute type casting.
     *
     * @var array<string,string>
     */
    protected $casts = [
        'id' => 'integer',
        'important' => 'boolean',
        'seen' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];
}
