import { Button } from '@/Components/Ui/button';
import { Checkbox } from '@/Components/Ui/checkbox';
import { Input } from '@/Components/Ui/input';
import { Label } from '@/Components/Ui/label';
import GuestLayout from '@/app/layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function Login({
  status,
  canResetPassword,
}: {
  status?: string;
  canResetPassword: boolean;
}) {
  const { data, setData, post, processing, errors, reset } = useForm({
    email: '',
    password: '',
    remember: false as boolean,
  });

  const submit: FormEventHandler = (e) => {
    e.preventDefault();

    post(route('login'), {
      onFinish: () => reset('password'),
    });
  };

  return (
    <GuestLayout>
      <Head title="Log in" />

      {status && (
        <div className="mb-4 text-sm font-medium text-green-600">{status}</div>
      )}

      <form onSubmit={submit}>
        <div>
          <Label htmlFor="email">Email</Label>

          <Input
            id="email"
            type="email"
            name="email"
            value={data.email}
            className="mt-1"
            autoComplete="username"
            autoFocus
            onChange={(e) => setData('email', e.target.value)}
          />

          {errors.email && (
            <p className="text-destructive mt-2 text-sm">{errors.email}</p>
          )}
        </div>

        <div className="mt-4">
          <Label htmlFor="password">Password</Label>

          <Input
            id="password"
            type="password"
            name="password"
            value={data.password}
            className="mt-1"
            autoComplete="current-password"
            onChange={(e) => setData('password', e.target.value)}
          />

          {errors.password && (
            <p className="text-destructive mt-2 text-sm">{errors.password}</p>
          )}
        </div>

        <div className="mt-4 block">
          <label className="flex items-center" htmlFor="remember">
            <Checkbox
              id="remember"
              name="remember"
              checked={data.remember}
              onCheckedChange={(checked) =>
                setData('remember', checked === true)
              }
            />
            <span className="text-muted-foreground ms-2 text-sm">
              Remember me
            </span>
          </label>
        </div>

        <div className="mt-4 flex items-center justify-end gap-3">
          {canResetPassword && (
            <Link
              href={route('password.request')}
              className="text-muted-foreground hover:text-foreground text-sm underline"
            >
              Forgot your password?
            </Link>
          )}

          <Button disabled={processing}>Log in</Button>
        </div>
      </form>
    </GuestLayout>
  );
}
