<?php

declare(strict_types=1);

namespace App\Modules\Courses\Http\Requests\CourseTranslation;

use App\Modules\Courses\Application\Services\SupportedLocalesResolver;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

final class StoreCourseTranslationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string,mixed>
     */
    public function rules(): array
    {
        $supported = app(SupportedLocalesResolver::class)->resolve();

        return [
            'locale' => [
                'required',
                'string',
                'max:20',
                Rule::in($supported),
            ],
            'name' => [
                'nullable',
                'string',
                'max:255',
                'required_without_all:institution,summary,description',
            ],
            'institution' => [
                'nullable',
                'string',
                'max:255',
                'required_without_all:name,summary,description',
            ],
            'summary' => [
                'nullable',
                'string',
                'max:255',
                'required_without_all:name,institution,description',
            ],
            'description' => [
                'nullable',
                'string',
                'required_without_all:name,institution,summary',
            ],
        ];
    }
}
