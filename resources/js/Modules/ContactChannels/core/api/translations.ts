import type { TranslationItem } from '@/Modules/ContactChannels/core/types';

type TranslationPayload = {
    locale: string;
    label: string;
};

function ensureArray(value: unknown): string[] {
    return Array.isArray(value)
        ? value.filter((item): item is string => typeof item === 'string')
        : [];
}

export async function fetchSupportedLocales(): Promise<string[]> {
    const response = await window.axios.get(route('website-settings.locales'));

    return ensureArray(response?.data?.data);
}

export async function listContactChannelTranslations(
    contactChannelId: number,
): Promise<TranslationItem[]> {
    const response = await window.axios.get(
        route('contact-channels.translations.index', contactChannelId),
    );

    return (response?.data?.data as TranslationItem[]) ?? [];
}

export async function createContactChannelTranslation(
    contactChannelId: number,
    payload: TranslationPayload,
): Promise<TranslationItem> {
    const response = await window.axios.post(
        route('contact-channels.translations.store', contactChannelId),
        payload,
    );

    return response.data?.data as TranslationItem;
}

export async function updateContactChannelTranslation(
    contactChannelId: number,
    locale: string,
    payload: TranslationPayload,
): Promise<TranslationItem> {
    const response = await window.axios.put(
        route('contact-channels.translations.update', { contactChannel: contactChannelId, locale }),
        payload,
    );

    return response.data?.data as TranslationItem;
}

export async function deleteContactChannelTranslation(
    contactChannelId: number,
    locale: string,
): Promise<void> {
    await window.axios.delete(
        route('contact-channels.translations.destroy', { contactChannel: contactChannelId, locale }),
    );
}
