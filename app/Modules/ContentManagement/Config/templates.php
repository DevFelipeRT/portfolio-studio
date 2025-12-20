<?php

declare(strict_types=1);

/**
 * Aggregates template definitions for the ContentManagement module.
 *
 * Each file inside the Templates directory must return a single
 * template definition array with a non-empty "key".
 *
 * @return array<int,array<string,mixed>>
 */
$baseDir = dirname(__DIR__) . '/Templates';

if (!is_dir($baseDir)) {
    throw new RuntimeException(
        sprintf('ContentManagement templates directory not found: [%s].', $baseDir),
    );
}

$files = glob($baseDir . '/*.php') ?: [];

if ($files === []) {
    throw new RuntimeException(
        sprintf('No template definition files found in directory: [%s].', $baseDir),
    );
}

$templates = [];
$seenKeys = [];

/** @var string $file */
foreach ($files as $file) {
    $definition = require $file;

    if (!is_array($definition)) {
        throw new RuntimeException(
            sprintf('Template file [%s] must return an array definition.', $file),
        );
    }

    $key = $definition['key'] ?? null;

    if (!is_string($key) || $key === '') {
        throw new RuntimeException(
            sprintf('Template file [%s] must define a non-empty "key".', $file),
        );
    }

    if (isset($seenKeys[$key])) {
        throw new RuntimeException(
            sprintf(
                'Duplicate template key [%s] detected in [%s] and [%s].',
                $key,
                $seenKeys[$key],
                $file,
            ),
        );
    }

    $seenKeys[$key] = $file;
    $templates[] = $definition;
}

return $templates;
