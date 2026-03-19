# Frontend Common

This directory documents shared frontend surfaces that do not belong to a specific domain module under `resources/js/modules/*`.

## Index

- [`i18n/`](./i18n/README.md): shared internationalization runtime, bundle preloading, scope registry, and Inertia integration.
- [`page-runtime/`](./page-runtime/README.md): shared page runtime facade for `Link`, `Head`, navigation, page props, and forms, with the concrete Inertia adapter hidden behind a stable shared API.
- `table/`: shared admin-table foundation under `resources/js/common/table`, including a compositional `SystemTable`, card/shell helpers, interactive row behavior, empty-state/action helpers, and lightweight class presets for future adoption.
