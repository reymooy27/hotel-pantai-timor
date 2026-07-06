import {
  addMonths,
  differenceInCalendarDays,
  eachDayOfInterval,
  endOfMonth,
  format,
  isSaturday,
  isSunday,
  isWithinInterval,
  parseISO,
  startOfMonth,
  subDays,
} from 'date-fns';

import type { PricingRule, Room } from '@/lib/types';

export interface NightBreakdown {
  date: string;
  label: 'weekday' | 'weekend' | 'high-season';
  price: number;
  ruleName?: string;
}

export interface PricingQuote {
  nights: number;
  total: number;
  breakdown: NightBreakdown[];
}

export function parseDateOnly(value: string) {
  return parseISO(value);
}

export function getMonthWindow(month: string) {
  const monthDate = parseISO(`${month}-01`);
  const monthStart = startOfMonth(monthDate);
  const monthEnd = endOfMonth(monthDate);
  const nextMonthStart = startOfMonth(addMonths(monthDate, 1));

  return {
    monthStart,
    monthEnd,
    monthStartKey: format(monthStart, 'yyyy-MM-dd'),
    monthEndKey: format(monthEnd, 'yyyy-MM-dd'),
    nextMonthStartKey: format(nextMonthStart, 'yyyy-MM-dd'),
  };
}

export function getNights(checkIn: string, checkOut: string) {
  return Math.max(
    differenceInCalendarDays(parseDateOnly(checkOut), parseDateOnly(checkIn)),
    0
  );
}

export function enumerateBookedDates(checkIn: string, checkOut: string) {
  const start = parseDateOnly(checkIn);
  const end = subDays(parseDateOnly(checkOut), 1);

  if (end < start) {
    return [];
  }

  return eachDayOfInterval({ start, end }).map((day) =>
    format(day, 'yyyy-MM-dd')
  );
}

export function enumerateBlockedDates(blockedFrom: string, blockedTo: string) {
  return eachDayOfInterval({
    start: parseDateOnly(blockedFrom),
    end: parseDateOnly(blockedTo),
  }).map((day) => format(day, 'yyyy-MM-dd'));
}

function findActiveRule(date: Date, rules: PricingRule[]) {
  return rules
    .filter((rule) => rule.is_active)
    .filter((rule) =>
      isWithinInterval(date, {
        start: parseDateOnly(rule.date_from),
        end: parseDateOnly(rule.date_to),
      })
    )
    .sort((left, right) => right.multiplier - left.multiplier)[0];
}

export function getNightRate(
  room: Room,
  date: Date,
  rules: PricingRule[]
): NightBreakdown {
  const weekend = isSaturday(date) || isSunday(date);
  const rule = findActiveRule(date, rules);
  const basePrice = weekend ? room.price_weekend : room.price_weekday;

  if (rule) {
    return {
      date: format(date, 'yyyy-MM-dd'),
      label: 'high-season',
      price: room.price_high_season ?? Math.round(basePrice * rule.multiplier),
      ruleName: rule.name,
    };
  }

  return {
    date: format(date, 'yyyy-MM-dd'),
    label: weekend ? 'weekend' : 'weekday',
    price: basePrice,
  };
}

export function calculateStayPricing(
  room: Room,
  checkIn: string,
  checkOut: string,
  rules: PricingRule[]
): PricingQuote {
  const nights = getNights(checkIn, checkOut);

  if (nights === 0) {
    return {
      nights: 0,
      total: 0,
      breakdown: [],
    };
  }

  const breakdown = eachDayOfInterval({
    start: parseDateOnly(checkIn),
    end: subDays(parseDateOnly(checkOut), 1),
  }).map((day) => getNightRate(room, day, rules));

  return {
    nights,
    total: breakdown.reduce((sum, night) => sum + night.price, 0),
    breakdown,
  };
}

export function rangesOverlap(
  leftStart: string,
  leftEndExclusive: string,
  rightStart: string,
  rightEndExclusive: string
) {
  return (
    parseDateOnly(leftStart) < parseDateOnly(rightEndExclusive) &&
    parseDateOnly(rightStart) < parseDateOnly(leftEndExclusive)
  );
}

export function blockOverlapsRange(
  blockedFrom: string,
  blockedToInclusive: string,
  checkIn: string,
  checkOut: string
) {
  const blockEndExclusive = format(
    new Date(parseDateOnly(blockedToInclusive).getTime() + 86400000),
    'yyyy-MM-dd'
  );

  return rangesOverlap(blockedFrom, blockEndExclusive, checkIn, checkOut);
}
