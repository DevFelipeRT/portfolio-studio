<?php

declare(strict_types=1);

/**
 * Aggregates template definitions for the ContentManagement module.
 *
 * Each template definition file must return a single template definition
 * array with a non-empty "key".
 *
 * @return array<int,array<string,mixed>>
 */
$originPaths = $templateOrigins ?? [resource_path('templates')];

if (!is_array($originPaths)) {
    $originPaths = [];
}

$originPaths = array_values(array_filter(
    $originPaths,
    static fn(mixed $path): bool => is_string($path) && $path !== '',
));

$originDirs = [];

$originHasTemplates = static function (string $originDir): bool {
    $templateDirs = glob($originDir . '/*', GLOB_ONLYDIR) ?: [];

    foreach ($templateDirs as $templateDir) {
        $templateName = basename($templateDir);
        $templateFile = $templateDir . '/' . $templateName . '.php';

        if (is_file($templateFile)) {
            return true;
        }
    }

    return false;
};

foreach ($originPaths as $originPath) {
    $originPath = rtrim($originPath, DIRECTORY_SEPARATOR);

    if (!is_dir($originPath)) {
        continue;
    }

    if ($originHasTemplates($originPath)) {
        $originDirs[] = $originPath;
        continue;
    }

    $candidateOrigins = glob($originPath . '/*', GLOB_ONLYDIR) ?: [];

    foreach ($candidateOrigins as $candidateOrigin) {
        if ($originHasTemplates($candidateOrigin)) {
            $originDirs[] = $candidateOrigin;
        }
    }
}

$originDirs = array_values(array_unique($originDirs));

if ($originDirs === []) {
    throw new RuntimeException(
        'No template origin directories found for ContentManagement.',
    );
}

$templates = [];
$seenKeys = [];

foreach ($originDirs as $originDir) {
    $originName = basename($originDir);
    $templateDirs = glob($originDir . '/*', GLOB_ONLYDIR) ?: [];

    foreach ($templateDirs as $templateDir) {
        $templateName = basename($templateDir);
        $templateFile = $templateDir . '/' . $templateName . '.php';

        if (!is_file($templateFile)) {
            continue;
        }

        $definition = require $templateFile;

        if (!is_array($definition)) {
            throw new RuntimeException(
                sprintf('Template file [%s] must return an array definition.', $templateFile),
            );
        }

        $key = $definition['key'] ?? null;

        if (!is_string($key) || $key === '') {
            throw new RuntimeException(
                sprintf('Template file [%s] must define a non-empty "key".', $templateFile),
            );
        }

        if (isset($seenKeys[$key])) {
            throw new RuntimeException(
                sprintf(
                    'Duplicate template key [%s] detected in [%s] and [%s].',
                    $key,
                    $seenKeys[$key],
                    $templateFile,
                ),
            );
        }

        $seenKeys[$key] = $templateFile;
        $definition['origin'] = $definition['origin'] ?? $originName;
        $definition['template'] = $definition['template'] ?? $templateName;
        $templates[] = $definition;
    }
}

return $templates;
