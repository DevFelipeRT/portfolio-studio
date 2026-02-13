interface PageTitleProps {
  title: string;
  internalName: string;
}

/**
 * Title + internal identifier displayed in the first column.
 */
export function PageTitle({ title, internalName }: PageTitleProps) {
  return (
    <div className="flex flex-col">
      <span>{title}</span>
      <span className="text-muted-foreground text-xs">{internalName}</span>
    </div>
  );
}
