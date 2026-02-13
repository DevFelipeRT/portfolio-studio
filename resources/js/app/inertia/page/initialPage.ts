import type { Page } from '@inertiajs/core';

/**
 * Reads the initial Inertia page JSON from the root HTML document when running
 * in client-side rendering mode.
 */
export function resolveInitialPageForCSR(): Page {
  const script = document.getElementById('inertia-page');

  if (!script) {
    throw new Error(
      'Inertia initial page script element not found. Expected <script id="inertia-page" type="application/json"> in the root view.',
    );
  }

  const raw = script.textContent;

  if (!raw || raw.trim() === '') {
    throw new Error(
      'Inertia initial page script element is empty. Expected serialized page JSON.',
    );
  }

  try {
    return JSON.parse(raw) as Page;
  } catch (error) {
    throw new Error(
      'Failed to parse Inertia initial page JSON from <script id="inertia-page">.',
      { cause: error },
    );
  }
}
