import { PageLink } from '@/common/page-runtime';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';

import type { NewButtonProps } from '../types';

export function NewButton({
  href,
  label,
  icon: Icon = Plus,
  className,
}: NewButtonProps) {
  return (
    <Button
      asChild
      size="sm"
      className={cn(
        'h-9 gap-2.5 rounded-md px-3.5 text-sm font-semibold tracking-[-0.01em] shadow-sm',
        '[&_svg]:size-4',
        className,
      )}
    >
      <PageLink href={href}>
        <Icon className="opacity-90" />
        <span className="leading-none whitespace-nowrap">{label}</span>
      </PageLink>
    </Button>
  );
}
