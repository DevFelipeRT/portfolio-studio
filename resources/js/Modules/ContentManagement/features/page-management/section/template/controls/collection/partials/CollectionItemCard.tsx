import { Button } from '@/Components/Ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/Ui/card';
import type {
  SectionDataCollectionItem,
  SectionDataValue,
  TemplateFieldDto,
} from '@/Modules/ContentManagement/types';
import { TemplateFieldRenderer } from '../../../TemplateFieldRenderer';

interface CollectionItemCardProps {
  index: number;
  item: SectionDataCollectionItem;
  itemFieldDefinitions: TemplateFieldDto[];
  onRemove: () => void;
  onChange: (itemFieldName: string, itemFieldValue: SectionDataValue) => void;
}

export function CollectionItemCard({
  index,
  item,
  itemFieldDefinitions,
  onRemove,
  onChange,
}: CollectionItemCardProps) {
  return (
    <Card className="rounded-md shadow-none">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 px-3 py-2">
        <CardTitle className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
          Item {index + 1}
        </CardTitle>
        <Button
          type="button"
          onClick={onRemove}
          size="sm"
          variant="destructive"
          className="h-7 px-2 text-[0.7rem]"
        >
          Remove
        </Button>
      </CardHeader>
      <CardContent className="grid gap-3 px-3 pt-0 pb-3">
        {itemFieldDefinitions.map((itemField) => (
          <TemplateFieldRenderer
            key={itemField.name}
            field={itemField}
            value={item[itemField.name] as SectionDataValue}
            onChange={(nextValue: SectionDataValue) =>
              onChange(itemField.name, nextValue)
            }
          />
        ))}
      </CardContent>
    </Card>
  );
}
