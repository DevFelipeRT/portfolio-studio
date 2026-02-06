<?php

declare(strict_types=1);

namespace App\Modules\ContactChannels\Http\Requests\ContactChannel;

use App\Modules\ContactChannels\Application\Services\SupportedLocalesResolver;
use App\Modules\ContactChannels\Domain\Enums\ContactChannelType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class UpdateContactChannelRequest extends FormRequest
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
        $types = array_map(static fn(ContactChannelType $type) => $type->value, ContactChannelType::cases());
        $supported = app(SupportedLocalesResolver::class)->resolve();

        return [
            'locale' => [
                'required',
                'string',
                'max:20',
                Rule::in($supported),
            ],
            'confirm_swap' => ['sometimes', 'boolean'],
            'channel_type' => ['required', 'string', Rule::in($types)],
            'label' => ['nullable', 'string', 'max:255', 'required_if:channel_type,custom'],
            'value' => ['required', 'string', 'max:2048'],
            'is_active' => ['sometimes', 'boolean'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator): void {
            $this->validateChannelValue($validator);
        });
    }

    private function validateChannelValue(Validator $validator): void
    {
        $type = (string) $this->input('channel_type');
        $value = (string) $this->input('value');

        if ($value === '') {
            return;
        }

        $contactType = ContactChannelType::tryFrom($type);

        if ($contactType === null) {
            return;
        }

        switch ($contactType) {
            case ContactChannelType::Email:
                if (!filter_var($value, FILTER_VALIDATE_EMAIL)) {
                    $validator->errors()->add('value', 'Value must be a valid email address.');
                }
                break;
            case ContactChannelType::Phone:
            case ContactChannelType::WhatsApp:
                $digits = preg_replace('/[^0-9]/', '', $value) ?? '';
                if (strlen($digits) < 8) {
                    $validator->errors()->add('value', 'Value must contain a valid phone number.');
                }
                break;
            case ContactChannelType::GitHub:
            case ContactChannelType::LinkedIn:
                if ($this->isUrl($value)) {
                    break;
                }
                if (!preg_match('/^[A-Za-z0-9._-]{2,}$/', ltrim($value, '@'))) {
                    $validator->errors()->add('value', 'Value must be a valid handle or URL.');
                }
                break;
            case ContactChannelType::Custom:
                if (!$this->isUrl($value)) {
                    $validator->errors()->add('value', 'Value must be a valid URL.');
                }
                break;
        }
    }

    private function isUrl(string $value): bool
    {
        return filter_var($value, FILTER_VALIDATE_URL) !== false;
    }
}
