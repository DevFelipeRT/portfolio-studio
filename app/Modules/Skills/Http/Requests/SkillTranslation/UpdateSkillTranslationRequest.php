<?php

declare(strict_types=1);

namespace App\Modules\Skills\Http\Requests\SkillTranslation;

use App\Modules\Skills\Application\Services\SupportedLocalesResolver;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

final class UpdateSkillTranslationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        if ($this->route('locale')) {
            $this->merge([
                'locale' => $this->route('locale'),
            ]);
        }
    }

    /**
     * @return array<string,mixed>
     */
    public function rules(): array
    {
        $supported = app(SupportedLocalesResolver::class)->resolve();
        $skill = $this->route('skill');
        $baseLocale = $skill?->locale;

        return [
            'locale' => [
                'required',
                'string',
                'max:20',
                Rule::in($supported),
                Rule::notIn($baseLocale ? [$baseLocale] : []),
            ],
            'name' => [
                'required',
                'string',
                'max:255',
            ],
        ];
    }
}
