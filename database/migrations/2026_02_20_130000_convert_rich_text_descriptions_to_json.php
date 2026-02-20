<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    /**
     * Tables/columns that store rich text payloads serialized from Lexical.
     *
     * @var array<int,array{table:string,column:string,nullable:bool,down_type:string}>
     */
    private array $targets = [
        [
            'table' => 'projects',
            'column' => 'description',
            'nullable' => false,
            'down_type' => 'TEXT NOT NULL',
        ],
        [
            'table' => 'project_translations',
            'column' => 'description',
            'nullable' => true,
            'down_type' => 'TEXT NULL',
        ],
        [
            'table' => 'initiatives',
            'column' => 'description',
            'nullable' => false,
            'down_type' => 'TEXT NOT NULL',
        ],
        [
            'table' => 'initiative_translations',
            'column' => 'description',
            'nullable' => true,
            'down_type' => 'TEXT NULL',
        ],
        [
            'table' => 'courses',
            'column' => 'description',
            'nullable' => false,
            'down_type' => 'TEXT NOT NULL',
        ],
        [
            'table' => 'course_translations',
            'column' => 'description',
            'nullable' => true,
            'down_type' => 'TEXT NULL',
        ],
        [
            'table' => 'experiences',
            'column' => 'description',
            'nullable' => false,
            'down_type' => 'LONGTEXT NOT NULL',
        ],
        [
            'table' => 'experience_translations',
            'column' => 'description',
            'nullable' => true,
            'down_type' => 'TEXT NULL',
        ],
    ];

    public function up(): void
    {
        foreach ($this->targets as $target) {
            $this->normalizeRowsToJsonDocument(
                table: $target['table'],
                column: $target['column'],
                nullable: $target['nullable'],
            );

            $this->alterColumnToJson(
                table: $target['table'],
                column: $target['column'],
                nullable: $target['nullable'],
            );
        }
    }

    public function down(): void
    {
        foreach ($this->targets as $target) {
            $table = $target['table'];
            $column = $target['column'];
            $downType = $target['down_type'];

            DB::statement(
                sprintf(
                    'ALTER TABLE `%s` MODIFY `%s` %s',
                    $table,
                    $column,
                    $downType,
                ),
            );
        }
    }

    private function normalizeRowsToJsonDocument(
        string $table,
        string $column,
        bool $nullable,
    ): void {
        DB::table($table)
            ->select(['id', $column])
            ->orderBy('id')
            ->chunkById(500, function ($rows) use ($table, $column, $nullable): void {
                foreach ($rows as $row) {
                    $value = $row->{$column};

                    if ($value === null) {
                        if ($nullable) {
                            continue;
                        }

                        $json = $this->encodeLexicalDocument('');
                    } else {
                        $json = $this->normalizeValueToLexicalJson((string) $value);
                    }

                    DB::table($table)
                        ->where('id', $row->id)
                        ->update([$column => $json]);
                }
            });
    }

    private function normalizeValueToLexicalJson(string $value): string
    {
        $trimmed = trim($value);

        if ($trimmed === '') {
            return $this->encodeLexicalDocument('');
        }

        $decoded = json_decode($value, true);

        if (json_last_error() === JSON_ERROR_NONE && is_array($decoded) && $this->looksLikeLexicalDocument($decoded)) {
            return json_encode($decoded, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) ?: $this->encodeLexicalDocument($value);
        }

        return $this->encodeLexicalDocument($value);
    }

    /**
     * @param array<string,mixed> $decoded
     */
    private function looksLikeLexicalDocument(array $decoded): bool
    {
        if (!array_key_exists('root', $decoded) || !is_array($decoded['root'])) {
            return false;
        }

        $root = $decoded['root'];

        return ($root['type'] ?? null) === 'root';
    }

    private function encodeLexicalDocument(string $text): string
    {
        $document = [
            'root' => [
                'children' => [
                    [
                        'children' => [
                            [
                                'detail' => 0,
                                'format' => 0,
                                'mode' => 'normal',
                                'style' => '',
                                'text' => $text,
                                'type' => 'text',
                                'version' => 1,
                            ],
                        ],
                        'direction' => null,
                        'format' => '',
                        'indent' => 0,
                        'type' => 'paragraph',
                        'version' => 1,
                        'textFormat' => 0,
                        'textStyle' => '',
                    ],
                ],
                'direction' => null,
                'format' => '',
                'indent' => 0,
                'type' => 'root',
                'version' => 1,
            ],
        ];

        return json_encode($document, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) ?: '{"root":{"children":[],"direction":null,"format":"","indent":0,"type":"root","version":1}}';
    }

    private function alterColumnToJson(string $table, string $column, bool $nullable): void
    {
        $nullability = $nullable ? 'NULL' : 'NOT NULL';

        DB::statement(
            sprintf(
                'ALTER TABLE `%s` MODIFY `%s` JSON %s',
                $table,
                $column,
                $nullability,
            ),
        );
    }
};
