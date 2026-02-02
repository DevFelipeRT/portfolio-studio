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
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Translations</DialogTitle>
          <DialogDescription>
            Manage translations for{' '}
            <span className="font-medium text-foreground">{entityLabel}</span>.
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
            Loading translations...
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Existing translations</Label>
              {translations.length === 0 && (
                <p className="text-muted-foreground text-sm">
                  No translations yet.
                </p>
              )}

              {translations.length > 0 && (
                <div className="space-y-2">
                  {translations.map((item) => (
                    <div
                      key={item.locale}
                      className="flex flex-col gap-2 rounded-md border p-3 md:flex-row md:items-center"
                    >
                      <div className="text-sm font-medium md:w-24">
                        {item.locale}
                      </div>
                      <Input
                        value={item.draftName ?? ''}
                        onChange={(event) =>
                          setTranslations((current) =>
                            current.map((entry) =>
                              entry.locale === item.locale
                                ? {
                                    ...entry,
                                    draftName: event.target.value,
                                  }
                                : entry,
                            ),
                          )
                        }
                      />
                      <div className="flex shrink-0 items-center gap-2 md:ml-auto">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleUpdate(item)}
                          disabled={saving}
                        >
                          Save
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
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label>Add translation</Label>
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
                <Button
                  size="sm"
                  onClick={handleCreate}
                  disabled={saving || availableLocales.length === 0}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add
                </Button>
              </div>
              {availableLocales.length === 0 && (
                <p className="text-muted-foreground text-xs">
                  All supported locales already have translations.
                </p>
              )}
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="secondary" onClick={handleClose} disabled={saving}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
