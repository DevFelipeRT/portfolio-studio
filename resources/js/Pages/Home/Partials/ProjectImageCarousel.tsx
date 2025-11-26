import { Button } from '@/Components/Ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/Components/Ui/dialog';
import { ProjectImage } from '@/Pages/types';
import { ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import { useState } from 'react';

interface ProjectImageCarouselProps {
    images: ProjectImage[];
    title: string;
}

/**
 * ProjectImageCarousel renders a simple image carousel inside the project card,
 * with optional zoom preview in a modal for the current image.
 */
export function ProjectImageCarousel({
    images,
    title,
}: ProjectImageCarouselProps) {
    const [index, setIndex] = useState(0);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);

    if (!images || images.length === 0) {
        return (
            <div className="bg-muted text-muted-foreground flex h-44 w-full items-center justify-center border-b text-xs sm:h-56 md:h-64">
                No images available.
            </div>
        );
    }

    const lastIndex = images.length - 1;

    function goPrevious(): void {
        setIndex((current) => (current === 0 ? lastIndex : current - 1));
    }

    function goNext(): void {
        setIndex((current) => (current === lastIndex ? 0 : current + 1));
    }

    const current = images[index];

    const imageUrl = current.src.startsWith('http')
        ? current.src
        : `/storage/${current.src}`;

    return (
        <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
            <div className="bg-muted relative h-44 w-full overflow-hidden border-b sm:h-56 md:h-64">
                <div className="h-full w-full">
                    <img
                        src={imageUrl}
                        alt={current.alt || title}
                        className="h-full w-full object-cover"
                        loading="lazy"
                    />
                </div>

                {/* Preview button for current image */}
                <div className="absolute top-2 right-2 z-10">
                    <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        className="hover:bg-background/70 bg-background/50 h-8 w-8 rounded-full backdrop-blur"
                        onClick={() => setIsPreviewOpen(true)}
                    >
                        <ZoomIn className="h-4 w-4" />
                    </Button>
                </div>

                {images.length > 1 && (
                    <>
                        <div className="pointer-events-none absolute inset-x-0 top-0 flex h-full items-center justify-between p-2">
                            <div className="pointer-events-auto">
                                <Button
                                    type="button"
                                    size="icon"
                                    variant="outline"
                                    className="group hover:bg-background/50 h-8 w-8 rounded-full bg-transparent backdrop-blur"
                                    onClick={goPrevious}
                                >
                                    <ChevronLeft className="text-foreground/50 group-hover:text-primary h-4 w-4" />
                                </Button>
                            </div>
                            <div className="pointer-events-auto">
                                <Button
                                    type="button"
                                    size="icon"
                                    variant="outline"
                                    className="group hover:bg-background/50 h-8 w-8 rounded-full bg-transparent backdrop-blur"
                                    onClick={goNext}
                                >
                                    <ChevronRight className="text-foreground/50 group-hover:text-primary h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        <div className="absolute inset-x-0 bottom-2 flex justify-center gap-1.5">
                            {images.map((image, dotIndex) => (
                                <Button
                                    key={`${image.src}-${dotIndex}`}
                                    type="button"
                                    aria-label={`Show image ${dotIndex + 1}`}
                                    onClick={() => setIndex(dotIndex)}
                                    className={[
                                        'h-1.5 rounded-full transition-all',
                                        dotIndex === index
                                            ? 'bg-primary w-5'
                                            : 'bg-muted-foreground/40 w-2',
                                    ].join(' ')}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>

            <DialogContent className="max-w-3xl">
                <DialogHeader>
                    <DialogTitle>{current.alt || title}</DialogTitle>
                </DialogHeader>

                <div className="mt-2 flex max-h-[70vh] w-full items-center justify-center overflow-hidden rounded-md">
                    <img
                        src={imageUrl}
                        alt={current.alt || title}
                        className="max-h-[70vh] w-auto max-w-full object-contain"
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
}
