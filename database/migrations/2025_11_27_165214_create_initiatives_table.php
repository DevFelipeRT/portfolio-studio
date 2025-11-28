<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Create the initiatives table.
     */
    public function up(): void
    {
        Schema::create('initiatives', function (Blueprint $table): void {
            $table->id();

            $table->string('name');
            $table->string('short_description');
            $table->text('long_description');

            $table->boolean('display')->default(false);

            $table->date('start_date');
            $table->date('end_date')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Drop the initiatives table.
     */
    public function down(): void
    {
        Schema::dropIfExists('initiatives');
    }
};
