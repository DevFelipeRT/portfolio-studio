<?php

declare(strict_types=1);

namespace App\Modules\ContactChannels\Http\Requests\ContactChannel;

use Illuminate\Foundation\Http\FormRequest;

class ToggleContactChannelRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string,mixed>
     */
    public function rules(): array
    {
        return [
            'is_active' => ['required', 'boolean'],
        ];
    }
}
