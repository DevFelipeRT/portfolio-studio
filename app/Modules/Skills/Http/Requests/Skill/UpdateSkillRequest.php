<?php

declare(strict_types=1);

namespace App\Modules\Skills\Http\Requests\Skill;

use App\Modules\Skills\Domain\Models\Skill;

use App\Modules\Skills\Application\Services\SupportedLocalesResolver;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * Request object for updating an existing skill.
 */
class UpdateSkillRequest extends FormRequest
{
    /**
     * Determines whether the user is authorized to perform this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Returns the validation rules for updating a skill.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        $supported = app(SupportedLocalesResolver::class)->resolve();

        /** @var Skill|null $skill */
        $skill = $this->route('skill');

        $skillId = $skill?->id;

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
                Rule::unique('skills', 'name')->ignore($skillId),
            ],
            'skill_category_id' => [
                'nullable',
                'integer',
                'exists:skill_categories,id',
            ],
        ];
    }
}
