import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

type CarouselRenderState = {
  activeIndex: number
  totalItems: number
}

interface CarouselProps<Item> {
  items: Item[]
  renderItem: (item: Item, index: number) => React.ReactNode
  getItemKey?: (item: Item, index: number) => React.Key
  renderProgress?: (state: CarouselRenderState) => React.ReactNode
  className?: string
  headerClassName?: string
  progressClassName?: string
  trackClassName?: string
  slideClassName?: string
  previousButtonLabel?: string
  nextButtonLabel?: string
}

function Carousel<Item>({
  items,
  renderItem,
  getItemKey,
  renderProgress,
  className,
  headerClassName,
  progressClassName,
  trackClassName,
  slideClassName,
  previousButtonLabel = "Previous",
  nextButtonLabel = "Next",
}: CarouselProps<Item>) {
  const viewportRef = React.useRef<HTMLDivElement | null>(null)
  const [activeIndex, setActiveIndex] = React.useState(0)

  if (!items.length) {
    return null
  }

  function scrollToIndex(index: number): void {
    const viewport = viewportRef.current
    if (!viewport) {
      return
    }

    const slide = viewport.querySelector<HTMLDivElement>(
      `[data-slide-index="${index}"]`
    )
    if (!slide) {
      return
    }

    slide.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    })
  }

  function handlePrevious(): void {
    setActiveIndex((current) => {
      const nextIndex = current === 0 ? 0 : current - 1
      scrollToIndex(nextIndex)
      return nextIndex
    })
  }

  function handleNext(): void {
    setActiveIndex((current) => {
      const lastIndex = items.length - 1
      const nextIndex = current === lastIndex ? lastIndex : current + 1
      scrollToIndex(nextIndex)
      return nextIndex
    })
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div
        className={cn("flex items-center justify-between gap-2", headerClassName)}
      >
        <div className={cn("text-muted-foreground text-xs", progressClassName)}>
          {renderProgress?.({
            activeIndex,
            totalItems: items.length,
          })}
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            size="icon"
            variant="outline"
            disabled={activeIndex === 0}
            aria-label={previousButtonLabel}
            onClick={handlePrevious}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            size="icon"
            variant="outline"
            disabled={activeIndex === items.length - 1}
            aria-label={nextButtonLabel}
            onClick={handleNext}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <ScrollArea className="w-full" type="always">
        <div
          ref={viewportRef}
          className={cn("mb-4 flex w-max items-start gap-4", trackClassName)}
        >
          {items.map((item, index) => (
            <div
              key={getItemKey ? getItemKey(item, index) : index}
              data-slide-index={index}
              className={cn("shrink-0 snap-center", slideClassName)}
            >
              {renderItem(item, index)}
            </div>
          ))}
        </div>

        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  )
}

export { Carousel }
