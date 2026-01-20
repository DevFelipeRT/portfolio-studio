<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Modules\Images\Domain\Models\Image;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;

final class PruneOrphanImages extends Command
{
    protected $signature = 'images:prune-orphans
        {--disk=public : Filesystem disk name used by stored images}
        {--path=images : Directory within the disk to scan}
        {--dry-run : Report candidate deletions without removing files}
        {--min-age-minutes=60 : Minimum file age in minutes to be eligible for deletion}
        {--sample=25 : Max number of orphan paths to print in the report}';

    protected $description = 'Removes image files from storage that have no corresponding database record.';

    public function handle(): int
    {
        $disk = $this->normalizeDisk((string) $this->option('disk'));
        $path = $this->normalizePath((string) $this->option('path'));
        $dryRun = (bool) $this->option('dry-run');

        $minAgeMinutes = $this->toNonNegativeInt($this->option('min-age-minutes'), 60);
        $minAgeSeconds = $minAgeMinutes * 60;

        $sampleLimit = $this->toNonNegativeInt($this->option('sample'), 25);

        if (!$this->diskExists($disk)) {
            $this->error("Disk '{$disk}' is not configured.");
            return self::FAILURE;
        }

        if (!$this->diskIsAllowed($disk)) {
            $this->error("Disk '{$disk}' is not allowed.");
            return self::FAILURE;
        }

        if ($path === '') {
            $this->error('Path must not be empty.');
            return self::FAILURE;
        }

        $storage = Storage::disk($disk);

        $dbPaths = Image::query()
            ->where('storage_disk', $disk)
            ->where('storage_path', 'like', $path . '/%')
            ->pluck('storage_path')
            ->all();

        $dbSet = [];
        foreach ($dbPaths as $dbPath) {
            if (\is_string($dbPath) && $dbPath !== '') {
                $dbSet[$dbPath] = true;
            }
        }

        $files = $storage->allFiles($path);

        $now = \time();
        $scanned = 0;
        $orphans = 0;
        $eligible = 0;
        $deleted = 0;
        $skippedRecent = 0;
        $errors = 0;

        $sample = [];

        foreach ($files as $filePath) {
            $scanned++;

            if (isset($dbSet[$filePath])) {
                continue;
            }

            $orphans++;

            $lastModified = null;

            try {
                $lastModified = $storage->lastModified($filePath);
            } catch (\Throwable) {
                $lastModified = null;
            }

            if (\is_int($lastModified) && ($now - $lastModified) < $minAgeSeconds) {
                $skippedRecent++;
                continue;
            }

            $eligible++;

            if (\count($sample) < $sampleLimit) {
                $sample[] = $filePath;
            }

            if ($dryRun) {
                continue;
            }

            try {
                $ok = $storage->delete($filePath);
                if ($ok) {
                    $deleted++;
                } else {
                    $errors++;
                }
            } catch (\Throwable) {
                $errors++;
            }
        }

        $mode = $dryRun ? 'DRY RUN' : 'DELETE';
        $this->info("Mode: {$mode}");
        $this->info("Disk: {$disk}");
        $this->info("Path: {$path}");
        $this->info("Min age minutes: {$minAgeMinutes}");

        $this->line("Scanned files: {$scanned}");
        $this->line("DB paths: " . \count($dbSet));
        $this->line("Orphan files: {$orphans}");
        $this->line("Eligible orphan files: {$eligible}");
        $this->line("Skipped (too recent): {$skippedRecent}");

        if (!$dryRun) {
            $this->line("Deleted: {$deleted}");
        }

        if ($errors > 0) {
            $this->warn("Errors: {$errors}");
        }

        if (\count($sample) > 0) {
            $this->line('Sample orphan paths:');
            foreach ($sample as $s) {
                $this->line($s);
            }
        }

        return $errors > 0 ? self::FAILURE : self::SUCCESS;
    }

    private function normalizeDisk(string $disk): string
    {
        return \trim($disk);
    }

    private function normalizePath(string $path): string
    {
        $path = \trim($path);
        $path = \str_replace('\\', '/', $path);
        $path = \trim($path, '/');

        if ($path === '') {
            return '';
        }

        if (\str_contains($path, '..')) {
            return '';
        }

        if (\str_starts_with($path, '/')) {
            return '';
        }

        return $path;
    }

    private function toNonNegativeInt(mixed $value, int $default): int
    {
        if (\is_int($value)) {
            return \max(0, $value);
        }

        if (\is_string($value) && $value !== '' && \ctype_digit($value)) {
            return (int) $value;
        }

        return \max(0, $default);
    }

    private function diskExists(string $disk): bool
    {
        $config = config('filesystems.disks.' . $disk);
        return \is_array($config);
    }

    private function diskIsAllowed(string $disk): bool
    {
        $allowed = config('images.allowed_disks');

        if (!\is_array($allowed) || $allowed === []) {
            return true;
        }

        return \in_array($disk, $allowed, true);
    }
}
