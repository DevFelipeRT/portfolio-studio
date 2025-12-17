<?php

declare(strict_types=1);

namespace App\Modules\ContentManagement\Http\Requests\Admin\PageSection;

use App\Modules\ContentManagement\Application\Services\Templates\TemplateValidationService;
use App\Modules\ContentManagement\Domain\Models\Page;
use App\Modules\ContentManagement\Domain\ValueObjects\TemplateKey;
use Illuminate\Foundation\Http\FormRequest;

final class StorePageSectionRequest extends FormRequest
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
        $pageTable = (new Page())->getTable();

        $baseRules = [
            'page_id' => [
                'required',
                'integer',
                'exists:' . $pageTable . ',id',
            ],
            'template_key' => [
                'required',
                'string',
                'max:191',
            ],
            'slot' => [
                'nullable',
                'string',
                'max:191',
            ],
            'position' => [
                'nullable',
                'integer',
                'min:1',
            ],
            'anchor' => [
                'nullable',
                'string',
                'max:191',
            ],
            'is_active' => [
                'sometimes',
                'boolean',
            ],
            'visible_from' => [
                'nullable',
                'date',
            ],
            'visible_until' => [
                'nullable',
                'date',
                'after_or_equal:visible_from',
            ],
            'locale' => [
                'nullable',
                'string',
                'max:10',
            ],
        ];

        $templateRules = $this->buildTemplateDataRules();

        return array_merge(
            $baseRules,
            $templateRules,
        );
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'is_active' => $this->boolean('is_active'),
        ]);
    }

    /**
     * @return array<string,mixed>
     */
    private function buildTemplateDataRules(): array
    {
        $templateKeyValue = $this->input('template_key');

        if ($templateKeyValue === null || $templateKeyValue === '') {
            return [
                'data' => ['nullable', 'array'],
            ];
        }

        $service = app(TemplateValidationService::class);

        $templateKey = TemplateKey::fromString((string) $templateKeyValue);

        $dataRules = $service->buildRulesForTemplateKey($templateKey);

        return [
            'data' => ['nullable', 'array'],
            'data.*' => [], // placeholder to keep structure valid
            ...$dataRules,
        ];
    }
}
