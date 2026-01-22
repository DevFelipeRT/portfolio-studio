import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { RichTextEditor } from '@/Common/RichText/RichTextEditor';
import { RichTextRenderer } from '@/Common/RichText/RichTextRenderer';
import { Head } from '@inertiajs/react';
import { useState } from 'react';

export default function Dashboard() {
    const [editorValue, setEditorValue] = useState('');

    return (
        <AuthenticatedLayout
            header={
                <h1 className="text-xl font-semibold leading-tight">
                    Dashboard
                </h1>
            }
        >
            <Head title="Dashboard" />

            <div className="space-y-6">
                <div className="text-muted-foreground text-sm">
                    You're logged in!
                </div>

                <section className="bg-muted/40 space-y-4 rounded-md border p-6">
                    <div>
                        <h2 className="text-lg font-semibold">
                            Rich Text Lab
                        </h2>
                        <p className="text-muted-foreground text-sm">
                            Teste o editor rich text antes de usa-lo nos
                            templates.
                        </p>
                    </div>

                    <div className="flex flex-col gap-6">
                        <div className="space-y-2">
                            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
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
                                <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                                    Preview
                                </h3>
                                <div className="rounded-md border bg-background p-4">
                                    {editorValue ? (
                                        <RichTextRenderer
                                            value={editorValue}
                                        />
                                    ) : (
                                        <p className="text-muted-foreground text-sm">
                                            O preview vai aparecer aqui.
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                                    JSON
                                </h3>
                                <pre className="bg-background text-xs text-muted-foreground max-h-64 overflow-auto rounded-md border p-3">
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
