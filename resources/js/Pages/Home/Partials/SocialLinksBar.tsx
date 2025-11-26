import { Button } from '@/Components/Ui/button';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/Components/Ui/tooltip';
import { ReactNode } from 'react';

export interface SocialLinkItem {
    label: string;
    href: string;
    icon: ReactNode;
    'aria-label'?: string;
}

interface SocialLinksBarProps {
    items: SocialLinkItem[];
    dense?: boolean;
}

/**
 * SocialLinksBar renders a horizontal row of icon buttons for social or external profiles.
 */
export function SocialLinksBar({ items, dense }: SocialLinksBarProps) {
    const size = dense ? 'sm' : 'default';
    const iconSize = dense ? 'h-4 w-4' : 'h-5 w-5';

    if (!items.length) {
        return null;
    }

    return (
        <TooltipProvider>
            <div className="flex flex-wrap items-center gap-1.5">
                {items.map((item) => (
                    <Tooltip key={item.href}>
                        <TooltipTrigger asChild>
                            <Button
                                asChild
                                variant="ghost"
                                size="icon"
                                aria-label={item['aria-label'] ?? item.label}
                            >
                                <a
                                    href={item.href}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    <span className={iconSize}>
                                        {item.icon}
                                    </span>
                                </a>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p className="text-xs">{item.label}</p>
                        </TooltipContent>
                    </Tooltip>
                ))}
            </div>
        </TooltipProvider>
    );
}
