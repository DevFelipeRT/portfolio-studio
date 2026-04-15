import { useTranslation } from '@/common/i18n';
import {
  compactRichTextTheme,
  extractRichTextPlainText,
  RichTextRenderer,
} from '@/common/rich-text';
import { formatTableDate, ItemDialog } from '@/common/table';
import { InfoBadge, VisibilityBadge } from '@/components/badges';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { useIsMobile } from '@/hooks/useMobile';
import { fetchProjectDetail } from '@/modules/projects/api/details';
import {
  PROJECTS_NAMESPACES,
  useProjectsTranslation,
} from '@/modules/projects/i18n';
import type { ProjectDetail } from '@/modules/projects/types';
import { ExternalLink, Github } from 'lucide-react';
import React from 'react';
import { ProjectStatusBadge } from '../../../../components/ProjectStatusBadge';
import type { ProjectListItem } from '../types';
import { ProjectOverlayHeaderLink, ProjectOverlayInfoRow } from './_partials';

interface ProjectOverlayProps {
  open: boolean;
  project: ProjectListItem | null;
  onOpenChange: (open: boolean) => void;
}

export function ProjectOverlay({
  open,
  project,
  onOpenChange,
}: ProjectOverlayProps) {
  const { locale } = useTranslation();
  const isMobile = useIsMobile();
  const { translate: tForm } = useProjectsTranslation(PROJECTS_NAMESPACES.form);
  const { translate: tActions } = useProjectsTranslation(
    PROJECTS_NAMESPACES.actions,
  );
  const [detail, setDetail] = React.useState<ProjectDetail | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [hasLoadError, setHasLoadError] = React.useState(false);
  const projectId = project?.id ?? null;

  React.useEffect(() => {
    let active = true;

    if (!open || projectId === null) {
      setDetail(null);
      setLoading(false);
      setHasLoadError(false);
      return () => {
        active = false;
      };
    }

    setDetail(null);
    setLoading(true);
    setHasLoadError(false);

    void fetchProjectDetail(projectId)
      .then((nextDetail) => {
        if (!active) {
          return;
        }

        setDetail(nextDetail);
      })
      .catch(() => {
        if (!active) {
          return;
        }

        setDetail(null);
        setHasLoadError(true);
      })
      .finally(() => {
        if (!active) {
          return;
        }

        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [projectId, open]);

  if (!project) {
    return null;
  }

  const detailSource = detail ?? project;
  const images = detail?.images ?? [];
  const repositoryUrl = detail?.repository_url ?? null;
  const liveUrl = detail?.live_url ?? null;
  const updatedLabel = formatTableDate(detail?.updated_at, {
    locale,
    isMobile,
    fallback: tForm('values.empty'),
  });
  const createdLabel = formatTableDate(detail?.created_at, {
    locale,
    isMobile,
    fallback: tForm('values.empty'),
  });
  const hasDescription =
    detail !== null &&
    extractRichTextPlainText(detail.description ?? '').length > 0;

  return (
    <ItemDialog open={open} onOpenChange={onOpenChange}>
      <ItemDialog.Content className="max-w-2xl">
        <ItemDialog.Header>
          <ItemDialog.Main>
            <ItemDialog.Heading>
              <ItemDialog.Title>{detailSource.name}</ItemDialog.Title>
            </ItemDialog.Heading>

            <div className="flex flex-wrap items-center gap-2">
              <ProjectStatusBadge status={detailSource.status} />
              <VisibilityBadge
                visible={detailSource.display}
                publicLabel={tForm('visibility.public')}
                privateLabel={tForm('visibility.private')}
              />
              <InfoBadge tone="muted" className="font-mono">
                {detailSource.locale}
              </InfoBadge>

              {repositoryUrl ? (
                <ProjectOverlayHeaderLink
                  href={repositoryUrl}
                  icon={Github}
                  label={tActions('repository')}
                />
              ) : null}

              {liveUrl ? (
                <ProjectOverlayHeaderLink
                  href={liveUrl}
                  icon={ExternalLink}
                  label={tActions('liveSite')}
                />
              ) : null}
            </div>
          </ItemDialog.Main>

          {detail ? (
            <ItemDialog.Metadata>
              {detail.created_at ? (
                <span>
                  {tForm('overlay.createdOn', { date: createdLabel })}
                </span>
              ) : null}
              {detail.updated_at ? (
                <span>
                  {tForm('overlay.updatedOn', { date: updatedLabel })}
                </span>
              ) : null}
            </ItemDialog.Metadata>
          ) : null}
        </ItemDialog.Header>

        <ItemDialog.Body className="flex h-full min-h-0 flex-col">
          {loading && !detail ? (
            <p className="text-muted-foreground text-sm">
              {tForm('overlay.loading')}
            </p>
          ) : null}

          {!loading && hasLoadError ? (
            <p className="text-destructive text-sm">
              {tForm('overlay.loadError')}
            </p>
          ) : null}

          {detail ? (
            <div className="flex h-full min-h-0 flex-col gap-6">
              <ProjectOverlayInfoRow
                label={tForm('overlay.summary')}
                value={
                  <p className="text-foreground text-sm leading-6">
                    {detail.summary || tForm('card.noSummary')}
                  </p>
                }
              />

              <section className="flex min-h-0 flex-1 flex-col gap-3">
                <p className="text-foreground text-base leading-5 font-semibold">
                  {tForm('overlay.details')}
                </p>

                <div className="min-h-0 flex-1">
                  {hasDescription ? (
                    <ScrollArea className="h-full pr-3">
                      <RichTextRenderer
                        value={detail.description ?? ''}
                        className="text-foreground text-sm leading-7"
                        fallbackClassName="text-foreground text-sm leading-7 whitespace-pre-line"
                        theme={compactRichTextTheme}
                      />
                    </ScrollArea>
                  ) : (
                    <div className="text-foreground text-sm leading-6">
                      {tForm('values.empty')}
                    </div>
                  )}
                </div>
              </section>

              {images.length > 0 ? (
                <ProjectOverlayInfoRow
                  label={tForm('overlay.images')}
                  value={
                    <ScrollArea className="w-full rounded-md whitespace-nowrap">
                      <div className="flex w-max gap-3 pb-3">
                        {images.map((image) => (
                          <figure
                            key={image.id}
                            className="bg-muted/40 w-28 overflow-hidden rounded-lg border"
                          >
                            <img
                              src={image.url ?? ''}
                              alt={
                                image.alt_text ??
                                image.alt ??
                                image.image_title ??
                                image.title ??
                                ''
                              }
                              className="h-20 w-full object-cover"
                            />
                          </figure>
                        ))}
                      </div>
                      <ScrollBar orientation="horizontal" />
                    </ScrollArea>
                  }
                />
              ) : null}

              <ProjectOverlayInfoRow
                label={tForm('overlay.skills')}
                value={
                  detail.skills.length > 0 ? (
                    <ScrollArea className="w-full min-w-0 rounded-md whitespace-nowrap">
                      <div className="flex w-max gap-2 pb-3">
                        {detail.skills.map((skill) => (
                          <InfoBadge
                            key={skill.id}
                            tone="outline"
                            className="shrink-0"
                          >
                            {skill.name}
                          </InfoBadge>
                        ))}
                      </div>
                      <ScrollBar orientation="horizontal" />
                    </ScrollArea>
                  ) : (
                    tForm('fields.skill_ids.emptyInline')
                  )
                }
              />
            </div>
          ) : null}
        </ItemDialog.Body>
      </ItemDialog.Content>
    </ItemDialog>
  );
}
