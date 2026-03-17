import { CollectionField, TextInputField, type FormErrors } from '@/common/forms';
import { Button } from '@/components/ui/button';
import {
  WEBSITE_SETTINGS_NAMESPACES,
  useWebsiteSettingsTranslation,
} from '@/modules/website-settings/i18n';
import type { WebsiteSettingsLink } from '@/modules/website-settings/types';

interface InstitutionalLinksSectionProps {
  errors: FormErrors;
  links: WebsiteSettingsLink[];
  onChange(links: WebsiteSettingsLink[]): void;
}

export function InstitutionalLinksSection({
  errors,
  links,
  onChange,
}: InstitutionalLinksSectionProps) {
  const { translate: tForm } = useWebsiteSettingsTranslation(
    WEBSITE_SETTINGS_NAMESPACES.form,
  );

  const handleLinkChange = (
    index: number,
    field: 'label' | 'url',
    value: string,
  ) => {
    const next = links.map((link, idx) =>
      idx === index ? { ...link, [field]: value } : link,
    );

    onChange(next);
  };

  const handleAddLink = () => {
    onChange([...links, { label: '', url: '' }]);
  };

  const handleRemoveLink = (index: number) => {
    onChange(links.filter((_, idx) => idx !== index));
  };

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">
          {tForm('sections.institutionalLinks.title')}
        </h2>
        <p className="text-muted-foreground text-sm">
          {tForm('sections.institutionalLinks.description')}
        </p>
      </div>

      <CollectionField
        name="institutional_links"
        items={links}
        errors={errors as FormErrors<string>}
        emptyState={
          <p className="text-muted-foreground text-sm">
            {tForm('sections.institutionalLinks.empty')}
          </p>
        }
        actions={
          <Button type="button" variant="outline" onClick={handleAddLink}>
            {tForm('actions.addLink')}
          </Button>
        }
        renderItem={(link, index) => (
          <div
            key={`link-${index}`}
            className="grid gap-3 rounded-md border p-4 md:grid-cols-[1fr_2fr_auto]"
          >
            <TextInputField
              name={`institutional_links.${index}.label`}
              id={`link-label-${index}`}
              value={link.label ?? ''}
              errors={errors}
              label={tForm('fields.institutional_link_label.label')}
              placeholder={tForm('fields.institutional_link_label.placeholder')}
              onChange={(value) => handleLinkChange(index, 'label', value)}
            />
            <TextInputField
              name={`institutional_links.${index}.url`}
              id={`link-url-${index}`}
              value={link.url ?? ''}
              errors={errors}
              label={tForm('fields.institutional_link_url.label')}
              placeholder={tForm('fields.institutional_link_url.placeholder')}
              onChange={(value) => handleLinkChange(index, 'url', value)}
            />
            <div className="flex items-end">
              <Button
                type="button"
                variant="ghost"
                onClick={() => handleRemoveLink(index)}
              >
                {tForm('actions.remove')}
              </Button>
            </div>
          </div>
        )}
      />
    </section>
  );
}
