import { useLayoutsTranslation } from '../i18n';
import { ContentContainer } from '../primitives';

export function FooterBar() {
  const { translate } = useLayoutsTranslation('footer');
  const madeByLabel = translate('madeBy', 'Made by Felipe Ruiz Terrazas.');
  const rightsLabel = translate('rights', 'All rights reserved');

  return (
    <footer className="bg-background border-border text-muted-foreground w-full border-t py-4 text-sm">
      <ContentContainer
        contentWidth="default"
        className="flex items-center justify-between"
      >
        <span>
          © {new Date().getFullYear()} Portfolio. {madeByLabel}
        </span>
        <span className="sm:inline">{rightsLabel}</span>
      </ContentContainer>
    </footer>
  );
}
