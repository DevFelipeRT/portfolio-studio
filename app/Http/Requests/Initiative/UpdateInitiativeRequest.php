<?php

declare(strict_types=1);

namespace App\Http\Requests\Initiative;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Request for updating initiatives.
 */
class UpdateInitiativeRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Validation rules for updating an initiative.
     *
     * @return array<string,mixed>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'short_description' => ['required', 'string', 'max:255'],
            'long_description' => ['required', 'string'],
            'display' => ['sometimes', 'boolean'],
            'start_date' => ['required', 'date'],
            'end_date' => ['nullable', 'date', 'after_or_equal:start_date'],

            'images' => ['sometimes', 'array'],
            'images.*.file' => ['sometimes', 'file', 'image', 'mimes:jpg,jpeg,png,webp,avif,svg', 'max:2048'],
            'images.*.alt' => ['nullable', 'string', 'max:255'],
        ];
    }
}
