import { Carousel } from '@/components/ui/carousel';
import {
    INITIATIVES_NAMESPACES,
    useInitiativesTranslation,
} from '@/modules/initiatives/i18n';
import { useMemo, useState } from 'react';
import { InitiativeCard, type InitiativeCardProps } from './InitiativeCard';

interface InitiativeCarouselProps {
    initiatives: InitiativeCardProps[];
}

/**
 * InitiativeCarousel renders a horizontal slider of initiative cards using the shared carousel primitive.
 */
export function InitiativeCarousel({
    initiatives,
}: InitiativeCarouselProps) {
    const { translate: tActions } = useInitiativesTranslation(
        INITIATIVES_NAMESPACES.actions,
    );
    const { translate: tForm } = useInitiativesTranslation(
        INITIATIVES_NAMESPACES.form,
    );
    const [collapsedHeights, setCollapsedHeights] = useState<Record<number, number>>(
        {},
    );

    const collapsedMinHeight = useMemo(() => {
        const heights = Object.values(collapsedHeights);

        if (!heights.length) {
            return undefined;
        }

        return Math.max(...heights);
    }, [collapsedHeights]);

    if (!initiatives.length) {
        return null;
    }

    function handleCollapsedHeightChange(initiativeId: number, height: number): void {
        setCollapsedHeights((current) => {
            if (current[initiativeId] === height) {
                return current;
            }

            return {
                ...current,
                [initiativeId]: height,
            };
        });
    }

    return (
        <Carousel
            items={initiatives}
            getItemKey={(initiative) => initiative.id ?? 0}
            previousButtonLabel={tActions('previousInitiative')}
            nextButtonLabel={tActions('nextInitiative')}
            renderProgress={({ activeIndex, totalItems }) =>
                tForm('carousel.progress', {
                    current: activeIndex + 1,
                    total: totalItems,
                })
            }
            renderItem={(initiative) => (
                <div className="w-[80vw] max-w-md sm:w-[60vw] md:w-[420px] lg:w-[460px]">
                    <InitiativeCard
                        {...initiative}
                        collapsedMinHeight={collapsedMinHeight}
                        onCollapsedHeightChange={(height) =>
                            handleCollapsedHeightChange(initiative.id, height)
                        }
                    />
                </div>
            )}
        />
    );
}
