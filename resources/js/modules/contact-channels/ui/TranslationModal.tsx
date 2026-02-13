import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    createContactChannelTranslation,
    deleteContactChannelTranslation,
    fetchSupportedLocales,
    listContactChannelTranslations,
    updateContactChannelTranslation,
} from '@/modules/contact-channels/core/api/translations';
import type { TranslationItem } from '@/modules/contact-channels/core/types';
import { Loader2, Plus, Trash2 } from 'lucide-react';
import React from 'react';
import {
    TranslationModalBody,
    TranslationModalLayout,
} from '@/modules/translations/ui/TranslationModalParts';

type TranslationModalProps = {
    open: boolean;
    onClose: () => void;
    contactChannelId: number;
    entityLabel: string;
    baseLocale?: string;
};

type EditableTranslation = TranslationItem & { draftLabel?: string };

function normalizeError(error: unknown): string {
    if (typeof error === 'string') return error;
    const message = (error as { response?: { data?: { message?: string } } })
        ?.response?.data?.message;
    return message ?? 'Unexpected error. Please try again.';
}

export function TranslationModal({
    open,
    onClose,
    contactChannelId,
    entityLabel,
    baseLocale,
}: TranslationModalProps) {
    const [supportedLocales, setSupportedLocales] = React.useState<string[]>([]);
    const [translations, setTranslations] = React.useState<EditableTranslation[]>(
        [],
    );
    const [newLocale, setNewLocale] = React.useState<string>('');
    const [newLabel, setNewLabel] = React.useState<string>('');
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
                listContactChannelTranslations(contactChannelId),
            ]);

            setSupportedLocales(locales);
            setTranslations(items.map((item) => ({
                ...item,
                draftLabel: item.label ?? '',
            })));
        } catch (err) {
            setError(normalizeError(err));
        } finally {
            setLoading(false);
        }
    }, [open, contactChannelId]);

    React.useEffect(() => {
        void loadData();
    }, [loadData]);

    const usedLocales = new Set(translations.map((item) => item.locale));
    const availableLocales = supportedLocales.filter(
        (locale) => !usedLocales.has(locale) && locale !== baseLocale,
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
        if (!newLocale || !newLabel.trim()) {
            setError('Select a locale and provide a label.');
            return;
        }

        setSaving(true);
        setError(null);

        try {
            const payload = { locale: newLocale, label: newLabel.trim() };
            const created = await createContactChannelTranslation(
                contactChannelId,
                payload,
            );

            setTranslations((current) => [
                ...current,
                { ...created, draftLabel: created.label ?? '' },
            ]);
            setNewLocale('');
            setNewLabel('');
        } catch (err) {
            setError(normalizeError(err));
        } finally {
            setSaving(false);
        }
    };

    const openAddPanel = (): void => {
        setError(null);
        setNewLocale('');
        setNewLabel('');
        setView('add');
        setActiveLocale(null);
    };

    const openEditPanel = (locale: string): void => {
        setError(null);
        setView('edit');
        setActiveLocale(locale);
    };

    const handleUpdate = async (item: EditableTranslation): Promise<void> => {
        if (!item.draftLabel?.trim()) {
            setError('Translation label cannot be empty.');
            return;
        }

        setSaving(true);
        setError(null);

        try {
            const payload = { locale: item.locale, label: item.draftLabel.trim() };
            const updated = await updateContactChannelTranslation(
                contactChannelId,
                item.locale,
                payload,
            );

            setTranslations((current) =>
                current.map((entry) =>
                    entry.locale === item.locale
                        ? { ...updated, draftLabel: updated.label ?? '' }
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
            await deleteContactChannelTranslation(contactChannelId, item.locale);

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
        setNewLabel('');
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
                    Manage translations for <span className="font-semibold">{entityLabel}</span>.
                </>
            }
        >
            <TranslationModalBody>
                {loading && (
                    <div className="text-muted-foreground flex items-center gap-2 text-sm">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Loading translations...
                    </div>
                )}

                {!loading && (
                    <div className="space-y-6">
                        {view === 'list' && (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <Label>Existing translations</Label>
                                    <Button
                                        type="button"
                                        size="sm"
                                        variant="secondary"
                                        onClick={openAddPanel}
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
                                    <div className="space-y-3">
                                        {translations.map((item) => (
                                            <div
                                                key={item.locale}
                                                className="flex items-center gap-2"
                                            >
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => openEditPanel(item.locale)}
                                                >
                                                    {item.locale}
                                                </Button>
                                                <p className="text-sm">{item.label}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {view === 'add' && (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <Label>Add translation</Label>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setView('list')}
                                    >
                                        Back
                                    </Button>
                                </div>

                                {availableLocales.length === 0 ? (
                                    <p className="text-muted-foreground text-sm">
                                        All supported locales already have translations.
                                    </p>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="space-y-1.5">
                                            <Label htmlFor="translation-locale">
                                                Locale
                                            </Label>
                                            <Select
                                                value={newLocale}
                                                onValueChange={setNewLocale}
                                            >
                                                <SelectTrigger id="translation-locale">
                                                    <SelectValue placeholder="Select a locale" />
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
                                            <Label htmlFor="translation-label">Label</Label>
                                            <Input
                                                id="translation-label"
                                                value={newLabel}
                                                onChange={(event) => setNewLabel(event.target.value)}
                                            />
                                        </div>

                                        <div className="flex justify-end">
                                            <Button
                                                type="button"
                                                onClick={handleCreate}
                                                disabled={saving}
                                            >
                                                {saving ? 'Saving…' : 'Save translation'}
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {view === 'edit' && activeTranslation && (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <Label>Edit translation</Label>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setView('list')}
                                    >
                                        Back
                                    </Button>
                                </div>

                                <div className="space-y-1.5">
                                    <Label>{activeTranslation.locale}</Label>
                                    <Input
                                        value={activeTranslation.draftLabel ?? ''}
                                        onChange={(event) =>
                                            setTranslations((current) =>
                                                current.map((entry) =>
                                                    entry.locale === activeTranslation.locale
                                                        ? {
                                                              ...entry,
                                                              draftLabel: event.target.value,
                                                          }
                                                        : entry,
                                                ),
                                            )
                                        }
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => handleDelete(activeTranslation)}
                                        disabled={saving}
                                    >
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Delete
                                    </Button>

                                    <Button
                                        type="button"
                                        onClick={() => handleUpdate(activeTranslation)}
                                        disabled={saving}
                                    >
                                        {saving ? 'Saving…' : 'Save changes'}
                                    </Button>
                                </div>
                            </div>
                        )}

                        {error && (
                            <p className="text-destructive text-sm">{error}</p>
                        )}
                    </div>
                )}
            </TranslationModalBody>
        </TranslationModalLayout>
    );
}
