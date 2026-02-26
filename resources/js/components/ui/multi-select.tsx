'use client';

import { CheckIcon, XIcon } from 'lucide-react';
import * as React from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Combobox,
  ComboboxContent,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
  ComboboxSeparator,
} from '@/components/ui/combobox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

export type MultiSelectOption<TValue extends string | number> = {
  value: TValue;
  label: string;
  group?: string | null;
  disabled?: boolean;
};

export type MultiSelectProps<TValue extends string | number> = {
  id?: string;
  className?: string;
  value: TValue[];
  onValueChange: (value: TValue[]) => void;
  options: MultiSelectOption<TValue>[];
  disabled?: boolean;
  placeholder?: string;
  emptyLabel?: string;
  otherGroupLabel?: string;
  limit?: number;
  showBadges?: boolean;
  portalContainer?: React.ComponentProps<
    typeof ComboboxContent
  >['portalContainer'];
};

type Group<TValue extends string | number> = {
  title: string;
  values: TValue[];
};

function normalizeText(value: string): string {
  return value.trim().toLowerCase();
}

function applyLimit<TValue extends string | number>(
  groups: Group<TValue>[],
  limit: number,
) {
  if (limit < 0) {
    return {
      groups,
      total: groups.reduce((sum, group) => sum + group.values.length, 0),
    };
  }

  let total = 0;
  const limited: Group<TValue>[] = [];

  for (const group of groups) {
    if (total >= limit) break;

    const remaining = limit - total;
    const slice = group.values.slice(0, remaining);
    total += slice.length;

    if (slice.length > 0) {
      limited.push({ ...group, values: slice });
    }
  }

  return { groups: limited, total };
}

