<?php

declare(strict_types=1);

namespace App\Modules\Initiatives\Http\Requests\InitiativeImage;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Request payload validation for updating an existing initiative image.
 */
class UpdateInitiativeImageRequest extends FormRequest
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
            /**
             * When present, the file replaces the current image file.
             */
            'file'    => ['sometimes', 'file', 'image'],

            /**
             * Optional metadata updates for the image.
             */
            'alt'     => ['nullable', 'string', 'max:255'],
            'title'   => ['nullable', 'string', 'max:255'],
            'caption' => ['nullable', 'string'],
        ];
    }
}
