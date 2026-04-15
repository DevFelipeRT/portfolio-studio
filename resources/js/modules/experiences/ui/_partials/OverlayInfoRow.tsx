import type { ReactNode } from 'react';

type OverlayInfoRowProps = {
  label: string;
  value: ReactNode;
};

export function OverlayInfoRow({ label, value }: OverlayInfoRowProps) {
  return (
    <div className="space-y-1">
      <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
        {label}
      </p>
      <div className="text-sm">{value}</div>
    </div>
  );
}
