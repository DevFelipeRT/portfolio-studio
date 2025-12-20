<?php

declare(strict_types=1);

namespace App\Modules\Courses\Http\Requests\Course;

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
            'category' => ['required', 'string', 'max:255'],
            'summary' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'started_at' => ['nullable', 'date'],
            'completed_at' => ['nullable', 'date', 'after_or_equal:started_at'],
            'display' => ['sometimes', 'boolean'],
        ];
    }
}
