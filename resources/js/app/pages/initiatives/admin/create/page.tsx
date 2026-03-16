import AuthenticatedLayout from '@/app/layouts/AuthenticatedLayout';
import { useSupportedLocales } from '@/common/locale';
import { useFormSubmit, type FormErrors } from '@/common/forms';
import { PageHead, PageLink, usePageForm, usePageProps } from '@/common/page-runtime';
import type {
  InitiativeFormData,
  InitiativeImageInput,
} from '@/modules/initiatives/core/forms';
import { InitiativeForm } from '@/modules/initiatives/ui/form/initiative';
import React from 'react';

const defaultInitiativeFormData: InitiativeFormData = {
  locale: '',
  name: '',
  summary: '',
  description: '',
  display: false,
  start_date: null,
  end_date: null,
  images: [],
};

export default function Create() {
  const supportedLocales = useSupportedLocales();
  const { data, setData, post, processing, transform } =
    usePageForm<InitiativeFormData>('initiatives.create', defaultInitiativeFormData);
  const submitForm = useFormSubmit();
  const { errors: formErrors } = usePageProps<{
    errors: FormErrors<keyof InitiativeFormData>;
  }>();

  function changeField<K extends keyof InitiativeFormData>(
    key: K,
    value: InitiativeFormData[K],
  ): void {
    setData((current: InitiativeFormData) => ({
      ...current,
      [key]: value,
    }));
  }

  function addImageRow(): void {
    setData((current: InitiativeFormData) => ({
      ...current,
      images: [
        ...current.images,
        {
          file: null,
          alt: '',
        } as InitiativeImageInput,
      ],
    }));
  }

  function removeImageRow(index: number): void {
    setData((current: InitiativeFormData) => ({
      ...current,
      images: current.images.filter((_image, i) => i !== index),
    }));
  }

  function updateImageAlt(index: number, value: string): void {
    setData((current: InitiativeFormData) => ({
      ...current,
      images: current.images.map((image, i) =>
        i === index ? { ...image, alt: value } : image,
      ),
    }));
  }

  function updateImageFile(
    index: number,
    event: React.ChangeEvent<HTMLInputElement>,
  ): void {
    const file = event.target.files?.[0] ?? null;

    setData((current: InitiativeFormData) => ({
      ...current,
      images: current.images.map((image, i) =>
        i === index ? { ...image, file } : image,
      ),
    }));
  }

  const submit = (event: React.FormEvent<HTMLFormElement>): void => {
    transform((current: InitiativeFormData) => {
      const validImages =
        current.images?.filter((image) => image.file instanceof File) ?? [];

      if (validImages.length === 0) {
        const next = { ...current };
        delete (next as { images?: unknown }).images;
        return next as InitiativeFormData;
      }

      return {
        ...current,
        images: validImages,
      };
    });

    submitForm(event, post, route('initiatives.store'), { forceFormData: true });
  };
  return (
    <AuthenticatedLayout>
      <PageHead title="New initiative" />

      <div className="overflow-hidden">
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-4">
            <PageLink
              href={route('initiatives.index')}
              className="text-muted-foreground hover:text-foreground text-sm"
            >
              Back to initiatives
            </PageLink>
          </div>

          <InitiativeForm
            submitLabel="Save initiative"
            cancelHref={route('initiatives.index')}
            existingImages={[]}
            data={data}
            errors={formErrors}
            processing={processing}
            supportedLocales={supportedLocales}
            onSubmit={submit}
            onChangeField={changeField}
            onAddImageRow={addImageRow}
            onRemoveImageRow={removeImageRow}
            onUpdateImageAlt={updateImageAlt}
            onUpdateImageFile={updateImageFile}
          />
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
