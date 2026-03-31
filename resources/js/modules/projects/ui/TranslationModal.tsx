import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  createProjectTranslation,
  deleteProjectTranslation,
  fetchSupportedLocales,
  listProjectTranslations,
  updateProjectTranslation,
} from '@/modules/projects/core/api/translations';
import {
  isProjectStatusValue,
  type ProjectStatusValue,
  useProjectStatusOptions,
} from '@/modules/projects/core/status';
import type { ProjectTranslationItem } from '@/modules/projects/core/types';
import { useProjectsTranslation, PROJECTS_NAMESPACES } from '@/modules/projects/i18n';
import { Loader2, Plus, Trash2 } from 'lucide-react';
import React from 'react';
import { RichTextEditor } from '@/common/rich-text/RichTextEditor';
import {
  TranslationModalLayout,
  TranslationModalBody,
} from '@/modules/translations/ui/TranslationModalParts';
import {
  createTranslationModalError,
  getTranslationModalErrorMessage,
  normalizeTranslationModalError,
  type TranslationModalError,
} from '@/modules/translations/ui/translationModalError';

type TranslationModalProps = {
  open: boolean;
  onClose: () => void;
  projectId: number;
  projectLabel: string;
  baseLocale: string;
};

type EditableTranslation = ProjectTranslationItem & {
  draftName?: string;
  draftSummary?: string;
  draftDescription?: string;
  draftStatus?: ProjectStatusValue | '';
};

type DraftProjectStatus = ProjectStatusValue | '';

function normalizeText(value: string): string | null {
  const trimmed = value.trim();
  return trimmed === '' ? null : trimmed;
}

function normalizeStatus(value: DraftProjectStatus): ProjectStatusValue | null {
  return value === '' ? null : value;
}

