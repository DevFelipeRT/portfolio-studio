<?php

declare(strict_types=1);

namespace App\Modules\Skills\Http\Requests\Skill;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Request object for storing a new skill.
 */
class StoreSkillRequest extends FormRequest
{
    /**
     * Determines whether the user is authorized to perform this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Returns the validation rules for storing a skill.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'name' => [
                'required',
                'string',
                'max:255',
                'unique:skills,name',
            ],
            'skill_category_id' => [
                'nullable',
                'integer',
                'exists:skill_categories,id',
            ],
        ];
    }
}
