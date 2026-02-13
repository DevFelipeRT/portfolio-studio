import type {
    WebsiteSettings,
    WebsiteSettingsLocaleMap,
    WebsiteSettingsLink,
    WebsiteSettingsSystemPages,
    WebsiteSettingsRobots,
} from '@/modules/website-settings/core/types';

export type WebsiteSettingsFormData = {
    site_name: WebsiteSettingsLocaleMap;
    site_description: WebsiteSettingsLocaleMap;
    owner_name: string;
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

type LocaleSource = Pick<
    WebsiteSettings,
    | 'site_name'
    | 'site_description'
    | 'default_meta_title'
    | 'default_meta_description'
    | 'default_locale'
    | 'fallback_locale'
>;

const buildLocaleList = (
    settings: LocaleSource,
    locales: string[],
): string[] => {
    const collected = new Set<string>();

    locales.forEach((locale) => {
        if (locale && locale !== 'auto') {
            collected.add(locale);
        }
    });

    if (settings.default_locale && settings.default_locale !== 'auto') {
        collected.add(settings.default_locale);
    }

    if (settings.fallback_locale && settings.fallback_locale !== 'auto') {
        collected.add(settings.fallback_locale);
    }

    const maps = [
        settings.site_name,
        settings.site_description,
        settings.default_meta_title,
        settings.default_meta_description,
    ];

    maps.forEach((map) => {
        if (!map) {
            return;
        }

        Object.keys(map).forEach((locale) => {
            if (locale && locale !== 'auto') {
                collected.add(locale);
            }
        });
    });

    return Array.from(collected);
};

export const buildWebsiteSettingsFormData = (
    settings: WebsiteSettings,
    locales: string[],
): WebsiteSettingsFormData => {
    const localeList = buildLocaleList(settings, locales);

    return {
        site_name: ensureLocaleMap(settings.site_name, localeList),
        site_description: ensureLocaleMap(
            settings.site_description,
            localeList,
        ),
        owner_name: settings.owner_name ?? '',
        default_locale: settings.default_locale ?? '',
        fallback_locale:
            settings.fallback_locale && settings.fallback_locale !== 'auto'
                ? settings.fallback_locale
                : settings.default_locale && settings.default_locale !== 'auto'
                  ? settings.default_locale
                  : localeList[0] ?? '',
        canonical_base_url: settings.canonical_base_url ?? '',
        meta_title_template: settings.meta_title_template ?? '',
        default_meta_title: ensureLocaleMap(
            settings.default_meta_title,
            localeList,
        ),
        default_meta_description: ensureLocaleMap(
            settings.default_meta_description,
            localeList,
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
    const localeList = buildLocaleList(
        {
            site_name: data.site_name,
            site_description: data.site_description,
            default_meta_title: data.default_meta_title,
            default_meta_description: data.default_meta_description,
            default_locale: data.default_locale,
            fallback_locale: data.fallback_locale,
        },
        locales,
    );

    return {
        ...data,
        site_name: ensureLocaleMap(data.site_name, localeList),
        site_description: ensureLocaleMap(data.site_description, localeList),
        default_meta_title: ensureLocaleMap(data.default_meta_title, localeList),
        default_meta_description: ensureLocaleMap(
            data.default_meta_description,
            localeList,
        ),
    };
};
