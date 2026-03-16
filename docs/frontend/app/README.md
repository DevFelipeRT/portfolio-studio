# Frontend App

This directory documents the application-specific frontend layer under `resources/js/app`.

Unlike [`docs/frontend/common/`](../common/README.md), these docs describe code that belongs to this application shell and browser boot process rather than shared cross-project runtime utilities.

## Index

- [`bootstrap/`](./bootstrap/README.md): browser entry wiring, initial page reading, Inertia app creation, and page resolver orchestration.
- [`shell/`](./shell/README.md): application runtime policy, localization context, title policy, page decoration, shell i18n preload, and page-registry access.
