<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Modules\Images\Application\Services\ImageService;
use App\Modules\Images\Domain\Models\Image;
use Database\Seeders\Concerns\PreventsProductionSeeding;
use Illuminate\Database\Seeder;
use Illuminate\Http\UploadedFile;

final class ImagesSeeder extends Seeder
{
    use PreventsProductionSeeding;

    private const MANIFEST_PATH = 'database/seeders/assets/images/manifest.json';

    /**
     * Seed canonical image records from committed seeder assets.
     *
     * This seeder intentionally seeds only images declared in the manifest.
     * Other images are left untouched.
     */
    public function run(): void
    {
        $this->assertNotProduction();

        $manifest = $this->loadManifest();

        $originalFilenames = [];
        foreach ($manifest as $entry) {
            $localPath = $entry['local_path'] ?? null;
            if (!is_string($localPath) || trim($localPath) === '') {
                continue;
            }

            $originalFilenames[] = basename($localPath);
        }

        $originalFilenames = array_values(array_unique(array_filter($originalFilenames)));

        /** @var ImageService $imageService */
        $imageService = app(ImageService::class);

        // Delete previously seeded images (and their stored files) deterministically.
        if ($originalFilenames !== []) {
            $existing = Image::query()
                ->whereIn('original_filename', $originalFilenames)
                ->get();

            foreach ($existing as $image) {
                $imageService->deleteCompletely($image);
            }
        }

        foreach ($manifest as $entry) {
            $localPath = $entry['local_path'] ?? null;
            if (!is_string($localPath) || trim($localPath) === '') {
                continue;
            }

            $fullPath = base_path($localPath);
            if (!is_file($fullPath)) {
                throw new \RuntimeException("Seed image asset not found: {$localPath}");
            }

            $module = $entry['module'] ?? null;
            $directory = is_string($module) && trim($module) !== '' ? trim($module) : 'images';

            $seederItem = $entry['seeder_item'] ?? null;
            $label = is_string($seederItem) && trim($seederItem) !== '' ? trim($seederItem) : null;

            $uploaded = new UploadedFile(
                path: $fullPath,
                originalName: basename($localPath),
                mimeType: null,
                error: null,
                test: true,
            );

            $imageService->createFromUploadedFile(
                file: $uploaded,
                directory: $directory,
                imageAttributes: [
                    'alt_text' => $label,
                    'image_title' => $label,
                    'caption' => $label,
                ],
            );
        }
    }

    /**
     * @return array<int,array<string,mixed>>
     */
    private function loadManifest(): array
    {
        $path = base_path(self::MANIFEST_PATH);

        if (!is_file($path)) {
            throw new \RuntimeException('Images seed manifest not found: ' . self::MANIFEST_PATH);
        }

        $raw = file_get_contents($path);
        if (!is_string($raw) || trim($raw) === '') {
            return [];
        }

        $decoded = json_decode($raw, true);

        if (!is_array($decoded)) {
            throw new \RuntimeException('Invalid JSON in images seed manifest: ' . self::MANIFEST_PATH);
        }

        /** @var array<int,array<string,mixed>> $decoded */
        return $decoded;
    }
}
