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
  createExperienceTranslation,
  deleteExperienceTranslation,
  fetchSupportedLocales,
  listExperienceTranslations,
  updateExperienceTranslation,
} from '@/modules/experiences/core/api/translations';
import type { ExperienceTranslationItem } from '@/modules/experiences/core/types';
import {
  useExperiencesTranslation,
  EXPERIENCES_NAMESPACES,
} from '@/modules/experiences/i18n';
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
  experienceId: number;
  experienceLabel: string;
  baseLocale: string;
};

type EditableTranslation = ExperienceTranslationItem & {
  draftPosition?: string;
  draftCompany?: string;
  draftSummary?: string;
  draftDescription?: string;
};

function normalizeText(value: string): string | null {
  const trimmed = value.trim();
  return trimmed === '' ? null : trimmed;
}

export function TranslationModal({
  open,
  onClose,
  experienceId,
  experienceLabel,
  baseLocale,
}: TranslationModalProps) {
  const { translate: t } = useExperiencesTranslation(
    EXPERIENCES_NAMESPACES.translations,
  );
  const [supportedLocales, setSupportedLocales] = React.useState<string[]>([]);
  const [translations, setTranslations] = React.useState<EditableTranslation[]>(
    [],
  );
  const [newLocale, setNewLocale] = React.useState<string>('');
  const [newPosition, setNewPosition] = React.useState<string>('');
  const [newCompany, setNewCompany] = React.useState<string>('');
  const [newSummary, setNewSummary] = React.useState<string>('');
  const [newDescription, setNewDescription] = React.useState<string>('');
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
          listExperienceTranslations(experienceId),
        ]);

        if (!active) {
          return;
        }

        setSupportedLocales(locales);
        setTranslations(
          items.map((item) => ({
            ...item,
            draftPosition: item.position ?? '',
            draftCompany: item.company ?? '',
            draftSummary: item.summary ?? '',
            draftDescription: item.description ?? '',
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
  }, [experienceId, open]);

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
    setNewPosition('');
    setNewCompany('');
    setNewSummary('');
    setNewDescription('');
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
      newPosition.trim() !== '' ||
      newCompany.trim() !== '' ||
      newSummary.trim() !== '' ||
      newDescription.trim() !== ''
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
        position: normalizeText(newPosition),
        company: normalizeText(newCompany),
        summary: normalizeText(newSummary),
        description: normalizeText(newDescription),
      };

      const created = await createExperienceTranslation(experienceId, payload);

      setTranslations((current) => [
        ...current,
        {
          ...created,
          draftPosition: created.position ?? '',
          draftCompany: created.company ?? '',
          draftSummary: created.summary ?? '',
          draftDescription: created.description ?? '',
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
    const position = item.draftPosition ?? '';
    const company = item.draftCompany ?? '';
    const summary = item.draftSummary ?? '';
    const description = item.draftDescription ?? '';

    if (
      position.trim() === '' &&
      company.trim() === '' &&
      summary.trim() === '' &&
      description.trim() === ''
    ) {
      setError(createTranslationModalError('errors.atLeastOne'));
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const payload = {
        locale: item.locale,
        position: normalizeText(position),
        company: normalizeText(company),
        summary: normalizeText(summary),
        description: normalizeText(description),
      };

      const updated = await updateExperienceTranslation(
        experienceId,
        item.locale,
        payload,
      );

      setTranslations((current) =>
        current.map((entry) =>
          entry.locale === item.locale
            ? {
                ...updated,
                draftPosition: updated.position ?? '',
                draftCompany: updated.company ?? '',
                draftSummary: updated.summary ?? '',
                draftDescription: updated.description ?? '',
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
      await deleteExperienceTranslation(experienceId, item.locale);
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
          <span className="font-medium text-foreground">{experienceLabel}</span>.
        </>
      }
      headerAction={null}
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
                          {item.draftPosition ? (
                            <div className="text-muted-foreground truncate text-xs">
                              {item.draftPosition}
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
                    value={newPosition}
                    onChange={(event) => setNewPosition(event.target.value)}
                    placeholder={t('placeholders.position')}
                  />
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <Input
                  value={newCompany}
                  onChange={(event) => setNewCompany(event.target.value)}
                  placeholder={t('placeholders.company')}
                />
                <Textarea
                  value={newSummary}
                  onChange={(event) => setNewSummary(event.target.value)}
                  placeholder={t('placeholders.summary')}
                  rows={3}
                />
              </div>

              <RichTextEditor
                id="experience-translation-new"
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
                  <Label>{t('fields.position')}</Label>
                  <Input
                    value={activeTranslation.draftPosition ?? ''}
                    onChange={(event) =>
                      setTranslations((current) =>
                        current.map((entry) =>
                          entry.locale === activeTranslation.locale
                            ? { ...entry, draftPosition: event.target.value }
                            : entry,
                        ),
                      )
                    }
                  />
                </div>

                <div className="space-y-1.5">
                  <Label>{t('fields.company')}</Label>
                  <Input
                    value={activeTranslation.draftCompany ?? ''}
                    onChange={(event) =>
                      setTranslations((current) =>
                        current.map((entry) =>
                          entry.locale === activeTranslation.locale
                            ? {
                                ...entry,
                                draftCompany: event.target.value,
                              }
                            : entry,
                        ),
                      )
                    }
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>{t('fields.summary')}</Label>
                <Textarea
                  value={activeTranslation.draftSummary ?? ''}
                  onChange={(event) =>
                    setTranslations((current) =>
                      current.map((entry) =>
                        entry.locale === activeTranslation.locale
                          ? { ...entry, draftSummary: event.target.value }
                          : entry,
                      ),
                    )
                  }
                  rows={3}
                />
              </div>

              <div className="space-y-1.5">
                <Label>{t('fields.description')}</Label>
                <RichTextEditor
                  id={`experience-translation-${activeTranslation.locale}`}
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
