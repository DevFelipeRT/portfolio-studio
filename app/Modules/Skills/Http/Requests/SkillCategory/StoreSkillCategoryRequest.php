<?php

declare(strict_types=1);

namespace App\Modules\Skills\Http\Requests\SkillCategory;

use App\Modules\Skills\Application\Services\SupportedLocalesResolver;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * Request object for storing a new skill category.
 */
class StoreSkillCategoryRequest extends FormRequest
{
    /**
     * Determines whether the user is authorized to perform this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Returns the validation rules for storing a category.
     *
     * @return array<string, mixed>
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
                'required',
                'string',
                'max:255',
                'unique:skill_categories,name',
            ],
            'slug' => [
                'nullable',
                'string',
                'max:255',
                Rule::unique('skill_categories', 'slug'),
            ],
        ];
    }
}
