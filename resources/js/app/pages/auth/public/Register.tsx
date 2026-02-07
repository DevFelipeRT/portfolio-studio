import { Button } from '@/Components/Ui/button';
import { Input } from '@/Components/Ui/input';
import { Label } from '@/Components/Ui/label';
import GuestLayout from '@/app/layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function Register() {
  const { data, setData, post, processing, errors, reset } = useForm({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });

  const submit: FormEventHandler = (e) => {
    e.preventDefault();

    post(route('register'), {
      onFinish: () => reset('password', 'password_confirmation'),
    });
  };

  return (
    <GuestLayout>
      <Head title="Register" />

      <form onSubmit={submit}>
        <div>
          <Label htmlFor="name">Name</Label>

          <Input
            id="name"
            name="name"
            value={data.name}
            className="mt-1"
            autoComplete="name"
            autoFocus
            onChange={(e) => setData('name', e.target.value)}
            required
          />

          {errors.name && (
            <p className="text-destructive mt-2 text-sm">{errors.name}</p>
          )}
        </div>

        <div className="mt-4">
          <Label htmlFor="email">Email</Label>

          <Input
            id="email"
            type="email"
            name="email"
            value={data.email}
            className="mt-1"
            autoComplete="username"
            onChange={(e) => setData('email', e.target.value)}
            required
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
            autoComplete="new-password"
            onChange={(e) => setData('password', e.target.value)}
            required
          />

          {errors.password && (
            <p className="text-destructive mt-2 text-sm">{errors.password}</p>
          )}
        </div>

        <div className="mt-4">
          <Label htmlFor="password_confirmation">Confirm Password</Label>

          <Input
            id="password_confirmation"
            type="password"
            name="password_confirmation"
            value={data.password_confirmation}
            className="mt-1"
            autoComplete="new-password"
            onChange={(e) => setData('password_confirmation', e.target.value)}
            required
          />

          {errors.password_confirmation && (
            <p className="text-destructive mt-2 text-sm">
              {errors.password_confirmation}
            </p>
          )}
        </div>

        <div className="mt-4 flex items-center justify-end gap-3">
          <Link
            href={route('login')}
            className="text-muted-foreground hover:text-foreground text-sm underline"
          >
            Already registered?
          </Link>

          <Button disabled={processing}>Register</Button>
        </div>
      </form>
    </GuestLayout>
  );
}
