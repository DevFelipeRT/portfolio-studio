import type { ComponentPropsWithoutRef, ReactNode } from 'react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export type ItemDialogRootProps = ComponentPropsWithoutRef<typeof Dialog>;

export type ItemDialogContentProps = ComponentPropsWithoutRef<
  typeof DialogContent
>;

export type ItemDialogHeaderProps = ComponentPropsWithoutRef<
  typeof DialogHeader
>;

export type ItemDialogHeaderRowProps = ComponentPropsWithoutRef<'div'>;

export type ItemDialogMainProps = ComponentPropsWithoutRef<'div'>;

export type ItemDialogTitleProps = ComponentPropsWithoutRef<typeof DialogTitle>;

export type ItemDialogDescriptionProps = ComponentPropsWithoutRef<
  typeof DialogDescription
>;
export type ItemDialogHeadingProps = ComponentPropsWithoutRef<'div'>;

export type ItemDialogBadgesProps = ComponentPropsWithoutRef<'div'>;

export type ItemDialogMetadataProps = ComponentPropsWithoutRef<'div'>;

export type ItemDialogActionsProps = ComponentPropsWithoutRef<'div'>;

export type ItemDialogBodyProps = ComponentPropsWithoutRef<'div'>;

export type ItemDialogRootComponent = (
  props: ItemDialogRootProps,
) => ReactNode;

export type ItemDialogContentComponent = (
  props: ItemDialogContentProps,
) => ReactNode;

export type ItemDialogHeaderComponent = (
  props: ItemDialogHeaderProps,
) => ReactNode;

export type ItemDialogHeaderRowComponent = (
  props: ItemDialogHeaderRowProps,
) => ReactNode;

export type ItemDialogMainComponent = (
  props: ItemDialogMainProps,
) => ReactNode;

export type ItemDialogTitleComponent = (
  props: ItemDialogTitleProps,
) => ReactNode;

export type ItemDialogDescriptionComponent = (
  props: ItemDialogDescriptionProps,
) => ReactNode;
export type ItemDialogHeadingComponent = (
  props: ItemDialogHeadingProps,
) => ReactNode;

export type ItemDialogBadgesComponent = (
  props: ItemDialogBadgesProps,
) => ReactNode;

export type ItemDialogMetadataComponent = (
  props: ItemDialogMetadataProps,
) => ReactNode;

export type ItemDialogActionsComponent = (
  props: ItemDialogActionsProps,
) => ReactNode;

export type ItemDialogBodyComponent = (
  props: ItemDialogBodyProps,
) => ReactNode;

export type ItemDialogComponent = ItemDialogRootComponent & {
  Actions: ItemDialogActionsComponent;
  Badges: ItemDialogBadgesComponent;
  Body: ItemDialogBodyComponent;
  Content: ItemDialogContentComponent;
  Description: ItemDialogDescriptionComponent;
  Heading: ItemDialogHeadingComponent;
  Header: ItemDialogHeaderComponent;
  HeaderRow: ItemDialogHeaderRowComponent;
  Main: ItemDialogMainComponent;
  Metadata: ItemDialogMetadataComponent;
  Title: ItemDialogTitleComponent;
};
