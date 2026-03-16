export type PageFormPrimitiveValue =
  | Blob
  | FormDataEntryValue
  | Date
  | boolean
  | number
  | null
  | undefined;

export type PageFormValue =
  | PageFormPrimitiveValue
  | { [key: string]: PageFormValue }
  | PageFormValue[];

export type PageFormDataValues = Record<string, PageFormValue>;

export type PageFormSetData<TValues extends PageFormDataValues> = {
  (data: Partial<TValues>): void;
  (updater: (previousData: TValues) => TValues): void;
  <K extends keyof TValues>(key: K, value: TValues[K]): void;
};

export type PageFormSubmitOptions = Record<string, unknown>;

export type PageFormHook<TValues extends PageFormDataValues> = {
  data: TValues;
  setData: PageFormSetData<TValues>;
  errors: Record<string, string>;
  processing: boolean;
  recentlySuccessful?: boolean;
  isDirty?: boolean;
  hasErrors?: boolean;
  reset: (...fields: string[]) => void;
  clearErrors: (...fields: string[]) => void;
  setDefaults: (...args: unknown[]) => void;
  transform: (callback: (data: TValues) => Record<string, unknown>) => void;
  post: (url: string, options?: PageFormSubmitOptions) => void;
  put: (url: string, options?: PageFormSubmitOptions) => void;
  patch: (url: string, options?: PageFormSubmitOptions) => void;
  delete: (url: string, options?: PageFormSubmitOptions) => void;
};
