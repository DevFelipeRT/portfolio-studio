import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  PROJECTS_NAMESPACES,
  useProjectsTranslation,
} from '@/modules/projects/i18n';
import { Loader2 } from 'lucide-react';
import { CreateProjectTranslation } from '../create';
import { EditProjectTranslation } from '../edit';
import { ProjectTranslationsList } from '../list';
import type { ProjectTranslationRecord } from '../types';
import type { OverlayView } from './types';

export type ProjectTranslationOverlayProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectLabel: string;
  loading: boolean;
  saving: boolean;
  errorMessage: string | null;
  view: OverlayView;
  translations: readonly ProjectTranslationRecord[];
  availableLocales: readonly string[];
  activeTranslation: ProjectTranslationRecord | null;
  projectId: number;
  onCreated: (translation: ProjectTranslationRecord) => void;
  replace: (translation: ProjectTranslationRecord) => void;
  onOpenAdd: () => void;
  onOpenEdit: (locale: string) => void;
  onBackToList: () => void;
  onDelete: (item: ProjectTranslationRecord) => void;
};

export function ProjectTranslationOverlay({
  open,
  onOpenChange,
  projectLabel,
  loading,
  saving,
  errorMessage,
  view,
  translations,
  availableLocales,
  activeTranslation,
  projectId,
  onCreated,
  replace,
  onOpenAdd,
  onOpenEdit,
  onBackToList,
  onDelete,
}: ProjectTranslationOverlayProps) {
  const { translate: t } = useProjectsTranslation(
    PROJECTS_NAMESPACES.translations,
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex h-[90vh] max-h-[90vh] min-h-0 max-w-3xl flex-col gap-0 p-0">
        <DialogHeader className="border-b px-6 py-4">
          <div className="space-y-1.5">
            <DialogTitle className="text-xl leading-tight font-semibold tracking-tight">
              {t('title')}
            </DialogTitle>
            <DialogDescription className="max-w-2xl text-sm leading-6">
              {t('subtitle')}{' '}
              <span className="text-foreground font-medium">
                {projectLabel}
              </span>
              .
            </DialogDescription>
          </div>
        </DialogHeader>

        {!loading && view === 'add' ? (
          <CreateProjectTranslation
            projectId={projectId}
            availableLocales={availableLocales}
            onCreated={onCreated}
            onCancel={onBackToList}
          />
        ) : null}

        {!loading && view === 'edit' && activeTranslation ? (
          <EditProjectTranslation
            projectId={projectId}
            translation={activeTranslation}
            onSaved={replace}
            onCancel={onBackToList}
          />
        ) : null}

        {!loading && view === 'list' ? (
          <div className="flex min-h-0 flex-1 flex-col px-6 py-4">
            <div className="flex min-h-0 flex-1 flex-col space-y-4">
              {errorMessage ? (
                <div className="bg-destructive/10 text-destructive border-destructive/20 rounded-md border px-3 py-2 text-sm">
                  {errorMessage}
                </div>
              ) : null}

              {loading ? (
                <div className="text-muted-foreground flex items-center gap-2 text-sm">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {t('loading')}
                </div>
              ) : null}

              {!loading && view === 'list' ? (
                <div className="min-h-0 flex-1">
                  <ProjectTranslationsList
                    translations={translations}
                    saving={saving}
                    canAddTranslation={availableLocales.length > 0}
                    onOpenAdd={onOpenAdd}
                    onOpenEdit={onOpenEdit}
                    onDelete={onDelete}
                  />
                </div>
              ) : null}
            </div>
          </div>
        ) : null}

        {loading ? (
          <div className="flex min-h-0 flex-1 flex-col px-6 py-4">
            {errorMessage ? (
              <div className="bg-destructive/10 text-destructive border-destructive/20 rounded-md border px-3 py-2 text-sm">
                {errorMessage}
              </div>
            ) : null}
            <div className="text-muted-foreground flex items-center gap-2 text-sm">
              <Loader2 className="h-4 w-4 animate-spin" />
              {t('loading')}
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
