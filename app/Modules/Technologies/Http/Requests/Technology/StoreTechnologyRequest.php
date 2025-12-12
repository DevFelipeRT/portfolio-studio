<?php

declare(strict_types=1);

namespace App\Modules\Technologies\Http\Requests\Technology;

use App\Modules\Technologies\Domain\Enums\TechnologyCategories;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * Request object for storing a new technology.
 */
class StoreTechnologyRequest extends FormRequest
{
    /**
     * Determines whether the user is authorized to perform this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Returns the validation rules for storing a technology.
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
                'unique:technologies,name',
            ],
            'category' => [
                'required',
                'string',
                Rule::enum(TechnologyCategories::class),
            ],
        ];
    }
}
