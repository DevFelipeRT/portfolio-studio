import { ContactPrimarySection } from '@/Modules/ContactChannels/ui/sections/ContactPrimarySection';
import type { SectionComponentRegistry } from '@/Modules/ContentManagement/features/page-rendering';

export const contactChannelsSectionRegistryProvider = {
    getSectionRegistry(): SectionComponentRegistry {
        return {
            contact_primary: ContactPrimarySection,
        };
    },
};
