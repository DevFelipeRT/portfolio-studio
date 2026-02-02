<?php

declare(strict_types=1);

namespace App\Modules\Skills\Http\Requests\SkillCategoryTranslation;

use App\Modules\Skills\Application\Services\SupportedLocalesResolver;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

final class StoreSkillCategoryTranslationRequest extends FormRequest
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
                'required',
                'string',
                'max:255',
            ],
        ];
    }
}