export function MultiSelect<TValue extends string | number>({
  id,
  className,
  value,
  onValueChange,
  options,
  disabled = false,
  placeholder = 'Search…',
  emptyLabel = 'No matching options.',
  otherGroupLabel = 'Other',
  limit = 250,
  showBadges = true,
  portalContainer,
}: MultiSelectProps<TValue>) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState('');

  const hasExplicitGroups = React.useMemo(
    () => options.some((option) => (option.group ?? '').trim() !== ''),
    [options],
  );

  const optionByValue = React.useMemo(() => {
    const map = new Map<TValue, MultiSelectOption<TValue>>();
    options.forEach((option) => map.set(option.value, option));
    return map;
  }, [options]);

  const labelByValue = React.useMemo(() => {
    const map = new Map<TValue, string>();
    options.forEach((option) => map.set(option.value, option.label));
    return map;
  }, [options]);

  const groupByValue = React.useMemo(() => {
    const map = new Map<TValue, string>();
    options.forEach((option) => {
      const normalized = (option.group ?? '').trim();
      map.set(
        option.value,
        hasExplicitGroups ? normalized || otherGroupLabel : '',
      );
    });
    return map;
  }, [hasExplicitGroups, options, otherGroupLabel]);

  const grouped = React.useMemo(() => {
    // If there are no explicit groups, treat it as a flat list.
    if (!hasExplicitGroups) {
      const values = options.map((option) => option.value);
      values.sort((a, b) => {
        const aLabel = labelByValue.get(a) ?? String(a);
        const bLabel = labelByValue.get(b) ?? String(b);
        return aLabel.localeCompare(bLabel);
      });
      return [{ title: '', values }];
    }

    const map = new Map<string, TValue[]>();

    for (const option of options) {
      const normalized = (option.group ?? '').trim();
      const group = normalized || otherGroupLabel;
      const list = map.get(group) ?? [];
      list.push(option.value);
      map.set(group, list);
    }

    const groups: Group<TValue>[] = Array.from(map.entries()).map(
      ([title, values]) => ({
        title,
        values: [...values].sort((a, b) => {
          const aLabel = labelByValue.get(a) ?? String(a);
          const bLabel = labelByValue.get(b) ?? String(b);
          return aLabel.localeCompare(bLabel);
        }),
      }),
    );

    groups.sort((a, b) => {
      if (a.title === otherGroupLabel && b.title !== otherGroupLabel) return 1;
      if (b.title === otherGroupLabel && a.title !== otherGroupLabel) return -1;
      return a.title.localeCompare(b.title);
    });

    return groups;
  }, [hasExplicitGroups, labelByValue, options, otherGroupLabel]);

  const filteredGroups = React.useMemo(() => {
    const normalizedQuery = normalizeText(query);
    if (normalizedQuery === '') return grouped;

    return grouped
      .map((group) => {
        const groupMatches = normalizeText(group.title).includes(
          normalizedQuery,
        );
        if (groupMatches) return group;

        return {
          ...group,
          values: group.values.filter((itemValue) =>
            normalizeText(labelByValue.get(itemValue) ?? '').includes(
              normalizedQuery,
            ),
          ),
        };
      })
      .filter((group) => group.values.length > 0);
  }, [grouped, labelByValue, query]);

  const { groups: limitedGroups, total: limitedTotal } = React.useMemo(
    () => applyLimit(filteredGroups, limit),
    [filteredGroups, limit],
  );

  const totalMatches = React.useMemo(
    () => filteredGroups.reduce((sum, group) => sum + group.values.length, 0),
    [filteredGroups],
  );

  const selectedItems = React.useMemo(() => {
    return value
      .map((itemValue) => ({
        value: itemValue,
        label: labelByValue.get(itemValue) ?? `#${String(itemValue)}`,
        group: hasExplicitGroups
          ? (groupByValue.get(itemValue) || otherGroupLabel).trim()
          : '',
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [groupByValue, hasExplicitGroups, labelByValue, otherGroupLabel, value]);

  const clearAll = React.useCallback(() => {
    onValueChange([]);
  }, [onValueChange]);

  const rootItems = React.useMemo(
    () => options.map((option) => option.value),
    [options],
  );

  let indexCounter = 0;

  return (
    <div className={cn('space-y-2', className)}>
      <Combobox<TValue, true>
        multiple
        disabled={disabled}
        open={open}
        onOpenChange={(nextOpen, eventDetails) => {
          if (!nextOpen && eventDetails?.reason === 'item-press') {
            setOpen(true);
            return;
          }
          setOpen(nextOpen);
        }}
        items={rootItems}
        value={value}
        onValueChange={(nextValue) => {
          if (Array.isArray(nextValue)) onValueChange(nextValue);
        }}
        inputValue={query}
        onInputValueChange={(nextValue) => setQuery(String(nextValue))}
        filter={null}
        itemToStringLabel={(item) => labelByValue.get(item) ?? String(item)}
        itemToStringValue={(item) => String(item)}
      >
        <ComboboxInput
          id={id}
          placeholder={placeholder}
          disabled={disabled}
          showClear
          showTrigger
        />

        <ComboboxContent portalContainer={portalContainer}>
          <div className="text-muted-foreground flex items-center justify-between px-2 py-1 text-xs">
            <span>
              {totalMatches === 0
                ? 'No results'
                : `${Math.min(limitedTotal, totalMatches)} of ${totalMatches}`}
            </span>
            {query.trim() !== '' && (
              <span className="tabular-nums">Filter: “{query.trim()}”</span>
            )}
          </div>

          <ComboboxList className="max-h-none overflow-visible p-0">
            <ScrollArea
              className={cn(
                // Put the height constraint on the viewport (the scrolling element),
                // not the root. The root only having max-height can make `h-full`
                // viewports resolve to "auto" and disable scroll.
                '[&_[data-radix-scroll-area-viewport]]:h-auto [&_[data-radix-scroll-area-viewport]]:max-h-72',
                '[&_[data-radix-scroll-area-viewport]]:overscroll-contain',
              )}
            >
              <div className="p-1">
                {limitedGroups.length === 0 && (
                  <div className="text-muted-foreground px-3 py-2 text-sm">
                    {emptyLabel}
                  </div>
                )}

                {!hasExplicitGroups
                  ? limitedGroups[0]?.values.map((itemValue) => {
                      const option = optionByValue.get(itemValue);
                      const label = labelByValue.get(itemValue) ?? String(itemValue);
                      const itemIndex = indexCounter++;

                      return (
                        <ComboboxItem
                          key={String(itemValue)}
                          value={itemValue}
                          index={itemIndex}
                          disabled={option?.disabled}
                          className="group/multi-select-item"
                        >
                          <span
                            aria-hidden
                            className={cn(
                              'border-muted-foreground/30 bg-background text-background mr-2 grid h-4 w-4 place-content-center rounded-sm border shadow-xs',
                              'group-data-[selected]/multi-select-item:bg-primary group-data-[selected]/multi-select-item:border-primary group-data-[selected]/multi-select-item:text-primary-foreground',
                              option?.disabled && 'opacity-60',
                            )}
                          >
                            <CheckIcon className="pointer-events-none size-3" />
                          </span>
                          <span className="flex-1">{label}</span>
                        </ComboboxItem>
                      );
                    })
                  : limitedGroups.map((group, groupIndex) => (
                      <React.Fragment key={group.title}>
                        <ComboboxGroup>
                          <ComboboxLabel>{group.title}</ComboboxLabel>
                          {group.values.map((itemValue) => {
                            const option = optionByValue.get(itemValue);
                            const label =
                              labelByValue.get(itemValue) ?? String(itemValue);
                            const itemIndex = indexCounter++;

                            return (
                              <ComboboxItem
                                key={String(itemValue)}
                                value={itemValue}
                                index={itemIndex}
                                disabled={option?.disabled}
                                className="group/multi-select-item"
                              >
                                <span
                                  aria-hidden
                                  className={cn(
                                    'border-muted-foreground/30 bg-background text-background mr-2 grid h-4 w-4 place-content-center rounded-sm border shadow-xs',
                                    'group-data-[selected]/multi-select-item:bg-primary group-data-[selected]/multi-select-item:border-primary group-data-[selected]/multi-select-item:text-primary-foreground',
                                    option?.disabled && 'opacity-60',
                                  )}
                                >
                                  <CheckIcon className="pointer-events-none size-3" />
                                </span>
                                <span className="flex-1">{label}</span>
                              </ComboboxItem>
                            );
                          })}
                        </ComboboxGroup>

                        {groupIndex < limitedGroups.length - 1 && (
                          <ComboboxSeparator />
                        )}
                      </React.Fragment>
                    ))}
              </div>
            </ScrollArea>
          </ComboboxList>
        </ComboboxContent>
      </Combobox>

      {showBadges && selectedItems.length > 0 && (
        <div className="space-y-2">
          {(() => {
            const visible = selectedItems.slice(0, 10);

            if (!hasExplicitGroups) {
              return (
                <div className="flex flex-wrap gap-2">
                  {visible.map((item) => (
                    <button
                      key={String(item.value)}
                      type="button"
                      className="group/chip focus-visible:ring-ring rounded-lg p-0.5 transition-transform hover:scale-[1.02] active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                      onClick={() =>
                        onValueChange(
                          value.filter((v) => !Object.is(v, item.value)),
                        )
                      }
                      disabled={disabled}
                    >
                      <Badge
                        variant="secondary"
                        className={cn(
                          'flex items-center gap-2 transition-colors group-hover/chip:border-border group-hover/chip:bg-accent group-hover/chip:text-accent-foreground',
                          disabled && 'opacity-60',
                        )}
                      >
                        <span className="max-w-52 truncate">{item.label}</span>
                        <XIcon className="text-muted-foreground size-3.5 transition-colors group-hover/chip:text-foreground" />
                      </Badge>
                    </button>
                  ))}
                  {selectedItems.length > 10 && (
                    <Badge variant="outline">
                      +{selectedItems.length - 10} more
                    </Badge>
                  )}
                </div>
              );
            }

            const byGroup = new Map<string, typeof visible>();
            for (const item of visible) {
              const key = item.group || otherGroupLabel;
              const list = byGroup.get(key) ?? [];
              list.push(item);
              byGroup.set(key, list);
            }

            const groupKeys = Array.from(byGroup.keys()).sort((a, b) => {
              if (a === otherGroupLabel && b !== otherGroupLabel) return 1;
              if (b === otherGroupLabel && a !== otherGroupLabel) return -1;
              return a.localeCompare(b);
            });

            return (
              <>
                {groupKeys.map((groupKey) => (
                  <div
                    key={groupKey}
                    className="space-y-1 border-l border-border pl-3 transition-colors hover:border-muted-foreground/50"
                  >
                    <p className="text-muted-foreground px-1 text-xs">
                      {groupKey}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {byGroup.get(groupKey)!.map((item) => (
                        <button
                          key={String(item.value)}
                          type="button"
                          className="group/chip focus-visible:ring-ring rounded-lg p-0.5 transition-transform hover:scale-[1.02] active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                          onClick={() =>
                            onValueChange(
                              value.filter((v) => !Object.is(v, item.value)),
                            )
                          }
                          disabled={disabled}
                          title={item.group || undefined}
                        >
                          <Badge
                            variant="secondary"
                            className={cn(
                              'flex items-center gap-2 transition-colors group-hover/chip:border-border group-hover/chip:bg-accent group-hover/chip:text-accent-foreground',
                              disabled && 'opacity-60',
                            )}
                          >
                            <span className="max-w-52 truncate">
                              {item.label}
                            </span>
                            <XIcon className="text-muted-foreground size-3.5 transition-colors group-hover/chip:text-foreground" />
                          </Badge>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
                {selectedItems.length > 10 && (
                  <div>
                    <Badge variant="outline">
                      +{selectedItems.length - 10} more
                    </Badge>
                  </div>
                )}
              </>
            );
          })()}
        </div>
      )}

      {showBadges && selectedItems.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-muted-foreground text-xs">
            Selected:{' '}
            <span className="text-foreground font-medium">{value.length}</span>
          </p>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={disabled || value.length === 0}
            onClick={clearAll}
          >
            Clear
          </Button>
        </div>
      )}
    </div>
  );
}
