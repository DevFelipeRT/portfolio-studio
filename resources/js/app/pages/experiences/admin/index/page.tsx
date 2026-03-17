import AuthenticatedLayout from '@/app/layouts/AuthenticatedLayout';
import { PageContent } from '@/app/layouts/primitives';
import { PageHead, PageLink } from '@/common/page-runtime';
import type { Experience } from '@/modules/experiences/core/types';
import {
  EXPERIENCES_NAMESPACES,
  useExperiencesTranslation,
} from '@/modules/experiences/i18n';

interface ExperiencesIndexProps {
  experiences: Experience[];
}

export default function Index({ experiences }: ExperiencesIndexProps) {
  const { translate: tActions } = useExperiencesTranslation(
    EXPERIENCES_NAMESPACES.actions,
  );
  const { translate: tForm } = useExperiencesTranslation(
    EXPERIENCES_NAMESPACES.form,
  );
  const { translate: tSections } = useExperiencesTranslation(
    EXPERIENCES_NAMESPACES.sections,
  );
  const hasExperiences = experiences.length > 0;

  const truncate = (text: string, maxLength: number): string => {
    if (text.length <= maxLength) {
      return text;
    }

    return `${text.slice(0, maxLength - 1)}…`;
  };

  const formatPeriod = (experience: Experience): string => {
    if (!experience.end_date) {
      return `${experience.start_date} – ${tForm('fields.period.present')}`;
    }

    return `${experience.start_date} – ${experience.end_date}`;
  };

  return (
    <AuthenticatedLayout>
      <PageHead title={tSections('managementTitle')} />

      <PageContent className="overflow-hidden py-8" pageWidth="container">
        <div className="mb-6 space-y-6">
          <div>
            <h1 className="text-xl leading-tight font-semibold">
              {tSections('managementTitle')}
            </h1>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-muted-foreground mt-1 text-sm">
                {tForm('help.managementSubtitle')}
              </p>
            </div>

            <PageLink
              href={route('experiences.create')}
              className="bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-ring inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium shadow-sm transition focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              {tActions('newExperience')}
            </PageLink>
          </div>
        </div>

        {!hasExperiences && (
          <p className="text-muted-foreground text-sm">
            {tForm('emptyState.index')}
          </p>
        )}

        {hasExperiences && (
          <div className="bg-card overflow-hidden rounded-lg border">
            <table className="min-w-full divide-y text-sm">
              <thead className="bg-muted/60">
                <tr>
                  <th className="text-muted-foreground px-4 py-3 text-left text-sm font-medium">
                    {tForm('fields.position.label')}
                  </th>
                  <th className="text-muted-foreground px-4 py-3 text-left text-sm font-medium">
                    {tForm('fields.company.label')}
                  </th>
                  <th className="text-muted-foreground px-4 py-3 text-left text-sm font-medium">
                    {tForm('fields.period.label')}
                  </th>
                  <th className="text-muted-foreground px-4 py-3 text-left text-sm font-medium">
                    {tForm('fields.display.label')}
                  </th>
                  <th className="text-muted-foreground px-4 py-3 text-left text-sm font-medium">
                    {tForm('fields.updated_at.label')}
                  </th>
                  <th className="text-muted-foreground px-4 py-3 text-right text-sm font-medium">
                    {tForm('fields.actions.label')}
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {experiences.map((experience) => (
                  <tr key={experience.id}>
                    <td className="px-4 py-3 align-top">
                      <div className="font-medium">{experience.position}</div>
                      <div className="text-muted-foreground mt-0.5 text-xs">
                        {truncate(experience.summary ?? '', 80)}
                      </div>
                    </td>

                    <td className="text-muted-foreground px-4 py-3 align-top text-sm">
                      {experience.company ?? tForm('values.empty')}
                    </td>

                    <td className="text-muted-foreground px-4 py-3 align-top text-xs whitespace-nowrap">
                      {formatPeriod(experience)}
                    </td>

                    <td className="text-muted-foreground px-4 py-3 align-top text-xs">
                      {experience.display
                        ? tActions('yes')
                        : tActions('no')}
                    </td>

                    <td className="text-muted-foreground px-4 py-3 align-top text-xs whitespace-nowrap">
                      {experience.updated_at ?? tForm('values.empty')}
                    </td>

                    <td className="px-4 py-3 align-top">
                      <div className="flex justify-end gap-3 text-xs">
                        <PageLink
                          href={route('experiences.edit', experience.id)}
                          className="text-primary font-medium hover:underline"
                        >
                          {tActions('edit')}
                        </PageLink>

                        <PageLink
                          href={route('experiences.destroy', experience.id)}
                          method="delete"
                          as="button"
                          className="text-destructive font-medium hover:underline"
                        >
                          {tActions('delete')}
                        </PageLink>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </PageContent>
    </AuthenticatedLayout>
  );
}

Index.i18n = ['experiences'];
