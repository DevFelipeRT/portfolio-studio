// resources/js/Pages/Images/Edit.tsx

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { ImageForm } from '@/Modules/Images/ui/ImageForm';
import type { Image } from '@/Modules/Images/core/types';

interface EditImagePageProps {
  image: Image;
}

/**
 * Page for editing global metadata of an existing image.
 */
export default function Edit({ image }: EditImagePageProps) {
  return (
    <AuthenticatedLayout>
      <Head title="Edit image" />

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
            mode="edit"
            submitRoute={route('images.update', image.id)}
            backRoute={route('images.index')}
            image={image}
          />
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
