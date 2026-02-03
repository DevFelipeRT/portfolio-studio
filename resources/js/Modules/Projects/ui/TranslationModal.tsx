import { Button } from '@/Components/Ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/Components/Ui/dialog';
import { Input } from '@/Components/Ui/input';
import { Label } from '@/Components/Ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/Components/Ui/select';
import {
  createProjectTranslation,
  deleteProjectTranslation,
  fetchSupportedLocales,
  listProjectTranslations,
  updateProjectTranslation,
} from '@/Modules/Projects/core/api/translations';
import type { ProjectTranslationItem } from '@/Modules/Projects/core/types';
import { useTranslation } from '@/Common/i18n';
import { Loader2, Plus, Trash2 } from 'lucide-react';
import React from 'react';
import { RichTextEditor } from '@/Common/RichText/RichTextEditor';

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
};

function normalizeError(error: unknown): string {
  if (typeof error === 'string') return error;
  const message = (error as { response?: { data?: { message?: string } } })
    ?.response?.data?.message;
  return message ?? 'Unexpected error. Please try again.';
}

function normalizeText(value: string): string | null {
  const trimmed = value.trim();
  return trimmed === '' ? null : trimmed;
}

export function TranslationModal({
  open,
  onClose,
  projectId,
  projectLabel,
  baseLocale,
}: TranslationModalProps) {
  const { translate: t } = useTranslation('projects');
  const [supportedLocales, setSupportedLocales] = React.useState<string[]>([]);
  const [translations, setTranslations] = React.useState<EditableTranslation[]>(
    [],
  );
  const [newLocale, setNewLocale] = React.useState<string>('');
  const [newName, setNewName] = React.useState<string>('');
  const [newSummary, setNewSummary] = React.useState<string>('');
  const [newDescription, setNewDescription] = React.useState<string>('');
  const [loading, setLoading] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const loadData = React.useCallback(async () => {
    if (!open) return;
    setLoading(true);
    setError(null);

    try {
      const [locales, items] = await Promise.all([
        fetchSupportedLocales(),
        listProjectTranslations(projectId),
      ]);

      setSupportedLocales(locales);
      setTranslations(
        items.map((item) => ({
          ...item,
          draftName: item.name ?? '',
          draftSummary: item.summary ?? '',
          draftDescription: item.description ?? '',
        })),
      );
    } catch (err) {
      setError(normalizeError(err));
    } finally {
      setLoading(false);
    }
  }, [open, projectId]);

  React.useEffect(() => {
    void loadData();
  }, [loadData]);

  const usedLocales = new Set(translations.map((item) => item.locale));
  const availableLocales = supportedLocales.filter(
    (locale) => locale !== baseLocale && !usedLocales.has(locale),
  );

  const resetNewFields = (): void => {
    setNewLocale('');
    setNewName('');
    setNewSummary('');
    setNewDescription('');
  };

  const hasNewContent = (): boolean => {
    return (
      newName.trim() !== '' ||
      newSummary.trim() !== '' ||
      newDescription.trim() !== ''
    );
  };

  const handleCreate = async (): Promise<void> => {
    if (!newLocale) {
      setError(t('translations.errors.localeRequired'));
      return;
    }

    if (!hasNewContent()) {
      setError(t('translations.errors.atLeastOne'));
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
      };

      const created = await createProjectTranslation(projectId, payload);

      setTranslations((current) => [
        ...current,
        {
          ...created,
          draftName: created.name ?? '',
          draftSummary: created.summary ?? '',
          draftDescription: created.description ?? '',
        },
      ]);
      resetNewFields();
    } catch (err) {
      setError(normalizeError(err));
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async (item: EditableTranslation): Promise<void> => {
    const name = item.draftName ?? '';
    const summary = item.draftSummary ?? '';
    const description = item.draftDescription ?? '';

    if (
      name.trim() === '' &&
      summary.trim() === '' &&
      description.trim() === ''
    ) {
      setError(t('translations.errors.atLeastOne'));
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
              }
            : entry,
        ),
      );
    } catch (err) {
      setError(normalizeError(err));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (item: EditableTranslation): Promise<void> => {
    if (!window.confirm(t('translations.confirmDelete', { locale: item.locale }))) {
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
      setError(normalizeError(err));
    } finally {
      setSaving(false);
    }
  };

  const handleClose = (): void => {
    setError(null);
    resetNewFields();
    onClose();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          handleClose();
        }
      }}
    >
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{t('translations.title')}</DialogTitle>
          <DialogDescription>
            {t('translations.subtitle')}{' '}
            <span className="font-medium text-foreground">{projectLabel}</span>.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="bg-destructive/10 text-destructive border-destructive/20 rounded-md border px-3 py-2 text-sm">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-muted-foreground flex items-center gap-2 text-sm">
            <Loader2 className="h-4 w-4 animate-spin" />
            {t('translations.loading')}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>{t('translations.existing')}</Label>
              {translations.length === 0 && (
                <p className="text-muted-foreground text-sm">
                  {t('translations.empty')}
                </p>
              )}

              {translations.length > 0 && (
                <div className="space-y-3">
                  {translations.map((item) => (
                    <div
                      key={item.locale}
                      className="space-y-3 rounded-md border p-4"
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="text-sm font-medium md:w-24">
                          {item.locale}
                        </div>
                        <div className="ml-auto flex shrink-0 items-center gap-2">
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => handleUpdate(item)}
                            disabled={saving}
                          >
                            {t('translations.actions.save')}
                          </Button>
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
                      </div>

                      <div className="grid gap-3 md:grid-cols-2">
                        <div className="space-y-1.5">
                          <Label>{t('translations.fields.name')}</Label>
                          <Input
                            value={item.draftName ?? ''}
                            onChange={(event) =>
                              setTranslations((current) =>
                                current.map((entry) =>
                                  entry.locale === item.locale
                                    ? { ...entry, draftName: event.target.value }
                                    : entry,
                                ),
                              )
                            }
                          />
                        </div>

                        <div className="space-y-1.5">
                          <Label>{t('translations.fields.summary')}</Label>
                          <Input
                            value={item.draftSummary ?? ''}
                            onChange={(event) =>
                              setTranslations((current) =>
                                current.map((entry) =>
                                  entry.locale === item.locale
                                    ? {
                                        ...entry,
                                        draftSummary: event.target.value,
                                      }
                                    : entry,
                                ),
                              )
                            }
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <Label>{t('translations.fields.description')}</Label>
                        <RichTextEditor
                          id={`project-translation-${item.locale}`}
                          value={item.draftDescription ?? ''}
                          onChange={(value) =>
                            setTranslations((current) =>
                              current.map((entry) =>
                                entry.locale === item.locale
                                  ? {
                                      ...entry,
                                      draftDescription: value,
                                    }
                                  : entry,
                              ),
                            )
                          }
                          placeholder={t('translations.placeholders.description')}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label>{t('translations.add')}</Label>
              <div className="grid gap-3 md:grid-cols-2">
                <div className="space-y-1.5">
                  <Select value={newLocale} onValueChange={setNewLocale}>
                    <SelectTrigger>
                      <SelectValue placeholder={t('translations.fields.locale')} />
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
                    placeholder={t('translations.placeholders.name')}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Input
                  value={newSummary}
                  onChange={(event) => setNewSummary(event.target.value)}
                  placeholder={t('translations.placeholders.summary')}
                />
              </div>

              <RichTextEditor
                id="project-translation-new"
                value={newDescription}
                onChange={setNewDescription}
                placeholder={t('translations.placeholders.description')}
              />

              <div className="flex flex-wrap items-center gap-2">
                <Button
                  size="sm"
                  onClick={handleCreate}
                  disabled={saving || availableLocales.length === 0}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  {t('translations.actions.add')}
                </Button>
                {availableLocales.length === 0 && (
                  <p className="text-muted-foreground text-xs">
                    {t('translations.allCovered')}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="secondary" onClick={handleClose} disabled={saving}>
            {t('translations.actions.close')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
