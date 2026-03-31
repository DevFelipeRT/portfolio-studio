import type { ReactNode } from 'react';

import { DateDisplay } from '@/components/ui/date-display';
import { TableCell } from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/common/i18n';

import { tablePresets } from '../presets';
import type {
  TableDateTextProps,
  TableMetaCellProps,
  TableStatusStackProps,
  TableTitleCellProps,
} from '../types';

export function TableTitleCell({
  title,
  subtitle,
  aside,
  titleClassName,
  subtitleClassName,
  asideClassName,
  children,
  className,
  ...props
}: TableTitleCellProps) {
  return (
    <TableCell
      className={cn(tablePresets.summaryCell, 'content-center pr-2', className)}
      {...props}
    >
      <div className="flex min-w-0 flex-col gap-0.5">
        <div className="flex w-full min-w-0 items-center gap-2">
          <p
            className={cn(
              'line-clamp-1 min-w-0 flex-1 truncate font-medium text-pretty hyphens-auto',
              titleClassName,
            )}
          >
            <span
              className={cn(
                'inline-block max-w-full truncate bg-linear-to-r from-primary-gradient-start to-primary-gradient-end bg-clip-text transition-[color,filter]',
                'text-current group-hover:text-transparent',
              )}
            >
              {title}
            </span>
          </p>

          {aside ? (
            <div className={cn('shrink-0', asideClassName)}>{aside}</div>
          ) : null}
        </div>

        {subtitle ? (
          <p
            className={cn(
              'text-muted-foreground line-clamp-1 min-w-0 truncate text-xs text-pretty hyphens-auto',
              subtitleClassName,
            )}
          >
            {subtitle}
          </p>
        ) : null}

        {children}
      </div>
    </TableCell>
  );
}

export function TableMetaCell({
  className,
  children,
  ...props
}: TableMetaCellProps) {
  return (
    <TableCell
      className={cn(tablePresets.metaCell, 'content-center pr-2', className)}
      {...props}
    >
      {children}
    </TableCell>
  );
}

