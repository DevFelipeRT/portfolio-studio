<?php

declare(strict_types=1);

namespace App\Modules\Courses\Http\Requests\Course;

use App\Modules\Courses\Application\Services\SupportedLocalesResolver;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * Request object for storing courses.
 */
class StoreCourseRequest extends FormRequest
{
    /**
     * Authorize the request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Validation rules for storing a course.
     */
    public function rules(): array
    {
        $supported = app(SupportedLocalesResolver::class)->resolve();

        return [
            'locale' => ['required', 'string', 'max:20', Rule::in($supported)],
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
