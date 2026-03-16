import type { PageRuntimeAdapter } from '../../types';
import { InertiaPageHead } from './InertiaPageHead';
import { InertiaPageLink } from './InertiaPageLink';
import { inertiaPageRouter } from './inertiaPageRouter';
import { useInertiaCurrentPage } from './useInertiaCurrentPage';
import { useInertiaPageForm } from './useInertiaPageForm';
import { useInertiaPageProps } from './useInertiaPageProps';

export function createInertiaAdapter(): PageRuntimeAdapter {
  return {
    Head: InertiaPageHead,
    Link: InertiaPageLink,
    router: inertiaPageRouter,
    useCurrentPage: useInertiaCurrentPage,
    usePageProps: useInertiaPageProps,
    useForm: useInertiaPageForm,
  };
}
