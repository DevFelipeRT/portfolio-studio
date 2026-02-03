<?php

declare(strict_types=1);

namespace App\Modules\Experiences\Http\Requests\ExperienceTranslation;

use App\Modules\Experiences\Application\Services\SupportedLocalesResolver;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

final class UpdateExperienceTranslationRequest extends FormRequest
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
        $experience = $this->route('experience');
        $baseLocale = $experience?->locale;

        return [
            'locale' => [
                'required',
                'string',
                'max:20',
                Rule::in($supported),
                Rule::notIn($baseLocale ? [$baseLocale] : []),
            ],
            'position' => [
                'nullable',
                'string',
                'max:255',
                'required_without_all:company,summary,description',
            ],
            'company' => [
                'nullable',
                'string',
                'max:255',
                'required_without_all:position,summary,description',
            ],
            'summary' => [
                'nullable',
                'string',
                'max:255',
                'required_without_all:position,company,description',
            ],
            'description' => [
                'nullable',
                'string',
                'required_without_all:position,company,summary',
            ],
        ];
    }
}
