<?php

declare(strict_types=1);

namespace App\Modules\Skills\Http\Requests\SkillCategory;

use App\Modules\Skills\Domain\Models\SkillCategory;
use App\Modules\Skills\Application\Services\SupportedLocalesResolver;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * Request object for updating an existing skill category.
 */
class UpdateSkillCategoryRequest extends FormRequest
{
    /**
     * Determines whether the user is authorized to perform this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Returns the validation rules for updating a category.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        $supported = app(SupportedLocalesResolver::class)->resolve();

        /** @var SkillCategory|null $category */
        $category = $this->route('skill_category') ?? $this->route('skillCategory');

        $categoryId = $category?->id;

        return [
            'locale' => [
                'required',
                'string',
                'max:20',
                Rule::in($supported),
            ],
            'confirm_swap' => ['sometimes', 'boolean'],
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('skill_categories', 'name')->ignore($categoryId),
            ],
            'slug' => [
                'nullable',
                'string',
                'max:255',
                Rule::unique('skill_categories', 'slug')->ignore($categoryId),
            ],
        ];
    }
}
