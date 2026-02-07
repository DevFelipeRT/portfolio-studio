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
  const inactive =
    'text-muted-foreground hover:text-foreground hover:bg-muted md:hover:bg-transparent';
  return [base, isActive ? '' : inactive].join(' ');
}

export function mobileWrapperClass(isActive: boolean | undefined): string {
  const base = 'w-full pl-2 transition-all';
  const active =
    'border-l-3 md:border-l-0 md:border-b-3 border-primary bg-gradient-to-r from-primary/50';
  const inactive = 'border-l-3 md:border-l-0 md:border-b-3 border-transparent';
  return [base, isActive ? active : inactive].join(' ');
}

export function mobileTriggerClass(isActive: boolean | undefined): string {
  const base =
    'w-full px-3 rounded-l-none py-2 text-sm justify-start font-medium transition transition-colors focus:text-accent focus-visible:text-accent border-b';
  const active =
    'text-primary focus-visible:text-accent hover:bg-transparent border-primary';
  const inactive = 'text-muted-foreground hover:bg-transparent border-border';
  return [base, isActive ? active : inactive].join(' ');
}

export function mobileButtonClass(isActive: boolean | undefined): string {
  const base =
    'flex w-full max-w-35 xs:max-w-3xs px-3 rounded-l-none py-2 text-sm justify-start font-medium transition transition-colors focus:text-white';
  const active =
    'text-white focus-visible:text-white hover:text-white hover:bg-transparent drop-shadow-xs drop-shadow-primary-shadow-soft';
  const inactive =
    'text-muted-foreground hover:text-foreground hover:bg-transparent';
  return [base, isActive ? active : inactive].join(' ');
}

export function submenuLinkClass(isActive: boolean | undefined): string {
  const base =
    'block w-full text-nowrap rounded-md px-3 py-2 text-sm leading-tight text-left transition transition-colors';
  const active = 'bg-primary text-primary-foreground';
  const inactive = 'text-muted-foreground hover:bg-muted hover:text-foreground';
  return [base, isActive ? active : inactive].join(' ');
}
