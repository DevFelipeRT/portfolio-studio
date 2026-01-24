<?php

declare(strict_types=1);

namespace App\Modules\WebsiteSettings\Http\Requests\WebsiteSettings;

use Illuminate\Foundation\Http\FormRequest;

final class UpdateWebsiteSettingsRequest extends FormRequest
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
        return [
            'site_name' => ['sometimes', 'array'],
            'site_name.*' => ['nullable', 'string', 'max:255'],
            'site_description' => ['sometimes', 'array'],
            'site_description.*' => ['nullable', 'string', 'max:500'],
            'owner_name' => ['nullable', 'string', 'max:255'],
            'default_locale' => ['sometimes', 'string', 'max:20'],
            'fallback_locale' => ['sometimes', 'string', 'max:20'],
            'canonical_base_url' => ['nullable', 'string', 'max:255', 'url'],
            'meta_title_template' => ['sometimes', 'string', 'max:255'],
            'default_meta_title' => ['sometimes', 'array'],
            'default_meta_title.*' => ['nullable', 'string', 'max:255'],
            'default_meta_description' => ['sometimes', 'array'],
            'default_meta_description.*' => ['nullable', 'string', 'max:500'],
            'default_meta_image_id' => ['nullable', 'integer', 'exists:images,id'],
            'default_og_image_id' => ['nullable', 'integer', 'exists:images,id'],
            'default_twitter_image_id' => ['nullable', 'integer', 'exists:images,id'],
            'robots' => ['sometimes', 'array'],
            'robots.public' => ['sometimes', 'array'],
            'robots.public.index' => ['sometimes', 'boolean'],
            'robots.public.follow' => ['sometimes', 'boolean'],
            'robots.private' => ['sometimes', 'array'],
            'robots.private.index' => ['sometimes', 'boolean'],
            'robots.private.follow' => ['sometimes', 'boolean'],
            'system_pages' => ['sometimes', 'array'],
            'institutional_links' => ['sometimes', 'array'],
            'institutional_links.*.label' => ['nullable', 'string', 'max:255'],
            'institutional_links.*.url' => ['nullable', 'string', 'max:2048', 'url'],
            'public_scope_enabled' => ['sometimes', 'boolean'],
            'private_scope_enabled' => ['sometimes', 'boolean'],
        ];
    }

}
