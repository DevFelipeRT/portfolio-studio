// resources/js/Navigation/styles.ts
import { navigationMenuTriggerStyle } from '@/Components/Ui/navigation-menu';

export function desktopItemClass(isActive: boolean | undefined): string {
    const base = 'border-l-3 md:border-l-0 md:border-b-3 transition';
    const active = 'border-primary';
    const inactive = 'border-transparent';
    return [base, isActive ? active : inactive].join(' ');
}

export function desktopTriggerClass(isActive: boolean | undefined): string {
    const base = navigationMenuTriggerStyle();
    const active = 'text-accent-foreground';
    const inactive =
        'text-muted-foreground hover:text-foreground hover:bg-muted md:hover:bg-transparent';
    return [base, isActive ? active : inactive].join(' ');
}

export function mobileWrapperClass(isActive: boolean | undefined): string {
    const base = 'w-full pl-2 transition-all';
    const active = 'border-l-3 md:border-l-0 md:border-b-3 border-primary';
    const inactive =
        'border-l-3 md:border-l-0 md:border-b-3 border-transparent';
    return [base, isActive ? active : inactive].join(' ');
}

export function mobileButtonClass(isActive: boolean | undefined): string {
    const base =
        'w-full rounded-md px-3 py-2 text-sm font-medium transition transition-colors';
    const active = 'text-accent-foreground hover:bg-transparent';
    const inactive =
        'text-muted-foreground hover:text-foreground hover:bg-transparent hover:outline hover:outline-primary/80';
    return [base, isActive ? active : inactive].join(' ');
}

export function submenuLinkClass(isActive: boolean | undefined): string {
    const base =
        'block rounded-md px-3 py-2 text-sm leading-tight transition transition-colors';
    const active = 'bg-primary text-primary-foreground';
    const inactive =
        'text-muted-foreground hover:bg-muted hover:text-foreground';
    return [base, isActive ? active : inactive].join(' ');
}
