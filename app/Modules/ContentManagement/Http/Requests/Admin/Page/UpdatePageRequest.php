<?php

declare(strict_types=1);

namespace App\Modules\ContentManagement\Http\Requests\Admin\Page;

use App\Modules\ContentManagement\Domain\Models\Page;
use Illuminate\Foundation\Http\FormRequest;

final class UpdatePageRequest extends FormRequest
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
        /** @var Page|null $page */
        $page = $this->route('page');
        $pageId = $page instanceof Page ? $page->id : null;

        $pageTable = (new Page())->getTable();

        return [
            'slug' => [
                'required',
                'string',
                'max:191',
                'regex:/^[a-z0-9\-]+$/',
                'unique:' . $pageTable . ',slug,' . $pageId . ',id,locale,' . $this->input('locale'),
            ],
            'internal_name' => [
                'required',
                'string',
                'max:191',
            ],
            'title' => [
                'required',
                'string',
                'max:255',
            ],
            'meta_title' => [
                'nullable',
                'string',
                'max:255',
            ],
            'meta_description' => [
                'nullable',
                'string',
                'max:1000',
            ],
            'meta_image_id' => [
                'nullable',
                'integer',
                'exists:images,id',
            ],
            'layout_key' => [
                'nullable',
                'string',
                'max:191',
            ],
            'locale' => [
                'required',
                'string',
                'max:10',
            ],
            'is_published' => [
                'sometimes',
                'boolean',
            ],
            'is_indexable' => [
                'sometimes',
                'boolean',
            ],
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'is_published' => $this->boolean('is_published'),
            'is_indexable' => $this->boolean('is_indexable'),
        ]);
    }
}
