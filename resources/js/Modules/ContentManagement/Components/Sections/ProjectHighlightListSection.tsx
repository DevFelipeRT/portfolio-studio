import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/Components/Ui/card';
import { SectionHeader } from '@/Layouts/Partials/SectionHeader';
import type { SectionComponentProps } from '@/Modules/ContentManagement/config/sectionComponents';
import type { SectionData } from '@/Modules/ContentManagement/types';
import { JSX } from 'react';

/**
 * Renders a project highlight list section for a content-managed page.
 */
export function ProjectHighlightListSection({
    section,
    template,
}: SectionComponentProps): JSX.Element | null {
    const data = (section.data ?? {}) as SectionData;

    const getString = (key: string): string | undefined => {
        const value = data[key];

        if (typeof value === 'string') {
            return value;
        }

        return undefined;
    };

    const getNumber = (key: string): number | undefined => {
        const value = data[key];

        if (typeof value === 'number' && Number.isFinite(value)) {
            return value;
        }

        return undefined;
    };

    const getBoolean = (key: string): boolean | undefined => {
        const value = data[key];

        if (typeof value === 'boolean') {
            return value;
        }

        return undefined;
    };

    const title =
        getString('title') ??
        getString('headline') ??
        getString('heading') ??
        template?.label ??
        '';

    const description =
        getString('subtitle') ?? getString('description') ?? undefined;

    const maxItems =
        getNumber('max_items') ?? getNumber('maxItems') ?? undefined;

    const onlyFeatured =
        getBoolean('only_featured') ?? getBoolean('onlyFeatured') ?? undefined;

    const rawProjectIds = (data['project_ids'] ??
        data['projectIds']) as unknown;

    const projectIds: number[] = Array.isArray(rawProjectIds)
        ? rawProjectIds.filter(
              (value): value is number => typeof value === 'number',
          )
        : [];

    const limitedProjectIds =
        typeof maxItems === 'number' && maxItems > 0
            ? projectIds.slice(0, maxItems)
            : projectIds;

    if (!title && !description && limitedProjectIds.length === 0) {
        return null;
    }

    return (
        <div className="border-t py-12 md:py-16">
            <div className="container mx-auto">
                <div className="space-y-8">
                    <SectionHeader
                        eyebrow={
                            onlyFeatured ? 'Projetos em destaque' : undefined
                        }
                        title={title}
                        description={description}
                        align="left"
                        level={2}
                    />

                    {limitedProjectIds.length > 0 ? (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {limitedProjectIds.map((projectId) => (
                                <Card key={projectId}>
                                    <CardHeader>
                                        <CardTitle>
                                            Projeto #{projectId}
                                        </CardTitle>
                                        <CardDescription>
                                            Este bloco exibirá os detalhes do
                                            projeto quando a integração com o
                                            catálogo de projetos estiver ativa.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-muted-foreground text-sm">
                                            Configuração atual da seção
                                            considera o ID informado no template
                                            de conteúdo.
                                        </p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <p className="text-muted-foreground text-sm">
                            Nenhum projeto configurado para esta seção.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
