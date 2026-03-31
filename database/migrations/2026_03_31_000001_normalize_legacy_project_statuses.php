<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * @var array<string,string>
     */
    private array $legacyToCanonicalStatusMap = [
        'em_andamento' => 'in_progress',
        'concluido' => 'completed',
        'manutencao' => 'maintenance',
        'planejado' => 'planned',
    ];

    public function up(): void
    {
        $this->normalizeTableStatuses('projects');
        $this->normalizeTableStatuses('project_translations');
    }

    public function down(): void
    {
        // Irreversible data migration: once normalized, original aliases are not recoverable.
    }

    private function normalizeTableStatuses(string $table): void
    {
        if (!Schema::hasTable($table) || !Schema::hasColumn($table, 'status')) {
            return;
        }

        foreach ($this->legacyToCanonicalStatusMap as $legacy => $canonical) {
            DB::table($table)
                ->where('status', $legacy)
                ->update(['status' => $canonical]);
        }
    }
};
