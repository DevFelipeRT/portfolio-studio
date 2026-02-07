// resources/js/Layouts/Partials/MobileSidebar.tsx
'use client';

import { Button } from '@/Components/Ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/Components/Ui/sheet';
import { UserMenu } from '@/app/layouts/partials/UserMenu';
import { useIsMobile } from '@/hooks/use-mobile';
import { Menu } from 'lucide-react';
import type { ReactNode } from 'react';
import { useEffect } from 'react';

type MobileSidebarProps = {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  openNavigationLabel: string;
  mobileNavigationTitle: string;
  user?: {
    name: string;
    email: string;
    avatar?: string | null;
  } | null;
  children: ReactNode;
};

export function MobileSidebar({
  isOpen,
  setIsOpen,
  openNavigationLabel,
  mobileNavigationTitle,
  user,
  children,
}: MobileSidebarProps) {
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!isMobile) {
      setIsOpen(false);
    }
  }, [isMobile, setIsOpen]);

  return (
    <div className="flex items-center md:hidden">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="data-[state=open]:bg-accent rounded-md data-[state=closed]:ring-0"
            aria-label={openNavigationLabel}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>

        <SheetContent
          side="left"
          className="bg-background/80 supports-backdrop-filter:bg-background/60 flex w-64 max-w-[80dvw] min-w-fit flex-col gap-4 p-0 pt-12 backdrop-blur-sm"
        >
          <SheetHeader className="px-6">
            <SheetTitle className="text-left">
              {mobileNavigationTitle}
            </SheetTitle>
          </SheetHeader>

          {children}

          {user && (
            <div className="border-border mt-auto w-[var(--radix-dropdown-menu-trigger-width)] border-t p-2 md:hidden">
              <UserMenu user={user} variant="full" />
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
