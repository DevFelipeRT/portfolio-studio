import type {
    WebsiteSettings,
    WebsiteSettingsLocaleMap,
    WebsiteSettingsLink,
    WebsiteSettingsSystemPages,
    WebsiteSettingsRobots,
} from '@/Modules/WebsiteSettings/core/types';

export type WebsiteSettingsFormData = {
    site_name: WebsiteSettingsLocaleMap;
    site_description: WebsiteSettingsLocaleMap;
    owner_name: string;
    supported_locales: string[];
    default_locale: string;
    fallback_locale: string;
    canonical_base_url: string;
    meta_title_template: string;
    default_meta_title: WebsiteSettingsLocaleMap;
    default_meta_description: WebsiteSettingsLocaleMap;
    default_meta_image_id: number | '';
    default_og_image_id: number | '';
    default_twitter_image_id: number | '';
    robots: Required<WebsiteSettingsRobots>;
    system_pages: WebsiteSettingsSystemPages;
    institutional_links: WebsiteSettingsLink[];
    public_scope_enabled: boolean;
    private_scope_enabled: boolean;
};

const defaultRobots = {
    public: {
        index: true,
        follow: true,
    },
    private: {
        index: false,
        follow: false,
    },
};

const defaultSystemPages: WebsiteSettingsSystemPages = {
    not_found: '',
    maintenance: '',
    policies: '',
};

const defaultLinks: WebsiteSettingsLink[] = [];

const ensureLocaleMap = (
    map: WebsiteSettingsLocaleMap | null | undefined,
    locales: string[],
): WebsiteSettingsLocaleMap => {
    const next: WebsiteSettingsLocaleMap = {};

    locales.forEach((locale) => {
        next[locale] = map?.[locale] ?? '';
    });

    return next;
};

export const buildWebsiteSettingsFormData = (
    settings: WebsiteSettings,
): WebsiteSettingsFormData => {
    const supportedLocales = Array.isArray(settings.supported_locales)
        ? settings.supported_locales
        : [];

    return {
        site_name: ensureLocaleMap(settings.site_name, supportedLocales),
        site_description: ensureLocaleMap(
            settings.site_description,
            supportedLocales,
        ),
        owner_name: settings.owner_name ?? '',
        supported_locales: supportedLocales,
        default_locale: settings.default_locale ?? '',
        fallback_locale: settings.fallback_locale ?? '',
        canonical_base_url: settings.canonical_base_url ?? '',
        meta_title_template: settings.meta_title_template ?? '',
        default_meta_title: ensureLocaleMap(
            settings.default_meta_title,
            supportedLocales,
        ),
        default_meta_description: ensureLocaleMap(
            settings.default_meta_description,
            supportedLocales,
        ),
        default_meta_image_id: settings.default_meta_image_id ?? '',
        default_og_image_id: settings.default_og_image_id ?? '',
        default_twitter_image_id: settings.default_twitter_image_id ?? '',
        robots: {
            public: {
                index: settings.robots?.public?.index ?? defaultRobots.public.index,
                follow: settings.robots?.public?.follow ?? defaultRobots.public.follow,
            },
            private: {
                index: settings.robots?.private?.index ?? defaultRobots.private.index,
                follow: settings.robots?.private?.follow ?? defaultRobots.private.follow,
            },
        },
        system_pages: {
            ...defaultSystemPages,
            ...(settings.system_pages ?? {}),
        },
        institutional_links: settings.institutional_links ?? defaultLinks,
        public_scope_enabled: settings.public_scope_enabled ?? true,
        private_scope_enabled: settings.private_scope_enabled ?? true,
    };
};

export const syncLocaleMaps = (
    data: WebsiteSettingsFormData,
    locales: string[],
): WebsiteSettingsFormData => {
    return {
        ...data,
        site_name: ensureLocaleMap(data.site_name, locales),
        site_description: ensureLocaleMap(data.site_description, locales),
        default_meta_title: ensureLocaleMap(data.default_meta_title, locales),
        default_meta_description: ensureLocaleMap(
            data.default_meta_description,
            locales,
        ),
    };
};
