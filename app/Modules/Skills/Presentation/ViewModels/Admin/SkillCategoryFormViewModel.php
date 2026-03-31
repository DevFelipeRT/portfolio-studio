<?php

declare(strict_types=1);

namespace App\Modules\Skills\Presentation\ViewModels\Admin;

final readonly class SkillCategoryFormViewModel
{
    public function __construct(
        public string $name,
        public string $slug,
        public string $locale,
        public bool $confirmSwap,
    ) {
    }

    /**
     * @param array<string,mixed> $oldInput
     */
    public static function empty(array $oldInput = []): self
    {
        return new self(
            name: (string) ($oldInput['name'] ?? ''),
            slug: (string) ($oldInput['slug'] ?? ''),
            locale: (string) ($oldInput['locale'] ?? ''),
            confirmSwap: array_key_exists('confirm_swap', $oldInput)
                ? (bool) $oldInput['confirm_swap']
                : false,
        );
    }

    /**
     * @param array<string,mixed> $oldInput
     */
    public static function fromCategory(
        SkillCategoryViewModel $category,
        array $oldInput = [],
    ): self {
        return new self(
            name: (string) ($oldInput['name'] ?? $category->name),
            slug: (string) ($oldInput['slug'] ?? $category->slug),
            locale: (string) ($oldInput['locale'] ?? $category->locale),
            confirmSwap: array_key_exists('confirm_swap', $oldInput)
                ? (bool) $oldInput['confirm_swap']
                : false,
        );
    }

    /**
     * @return array{
     *     name:string,
     *     slug:string,
     *     locale:string,
     *     confirm_swap:bool
     * }
     */
    public function toArray(): array
    {
        return [
            'name' => $this->name,
            'slug' => $this->slug,
            'locale' => $this->locale,
            'confirm_swap' => $this->confirmSwap,
        ];
    }
}
