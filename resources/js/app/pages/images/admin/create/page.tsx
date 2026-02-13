// resources/js/Pages/Images/Create.tsx

import AuthenticatedLayout from '@/app/layouts/AuthenticatedLayout';
import { ImageForm } from '@/modules/images/ui/ImageForm';
import { Head, Link } from '@inertiajs/react';

/**
 * Page for creating a new image (upload + metadata).
 */
export default function Create() {
  return (
    <AuthenticatedLayout>
      <Head title="New image" />

      <div className="overflow-hidden">
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-4">
            <Link
              href={route('images.index')}
              className="text-muted-foreground hover:text-foreground text-sm"
            >
              Back to images
            </Link>
          </div>

          <ImageForm
            mode="create"
            submitRoute={route('images.store')}
            backRoute={route('images.index')}
          />
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
