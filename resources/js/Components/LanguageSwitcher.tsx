'use client';

import { Button } from '@/Components/Ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuTrigger,
} from '@/Components/Ui/dropdown-menu';
import { NAMESPACES } from '@/i18n/config/namespaces';
import { useSetLocale } from '@/i18n/react/hooks/useSetLocale';
import { useTranslation } from '@/i18n/react/hooks/useTranslation';
import { usePage } from '@inertiajs/react';
import { Languages } from 'lucide-react';
import { MouseEvent } from 'react';

type LocalizationProps = {
    currentLocale?: string;
    supportedLocales?: string[];
    defaultLocale?: string;
    fallbackLocale?: string;
};

type SharedProps = {
    localization?: LocalizationProps;
};

type LanguageSwitcherProps = {
    cookieName?: string;
    maxAgeDays?: number;
};

/**
 * LanguageSwitcher renders a language selector that updates
 * the active locale using the i18n context and persists the preference in a cookie.
 * When i18n is not fully configured yet, it falls back to English labels.
 */
export function LanguageSwitcher({
    cookieName = 'locale',
    maxAgeDays = 30,
}: LanguageSwitcherProps) {
    const { translate, locale: activeLocale } = useTranslation(
        NAMESPACES.common,
    );
    const page = usePage().props as SharedProps;

    const localization = page.localization ?? {};
    const supportedLocales = localization.supportedLocales ?? [];

    const setLocaleAndPersist = useSetLocale({
        cookieName,
        maxAgeDays,
    });

    const handleTriggerClick = (event: MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
    };

    if (!supportedLocales.length) {
        return null;
    }

    const ariaLabel = translate(
        'languageSwitcher.ariaLabel',
        `Change language (current: ${activeLocale})`,
        { locale: activeLocale },
    );

    const menuLabel = translate('languageSwitcher.label', 'Language');

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="sm"
                    aria-label={ariaLabel}
                    className="inline-flex items-center gap-1.5"
                    onClick={handleTriggerClick}
                >
                    <Languages className="h-4 w-4" />
                    <span className="text-muted-foreground text-xs">
                        {formatLocaleShortLabel(activeLocale)}
                    </span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>{menuLabel}</DropdownMenuLabel>
                <DropdownMenuRadioGroup
                    value={activeLocale}
                    onValueChange={setLocaleAndPersist}
                >
                    {supportedLocales.map((code) => (
                        <DropdownMenuRadioItem key={code} value={code}>
                            {formatLocaleLabel(code)}
                        </DropdownMenuRadioItem>
                    ))}
                </DropdownMenuRadioGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

/**
 * Returns a human-readable label for a locale code.
 */
function formatLocaleLabel(code: string): string {
    switch (code) {
        case 'pt_BR':
            return 'Português (Brasil)';
        case 'en':
            return 'English';
        default:
            return code;
    }
}

/**
 * Returns a compact label for the currently selected locale.
 */
function formatLocaleShortLabel(code: string): string {
    switch (code) {
        case 'pt_BR':
            return 'pt_BR';
        case 'en':
            return 'en';
        default:
            return code;
    }
}
