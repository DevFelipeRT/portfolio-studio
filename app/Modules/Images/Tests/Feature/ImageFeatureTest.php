<?php

declare(strict_types=1);

namespace App\Modules\Images\Tests\Feature;

use App\Modules\Images\Domain\Models\Image;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

final class ImageFeatureTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_stores_an_uploaded_image(): void
    {
        Storage::fake('public');
        $this->actingAsAdmin();

        $response = $this->post(route('images.store'), [
            'file' => $this->fakeImageUpload(),
            'alt_text' => 'Portfolio image',
            'image_title' => 'Portfolio',
            'caption' => 'Image caption',
        ]);

        $image = Image::query()->first();

        $response
            ->assertRedirect(route('images.edit', $image))
            ->assertSessionHasNoErrors();

        $this->assertNotNull($image);
        Storage::disk('public')->assertExists($image?->storage_path ?? '');
    }

    public function test_it_validates_image_uploads(): void
    {
        Storage::fake('public');
        $this->actingAsAdmin();

        $response = $this->from(route('images.create'))->post(route('images.store'), [
            'file' => UploadedFile::fake()->create('notes.txt', 5, 'text/plain'),
        ]);

        $response
            ->assertRedirect(route('images.create'))
            ->assertSessionHasErrors(['file']);
    }

    public function test_it_updates_image_metadata(): void
    {
        $this->actingAsAdmin();
        $image = $this->createImage();

        $response = $this->from(route('images.edit', $image))->put(route('images.update', $image), [
            'alt_text' => 'Updated alt text',
            'image_title' => 'Updated title',
            'caption' => 'Updated caption',
        ]);

        $response
            ->assertRedirect(route('images.edit', $image))
            ->assertSessionHasNoErrors();

        $this->assertDatabaseHas('images', [
            'id' => $image->id,
            'alt_text' => 'Updated alt text',
            'image_title' => 'Updated title',
        ]);
    }

    private function createImage(array $overrides = []): Image
    {
        $image = new Image();
        $image->storage_disk = 'public';
        $image->storage_path = 'images/base.jpg';
        $image->mime_type = 'image/jpeg';
        $image->file_size_bytes = 1234;
        $image->image_width = 100;
        $image->image_height = 100;
        $image->original_filename = 'base.jpg';
        $image->alt_text = 'Base alt';
        $image->image_title = 'Base title';
        $image->caption = 'Base caption';

        foreach ($overrides as $key => $value) {
            $image->{$key} = $value;
        }

        $image->save();

        return $image;
    }

    private function fakeImageUpload(): UploadedFile
    {
        return UploadedFile::fake()->createWithContent(
            'portfolio.png',
            base64_decode(
                'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9sqsK0wAAAAASUVORK5CYII=',
                true,
            ) ?: '',
        );
    }
}
