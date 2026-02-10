import { Button } from '@/Components/Ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/Ui/card';
import type {
  PageSectionDto,
  TemplateDefinitionDto,
} from '@/Modules/ContentManagement/types';
import { closestCenter, DndContext } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Plus } from 'lucide-react';
import React from 'react';

import { useOrderedSections, useSectionsDragOrdering } from './hooks';
import { SectionItem } from './partials';

interface SectionListProps {
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
export function SectionList({
  sections,
  templates,
  onCreateSection,
  onEditSection,
  onToggleActive,
  onRemoveSection,
  onReorder,
  onReorderIds,
  onValidateReorder,
}: SectionListProps) {
  const { orderedSections, setOrderedSections } = useOrderedSections(sections);

  const templateLabelByKey = React.useMemo(() => {
    const map = new Map<string, string>();

    for (const template of templates) {
      map.set(template.key, template.label);
    }

    return map;
  }, [templates]);

  const { sensors, handleDragEnd } = useSectionsDragOrdering({
    orderedSections,
    setOrderedSections,
    onReorderIds,
    onValidateReorder,
  });

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
        {orderedSections.length === 0 && (
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
                  templateLabel={
                    templateLabelByKey.get(section.template_key) ??
                    section.template_key
                  }
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
