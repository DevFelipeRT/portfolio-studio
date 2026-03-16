export type RuntimePageProps = Record<string, unknown>;

export type RuntimePage = {
  component: string;
  props: RuntimePageProps;
  url?: string;
  version?: string | null;
};
