import AuthenticatedLayout from '@/app/layouts/AuthenticatedLayout';
import { RichTextEditor } from '@/common/rich-text/RichTextEditor';
import { RichTextRenderer } from '@/common/rich-text/RichTextRenderer';
import { Head } from '@inertiajs/react';
import { useState } from 'react';

export default function Dashboard() {
  const [editorValue, setEditorValue] = useState('');

  return (
    <AuthenticatedLayout
      header={
        <h1 className="text-xl leading-tight font-semibold">Dashboard</h1>
      }
    >
      <Head title="Dashboard" />

      <div className="space-y-6">
        <div className="text-muted-foreground text-sm">You're logged in!</div>

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
      </div>
    </AuthenticatedLayout>
  );
}
