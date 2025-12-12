<?php

use App\Modules\Home\HomeController;
use App\Modules\Courses\Http\Controllers\CourseController;
use App\Modules\Experiences\Http\Controllers\ExperienceController;
use App\Modules\IdentityAccess\Http\Controllers\ProfileController;
use App\Modules\Images\Http\Controllers\ImageController;
use App\Modules\Initiatives\Http\Controllers\InitiativeController;
use App\Modules\Initiatives\Http\Controllers\InitiativeImageController;
use App\Modules\Locale\Http\Controllers\LocaleController;
use App\Modules\Mail\Http\Controllers\MessageController;
use App\Modules\Projects\Http\Controllers\ProjectController;
use App\Modules\Projects\Http\Controllers\ProjectImageController;
use App\Modules\Technologies\Http\Controllers\TechnologyController;

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/welcome', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/', [HomeController::class, 'index'])->name('home');

Route::post('/set-locale', [LocaleController::class, 'set']);

/**
 * Public contact form endpoint (landing page).
 */
Route::post('/contact/messages', [MessageController::class, 'store'])
    ->name('messages.store');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
    })->name('dashboard');

    /**
     * Projects and project images.
     */
    Route::resource('projects', ProjectController::class)->names('projects');

    Route::resource('projects.images', ProjectImageController::class)
        ->only(['store', 'update', 'destroy'])
        ->names('projects.images');

    /**
     * Technologies.
     */
    Route::resource('technologies', TechnologyController::class)->names('technologies');

    /**
     * Experiences.
     */
    Route::resource('experiences', ExperienceController::class)->names('experiences');

    /**
     * Courses.
     */
    Route::resource('courses', CourseController::class)->names('courses');

    /**
     * Initiatives and initiative images.
     */
    Route::resource('initiatives', InitiativeController::class)->names('initiatives');

    Route::resource('initiatives.images', InitiativeImageController::class)
        ->only(['store', 'update', 'destroy'])
        ->names('initiatives.images');

    Route::put(
        'initiatives/{initiative}/toggle-display',
        [InitiativeController::class, 'toggleDisplay']
    )->name('initiatives.toggleDisplay');

    /**
     * Global images management.
     */
    Route::resource('images', ImageController::class)
        ->only(['index', 'create', 'store', 'edit', 'update', 'destroy'])
        ->names('images');

    Route::delete('images/bulk-destroy', [ImageController::class, 'bulkDestroy'])
        ->name('images.bulk-destroy');

    /**
     * Admin messages management.
     */
    Route::resource('messages', MessageController::class)
        ->only(['index', 'show', 'destroy'])
        ->names('messages');

    Route::patch('/messages/{message}/important', [MessageController::class, 'markAsImportant'])
        ->name('messages.mark-as-important');

    Route::patch('/messages/{message}/not-important', [MessageController::class, 'markAsNotImportant'])
        ->name('messages.mark-as-not-important');

    Route::patch('/messages/{message}/seen', [MessageController::class, 'markAsSeen'])
        ->name('messages.mark-as-seen');

    Route::patch('/messages/{message}/unseen', [MessageController::class, 'markAsUnseen'])
        ->name('messages.mark-as-unseen');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';
