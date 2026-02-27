export function formatFileSize(bytes: number | null | undefined): string | null {
  if (bytes == null || Number.isNaN(bytes)) {
    return null;
  }

  if (bytes < 1024) {
    return `${bytes} B`;
  }

  const kb = bytes / 1024;
  if (kb < 1024) {
    return `${kb.toFixed(1)} KB`;
  }

  const mb = kb / 1024;
  if (mb < 1024) {
    return `${mb.toFixed(2)} MB`;
  }

  const gb = mb / 1024;
  return `${gb.toFixed(2)} GB`;
}

export function formatDimensions(
  width: number | null | undefined,
  height: number | null | undefined,
): string | null {
  if (
    width == null ||
    height == null ||
    Number.isNaN(width) ||
    Number.isNaN(height)
  ) {
    return null;
  }

  return `${width} × ${height}px`;
}

