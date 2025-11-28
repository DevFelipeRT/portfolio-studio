'use client';

import { Moon, Sun } from 'lucide-react';

import { useTheme } from '@/Components/Theme/ThemeProvider';
import { Button } from '@/Components/Ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuTrigger,
} from '@/Components/Ui/dropdown-menu';
import { NAMESPACES } from '@/i18n/config/namespaces';
import { useTranslation } from '@/i18n/react/useTranslation';

/**
 * ModeToggle renders an accessible theme switcher backed by the global
 * theme provider and using i18n labels from the common namespace.
 */
export function ModeToggle() {
    const { theme, setTheme } = useTheme();
    const { translate } = useTranslation(NAMESPACES.common);

    const currentTheme = theme ?? 'system';

    const triggerLabel = translate('themeToggle.label', 'Theme');
    const lightLabel = translate('themeToggle.light', 'Light');
    const darkLabel = translate('themeToggle.dark', 'Dark');
    const systemLabel = translate('themeToggle.system', 'System');

    const handleThemeChange = (value: string): void => {
        if (value === 'light' || value === 'dark' || value === 'system') {
            setTheme(value);
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    aria-label={triggerLabel}
                    className="hover:text-primary bg-transparent focus-visible:ring-0"
                >
                    <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
                    <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuRadioGroup
                    value={currentTheme}
                    onValueChange={handleThemeChange}
                    aria-label={triggerLabel}
                >
                    <DropdownMenuRadioItem value="light">
                        {lightLabel}
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="dark">
                        {darkLabel}
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="system">
                        {systemLabel}
                    </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
