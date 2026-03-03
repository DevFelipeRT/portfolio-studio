import { ContactPrimarySection } from '@/modules/contact-channels/ui/sections/ContactPrimarySection';
import type { SectionComponentRegistry } from '@/modules/content-management/features/page-rendering';

export const contactChannelsSectionRegistryProvider = {
    i18n: ['contact-channels'],
    getSectionRegistry(): SectionComponentRegistry {
        return {
            contact_primary: ContactPrimarySection,
        };
    },
};
