import { Button } from '@/Components/Ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/Ui/card';
import type {
  PageSectionDto,
  TemplateDefinitionDto,
} from '@/Modules/ContentManagement/core/types';
import type { DragEndEvent } from '@dnd-kit/core';
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Plus } from 'lucide-react';
import React from 'react';
import { SectionItem } from './components/SectionItem';

interface SectionsListProps {
  sections: PageSectionDto[];
  templates: TemplateDefinitionDto[];
  onCreateSection?: () => void;
  onEditSection?: (section: PageSectionDto) => void;
  onToggleActive?: (section: PageSectionDto) => void;
  onRemoveSection?: (section: PageSectionDto) => void;
  onReorder?: (section: PageSectionDto, direction: 'up' | 'down') => void;
  onReorderIds?: (orderedIds: Array<PageSectionDto['id']>) => void;
  onValidateReorder?: (orderedSections: PageSectionDto[]) => boolean;
}

/**
 * Sections list for the page edit screen.
 *
 * This component wires layout and per-row actions, delegating individual
 * row rendering to SectionItem.
 */
export function SectionsList({
  sections,
  templates,
  onCreateSection,
  onEditSection,
  onToggleActive,
  onRemoveSection,
  onReorder,
  onReorderIds,
  onValidateReorder,
}: SectionsListProps) {
  const [orderedSections, setOrderedSections] = React.useState(sections);

  React.useEffect(() => {
    setOrderedSections(sections);
  }, [sections]);

  const resolveTemplateLabel = (templateKey: string): string => {
    const template = templates.find((item) => item.key === templateKey);

    if (template) {
      return template.label;
    }

    return templateKey;
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent): void => {
    if (!event.over || event.active.id === event.over.id) {
      return;
    }

    const oldIndex = orderedSections.findIndex(
      (section) => section.id === event.active.id,
    );
    const newIndex = orderedSections.findIndex(
      (section) => section.id === event.over?.id,
    );

    if (oldIndex === -1 || newIndex === -1) {
      return;
    }

    const nextSections = arrayMove(orderedSections, oldIndex, newIndex);

    if (onValidateReorder && !onValidateReorder(nextSections)) {
      return;
    }

    setOrderedSections(nextSections);
    onReorderIds?.(nextSections.map((section) => section.id));
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-3">
        <div>
          <CardTitle className="text-base">Sections</CardTitle>
          <p className="text-muted-foreground mt-1 text-xs">
            Manage the content sections that compose this page.
          </p>
        </div>

        <Button
          type="button"
          size="sm"
          className="gap-2"
          onClick={onCreateSection}
        >
          <Plus className="h-4 w-4" />
          Add section
        </Button>
      </CardHeader>

      <CardContent>
        {sections.length === 0 && (
          <p className="text-muted-foreground py-6 text-sm">
            No sections configured yet. Use the button above to add the first
            section.
          </p>
        )}

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={orderedSections.map((section) => section.id)}
            strategy={verticalListSortingStrategy}
          >
            <ul className="space-y-2">
              {orderedSections.map((section, index) => (
                <SectionItem
                  key={section.id}
                  section={section}
                  templateLabel={resolveTemplateLabel(section.template_key)}
                  index={index}
                  totalCount={orderedSections.length}
                  onToggleActive={onToggleActive}
                  onEdit={onEditSection}
                  onRemove={onRemoveSection}
                  onReorder={onReorder}
                />
              ))}
            </ul>
          </SortableContext>
        </DndContext>
      </CardContent>
    </Card>
  );
}
