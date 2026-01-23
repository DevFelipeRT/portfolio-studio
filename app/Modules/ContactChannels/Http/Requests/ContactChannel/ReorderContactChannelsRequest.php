<?php

declare(strict_types=1);

namespace App\Modules\ContactChannels\Http\Requests\ContactChannel;

use Illuminate\Foundation\Http\FormRequest;

class ReorderContactChannelsRequest extends FormRequest
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
            'items' => ['required', 'array', 'min:1'],
            'items.*.id' => ['required', 'integer', 'exists:contact_channels,id'],
            'items.*.sort_order' => ['required', 'integer', 'min:0'],
        ];
    }
}
