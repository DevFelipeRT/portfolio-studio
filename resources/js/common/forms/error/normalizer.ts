function normalizeStringError(formError: string): string | null {
  const message = formError.trim();
  return message.length > 0 ? message : null;
}

function joinNormalizedMessages(messages: Array<string | null>): string | null {
  const validMessages = messages.filter(
    (message): message is string => Boolean(message),
  );

  return validMessages.length > 0 ? validMessages.join(' ') : null;
}

function normalizeArrayError(formError: unknown[]): string | null {
  return joinNormalizedMessages(formError.map((entry) => normalizeFormError(entry)));
}

function normalizeObjectError(
  formError: Record<string, unknown>,
): string | null {
  const messageCandidate = normalizeFormError(formError.message);
  if (messageCandidate) {
    return messageCandidate;
  }

  return joinNormalizedMessages(
    Object.values(formError).map((entry) => normalizeFormError(entry)),
  );
}

/**
 * Normalizes a form error value into a single string.
 */
export function normalizeFormError(formError: unknown): string | null {
  if (typeof formError === 'string') {
    return normalizeStringError(formError);
  }

  if (Array.isArray(formError)) {
    return normalizeArrayError(formError);
  }

  if (formError && typeof formError === 'object') {
    return normalizeObjectError(formError as Record<string, unknown>);
  }

  return null;
}
