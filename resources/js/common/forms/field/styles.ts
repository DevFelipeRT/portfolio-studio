/**
 * Returns the input class name used for error state styling.
 */
export function getInputErrorClassName(hasError: boolean): string {
  return hasError ? 'border-destructive focus-visible:ring-destructive' : '';
}

/**
 * Returns the select trigger class name used for error state styling.
 */
export function getSelectErrorClassName(hasError: boolean): string {
  return hasError ? 'border-destructive focus:ring-destructive' : '';
}
