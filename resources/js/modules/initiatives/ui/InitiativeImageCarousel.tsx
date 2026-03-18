import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import { useState } from 'react';

export interface InitiativeCarouselImage {
    id: number;
    url?: string | null;
    src?: string | null;
    alt?: string | null;
    title?: string | null;
    alt_text?: string | null;
    image_title?: string | null;
    caption?: string | null;
    owner_caption?: string | null;
}

interface InitiativeImageCarouselProps {
    images: InitiativeCarouselImage[] | null | undefined;
    title: string;
    emptyLabel: string;
}

/**
 * InitiativeImageCarousel renders a simple image carousel inside the initiative card,
 * with optional zoom preview in a modal for the current image.
 */
export function InitiativeImageCarousel({
    images,
    title,
    emptyLabel,
}: InitiativeImageCarouselProps) {
    const [index, setIndex] = useState(0);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);

    if (!images || images.length === 0) {
        return (
            <div className="bg-muted text-muted-foreground flex h-44 w-full items-center justify-center border-b text-xs sm:h-56 md:h-64">
                {emptyLabel}
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
    const imageUrl = current?.url ?? current?.src ?? null;

    if (!current || !imageUrl) {
        return (
            <div className="bg-muted text-muted-foreground flex h-44 w-full items-center justify-center border-b text-xs sm:h-56 md:h-64">
                {emptyLabel}
            </div>
        );
    }

    const imageAlt =
        current.alt_text ||
        current.alt ||
        current.image_title ||
        current.title ||
        title;
    const dialogTitle =
        current.image_title ||
        current.title ||
        current.alt_text ||
        current.alt ||
        title;

    return (
        <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
            <div className="bg-muted relative h-44 w-full overflow-hidden border-b sm:h-56 md:h-64">
                <div className="h-full w-full">
                    <img
                        src={imageUrl}
                        alt={imageAlt}
                        className="h-full w-full object-cover"
                        loading="lazy"
                    />
                </div>

                <div className="absolute top-2 right-2 z-10">
                    <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        className="group hover:bg-background/70 bg-background/50 h-8 w-8 rounded-full backdrop-blur"
                        onClick={() => setIsPreviewOpen(true)}
                    >
                        <ZoomIn className="text-foreground/70 group-hover:text-primary h-4 w-4" />
                    </Button>
                </div>

                {images.length > 1 && (
                    <>
                        <div className="inset-shadow pointer-events-none absolute inset-x-0 top-0 flex h-full items-center justify-between p-2">
                            <div className="pointer-events-auto">
                                <Button
                                    type="button"
                                    size="icon"
                                    variant="ghost"
                                    className="group h-16 w-16 bg-transparent hover:bg-transparent focus:ring-0"
                                    onClick={goPrevious}
                                >
                                    <div className="group-hover:bg-background/70 bg-background/50 mr-auto h-8 w-8 content-center rounded-full backdrop-blur">
                                        <ChevronLeft
                                            strokeWidth={4}
                                            className="text-foreground/70 group-hover:text-primary mx-auto h-4 w-4"
                                        />
                                    </div>
                                </Button>
                            </div>

                            <div className="pointer-events-auto flex h-full items-center">
                                <Button
                                    type="button"
                                    size="icon"
                                    variant="ghost"
                                    className="group h-16 w-16 bg-transparent hover:bg-transparent focus:ring-0"
                                    onClick={goNext}
                                >
                                    <div className="group-hover:bg-background/70 bg-background/50 ml-auto h-8 w-8 content-center rounded-full backdrop-blur">
                                        <ChevronRight
                                            strokeWidth={4}
                                            className="text-foreground/70 group-hover:text-primary mx-auto h-4 w-4"
                                        />
                                    </div>
                                </Button>
                            </div>
                        </div>

                        <div className="absolute inset-x-0 bottom-2">
                            <div className="bg-background/50 mx-auto flex w-fit justify-center gap-1.5 rounded-full p-1 backdrop-blur">
                                {images.map((image, dotIndex) => (
                                    <button
                                        key={`${image.id}-${dotIndex}`}
                                        type="button"
                                        aria-label={`Show image ${dotIndex + 1}`}
                                        onClick={() => setIndex(dotIndex)}
                                        className={[
                                            'h-2 rounded-full backdrop-blur transition-all',
                                            dotIndex === index
                                                ? 'bg-primary shadow-primary-shadow-glow w-5 shadow-sm/50'
                                                : 'bg-foreground/70 w-2',
                                        ].join(' ')}
                                    />
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </div>

            <DialogContent className="max-w-3xl">
                <DialogHeader>
                    <DialogTitle>{dialogTitle}</DialogTitle>
                </DialogHeader>

                <div className="mt-2 flex max-h-[70vh] w-full items-center justify-center overflow-hidden rounded-md">
                    <img
                        src={imageUrl}
                        alt={imageAlt}
                        className="max-h-[70vh] w-auto max-w-full object-contain"
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
}
