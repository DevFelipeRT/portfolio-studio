import type {
    Placeholder,
    TranslationTemplate,
} from '../types';

/**
 * Analyzes a string and returns a TranslationTemplate when placeholders are present.
 */
export function analyzeTranslationValue(
    value: string,
): TranslationTemplate | null {
    const placeholders = extractPlaceholders(value);
    if (placeholders.length === 0) {
        return null;
    }

    return {
        value,
        placeholders,
    };
}

function extractPlaceholders(value: string): Placeholder[] {
    const placeholders: Placeholder[] = [];
    const pattern = /{{\s*([\w.-]+)\s*}}/g;

    let match: RegExpExecArray | null;
    while ((match = pattern.exec(value)) !== null) {
        placeholders.push({
            identifier: match[1] ?? '',
            raw: match[0],
        });
    }

    return placeholders.filter((placeholder) => placeholder.identifier !== '');
}
