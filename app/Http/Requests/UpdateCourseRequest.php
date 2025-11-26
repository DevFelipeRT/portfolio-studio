<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Request object for updating courses.
 */
class UpdateCourseRequest extends FormRequest
{
    /**
     * Authorize the request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Validation rules for updating a course.
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'institution' => ['required', 'string', 'max:255'],
            'short_description' => ['required', 'string', 'max:255'],
            'long_description' => ['required', 'string'],
            'start_date' => ['required', 'date'],
            'end_date' => ['nullable', 'date', 'after_or_equal:start_date'],
            'display' => ['sometimes', 'boolean'],
        ];
    }
}
