export function getHeaderHeight(): number {
  if (typeof document === 'undefined') {
    return 0;
  }

  const header = document.getElementById('app-header');
  if (!header) {
    return 0;
  }

  return header.getBoundingClientRect().height;
}
