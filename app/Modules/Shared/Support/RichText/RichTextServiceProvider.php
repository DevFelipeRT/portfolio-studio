<?php

declare(strict_types=1);

namespace App\Modules\Shared\Support\RichText;

use App\Modules\Shared\Contracts\RichText\IRichTextService;
use Illuminate\Support\ServiceProvider;

final class RichTextServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->singleton(IRichTextService::class, LexicalRichTextService::class);
    }
}
