import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { PageLink } from '@/common/page-runtime';

interface ExistingImageCardModel {
  id: number;
  resolvedUrl: string;
  imageAlt: string;
  caption: string;
}

interface ExistingImageCardProps {
  image: ExistingImageCardModel;
  initiativeId?: number;
}

export function ExistingImageCard({
  image,
  initiativeId,
}: ExistingImageCardProps) {
  return (
    <Card className="border-border/70 flex h-full flex-col gap-3 rounded-lg shadow-sm transition-shadow hover:shadow">
      <CardContent className="flex flex-1 flex-col gap-3 p-4">
        <div className="border-border/60 bg-muted/20 relative min-h-28 flex-1 overflow-hidden rounded-md border">
          <img
            src={image.resolvedUrl}
            alt={image.imageAlt}
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>

        {image.caption && (
          <p className="text-muted-foreground line-clamp-2 text-xs">
            {image.caption}
          </p>
        )}
      </CardContent>

      {initiativeId && (
        <CardFooter className="p-4 pt-0">
          <div className="flex w-full justify-end">
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="text-destructive hover:text-destructive"
            >
              <PageLink
                href={route('initiatives.images.destroy', {
                  initiative: initiativeId,
                  image: image.id,
                })}
                method="delete"
                as="button"
              >
                Delete image
              </PageLink>
            </Button>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
