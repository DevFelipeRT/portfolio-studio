import { TextInputField, type FormErrors } from '@/common/forms';
import { Button } from '@/components/ui/button';
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
        <h2 className="text-lg font-semibold">Links institucionais</h2>
        <p className="text-muted-foreground text-sm">
          Links globais usados no site inteiro.
        </p>
      </div>

      <div className="space-y-4">
        {links.length === 0 && (
          <p className="text-muted-foreground text-sm">
            Nenhum link cadastrado.
          </p>
        )}
        {links.map((link, index) => (
          <div
            key={`link-${index}`}
            className="grid gap-3 rounded-md border p-4 md:grid-cols-[1fr_2fr_auto]"
          >
            <TextInputField
              name={`institutional_links.${index}.label`}
              id={`link-label-${index}`}
              value={link.label ?? ''}
              errors={errors}
              label="Label"
              placeholder="Suporte"
              onChange={(value) => handleLinkChange(index, 'label', value)}
            />
            <TextInputField
              name={`institutional_links.${index}.url`}
              id={`link-url-${index}`}
              value={link.url ?? ''}
              errors={errors}
              label="URL"
              placeholder="https://meusite.com/suporte"
              onChange={(value) => handleLinkChange(index, 'url', value)}
            />
            <div className="flex items-end">
              <Button
                type="button"
                variant="ghost"
                onClick={() => handleRemoveLink(index)}
              >
                Remover
              </Button>
            </div>
          </div>
        ))}

        <Button type="button" variant="outline" onClick={handleAddLink}>
          Adicionar link
        </Button>
      </div>
    </section>
  );
}
