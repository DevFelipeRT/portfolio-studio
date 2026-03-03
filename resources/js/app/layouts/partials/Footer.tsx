import { useLayoutsTranslation } from '@/app/layouts/i18n';

export default function Footer() {
  const { translate } = useLayoutsTranslation('footer');

  const madeByLabel = translate('madeBy', 'Made by Felipe Ruiz Terrazas.');
  const rightsLabel = translate('rights', 'All rights reserved');

  return (
    <footer className="bg-background border-border text-muted-foreground border-t py-4 text-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <span>
          © {new Date().getFullYear()} Portfolio. {madeByLabel}
        </span>
        <span className="sm:inline">{rightsLabel}</span>
      </div>
    </footer>
  );
}
