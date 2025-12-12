<?php

declare(strict_types=1);

namespace App\Modules\Projects\Http\Requests\ProjectImage;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Request payload validation for updating an existing project image.
 */
class UpdateProjectImageRequest extends FormRequest
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
            'file' => ['sometimes', 'file', 'image'],
            'alt' => ['nullable', 'string', 'max:255'],
            'title' => ['nullable', 'string', 'max:255'],
            'caption' => ['nullable', 'string'],
        ];
    }
}
