<?php

declare(strict_types=1);

namespace App\Modules\ContactChannels\Http\Requests\ContactChannelTranslation;

use App\Modules\ContactChannels\Application\Services\SupportedLocalesResolver;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

final class UpdateContactChannelTranslationRequest extends FormRequest
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
        $channel = $this->route('contactChannel');
        $baseLocale = $channel?->locale;

        $locale = $this->route('locale');

        if ($locale) {
            $this->merge([
                'locale' => $locale,
            ]);
        }

        return [
            'locale' => [
                'required',
                'string',
                'max:20',
                Rule::in($supported),
                Rule::notIn($baseLocale ? [$baseLocale] : []),
            ],
            'label' => [
                'required',
                'string',
                'max:255',
            ],
        ];
    }
}
