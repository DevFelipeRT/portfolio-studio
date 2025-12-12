<?php

declare(strict_types=1);

namespace App\Modules\ContentManagement\Domain\Template;

use App\Modules\ContentManagement\Domain\ValueObjects\SlotName;
use App\Modules\ContentManagement\Domain\ValueObjects\TemplateKey;
use InvalidArgumentException;

/**
 * In-memory catalog for content templates.
 *
 * This registry provides lookup operations for TemplateDefinition
 * instances, allowing services and validation layers to resolve
 * template metadata by key or by allowed slot.
 */
final class TemplateRegistry
{
    /**
     * @var array<string,TemplateDefinition>
     */
    private array $definitionsByKey;

    /**
     * @param array<int,TemplateDefinition> $definitions
     */
    public function __construct(array $definitions)
    {
        $this->definitionsByKey = [];

        foreach ($definitions as $definition) {
            $keyString = (string) $definition->key();

            if (isset($this->definitionsByKey[$keyString])) {
                throw new InvalidArgumentException(sprintf(
                    'Duplicate template key detected: "%s".',
                    $keyString,
                ));
            }

            $this->definitionsByKey[$keyString] = $definition;
        }
    }

    /**
     * Creates a registry from an array of TemplateDefinition instances.
     *
     * @param array<int,TemplateDefinition> $definitions
     */
    public static function fromDefinitions(array $definitions): self
    {
        return new self($definitions);
    }

    /**
     * Resolves a template definition by its key.
     *
     * @throws InvalidArgumentException
     */
    public function get(TemplateKey|string $key): TemplateDefinition
    {
        $keyString = $key instanceof TemplateKey ? $key->value() : trim($key);

        if ($keyString === '') {
            throw new InvalidArgumentException('Template key must not be empty.');
        }

        $definition = $this->definitionsByKey[$keyString] ?? null;

        if ($definition === null) {
            throw new InvalidArgumentException(sprintf(
                'Unknown template key: "%s".',
                $keyString,
            ));
        }

        return $definition;
    }

    /**
     * Safely attempts to resolve a template definition by its key.
     *
     * Returns null when no definition exists for the given key.
     */
    public function find(TemplateKey|string $key): ?TemplateDefinition
    {
        $keyString = $key instanceof TemplateKey ? $key->value() : trim($key);

        if ($keyString === '') {
            return null;
        }

        return $this->definitionsByKey[$keyString] ?? null;
    }

    /**
     * Returns all registered template definitions.
     *
     * @return array<int,TemplateDefinition>
     */
    public function all(): array
    {
        return array_values($this->definitionsByKey);
    }

    /**
     * Returns all templates allowed for the given slot.
     *
     * @return array<int,TemplateDefinition>
     */
    public function forSlot(SlotName|string $slot): array
    {
        $slotName = $slot instanceof SlotName
            ? $slot->value()
            : trim($slot);

        if ($slotName === '') {
            return [];
        }

        $result = [];

        foreach ($this->definitionsByKey as $definition) {
            foreach ($definition->allowedSlots() as $allowedSlot) {
                if ($allowedSlot->value() === $slotName) {
                    $result[] = $definition;
                    break;
                }
            }
        }

        return $result;
    }

    /**
     * Factory method to build a registry from a configuration array.
     *
     * The expected structure for each entry is:
     * [
     *     'key'           => string,
     *     'label'         => string,
     *     'description'   => string|null,
     *     'allowed_slots' => string[]|null,
     *     'fields'        => array<int,array{
     *         name: string,
     *         label: string,
     *         type: string,
     *         required?: bool,
     *         default?: mixed,
     *         validation?: string|string[],
     *     }>,
     * ]
     *
     * @param array<int,array<string,mixed>> $config
     */
    public static function fromConfigArray(array $config): self
    {
        $definitions = [];

        foreach ($config as $entry) {
            $templateKey = TemplateKey::fromString((string) ($entry['key'] ?? ''));
            $label = (string) ($entry['label'] ?? '');
            $description = array_key_exists('description', $entry)
                ? (string) $entry['description']
                : null;

            $rawSlots = $entry['allowed_slots'] ?? [];
            $allowedSlots = [];

            if (is_array($rawSlots)) {
                foreach ($rawSlots as $slot) {
                    $allowedSlots[] = SlotName::fromString((string) $slot);
                }
            }

            $rawFields = $entry['fields'] ?? [];
            $fields = [];

            if (is_array($rawFields)) {
                foreach ($rawFields as $fieldConfig) {
                    $validation = $fieldConfig['validation'] ?? [];

                    if (is_string($validation)) {
                        $validation = [$validation];
                    }

                    $fields[] = new TemplateField(
                        name: (string) ($fieldConfig['name'] ?? ''),
                        label: (string) ($fieldConfig['label'] ?? ''),
                        type: (string) ($fieldConfig['type'] ?? ''),
                        required: (bool) ($fieldConfig['required'] ?? false),
                        defaultValue: $fieldConfig['default'] ?? null,
                        validationRules: is_array($validation) ? $validation : [],
                    );
                }
            }

            $definitions[] = new TemplateDefinition(
                key: $templateKey,
                label: $label,
                description: $description,
                allowedSlots: $allowedSlots,
                fields: $fields,
            );
        }

        return new self($definitions);
    }
}
