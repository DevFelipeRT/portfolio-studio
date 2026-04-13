export type OverlayError =
  | { kind: 'message'; message: string }
  | { kind: 'translation'; key: string };

function createError(key: string): OverlayError {
  return { kind: 'translation', key };
}

export function getErrorMessage(
  error: OverlayError | null,
  translate: (key: string) => string,
): string | null {
  if (!error) {
    return null;
  }

  return error.kind === 'message' ? error.message : translate(error.key);
}

export function normalizeError(
  error: unknown,
  fallbackKey = 'errors.unexpected',
): OverlayError {
  if (typeof error === 'string' && error.trim() !== '') {
    return { kind: 'message', message: error };
  }

  const message = (error as { response?: { data?: { message?: string } } })
    ?.response?.data?.message;

  if (typeof message === 'string' && message.trim() !== '') {
    return { kind: 'message', message };
  }

  return createError(fallbackKey);
}
