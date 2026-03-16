import AuthenticatedLayout from '@/app/layouts/AuthenticatedLayout';
import { PageContent } from '@/app/layouts/primitives';
import { PageHead } from '@/common/page-runtime';
import { RichTextEditor } from '@/common/rich-text/RichTextEditor';
import { RichTextRenderer } from '@/common/rich-text/RichTextRenderer';
import { useState } from 'react';

export default function Dashboard() {
  const [editorValue, setEditorValue] = useState('');

  return (
    <AuthenticatedLayout>
      <PageHead title="Dashboard" />

      <PageContent className="space-y-6 py-8" pageWidth="default">
        <div>
          <h1 className="text-xl leading-tight font-semibold">Dashboard</h1>
        </div>

        <div className="text-muted-foreground text-sm">You&apos;re logged in!</div>

        <section className="bg-muted/40 space-y-4 rounded-md border p-6">
          <div>
            <h2 className="text-lg font-semibold">Rich Text Lab</h2>
            <p className="text-muted-foreground text-sm">
              Teste o editor rich text antes de usa-lo nos templates.
            </p>
          </div>

          <div className="flex flex-col gap-6">
            <div className="space-y-2">
              <h3 className="text-muted-foreground text-sm font-semibold tracking-wide uppercase">
                Editor
              </h3>
              <RichTextEditor
                id="dashboard-rich-text"
                value={editorValue}
                onChange={setEditorValue}
              />
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-muted-foreground text-sm font-semibold tracking-wide uppercase">
                  Preview
                </h3>
                <div className="bg-background rounded-md border p-4">
                  {editorValue ? (
                    <RichTextRenderer value={editorValue} />
                  ) : (
                    <p className="text-muted-foreground text-sm">
                      O preview vai aparecer aqui.
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-muted-foreground text-sm font-semibold tracking-wide uppercase">
                  JSON
                </h3>
                <pre className="bg-background text-muted-foreground max-h-64 overflow-auto rounded-md border p-3 text-xs">
                  {editorValue || 'Sem conteudo ainda.'}
                </pre>
              </div>
            </div>
          </div>
        </section>
      </PageContent>
    </AuthenticatedLayout>
  );
}
