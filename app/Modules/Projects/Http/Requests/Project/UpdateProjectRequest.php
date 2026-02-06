<?php

declare(strict_types=1);

namespace App\Modules\Projects\Http\Requests\Project;

use App\Modules\Projects\Application\Services\SupportedLocalesResolver;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * Request payload validation for updating an existing project.
 */
class UpdateProjectRequest extends FormRequest
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
        $supported = app(SupportedLocalesResolver::class)->resolve();

        return [
            'locale' => ['required', 'string', 'max:20', Rule::in($supported)],
            'confirm_swap' => ['sometimes', 'boolean'],
            'name' => ['required', 'string', 'max:255'],
            'summary' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'status' => ['required', 'string', 'max:50'],
            'repository_url' => ['nullable', 'string', 'max:2048', 'url'],
            'live_url' => ['nullable', 'string', 'max:2048', 'url'],

            'skill_ids' => ['nullable', 'array'],
            'skill_ids.*' => ['integer', 'exists:skills,id'],

            /**
             * When present, images represents a full replacement of the
             * project image collection. Each item may contain:
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

            'display' => ['nullable', 'bool'],
        ];
    }
}
