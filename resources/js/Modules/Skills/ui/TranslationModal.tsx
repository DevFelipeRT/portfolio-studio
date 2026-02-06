import { Button } from '@/Components/Ui/button';
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
  createSkillCategoryTranslation,
  createSkillTranslation,
  deleteSkillCategoryTranslation,
  deleteSkillTranslation,
  fetchSupportedLocales,
  listSkillCategoryTranslations,
  listSkillTranslations,
  updateSkillCategoryTranslation,
  updateSkillTranslation,
} from '@/Modules/Skills/core/api/translations';
import type { TranslationItem } from '@/Modules/Skills/core/types';
import { Loader2, Plus, Trash2 } from 'lucide-react';
import React from 'react';
import {
  TranslationModalLayout,
  TranslationModalBody,
} from '@/Modules/Translations/ui/TranslationModalParts';

export type TranslationEntityType = 'skill' | 'skill-category';

type TranslationModalProps = {
  open: boolean;
  onClose: () => void;
  entityId: number;
  entityLabel: string;
  entityType: TranslationEntityType;
};

type EditableTranslation = TranslationItem & { draftName?: string };

function normalizeError(error: unknown): string {
  if (typeof error === 'string') return error;
  const message = (error as { response?: { data?: { message?: string } } })
    ?.response?.data?.message;
  return message ?? 'Unexpected error. Please try again.';
}

export function TranslationModal({
  open,
  onClose,
  entityId,
  entityLabel,
  entityType,
}: TranslationModalProps) {
  const [supportedLocales, setSupportedLocales] = React.useState<string[]>([]);
  const [translations, setTranslations] = React.useState<EditableTranslation[]>(
    [],
  );
  const [newLocale, setNewLocale] = React.useState<string>('');
  const [newName, setNewName] = React.useState<string>('');
  const [loading, setLoading] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [view, setView] = React.useState<'list' | 'add' | 'edit'>('list');
  const [activeLocale, setActiveLocale] = React.useState<string | null>(null);

  const loadData = React.useCallback(async () => {
    if (!open) return;
    setLoading(true);
    setError(null);

    try {
      const [locales, items] = await Promise.all([
        fetchSupportedLocales(),
        entityType === 'skill'
          ? listSkillTranslations(entityId)
          : listSkillCategoryTranslations(entityId),
      ]);

      setSupportedLocales(locales);
      setTranslations(items.map((item) => ({ ...item, draftName: item.name })));
    } catch (err) {
      setError(normalizeError(err));
    } finally {
      setLoading(false);
    }
  }, [open, entityId, entityType]);

  React.useEffect(() => {
    void loadData();
  }, [loadData]);

  const usedLocales = new Set(translations.map((item) => item.locale));
  const availableLocales = supportedLocales.filter(
    (locale) => !usedLocales.has(locale),
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

  const handleCreate = async (): Promise<void> => {
    if (!newLocale || !newName.trim()) {
      setError('Select a locale and provide a name.');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const payload = { locale: newLocale, name: newName.trim() };
      const created =
        entityType === 'skill'
          ? await createSkillTranslation(entityId, payload)
          : await createSkillCategoryTranslation(entityId, payload);

      setTranslations((current) => [
        ...current,
        { ...created, draftName: created.name },
      ]);
      setNewLocale('');
      setNewName('');
    } catch (err) {
      setError(normalizeError(err));
    } finally {
      setSaving(false);
    }
  };

  const openAddPanel = (): void => {
    setError(null);
    setNewLocale('');
    setNewName('');
    setView('add');
    setActiveLocale(null);
  };

  const openEditPanel = (locale: string): void => {
    setError(null);
    setView('edit');
    setActiveLocale(locale);
  };

  const handleUpdate = async (item: EditableTranslation): Promise<void> => {
    if (!item.draftName?.trim()) {
      setError('Translation name cannot be empty.');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const payload = { locale: item.locale, name: item.draftName.trim() };
      const updated =
        entityType === 'skill'
          ? await updateSkillTranslation(entityId, item.locale, payload)
          : await updateSkillCategoryTranslation(
              entityId,
              item.locale,
              payload,
            );

      setTranslations((current) =>
        current.map((entry) =>
          entry.locale === item.locale
            ? { ...updated, draftName: updated.name }
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
    if (!window.confirm(`Delete translation for ${item.locale}?`)) {
      return;
    }

    setSaving(true);
    setError(null);

    try {
      if (entityType === 'skill') {
        await deleteSkillTranslation(entityId, item.locale);
      } else {
        await deleteSkillCategoryTranslation(entityId, item.locale);
      }

      setTranslations((current) =>
        current.filter((entry) => entry.locale !== item.locale),
      );
    } catch (err) {
      setError(normalizeError(err));
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    setError(null);
    setNewLocale('');
    setNewName('');
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
      maxWidthClassName="max-w-2xl"
      title="Translations"
      description={
        <>
          Manage translations for{' '}
          <span className="font-medium text-foreground">{entityLabel}</span>.
        </>
      }
      headerAction={null}
      footer={
        <Button variant="secondary" onClick={handleClose} disabled={saving}>
          Close
        </Button>
      }
    >
      <TranslationModalBody>
        <div className="space-y-4">
          {error && (
            <div className="bg-destructive/10 text-destructive border-destructive/20 rounded-md border px-3 py-2 text-sm">
              {error}
            </div>
          )}

          {loading ? (
            <div className="text-muted-foreground flex items-center gap-2 text-sm">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading translations...
            </div>
          ) : view === 'list' ? (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <Label>Existing translations</Label>
                <Button
                  size="sm"
                  onClick={openAddPanel}
                  disabled={saving || availableLocales.length === 0}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add translation
                </Button>
              </div>

              {translations.length === 0 ? (
                <p className="text-muted-foreground text-sm">
                  No translations yet.
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
                        <span className="text-muted-foreground text-xs">Edit</span>
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
                  Back
                </Button>
                <Label>Add translation</Label>
              </div>

              <div className="flex flex-col gap-2 md:flex-row md:items-center">
                <Select value={newLocale} onValueChange={setNewLocale}>
                  <SelectTrigger className="md:w-40">
                    <SelectValue placeholder="Locale" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableLocales.map((locale) => (
                      <SelectItem key={locale} value={locale}>
                        {locale}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  value={newName}
                  onChange={(event) => setNewName(event.target.value)}
                  placeholder="Translated name"
                />
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  size="sm"
                  onClick={handleCreate}
                  disabled={saving || availableLocales.length === 0}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add
                </Button>
                {availableLocales.length === 0 && (
                  <p className="text-muted-foreground text-xs">
                    All supported locales already have translations.
                  </p>
                )}
              </div>
            </div>
          ) : activeTranslation ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Button size="sm" variant="ghost" onClick={() => setView('list')}>
                  Back
                </Button>
                <Label>{activeTranslation.locale}</Label>
              </div>
              <div className="space-y-1.5">
                <Label>Name</Label>
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
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => handleUpdate(activeTranslation)}
                  disabled={saving}
                >
                  Save
                </Button>
              </div>
            </div>
          ) : null}
        </div>
      </TranslationModalBody>
    </TranslationModalLayout>
  );
}
