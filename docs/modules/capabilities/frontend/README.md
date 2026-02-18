# Capabilities (Frontend)

There is no dedicated frontend module for the capabilities subsystem.

Capabilities are executed server-side (in-process) and their results reach the browser only as part of normal HTTP responses (for example, injected into section payloads during public page rendering) (`app/Modules/Capabilities/Domain/Services/CapabilityResolver.php`, `app/Modules/ContentManagement/Presentation/Presenters/PagePresenter.php`).

