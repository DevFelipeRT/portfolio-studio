<?php

declare(strict_types=1);

namespace App\Modules\Experiences\Domain\Models;

use Illuminate\Database\Eloquent\Model;

class Experience extends Model
{
    /**
     * Mass assignable attributes.
     *
     * @var array<int,string>
     */
    protected $fillable = [
        'position',
        'company',
        'short_description',
        'long_description',
        'start_date',
        'end_date',
        'display',
    ];

    /**
     * Attribute type casting.
     *
     * @var array<string,string>
     */
    protected $casts = [
        'id' => 'integer',
        'start_date' => 'date:Y-m-d',
        'end_date' => 'date:Y-m-d',
    ];
}
