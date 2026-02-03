<?php

declare(strict_types=1);

namespace App\Modules\Experiences\Http\Requests\Experience;

use App\Modules\Experiences\Application\Services\SupportedLocalesResolver;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * Form request for storing a new experience.
 */
class StoreExperienceRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        $supported = app(SupportedLocalesResolver::class)->resolve();

        return [
            'locale' => ['required', 'string', 'max:20', Rule::in($supported)],
            'position' => ['required', 'string', 'max:255'],
            'company' => ['required', 'string', 'max:255'],
            'summary' => ['nullable', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'start_date' => ['required', 'date'],
            'end_date' => ['nullable', 'date', 'after_or_equal:start_date'],
            'display' => ['required', 'boolean'],
        ];
    }
}
