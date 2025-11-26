<?php

use App\Http\Controllers\CourseController;
use App\Http\Controllers\ExperienceController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\TechnologyController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/welcome', function () {
    return Inertia::render('Welcome', [
        'canLogin'       => Route::has('login'),
        'canRegister'    => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion'     => PHP_VERSION,
    ]);
});

Route::get('/', [HomeController::class, 'index'])->name('home');

/**
 * Public contact form endpoint (landing page).
 */
Route::post('/contact/messages', [MessageController::class, 'store'])
    ->name('messages.store');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
    })->name('dashboard');

    Route::resource('projects', ProjectController::class)->names('projects');

    Route::delete('projects/{project}/images/{image}', [ProjectController::class, 'destroyImage'])
        ->name('projects.images.destroy');

    Route::resource('technologies', TechnologyController::class)->names('technologies');

    Route::resource('experiences', ExperienceController::class)->names('experiences');

    Route::resource('courses', CourseController::class)->names('courses');

    /**
     * Admin messages management (Inertia React).
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
