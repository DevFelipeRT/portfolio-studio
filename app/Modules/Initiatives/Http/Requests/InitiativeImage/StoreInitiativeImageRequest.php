<?php

declare(strict_types=1);

namespace App\Modules\Initiatives\Http\Requests\InitiativeImage;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Request payload validation for attaching a new image to an initiative.
 */
class StoreInitiativeImageRequest extends FormRequest
{
    /**
     * Authorization check for the request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Validation rules for the request payload.
     *
     * @return array<string,mixed>
     */
    public function rules(): array
    {
        return [
            'file' => ['required', 'file', 'image'],
            'alt' => ['nullable', 'string', 'max:255'],
            'title' => ['nullable', 'string', 'max:255'],
            'caption' => ['nullable', 'string'],
        ];
    }
}
