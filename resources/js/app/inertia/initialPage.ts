import type { Page } from '@inertiajs/core';

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

  return JSON.parse(raw) as Page;
}

