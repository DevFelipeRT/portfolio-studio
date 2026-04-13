<?php

declare(strict_types=1);

namespace App\Modules\Projects\Http\Requests\ProjectTranslation;

use App\Modules\Projects\Application\Services\SupportedLocalesResolver;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

final class UpdateProjectTranslationRequest extends FormRequest
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
        $project = $this->route('project');
        $baseLocale = $project?->locale;

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
                'required_without_all:summary,description,repository_url,live_url',
            ],
            'summary' => [
                'nullable',
                'string',
                'max:255',
                'required_without_all:name,description,repository_url,live_url',
            ],
            'description' => [
                'nullable',
                'string',
                'required_without_all:name,summary,repository_url,live_url',
            ],
            'repository_url' => [
                'nullable',
                'string',
                'max:2048',
                'url',
                'required_without_all:name,summary,description,live_url',
            ],
            'live_url' => [
                'nullable',
                'string',
                'max:2048',
                'url',
                'required_without_all:name,summary,description,repository_url',
            ],
        ];
    }
}
