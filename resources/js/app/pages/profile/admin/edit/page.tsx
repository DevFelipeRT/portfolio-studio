import AuthenticatedLayout from '@/app/layouts/AuthenticatedLayout';
import DeleteUserForm from '@/modules/profile/ui/DeleteUserForm';
import UpdatePasswordForm from '@/modules/profile/ui/UpdatePasswordForm';
import UpdateProfileInformationForm from '@/modules/profile/ui/UpdateProfileInformationForm';
import { PageProps } from '@/types';
import { Head } from '@inertiajs/react';

export default function Edit({
  mustVerifyEmail,
  status,
}: PageProps<{ mustVerifyEmail: boolean; status?: string }>) {
  return (
    <AuthenticatedLayout
      header={
        <h2 className="text-xl leading-tight font-semibold text-gray-800 dark:text-gray-200">
          Profile
        </h2>
      }
    >
      <Head title="Profile" />

      <div className="space-y-4">
        <div className="bg-card border-border border p-4 shadow sm:rounded-lg sm:p-8">
          <UpdateProfileInformationForm
            mustVerifyEmail={mustVerifyEmail}
            status={status}
            className="max-w-xl"
          />
        </div>

        <div className="bg-card border-border border p-4 shadow sm:rounded-lg sm:p-8">
          <UpdatePasswordForm className="max-w-xl" />
        </div>

        <div className="bg-card border-border border p-4 shadow sm:rounded-lg sm:p-8">
          <DeleteUserForm className="max-w-xl" />
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
