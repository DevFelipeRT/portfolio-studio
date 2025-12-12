import { Button } from '@/Components/Ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/Ui/card';
import type {
    PageSectionDto,
    TemplateDefinitionDto,
} from '@/Modules/ContentManagement/types';
import { Plus } from 'lucide-react';
import { PageSectionItem } from './PageSectionItem';

interface PageSectionsListProps {
    sections: PageSectionDto[];
    templates: TemplateDefinitionDto[];
    onCreateSection?: () => void;
    onEditSection?: (section: PageSectionDto) => void;
    onToggleActive?: (section: PageSectionDto) => void;
    onRemoveSection?: (section: PageSectionDto) => void;
    onReorder?: (section: PageSectionDto, direction: 'up' | 'down') => void;
}

/**
 * Sections list for the page edit screen.
 *
 * This component wires layout and per-row actions, delegating individual
 * row rendering to PageSectionItem.
 */
export function PageSectionsList({
    sections,
    templates,
    onCreateSection,
    onEditSection,
    onToggleActive,
    onRemoveSection,
    onReorder,
}: PageSectionsListProps) {
    const resolveTemplateLabel = (templateKey: string): string => {
        const template = templates.find((item) => item.key === templateKey);

        if (template) {
            return template.label;
        }

        return templateKey;
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
                        No sections configured yet. Use the button above to add
                        the first section.
                    </p>
                )}

                <ul className="space-y-2">
                    {sections.map((section, index) => (
                        <PageSectionItem
                            key={section.id}
                            section={section}
                            templateLabel={resolveTemplateLabel(
                                section.template_key,
                            )}
                            index={index}
                            totalCount={sections.length}
                            onToggleActive={onToggleActive}
                            onEdit={onEditSection}
                            onRemove={onRemoveSection}
                            onReorder={onReorder}
                        />
                    ))}
                </ul>
            </CardContent>
        </Card>
    );
}