export function TranslationModal({
  open,
  onClose,
  projectId,
  projectLabel,
  baseLocale,
}: TranslationModalProps) {
  const { translate: t } = useProjectsTranslation(
    PROJECTS_NAMESPACES.translations,
  );
  const { translate: tForm } = useProjectsTranslation(PROJECTS_NAMESPACES.form);
  const statusOptions = useProjectStatusOptions(true);
  const [supportedLocales, setSupportedLocales] = React.useState<string[]>([]);
  const [translations, setTranslations] = React.useState<EditableTranslation[]>(
    [],
  );
  const [newLocale, setNewLocale] = React.useState<string>('');
  const [newName, setNewName] = React.useState<string>('');
  const [newSummary, setNewSummary] = React.useState<string>('');
  const [newDescription, setNewDescription] = React.useState<string>('');
  const [newStatus, setNewStatus] = React.useState<DraftProjectStatus>('');
  const [loading, setLoading] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<TranslationModalError | null>(null);
  const [view, setView] = React.useState<'list' | 'add' | 'edit'>('list');
  const [activeLocale, setActiveLocale] = React.useState<string | null>(null);
  const errorMessage = getTranslationModalErrorMessage(error, t);

  React.useEffect(() => {
    if (!open) {
      return;
    }

    let active = true;

    const loadData = async (): Promise<void> => {
      setLoading(true);
      setError(null);

      try {
        const [locales, items] = await Promise.all([
          fetchSupportedLocales(),
          listProjectTranslations(projectId),
        ]);

        if (!active) {
          return;
        }

        setSupportedLocales(locales);
        setTranslations(
          items.map((item) => ({
            ...item,
            draftName: item.name ?? '',
            draftSummary: item.summary ?? '',
            draftDescription: item.description ?? '',
            draftStatus: item.status ?? '',
          })),
        );
      } catch (err) {
        if (active) {
          setError(normalizeTranslationModalError(err));
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void loadData();

    return () => {
      active = false;
    };
  }, [open, projectId]);

  const usedLocales = new Set(translations.map((item) => item.locale));
  const availableLocales = supportedLocales.filter(
    (locale) => locale !== baseLocale && !usedLocales.has(locale),
  );
  const activeTranslation = React.useMemo(
    () => translations.find((item) => item.locale === activeLocale) ?? null,
    [activeLocale, translations],
  );

  React.useEffect(() => {
    if (open) {
      setView('list');
      setActiveLocale(null);
    }
  }, [open]);

  React.useEffect(() => {
    if (view === 'edit' && activeLocale && !activeTranslation) {
      setView('list');
      setActiveLocale(null);
    }
  }, [activeLocale, activeTranslation, view]);

  const resetNewFields = (): void => {
    setNewLocale('');
    setNewName('');
    setNewSummary('');
    setNewDescription('');
    setNewStatus('');
  };

  const openAddPanel = (): void => {
    setError(null);
    resetNewFields();
    setView('add');
    setActiveLocale(null);
  };

  const openEditPanel = (locale: string): void => {
    setError(null);
    setView('edit');
    setActiveLocale(locale);
  };

  const hasNewContent = (): boolean => {
    return (
      newName.trim() !== '' ||
      newSummary.trim() !== '' ||
      newDescription.trim() !== '' ||
      newStatus !== ''
    );
  };

  const handleCreate = async (): Promise<void> => {
    if (!newLocale) {
      setError(createTranslationModalError('errors.localeRequired'));
      return;
    }

    if (!hasNewContent()) {
      setError(createTranslationModalError('errors.atLeastOne'));
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const payload = {
        locale: newLocale,
        name: normalizeText(newName),
        summary: normalizeText(newSummary),
        description: normalizeText(newDescription),
        status: normalizeStatus(newStatus),
      };

      const created = await createProjectTranslation(projectId, payload);

      setTranslations((current) => [
        ...current,
        {
          ...created,
          draftName: created.name ?? '',
          draftSummary: created.summary ?? '',
          draftDescription: created.description ?? '',
          draftStatus: created.status ?? '',
        },
      ]);
      resetNewFields();
    } catch (err) {
      setError(normalizeTranslationModalError(err));
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async (item: EditableTranslation): Promise<void> => {
    const name = item.draftName ?? '';
    const summary = item.draftSummary ?? '';
    const description = item.draftDescription ?? '';
    const status: DraftProjectStatus = item.draftStatus ?? '';

    if (
      name.trim() === '' &&
      summary.trim() === '' &&
      description.trim() === '' &&
      status === ''
    ) {
      setError(createTranslationModalError('errors.atLeastOne'));
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const payload = {
        locale: item.locale,
        name: normalizeText(name),
        summary: normalizeText(summary),
        description: normalizeText(description),
        status: normalizeStatus(status),
      };

      const updated = await updateProjectTranslation(
        projectId,
        item.locale,
        payload,
      );

      setTranslations((current) =>
        current.map((entry) =>
          entry.locale === item.locale
            ? {
                ...updated,
                draftName: updated.name ?? '',
                draftSummary: updated.summary ?? '',
                draftDescription: updated.description ?? '',
                draftStatus: updated.status ?? '',
              }
            : entry,
        ),
      );
    } catch (err) {
      setError(normalizeTranslationModalError(err));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (item: EditableTranslation): Promise<void> => {
    if (!window.confirm(t('confirmDelete', { locale: item.locale }))) {
      return;
    }

    setSaving(true);
    setError(null);

    try {
      await deleteProjectTranslation(projectId, item.locale);
      setTranslations((current) =>
        current.filter((entry) => entry.locale !== item.locale),
      );
    } catch (err) {
      setError(normalizeTranslationModalError(err));
    } finally {
      setSaving(false);
    }
  };

  const handleClose = (): void => {
    setError(null);
    resetNewFields();
    setView('list');
    setActiveLocale(null);
    onClose();
  };

  return (
    <TranslationModalLayout
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          handleClose();
        }
      }}
      maxWidthClassName="max-w-3xl"
      title={t('title')}
      description={
        <>
          {t('subtitle')}{' '}
          <span className="font-medium text-foreground">{projectLabel}</span>.
        </>
      }
      headerAction={
        null
      }
      footer={
        <Button variant="secondary" onClick={handleClose} disabled={saving}>
          {t('actions.close')}
        </Button>
      }
    >
      <TranslationModalBody>
        <div className="space-y-4">
          {errorMessage && (
            <div className="bg-destructive/10 text-destructive border-destructive/20 rounded-md border px-3 py-2 text-sm">
              {errorMessage}
            </div>
          )}

          {loading ? (
            <div className="text-muted-foreground flex items-center gap-2 text-sm">
              <Loader2 className="h-4 w-4 animate-spin" />
              {t('loading')}
            </div>
          ) : view === 'list' ? (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <Label>{t('existing')}</Label>
                <Button
                  size="sm"
                  onClick={openAddPanel}
                  disabled={saving || availableLocales.length === 0}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  {t('add')}
                </Button>
              </div>

              {translations.length === 0 ? (
                <p className="text-muted-foreground text-sm">
                  {t('empty')}
                </p>
              ) : (
                <div className="space-y-2">
                  {translations.map((item) => (
                    <div key={item.locale} className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => openEditPanel(item.locale)}
                        className="flex w-full items-center justify-between gap-3 rounded-md border px-3 py-2 text-left transition hover:bg-muted"
                      >
                        <div className="min-w-0">
                          <div className="text-sm font-medium">
                            {item.locale}
                          </div>
                          {item.draftName ? (
                            <div className="text-muted-foreground truncate text-xs">
                              {item.draftName}
                            </div>
                          ) : null}
                        </div>
                        <span className="text-muted-foreground text-xs">
                          {t('actions.edit')}
                        </span>
                      </button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="text-destructive"
                        onClick={() => handleDelete(item)}
                        disabled={saving}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : view === 'add' ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Button size="sm" variant="ghost" onClick={() => setView('list')}>
                  {t('actions.back')}
                </Button>
                <Label>{t('addPanelTitle')}</Label>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <div className="space-y-1.5">
                  <Select value={newLocale} onValueChange={setNewLocale}>
                    <SelectTrigger>
                      <SelectValue placeholder={t('fields.locale')} />
                    </SelectTrigger>
                    <SelectContent>
                      {availableLocales.map((locale) => (
                        <SelectItem key={locale} value={locale}>
                          {locale}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                    <Input
                      value={newName}
                      onChange={(event) => setNewName(event.target.value)}
                      placeholder={t('placeholders.name')}
                    />
                </div>
              </div>

              <div className="space-y-1.5">
                  <Textarea
                    value={newSummary}
                    onChange={(event) => setNewSummary(event.target.value)}
                    placeholder={t('placeholders.summary')}
                    rows={3}
                  />
              </div>

              <div className="space-y-1.5">
                <Select
                  value={newStatus === '' ? '__empty__' : newStatus}
                  onValueChange={(value) =>
                    setNewStatus(
                      value === '__empty__'
                        ? ''
                        : (isProjectStatusValue(value) ? value : ''),
                    )
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder={tForm('fields.status.placeholder')} />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

                <RichTextEditor
                  id="project-translation-new"
                  value={newDescription}
                  onChange={setNewDescription}
                  placeholder={t('placeholders.description')}
                />

              <div className="flex flex-wrap items-center gap-2">
                <Button
                  size="sm"
                  onClick={handleCreate}
                  disabled={saving || availableLocales.length === 0}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  {t('actions.add')}
                </Button>
                {availableLocales.length === 0 && (
                  <p className="text-muted-foreground text-xs">
                    {t('allCovered')}
                  </p>
                )}
              </div>
            </div>
          ) : activeTranslation ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Button size="sm" variant="ghost" onClick={() => setView('list')}>
                  {t('actions.back')}
                </Button>
                <Label>{activeTranslation.locale}</Label>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <div className="space-y-1.5">
                  <Label>{t('fields.name')}</Label>
                  <Input
                    value={activeTranslation.draftName ?? ''}
                    onChange={(event) =>
                      setTranslations((current) =>
                        current.map((entry) =>
                          entry.locale === activeTranslation.locale
                            ? { ...entry, draftName: event.target.value }
                            : entry,
                        ),
                      )
                    }
                  />
                </div>

                <div className="space-y-1.5">
                  <Label>{t('fields.summary')}</Label>
                  <Textarea
                    value={activeTranslation.draftSummary ?? ''}
                    onChange={(event) =>
                      setTranslations((current) =>
                        current.map((entry) =>
                          entry.locale === activeTranslation.locale
                            ? {
                                ...entry,
                                draftSummary: event.target.value,
                              }
                            : entry,
                        ),
                      )
                    }
                    rows={3}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>{t('fields.status')}</Label>
                <Select
                  value={(activeTranslation.draftStatus ?? '') === '' ? '__empty__' : (activeTranslation.draftStatus ?? '')}
                  onValueChange={(value) =>
                    setTranslations((current) =>
                      current.map((entry) =>
                        entry.locale === activeTranslation.locale
                          ? {
                              ...entry,
                              draftStatus:
                                value === '__empty__'
                                  ? ''
                                  : (isProjectStatusValue(value)
                                      ? value
                                      : ''),
                            }
                          : entry,
                      ),
                    )
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder={tForm('fields.status.placeholder')} />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label>{t('fields.description')}</Label>
                  <RichTextEditor
                    id={`project-translation-${activeTranslation.locale}`}
                    value={activeTranslation.draftDescription ?? ''}
                  onChange={(value) =>
                    setTranslations((current) =>
                      current.map((entry) =>
                        entry.locale === activeTranslation.locale
                          ? { ...entry, draftDescription: value }
                          : entry,
                      ),
                    )
                  }
                    placeholder={t('placeholders.description')}
                  />
              </div>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => handleUpdate(activeTranslation)}
                  disabled={saving}
                >
                  {t('actions.save')}
                </Button>
              </div>
            </div>
          ) : null}
        </div>
      </TranslationModalBody>
    </TranslationModalLayout>
  );
}
