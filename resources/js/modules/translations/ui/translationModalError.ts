export type TranslationModalError =
  | { kind: 'message'; message: string }
  | { kind: 'translation'; key: string };

export function createTranslationModalError(
  key: string,
): TranslationModalError {
  return { kind: 'translation', key };
}

export function getTranslationModalErrorMessage(
  error: TranslationModalError | null,
  translate: (key: string) => string,
): string | null {
  if (!error) {
    return null;
  }

  return error.kind === 'message' ? error.message : translate(error.key);
}

export function normalizeTranslationModalError(
  error: unknown,
  fallbackKey = 'errors.unexpected',
): TranslationModalError {
  if (typeof error === 'string' && error.trim() !== '') {
    return { kind: 'message', message: error };
  }

  const message = (error as { response?: { data?: { message?: string } } })
    ?.response?.data?.message;

  if (typeof message === 'string' && message.trim() !== '') {
    return { kind: 'message', message };
  }

  return createTranslationModalError(fallbackKey);
}
