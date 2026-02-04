<?php

declare(strict_types=1);

namespace App\Modules\Initiatives\Http\Requests\InitiativeTranslation;

use App\Modules\Initiatives\Application\Services\SupportedLocalesResolver;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

final class UpdateInitiativeTranslationRequest extends FormRequest
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
        $initiative = $this->route('initiative');
        $baseLocale = $initiative?->locale;

        return [
            'locale' => [
                'required',
                'string',
                'max:20',
                Rule::in($supported),
                Rule::notIn($baseLocale ? [$baseLocale] : []),
            ],
            'name' => [
                'nullable',
                'string',
                'max:255',
                'required_without_all:summary,description',
            ],
            'summary' => [
                'nullable',
                'string',
                'max:255',
                'required_without_all:name,description',
            ],
            'description' => [
                'nullable',
                'string',
                'required_without_all:name,summary',
            ],
        ];
    }
}
