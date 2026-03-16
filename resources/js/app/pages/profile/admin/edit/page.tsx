import AuthenticatedLayout from '@/app/layouts/AuthenticatedLayout';
import { PageContent } from '@/app/layouts/primitives';
import { PageHead } from '@/common/page-runtime';
import DeleteUserForm from '@/modules/profile/ui/DeleteUserForm';
import UpdatePasswordForm from '@/modules/profile/ui/UpdatePasswordForm';
import UpdateProfileInformationForm from '@/modules/profile/ui/UpdateProfileInformationForm';
import { PageProps } from '@/types';

export default function Edit({
  mustVerifyEmail,
  status,
}: PageProps<{ mustVerifyEmail: boolean; status?: string }>) {
  return (
    <AuthenticatedLayout>
      <PageHead title="Profile" />

      <PageContent className="space-y-4 py-8" pageWidth="detail">
        <div>
          <h1 className="text-xl leading-tight font-semibold">Profile</h1>
        </div>

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
      </PageContent>
    </AuthenticatedLayout>
  );
}
