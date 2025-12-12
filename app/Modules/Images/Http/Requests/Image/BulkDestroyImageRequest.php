<?php

declare(strict_types=1);

namespace App\Modules\Images\Http\Requests\Image;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Request payload validation for bulk deletion of images.
 */
class BulkDestroyImageRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Validation rules for bulk image deletion.
     *
     * @return array<string,mixed>
     */
    public function rules(): array
    {
        return [
            'image_ids' => ['required', 'array'],
            'image_ids.*' => ['integer', 'exists:images,id'],
        ];
    }
}
