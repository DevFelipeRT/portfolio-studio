import {
  CONTENT_MANAGEMENT_NAMESPACES,
  useContentManagementTranslation,
} from '@/modules/content-management/i18n';

interface CollectionEmptyStateProps {
  hasItems: boolean;
  hasItemFields: boolean;
}

export function CollectionEmptyState({
  hasItems,
  hasItemFields,
}: CollectionEmptyStateProps) {
  const { translate: tTemplates } = useContentManagementTranslation(
    CONTENT_MANAGEMENT_NAMESPACES.templates,
  );

  return (
    <>
      {!hasItems && (
        <p className="text-muted-foreground text-xs">
          {tTemplates(
            'collection.empty',
            'No items configured. Use "Add item" to create one.',
          )}
        </p>
      )}
      {!hasItemFields && (
        <p className="text-destructive text-xs">
          {tTemplates(
            'collection.noItemFields',
            'This collection has no item fields defined in the template.',
          )}
        </p>
      )}
    </>
  );
}
