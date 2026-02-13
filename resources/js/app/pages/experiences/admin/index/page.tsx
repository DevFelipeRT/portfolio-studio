import AuthenticatedLayout from '@/app/layouts/AuthenticatedLayout';
import type { Experience } from '@/modules/experiences/core/types';
import { Head, Link } from '@inertiajs/react';

interface ExperiencesIndexProps {
  experiences: Experience[];
}

export default function Index({ experiences }: ExperiencesIndexProps) {
  const hasExperiences = experiences.length > 0;

  const truncate = (text: string, maxLength: number): string => {
    if (text.length <= maxLength) {
      return text;
    }

    return `${text.slice(0, maxLength - 1)}…`;
  };

  const formatPeriod = (experience: Experience): string => {
    if (!experience.end_date) {
      return `${experience.start_date} – Present`;
    }

    return `${experience.start_date} – ${experience.end_date}`;
  };

  return (
    <AuthenticatedLayout
      header={
        <h1 className="text-xl leading-tight font-semibold">
          Experience management
        </h1>
      }
    >
      <Head title="Experiences" />

      <div className="overflow-hidden">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-muted-foreground mt-1 text-sm">
              Manage the experiences displayed on your portfolio and resume
              sections.
            </p>
          </div>

          <Link
            href={route('experiences.create')}
            className="bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-ring inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium shadow-sm transition focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            New experience
          </Link>
        </div>

        {!hasExperiences && (
          <p className="text-muted-foreground text-sm">
            No experiences have been created yet.
          </p>
        )}

        {hasExperiences && (
          <div className="bg-card overflow-hidden rounded-lg border">
            <table className="min-w-full divide-y text-sm">
              <thead className="bg-muted/60">
                <tr>
                  <th className="text-muted-foreground px-4 py-3 text-left text-sm font-medium">
                    Position
                  </th>
                  <th className="text-muted-foreground px-4 py-3 text-left text-sm font-medium">
                    Company
                  </th>
                  <th className="text-muted-foreground px-4 py-3 text-left text-sm font-medium">
                    Period
                  </th>
                  <th className="text-muted-foreground px-4 py-3 text-left text-sm font-medium">
                    Display
                  </th>
                  <th className="text-muted-foreground px-4 py-3 text-left text-sm font-medium">
                    Updated at
                  </th>
                  <th className="text-muted-foreground px-4 py-3 text-right text-sm font-medium">
                    Actions
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
                      {experience.company ?? '—'}
                    </td>

                    <td className="text-muted-foreground px-4 py-3 align-top text-xs whitespace-nowrap">
                      {formatPeriod(experience)}
                    </td>

                    <td className="text-muted-foreground px-4 py-3 align-top text-xs">
                      {experience.display ? 'Yes' : 'No'}
                    </td>

                    <td className="text-muted-foreground px-4 py-3 align-top text-xs whitespace-nowrap">
                      {experience.updated_at ?? '—'}
                    </td>

                    <td className="px-4 py-3 align-top">
                      <div className="flex justify-end gap-3 text-xs">
                        <Link
                          href={route('experiences.edit', experience.id)}
                          className="text-primary font-medium hover:underline"
                        >
                          Edit
                        </Link>

                        <Link
                          href={route('experiences.destroy', experience.id)}
                          method="delete"
                          as="button"
                          className="text-destructive font-medium hover:underline"
                        >
                          Delete
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AuthenticatedLayout>
  );
}
