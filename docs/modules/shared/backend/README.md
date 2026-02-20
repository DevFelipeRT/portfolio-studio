# Shared (Backend)

Scope: cross-cutting abstractions, contracts, and utility helpers shared across domain modules.

Evidence:

- Base controller: `app/Modules/Shared/Abstractions/Http/Controller.php`
- Base mapper: `app/Modules/Shared/Abstractions/Mapping/Mapper.php`
- Data transformer: `app/Modules/Shared/Support/Data/DataTransformer.php`
- Rich text service (Lexical JSON): `app/Modules/Shared/Contracts/RichText/IRichTextService.php`, `app/Modules/Shared/Support/RichText/LexicalRichTextService.php`, `config/rich_text.php`
- Capability contracts + registration helper: `app/Modules/Shared/Contracts/Capabilities/*`, `app/Modules/Shared/Support/Capabilities/Traits/RegisterCapabilitiesTrait.php`
- Enum contracts + helpers: `app/Modules/Shared/Contracts/Enums/IEnum.php`, `app/Modules/Shared/Support/Enums/CommonEnumMethods.php`
- Date normalization: `app/Modules/Shared/Support/Normalizers/DateNormalizer.php`
- Example usage (mappers/enums/transformer): `app/Modules/Projects/Presentation/Mappers/ProjectMapper.php`, `app/Modules/Courses/Domain/Enums/CourseCategories.php`, `app/Modules/ContentManagement/Presentation/Presenters/PagePresenter.php`

## Base HTTP controller helpers

`App\Modules\Shared\Abstractions\Http\Controller` provides `mapPaginatedResource(...)`, a helper to shape a paginator into `{ data, pagination }` using a module mapper (`app/Modules/Shared/Abstractions/Http/Controller.php`).

Example usage:

- Courses index uses `mapPaginatedResource(..., CourseMapper::class)` (`app/Modules/Courses/Http/Controllers/CourseController.php`).

## Mapping layer (presentation mappers)

`Mapper` is a base class used by module-specific mappers to transform Eloquent models to arrays for frontend consumption (`app/Modules/Shared/Abstractions/Mapping/Mapper.php`).

Notable helper methods:

- `collection(iterable $models)` to map a collection
- `mapRelatedWithPivot(...)` to merge many-to-many related models with pivot metadata
- `formatDate(...)` for date formatting (`app/Modules/Shared/Abstractions/Mapping/Mapper.php`)

Example mapper:

- `ProjectMapper` maps project images with pivot fields `position`, `is_cover`, and `caption` (`app/Modules/Projects/Presentation/Mappers/ProjectMapper.php`).

## DataTransformer (DTO → array utilities)

`DataTransformer` is an immutable transformation pipeline commonly used to:

- convert DTOs into arrays
- recursively convert keys to snake_case for frontend props
- encode payloads as JSON (`app/Modules/Shared/Support/Data/DataTransformer.php`)

Example usage:

- Content management presenters transform DTOs and template DTOs into snake_case arrays (`app/Modules/ContentManagement/Presentation/Presenters/PagePresenter.php`, `app/Modules/ContentManagement/Presentation/Presenters/PageAdminPresenter.php`).

## Capabilities contracts (shared interface surface)

The capabilities subsystem’s public interfaces live under Shared contracts so provider/consumer modules can depend on contracts rather than concrete implementations (`app/Modules/Shared/Contracts/Capabilities/*`).

`RegisterCapabilitiesTrait` is a shared helper for module service providers to register capability provider classes with the global catalog when it is bound (`app/Modules/Shared/Support/Capabilities/Traits/RegisterCapabilitiesTrait.php`).

## Enum contract + common methods

`IEnum` standardizes a `label()` method and an `options()` helper for UI-friendly key/value pairs (`app/Modules/Shared/Contracts/Enums/IEnum.php`).

`CommonEnumMethods` implements `options()` for PHP enums that implement `IEnum` (`app/Modules/Shared/Support/Enums/CommonEnumMethods.php`).

Example:

- `CourseCategories` implements `IEnum` and uses `CommonEnumMethods` (`app/Modules/Courses/Domain/Enums/CourseCategories.php`).

## DateNormalizer

`DateNormalizer::toCarbon(...)` converts mixed date inputs into `Carbon` with explicit supported input types and error handling (`app/Modules/Shared/Support/Normalizers/DateNormalizer.php`).

## Rich text (Lexical JSON) persistence pipeline

Several modules store `description` as serialized Lexical JSON. The shared RichText service centralizes the technical pipeline needed before persistence:

1) normalize the raw input into a Lexical-compatible JSON document
2) enforce the configured max payload size in bytes (`RICH_TEXT_MAX_PAYLOAD_BYTES` / `config('rich_text.max_payload_bytes')`)
3) extract best-effort visible/plain text

Evidence:

- Contract: `app/Modules/Shared/Contracts/RichText/IRichTextService.php`
- Implementation: `app/Modules/Shared/Support/RichText/LexicalRichTextService.php`
- Normalization/extraction helpers: `app/Modules/Shared/Support/RichText/LexicalJsonNormalizer.php`, `app/Modules/Shared/Support/RichText/LexicalPlainTextExtractor.php`
- Config: `config/rich_text.php`, `.env.example`

Database note: when converting `description` columns to MySQL `JSON`, existing legacy/plain text values must be normalized to valid JSON documents (see `database/migrations/2026_02_20_130000_convert_rich_text_descriptions_to_json.php`).
