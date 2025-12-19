// resources/js/Modules/ContentManagement/Pages/Public/RenderedPage.tsx
import HomeLayout from '@/Layouts/HomeLayout';

import { SectionRenderer } from '@/Modules/ContentManagement/Components/Sections/SectionRenderer';
import type {
    PageRenderViewModelProps,
    PageSectionDto,
    TemplateDefinitionDto,
} from '@/Modules/ContentManagement/types';
import type { SectionEnvironment } from '@/Modules/ContentManagement/types/sectionEnvironment';
import { defaultSocialLinks } from '@/config/socials';
import { Head } from '@inertiajs/react';
import { JSX } from 'react';
import { SectionEnvironmentProvider } from '../../context/SectionEnvironmentContext';

/**
 * Public screen that renders a content-managed page using the SectionRenderer.
 */
export default function RenderedPage({
    page,
    sections,
    extra,
}: PageRenderViewModelProps): JSX.Element {
    const templates: TemplateDefinitionDto[] = Array.isArray(extra?.templates)
        ? extra.templates
        : [];

    const sortedSections: PageSectionDto[] = [...sections].sort(
        (a, b) => a.position - b.position,
    );

    const visibleSections = sortedSections.filter(
        (section) => section.is_active,
    );

    const heroSections = visibleSections.filter(
        (section) => section.slot === 'hero',
    );

    const otherSections = visibleSections.filter(
        (section) => section.slot !== 'hero',
    );

    const headTitle: string = page.meta_title || page.title;
    const headDescription: string | undefined =
        page.meta_description || undefined;
    const headImageUrl: string | undefined = page.meta_image_url || undefined;

    const environment: SectionEnvironment = {
        socialLinks: defaultSocialLinks,
    };

    return (
        <HomeLayout>
            <SectionEnvironmentProvider value={environment}>
                <Head title={headTitle}>
                    {headDescription && (
                        <meta name="description" content={headDescription} />
                    )}

                    {headImageUrl && (
                        <>
                            <meta property="og:title" content={headTitle} />
                            <meta
                                property="og:description"
                                content={headDescription ?? ''}
                            />
                            <meta property="og:image" content={headImageUrl} />
                        </>
                    )}
                </Head>

                <main className="space-y-16">
                    {heroSections.length > 0 && (
                        <SectionRenderer
                            sections={heroSections}
                            templates={templates}
                        />
                    )}

                    {otherSections.length > 0 && (
                        <SectionRenderer
                            sections={otherSections}
                            templates={templates}
                        />
                    )}
                </main>
            </SectionEnvironmentProvider>
        </HomeLayout>
    );
}
