<?php

declare(strict_types=1);

namespace App\Modules\ContentManagement\Http\Requests\Admin\PageSection;

use App\Modules\ContentManagement\Application\Services\Templates\TemplateValidationService;
use App\Modules\ContentManagement\Domain\Models\Page;
use App\Modules\ContentManagement\Domain\ValueObjects\TemplateKey;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

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
        $pageId = $this->input('page_id');
        $locale = $this->input('locale');

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
            'navigation_label' => [
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

        $anchor = $this->input('anchor');
        if ($anchor !== null && $anchor !== '' && $pageId !== null) {
            $baseRules['anchor'][] = Rule::unique('page_sections', 'anchor')
                ->where(function ($query) use ($pageId, $locale): void {
                    $query->where('page_id', $pageId);

                    if ($locale === null || $locale === '') {
                        $query->whereNull('locale');
                    } else {
                        $query->where('locale', $locale);
                    }
                });
        }

        $navigationLabel = $this->input('navigation_label');
        if ($navigationLabel !== null && $navigationLabel !== '' && $pageId !== null) {
            $baseRules['navigation_label'][] = Rule::unique('page_sections', 'navigation_label')
                ->where(function ($query) use ($pageId, $locale): void {
                    $query->where('page_id', $pageId);

                    if ($locale === null || $locale === '') {
                        $query->whereNull('locale');
                    } else {
                        $query->where('locale', $locale);
                    }
                });
        }

        $templateRules = $this->buildTemplateDataRules();

        return array_merge(
            $baseRules,
            $templateRules,
        );
    }

    protected function prepareForValidation(): void
    {
        if ($this->has('is_active')) {
            $this->merge([
                'is_active' => $this->boolean('is_active'),
            ]);
        }
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
