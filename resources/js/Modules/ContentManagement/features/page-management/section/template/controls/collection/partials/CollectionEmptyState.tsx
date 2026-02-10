interface CollectionEmptyStateProps {
  hasItems: boolean;
  hasItemFields: boolean;
}

export function CollectionEmptyState({
  hasItems,
  hasItemFields,
}: CollectionEmptyStateProps) {
  return (
    <>
      {!hasItems && (
        <p className="text-muted-foreground text-xs">
          No items configured. Use &ldquo;Add item&rdquo; to create one.
        </p>
      )}
      {!hasItemFields && (
        <p className="text-destructive text-xs">
          This collection has no item fields defined in the template.
        </p>
      )}
    </>
  );
}
