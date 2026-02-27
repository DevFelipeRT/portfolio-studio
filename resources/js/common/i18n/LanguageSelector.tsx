import { NAMESPACES } from '@/common/i18n/config/namespaces';
import { useTranslation } from '@/common/i18n/react/hooks/useTranslation';
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
import { MouseEvent } from 'react';

type LanguageSelectorProps = {
  locales: readonly string[];
  activeLocale?: string;
  onSelect(locale: string): void;
  disabled?: boolean;
  variant?: 'auto' | 'label' | 'short' | 'labelAndShort' | 'ghost';
};

/**
 * LanguageSelector renders a language selector and handles its own
 * i18n/a11y labels.
 */
export function LanguageSelector({
  locales,
  activeLocale,
  onSelect,
  disabled = false,
  variant = 'auto',
}: LanguageSelectorProps) {
  const { translate, locale: contextLocale } = useTranslation(NAMESPACES.i18n);
  const requestedLocale = (activeLocale ?? contextLocale).trim();
  const localeList = Array.from(locales);
  const resolvedActiveLocale = localeList.includes(requestedLocale)
    ? requestedLocale
    : (localeList[0]?.trim() ?? requestedLocale);

  const handleTriggerClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
  };

  if (!locales.length) {
    return null;
  }

  const selectorLabel = translate('languageSwitcher.label', 'Language');
  const ariaLabel = translate(
    'languageSwitcher.ariaLabel',
    `Change language (current: ${resolvedActiveLocale})`,
    { locale: resolvedActiveLocale },
  );

  const formatLabel = (code: string): string =>
    translate(`locales.${code}.label`, code);

  const formatShortLabel = (code: string): string =>
    translate(`locales.${code}.short`, code);

  const triggerShortLabel = formatShortLabel(resolvedActiveLocale);
  const triggerLongLabel = `${selectorLabel}: ${triggerShortLabel}`;

  const triggerContent = (() => {
    switch (variant) {
      case 'ghost':
        return null;
      case 'label':
        return selectorLabel;
      case 'short':
        return triggerShortLabel;
      case 'labelAndShort':
        return triggerLongLabel;
      case 'auto':
      default:
        return (
          <>
            <span className="hidden xs:inline sm:hidden">{triggerShortLabel}</span>
            <span className="hidden sm:inline">{triggerLongLabel}</span>
          </>
        );
    }
  })();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          aria-label={ariaLabel}
          className="inline-flex items-center gap-1.5"
          onClick={handleTriggerClick}
          disabled={disabled}
        >
          <Languages className="h-4 w-4" />
          {triggerContent ? (
            <span className="text-muted-foreground text-xs">
              {triggerContent}
            </span>
          ) : null}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{selectorLabel}</DropdownMenuLabel>
        <DropdownMenuRadioGroup
          value={resolvedActiveLocale}
          onValueChange={onSelect}
        >
          {localeList.map((code) => (
            <DropdownMenuRadioItem key={code} value={code}>
              {formatLabel(code)}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
