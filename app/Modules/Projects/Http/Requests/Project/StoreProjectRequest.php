<?php

declare(strict_types=1);

namespace App\Modules\Projects\Http\Requests\Project;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Request payload validation for creating a new project.
 */
class StoreProjectRequest extends FormRequest
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
            'name' => ['required', 'string', 'max:255'],
            'short_description' => ['required', 'string', 'max:255'],
            'long_description' => ['required', 'string'],
            'status' => ['required', 'string', 'max:50'],
            'repository_url' => ['nullable', 'string', 'max:2048', 'url'],
            'live_url' => ['nullable', 'string', 'max:2048', 'url'],

            'skill_ids' => ['nullable', 'array'],
            'skill_ids.*' => ['integer', 'exists:skills,id'],

            /**
             * Images payload: full initial collection for this project.
             * Each item may contain:
             * - file    : UploadedFile (image, required)
             * - alt     : optional alt text
             * - title   : optional image title
             * - caption : optional caption for the image
             */
            'images' => ['nullable', 'array'],
            'images.*.file' => ['required', 'file', 'image'],
            'images.*.alt' => ['nullable', 'string', 'max:255'],
            'images.*.title' => ['nullable', 'string', 'max:255'],
            'images.*.caption' => ['nullable', 'string'],
        ];
    }
}