export function TableStatusStack({
  className,
  children,
  ...props
}: TableStatusStackProps) {
  return (
    <div
      className={cn(
        'xs:flex-row flex w-full flex-col items-center gap-2 sm:flex-nowrap',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function TableDateText({
  value,
  endValue,
  locale,
  fallback = '\u2014',
  todayAsTime = false,
  presentLabel,
  rangeLayout = 'inline',
  startLabel,
  endLabel,
  format,
  className,
  children,
  ...props
}: TableDateTextProps) {
  const { locale: activeLocale } = useTranslation();
  const resolvedLocale = locale ?? activeLocale;
  const formats = resolveTableDateDisplayFormats(format);

  if (value !== undefined || endValue !== undefined) {
    return (
      <span className={cn('block whitespace-nowrap', className)} {...props}>
        <span className="lg:hidden">
          {endValue !== undefined ? (
            <TableDateRangeValue
              start={value}
              end={endValue}
              locale={resolvedLocale}
              fallback={fallback}
              presentLabel={presentLabel}
              rangeLayout={rangeLayout}
              startLabel={startLabel}
              endLabel={endLabel}
              format={formats.compact}
            />
          ) : (
            <DateDisplay
              value={value}
              locale={resolvedLocale ?? 'en-US'}
              fallback={fallback}
              format={resolveSingleDateDisplayFormat(
                value,
                todayAsTime,
                formats.compact,
                formats.time,
              )}
            />
          )}
        </span>
        <span className="hidden whitespace-nowrap lg:inline 2xl:hidden">
          {endValue !== undefined ? (
            <TableDateRangeValue
              start={value}
              end={endValue}
              locale={resolvedLocale}
              fallback={fallback}
              presentLabel={presentLabel}
              rangeLayout={rangeLayout}
              startLabel={startLabel}
              endLabel={endLabel}
              format={formats.medium}
            />
          ) : (
            <DateDisplay
              value={value}
              locale={resolvedLocale ?? 'en-US'}
              fallback={fallback}
              format={resolveSingleDateDisplayFormat(
                value,
                todayAsTime,
                formats.medium,
                formats.time,
              )}
            />
          )}
        </span>
        <span className="hidden whitespace-nowrap 2xl:inline">
          {endValue !== undefined ? (
            <TableDateRangeValue
              start={value}
              end={endValue}
              locale={resolvedLocale}
              fallback={fallback}
              presentLabel={presentLabel}
              rangeLayout={rangeLayout}
              startLabel={startLabel}
              endLabel={endLabel}
              format={formats.full}
            />
          ) : (
            <DateDisplay
              value={value}
              locale={resolvedLocale ?? 'en-US'}
              fallback={fallback}
              format={resolveSingleDateDisplayFormat(
                value,
                todayAsTime,
                formats.full,
                formats.time,
              )}
            />
          )}
        </span>
      </span>
    );
  }

  return (
    <span className={cn('block whitespace-nowrap', className)} {...props}>
      {children}
    </span>
  );
}

function TableDateRangeValue({
  start,
  end,
  locale,
  fallback,
  presentLabel,
  rangeLayout,
  startLabel,
  endLabel,
  format,
}: {
  start?: string | null;
  end?: string | null;
  locale?: string | null;
  fallback: TableDateTextProps['fallback'];
  presentLabel?: string;
  rangeLayout: NonNullable<TableDateTextProps['rangeLayout']>;
  startLabel?: TableDateTextProps['startLabel'];
  endLabel?: TableDateTextProps['endLabel'];
  format: string;
}) {
  const localeCode = locale ?? 'en-US';

  if (!start || !isValidDateValue(start)) {
    return <>{fallback}</>;
  }

  const resolvedEndContent = !end
    ? (presentLabel ?? fallback)
    : isValidDateValue(end)
      ? (
          <DateDisplay
            value={end}
            locale={localeCode}
            fallback={fallback}
            format={format}
          />
        )
      : fallback;

  if (rangeLayout === 'stacked') {
    return (
      <span className="inline-flex flex-col items-start gap-0.5 whitespace-nowrap">
        <RangeLine
          label={startLabel}
          value={
            <DateDisplay
              value={start}
              locale={localeCode}
              fallback={fallback}
              format={format}
            />
          }
        />
        <RangeLine label={endLabel} value={resolvedEndContent} />
      </span>
    );
  }

  return (
    <>
      <DateDisplay
        value={start}
        locale={localeCode}
        fallback={fallback}
        format={format}
      />
      {!end ? (
        presentLabel ? (
          <>
            {' - '}
            <span>{presentLabel}</span>
          </>
        ) : (
          <>
            {' - '}
            <>{fallback}</>
          </>
        )
      ) : isValidDateValue(end) ? (
        <>
          {' - '}
          {resolvedEndContent}
        </>
      ) : null}
    </>
  );
}

function RangeLine({
  label,
  value,
}: {
  label?: ReactNode;
  value: ReactNode;
}) {
  return (
    <span className="inline-flex items-center gap-1">
      {label ? (
        <span className="text-muted-foreground text-xs font-medium">
          {label}:
        </span>
      ) : null}
      <span>{value}</span>
    </span>
  );
}

function resolveTableDateDisplayFormats(
  format: TableDateTextProps['format'],
): {
  compact: string;
  medium: string;
  full: string;
  time: string;
} {
  if (typeof format === 'string') {
    return {
      compact: format,
      medium: format,
      full: format,
      time: 'p',
    };
  }

  return {
    compact: format?.compact ?? 'P',
    medium: format?.medium ?? 'PP',
    full: format?.full ?? 'PPP',
    time: format?.time ?? 'p',
  };
}

function resolveSingleDateDisplayFormat(
  value: string | null | undefined,
  todayAsTime: boolean,
  dateFormat: string,
  timeFormat: string,
): string {
  if (todayAsTime && isSameDayValue(value)) {
    return timeFormat;
  }

  return dateFormat;
}

function isSameDayValue(value: string | null | undefined): boolean {
  if (!value) {
    return false;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return false;
  }

  const now = new Date();

  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  );
}

function isValidDateValue(value: string | null | undefined): boolean {
  if (!value) {
    return false;
  }

  return !Number.isNaN(new Date(value).getTime());
}
