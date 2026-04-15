import type { ComponentType } from 'react';

type ProjectOverlayHeaderLinkProps = {
  href: string;
  icon: ComponentType<{ className?: string }>;
  label: string;
};

export function ProjectOverlayHeaderLink({
  href,
  icon: Icon,
  label,
}: ProjectOverlayHeaderLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="text-primary hover:bg-muted/40 inline-flex h-8 items-center gap-2 rounded-md border px-3 text-xs font-medium"
    >
      <Icon className="h-3.5 w-3.5" />
      <span>{label}</span>
    </a>
  );
}
