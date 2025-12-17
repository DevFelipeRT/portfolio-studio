<?php

declare(strict_types=1);

namespace App\Modules\ContentManagement\Application\Services\Templates;

use App\Modules\ContentManagement\Domain\Templates\TemplateDefinition;
use App\Modules\ContentManagement\Domain\Templates\TemplateRegistry;
use App\Modules\ContentManagement\Domain\ValueObjects\TemplateKey;

/**
 * Application-level service for building validation rules and
 * normalized payloads based on template definitions.
 *
 * This service does not execute validation. It generates rule
 * structures that can be consumed by FormRequests or other
 * validation mechanisms.
 */
final class TemplateValidationService
{
    public function __construct(
        private readonly TemplateRegistry $templateRegistry,
    ) {
    }

    /**
     * Resolves the template definition for the given key.
     */
    public function getDefinitionForKey(TemplateKey|string $key): TemplateDefinition
    {
        $templateKey = $key instanceof TemplateKey
            ? $key
            : TemplateKey::fromString((string) $key);

        return $this->templateRegistry->get($templateKey);
    }

    /**
     * Builds validation rules for all fields of the template identified by the given key.
     *
     * The rules are returned in a structure suitable for Laravel validation,
     * using a configurable data root (for example, "data").
     *
     * Example of returned structure:
     * [
     *     'data.headline' => ['required', 'string', 'max:120'],
     *     'data.subheadline' => ['nullable', 'string'],
     * ]
     *
     * @return array<string,array<int,string>>
     */
    public function buildRulesForTemplateKey(
        TemplateKey|string $key,
        string $dataRoot = 'data',
    ): array {
        $definition = $this->getDefinitionForKey($key);

        return $this->buildRulesForDefinition($definition, $dataRoot);
    }

    /**
     * Builds validation rules for all fields of the given template definition.
     *
     * Rules are derived from:
     *  - field.required: drives required/nullable when no explicit presence rule is defined;
     *  - field.type: provides a base type rule when no explicit type rule is defined;
     *  - field.validationRules(): additional rules from template configuration.
     *
     * @return array<string,array<int,string>>
     */
    public function buildRulesForDefinition(
        TemplateDefinition $definition,
        string $dataRoot = 'data',
    ): array {
        $rules = [];

        foreach ($definition->fields() as $field) {
            $fieldPath = sprintf('%s.%s', $dataRoot, $field->name());

            $explicitRules = $field->validationRules();
            $fieldRules = [];

            // 1) Presence rule (required/nullable), unless already defined explicitly
            if (!$this->hasPresenceRule($explicitRules)) {
                if ($field->isRequired()) {
                    $fieldRules[] = 'required';
                } else {
                    $fieldRules[] = 'nullable';
                }
            }

            // 2) Base type rule, unless already present explicitly
            $baseTypeRule = $this->mapTypeToBaseRule($field->type());

            if ($baseTypeRule !== null && !$this->hasTypeRule($explicitRules, $baseTypeRule)) {
                $fieldRules[] = $baseTypeRule;
            }

            // 3) Additional explicit rules from template configuration
            foreach ($explicitRules as $rule) {
                $fieldRules[] = $rule;
            }

            if ($fieldRules !== []) {
                $rules[$fieldPath] = $fieldRules;
            }
        }

        return $rules;
    }

    /**
     * Normalizes a data payload for the template identified by the given key.
     *
     * This method applies default values for missing fields according to
     * the template definition. It does not perform type coercion.
     *
     * @param array<string,mixed> $data
     * @return array<string,mixed>
     */
    public function normalizeDataForTemplateKey(
        TemplateKey|string $key,
        array $data,
    ): array {
        $definition = $this->getDefinitionForKey($key);

        return $this->normalizeDataForDefinition($definition, $data);
    }

    /**
     * Normalizes a data payload for the given template definition.
     *
     * @param array<string,mixed> $data
     * @return array<string,mixed>
     */
    public function normalizeDataForDefinition(
        TemplateDefinition $definition,
        array $data,
    ): array {
        $normalized = $data;

        foreach ($definition->fields() as $field) {
            $name = $field->name();

            if (!array_key_exists($name, $normalized)) {
                $normalized[$name] = $field->defaultValue();
            }
        }

        return $normalized;
    }

    /**
     * Checks if a rule set already defines presence semantics.
     *
     * @param array<int,string> $rules
     */
    private function hasPresenceRule(array $rules): bool
    {
        foreach ($rules as $rule) {
            if ($rule === 'required' || $rule === 'nullable' || $rule === 'sometimes') {
                return true;
            }
        }

        return false;
    }

    /**
     * Maps a template field type to a base Laravel validation rule.
     */
    private function mapTypeToBaseRule(string $type): ?string
    {
        return match ($type) {
            'string', 'text', 'rich_text' => 'string',
            'integer' => 'integer',
            'boolean' => 'boolean',
            'array', 'array_integer' => 'array',
            default => null,
        };
    }

    /**
     * Checks if a rule set already defines a base type rule compatible with the given rule.
     *
     * @param array<int,string> $rules
     */
    private function hasTypeRule(array $rules, string $baseTypeRule): bool
    {
        foreach ($rules as $rule) {
            if ($rule === $baseTypeRule) {
                return true;
            }
        }

        return false;
    }
}
