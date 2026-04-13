import { useTranslation } from '@/common/i18n';
import {
  compactRichTextTheme,
  extractRichTextPlainText,
  RichTextRenderer,
} from '@/common/rich-text';
import {
  formatTableDate,
  TableBadge,
  TableBooleanBadge,
  TableDetailDialog,
} from '@/common/table';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useIsMobile } from '@/hooks/useMobile';
import { fetchProjectDetail } from '@/modules/projects/api/details';
import {
  PROJECTS_NAMESPACES,
  useProjectsTranslation,
} from '@/modules/projects/i18n';
import type { ProjectDetail } from '@/modules/projects/types';
import { ExternalLink, Eye, EyeOff, Github } from 'lucide-react';
import React from 'react';
import { ProjectStatusBadge } from '../../../../components/ProjectStatusBadge';
import type { ProjectListItem } from '../types';

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
    <TableDetailDialog
      open={open}
      onOpenChange={onOpenChange}
      title={
        <div className="flex flex-col gap-4 pr-10 md:flex-row md:items-start md:justify-between md:pr-12">
          <div className="min-w-0 space-y-3">
            <div className="text-lg leading-tight font-semibold sm:text-xl">
              {detailSource.name}
            </div>

            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <ProjectStatusBadge status={detailSource.status} />
              <TableBooleanBadge
                active={detailSource.display}
                activeLabel={tForm('visibility.public')}
                inactiveLabel={tForm('visibility.private')}
                activeIcon={Eye}
                inactiveIcon={EyeOff}
              />
              <span className="bg-muted text-muted-foreground inline-flex rounded px-2 py-0.5 font-mono text-xs">
                {detailSource.locale}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 md:flex-none md:justify-end">
            {repositoryUrl ? (
              <HeaderLink
                href={repositoryUrl}
                icon={Github}
                label={tActions('repository')}
              />
            ) : null}

            {liveUrl ? (
              <HeaderLink
                href={liveUrl}
                icon={ExternalLink}
                label={tActions('liveSite')}
              />
            ) : null}
          </div>
        </div>
      }
      className="max-w-2xl"
    >
      {loading && !detail ? (
        <p className="text-muted-foreground text-sm">
          {tForm('overlay.loading')}
        </p>
      ) : null}

      {!loading && hasLoadError ? (
        <p className="text-destructive text-sm">{tForm('overlay.loadError')}</p>
      ) : null}

      {detail ? (
        <div className="space-y-5">
          <div className="text-muted-foreground flex flex-row flex-wrap items-center gap-x-3 gap-y-1 text-xs">
            {detail.created_at ? (
              <span>{tForm('overlay.createdOn', { date: createdLabel })}</span>
            ) : null}
            {detail.updated_at ? (
              <span>{tForm('overlay.updatedOn', { date: updatedLabel })}</span>
            ) : null}
          </div>

          <Separator />

          <div className="space-y-6">
            <InfoRow
              label={tForm('overlay.summary')}
              value={
                <p className="text-foreground text-sm leading-6">
                  {detail.summary || tForm('card.noSummary')}
                </p>
              }
            />

            <InfoRow
              label={tForm('overlay.details')}
              value={
                hasDescription ? (
                  <RichTextRenderer
                    value={detail.description ?? ''}
                    className="text-foreground text-sm leading-7"
                    fallbackClassName="text-foreground text-sm leading-7 whitespace-pre-line"
                    theme={compactRichTextTheme}
                  />
                ) : (
                  tForm('values.empty')
                )
              }
            />

            {images.length > 0 ? (
              <InfoRow
                label={tForm('overlay.images')}
                value={
                  <ScrollArea className="w-full rounded-md whitespace-nowrap">
                    <div className="flex w-max gap-3 pb-3">
                      {images.map((image) => (
                        <figure
                          key={image.id}
                          className="bg-muted/40 w-56 overflow-hidden rounded-lg border"
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
                            className="h-40 w-full object-cover"
                          />
                        </figure>
                      ))}
                    </div>
                    <ScrollBar orientation="horizontal" />
                  </ScrollArea>
                }
              />
            ) : null}

            <Separator />

            <InfoRow
              label={tForm('overlay.skills')}
              value={
                detail.skills.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {detail.skills.map((skill) => (
                      <TableBadge
                        key={skill.id}
                        tone="outline"
                        className="font-medium"
                      >
                        {skill.name}
                      </TableBadge>
                    ))}
                  </div>
                ) : (
                  tForm('fields.skill_ids.emptyInline')
                )
              }
            />
          </div>
        </div>
      ) : null}
    </TableDetailDialog>
  );
}

function HeaderLink({
  href,
  icon: Icon,
  label,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="text-primary hover:bg-muted/40 inline-flex h-8 items-center gap-2 rounded-md border px-3 text-xs font-medium"
    >
      <Icon className="h-3.5 w-3.5" />
      <span>{label}</span>
    </a>
  );
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <p className="text-foreground text-base leading-5 font-semibold">
        {label}
      </p>
      <div className="text-foreground text-sm leading-6">{value}</div>
    </section>
  );
}
