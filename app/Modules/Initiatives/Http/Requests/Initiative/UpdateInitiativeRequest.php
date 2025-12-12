<?php

declare(strict_types=1);

namespace App\Modules\Initiatives\Http\Requests\Initiative;

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
     * When the images field is present, it represents a full replacement
     * of the initiative image collection. Each item is expected to contain:
     * - file    : UploadedFile (image, required)
     * - alt     : optional alt text
     * - title   : optional image title
     * - caption : optional caption for the image
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
            'images.*.file' => ['required', 'file', 'image'],
            'images.*.alt' => ['nullable', 'string', 'max:255'],
            'images.*.title' => ['nullable', 'string', 'max:255'],
            'images.*.caption' => ['nullable', 'string'],
        ];
    }
}
