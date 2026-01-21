import type {
    PageSectionDto,
    TemplateDefinitionDto,
} from '@/Modules/ContentManagement/types';
import { SectionRenderer } from '@/Modules/ContentManagement/Components/SectionRenderer';
import type { JSX } from 'react';

type SlotName = 'hero' | 'main' | 'secondary' | 'footer' | 'other';

type SlotDefinition = {
    slot: SlotName;
    tag?: keyof JSX.IntrinsicElements;
};

const SLOT_DEFINITIONS: SlotDefinition[] = [
    { slot: 'hero', tag: 'header' },
    { slot: 'main' },
    { slot: 'secondary', tag: 'aside' },
    { slot: 'footer', tag: 'footer' },
    { slot: 'other', tag: 'section' },
];

function normalizeSlot(slot: string | null): SlotName {
    const normalized = (slot ?? '').trim().toLowerCase();

    if (normalized === 'hero') {
        return 'hero';
    }

    if (normalized === 'main') {
        return 'main';
    }

    if (normalized === 'secondary') {
        return 'secondary';
    }

    if (normalized === 'footer') {
        return 'footer';
    }

    return 'other';
}

export class SectionSlotLayoutManager {
    public render(
        sections: PageSectionDto[],
        templates: TemplateDefinitionDto[],
    ): JSX.Element | null {
        if (sections.length === 0) {
            return null;
        }

        const grouped = new Map<SlotName, PageSectionDto[]>();

        sections.forEach((section) => {
            const slot = normalizeSlot(section.slot);
            const bucket = grouped.get(slot) ?? [];
            bucket.push(section);
            grouped.set(slot, bucket);
        });

        return (
            <>
                {SLOT_DEFINITIONS.map(({ slot, tag }) => {
                    const items = grouped.get(slot) ?? [];

                    if (items.length === 0) {
                        return null;
                    }

                    if (!tag) {
                        return (
                            <SectionRenderer
                                key={slot}
                                sections={items}
                                templates={templates}
                            />
                        );
                    }

                    const Container = tag;

                    return (
                        <Container
                            key={slot}
                            className={`content-slot content-slot-${slot}`}
                        >
                            <SectionRenderer
                                sections={items}
                                templates={templates}
                            />
                        </Container>
                    );
                })}
            </>
        );
    }
}

export const sectionSlotLayoutManager = new SectionSlotLayoutManager();
