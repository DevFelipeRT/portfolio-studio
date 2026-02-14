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

export const mobileSubmenuContainerClass = 'flex flex-col gap-1 pl-3';
export const mobileSubmenuChildrenClass = 'flex flex-col gap-1 pl-2';
