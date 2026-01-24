export type WebsiteSettingsRobotsScope = {
    index: boolean;
    follow: boolean;
};

export type WebsiteSettingsRobots = {
    public?: WebsiteSettingsRobotsScope;
    private?: WebsiteSettingsRobotsScope;
};

export type WebsiteSettingsLink = {
    label?: string | null;
    url?: string | null;
};

export type WebsiteSettingsSystemPages = {
    not_found?: string | null;
    maintenance?: string | null;
    policies?: string | null;
};

export type WebsiteSettingsLocaleMap = Record<string, string>;

export interface WebsiteSettings {
    id: number;
    site_name?: WebsiteSettingsLocaleMap | null;
    site_description?: WebsiteSettingsLocaleMap | null;
    owner_name?: string | null;
    supported_locales?: string[] | null;
    default_locale?: string | null;
    fallback_locale?: string | null;
    canonical_base_url?: string | null;
    meta_title_template?: string | null;
    default_meta_title?: WebsiteSettingsLocaleMap | null;
    default_meta_description?: WebsiteSettingsLocaleMap | null;
    default_meta_image_id?: number | null;
    default_og_image_id?: number | null;
    default_twitter_image_id?: number | null;
    robots?: WebsiteSettingsRobots | null;
    system_pages?: WebsiteSettingsSystemPages | null;
    institutional_links?: WebsiteSettingsLink[] | null;
    public_scope_enabled?: boolean;
    private_scope_enabled?: boolean;
}

export type WebsiteSettingsPageProps = {
    settings: WebsiteSettings;
};
