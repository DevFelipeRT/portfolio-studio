<?php

declare(strict_types=1);

namespace App\Http\Requests\Technology;

use App\Enums\TechnologyCategories;
use App\Models\Technology;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * Request object for updating an existing technology.
 */
class UpdateTechnologyRequest extends FormRequest
{
    /**
     * Determines whether the user is authorized to perform this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Returns the validation rules for updating a technology.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        /** @var Technology|null $technology */
        $technology = $this->route('technology');

        $technologyId = $technology?->id;

        return [
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('technologies', 'name')->ignore($technologyId),
            ],
            'category' => [
                'required',
                'string',
                Rule::enum(TechnologyCategories::class),
            ],
        ];
    }
}
