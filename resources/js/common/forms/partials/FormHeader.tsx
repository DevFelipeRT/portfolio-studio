import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';
import {
  FormLocaleField,
  type FormLocaleFieldProps,
} from '../field/presets/FormLocaleField';

type FormHeaderProps = {
  title: ReactNode;
  className?: string;
  showLocaleSelector?: boolean;
  localeFieldProps?: FormLocaleFieldProps;
};

export function FormHeader({
  title,
  className,
  showLocaleSelector = true,
  localeFieldProps: localeField,
}: FormHeaderProps) {
  const hasSelector = Boolean(localeField) && showLocaleSelector;

  return (
    <div className={cn('flex justify-between', className)}>
      <div>{title}</div>

      {hasSelector ? (
        <div className="max-w-fit">
          <FormLocaleField {...localeField!} />
        </div>
      ) : null}
    </div>
  );
}
