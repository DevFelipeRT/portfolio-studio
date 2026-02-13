import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type {
  PageSectionDto,
  TemplateDefinitionDto,
} from '@/modules/content-management/types';
import type { DragEndEvent, SensorDescriptor } from '@dnd-kit/core';
import { closestCenter, DndContext } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Plus } from 'lucide-react';
import React from 'react';
import { SectionItem } from './partials';

interface SectionListProps {
  sections: PageSectionDto[];
  templates: TemplateDefinitionDto[];
  reorderLocked?: boolean;
  sensors: Array<SensorDescriptor<Record<string, unknown>>>;
  onDragEnd: (event: DragEndEvent) => void;
  onCreateSection?: () => void;
  onEditSection?: (section: PageSectionDto) => void;
  onToggleActive?: (section: PageSectionDto) => void;
  onRemoveSection?: (section: PageSectionDto) => void;
  onReorder?: (section: PageSectionDto, direction: 'up' | 'down') => void;
}

/**
 * Presentational sections list used in the page edit screen.
 *
 * Notes:
 * - This component is UI-only: it receives ordered `sections`, DnD sensors, and callbacks.
 * - For the orchestration (optimistic reorder + persistence + locking), use
 *   `useSectionListController`.
 */
export function SectionList({
  sections,
  templates,
  reorderLocked = false,
  sensors,
  onDragEnd,
  onCreateSection,
  onEditSection,
  onToggleActive,
  onRemoveSection,
  onReorder,
}: SectionListProps) {
  const templateLabelByKey = React.useMemo(() => {
    const map = new Map<string, string>();

    for (const template of templates) {
      map.set(template.key, template.label);
    }

    return map;
  }, [templates]);

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
          onDragEnd={onDragEnd}
        >
          <SortableContext
            items={sections.map((section) => section.id)}
            strategy={verticalListSortingStrategy}
          >
            <ul className="space-y-2">
              {sections.map((section, index) => (
                <SectionItem
                  key={section.id}
                  section={section}
                  templateLabel={
                    templateLabelByKey.get(section.template_key) ??
                    section.template_key
                  }
                  index={index}
                  totalCount={sections.length}
                  reorderLocked={reorderLocked}
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
