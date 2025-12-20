<?php

declare(strict_types=1);

namespace App\Modules\Images\Http\Requests\Image;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Request payload validation for updating global image metadata.
 */
class UpdateImageRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Validation rules for updating an image.
     *
     * @return array<string,mixed>
     */
    public function rules(): array
    {
        return [
            'alt_text' => ['nullable', 'string', 'max:255'],
            'image_title' => ['nullable', 'string', 'max:255'],
            'caption' => ['nullable', 'string'],
        ];
    }
}
