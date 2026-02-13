import { ContactPrimarySection } from '@/modules/contact-channels/ui/sections/ContactPrimarySection';
import type { SectionComponentRegistry } from '@/modules/content-management/features/page-rendering';

export const contactChannelsSectionRegistryProvider = {
    getSectionRegistry(): SectionComponentRegistry {
        return {
            contact_primary: ContactPrimarySection,
        };
    },
};
