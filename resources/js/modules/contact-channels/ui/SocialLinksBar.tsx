// resources/js/Modules/ContactChannels/ui/SocialLinksBar.tsx
import { NAMESPACES, useTranslation } from '@/common/i18n';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import type { ComponentType, SVGProps } from 'react';

export interface SocialLinkItem {
  label: string;
  href: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  'aria-label'?: string;
  translationKey?: string;
}

interface SocialLinksBarProps {
  items: SocialLinkItem[];
  dense?: boolean;
}

/**
 * SocialLinksBar renders a horizontal row of icon buttons for social or external profiles.
 */
export function SocialLinksBar({ items, dense }: SocialLinksBarProps) {
  const { translate } = useTranslation(NAMESPACES.contactChannels);

  const size = dense ? 'sm' : 'default';
  const iconSize = dense ? 'h-4 w-4' : 'h-5 w-5';

  if (!items.length) {
    return null;
  }

  return (
    <TooltipProvider>
      <div className="flex flex-wrap items-center gap-1.5">
        {items.map((item) => {
          const Icon = item.icon;
          const resolvedLabel = item.translationKey
            ? translate(item.translationKey, item.label)
            : item.label;

          return (
            <Tooltip key={item.href || resolvedLabel}>
              <TooltipTrigger asChild>
                <Button
                  asChild
                  variant="ghost"
                  size={size}
                  aria-label={item['aria-label'] ?? resolvedLabel}
                  className="group hover:text-primary"
                >
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    className="group-hover:text-primary"
                  >
                    <Icon className={iconSize} aria-hidden="true" />
                  </a>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">{resolvedLabel}</p>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </TooltipProvider>
  );
}
