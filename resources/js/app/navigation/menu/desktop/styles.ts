import { navigationMenuTriggerStyle } from '@/components/ui/navigation-menu';

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

export function submenuLinkClass(isActive: boolean | undefined): string {
  const base =
    'block w-full text-nowrap rounded-md px-3 py-2 text-sm leading-tight text-left transition transition-colors';
  const active = 'bg-primary text-primary-foreground';
  const inactive = 'text-muted-foreground hover:bg-muted hover:text-foreground';
  return [base, isActive ? active : inactive].join(' ');
}

export const desktopSubmenuContentClass =
  'bg-popover mt-0.5 rounded-md rounded-tl-none border p-2 shadow-lg';
