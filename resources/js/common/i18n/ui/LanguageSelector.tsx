import { MouseEvent } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Languages } from 'lucide-react';

type LanguageSelectorProps = {
  activeLocale: string;
  locales: string[];
  ariaLabel: string;
  menuLabel: string;
  onSelect(locale: string): void;
  formatLabel(code: string): string;
  formatShortLabel(code: string): string;
};

/**
 * LanguageSelector renders a language selector that updates
 * the active locale using the i18n context and persists the preference in a cookie.
 * When i18n is not fully configured yet, it falls back to English labels.
 */
export function LanguageSelector({
  activeLocale,
  locales,
  ariaLabel,
  menuLabel,
  onSelect,
  formatLabel,
  formatShortLabel,
}: LanguageSelectorProps) {
  const handleTriggerClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
  };

  if (!locales.length) {
    return null;
  }

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
            {formatShortLabel(activeLocale)}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{menuLabel}</DropdownMenuLabel>
        <DropdownMenuRadioGroup value={activeLocale} onValueChange={onSelect}>
          {locales.map((code) => (
            <DropdownMenuRadioItem key={code} value={code}>
              {formatLabel(code)}
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
