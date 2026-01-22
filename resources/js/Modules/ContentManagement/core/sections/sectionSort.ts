import type { PageSectionDto } from '@/Modules/ContentManagement/core/types';

const FALLBACK_POSITION = Number.MAX_SAFE_INTEGER;

export function getSectionPositionValue(section: PageSectionDto): number {
    if (typeof section.position === 'number' && Number.isFinite(section.position)) {
        return section.position;
    }

    return FALLBACK_POSITION;
}

export function sortSectionsByPosition(
    sections: PageSectionDto[],
): PageSectionDto[] {
    return [...sections].sort((left, right) => {
        const leftPosition = getSectionPositionValue(left);
        const rightPosition = getSectionPositionValue(right);

        if (leftPosition !== rightPosition) {
            return leftPosition - rightPosition;
        }

        return left.id - right.id;
    });
}
