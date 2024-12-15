export const FILTER_COMPARATOR = {
  In: 'IN',
  Is: '=',
  GreaterThan: '>',
  GreaterThanOrEqual: '>=',
  LessThan: '<',
  LessThanOrEqual: '<=',
} as const;

type FilterTypeComparison =
  | typeof FILTER_COMPARATOR.GreaterThan
  | typeof FILTER_COMPARATOR.GreaterThanOrEqual
  | typeof FILTER_COMPARATOR.LessThan
  | typeof FILTER_COMPARATOR.LessThanOrEqual;

export type FilterType = (typeof FILTER_COMPARATOR)[keyof typeof FILTER_COMPARATOR];

export type FilterValue = string | number | (string | number)[];

export type FilterForEquality<T extends string> = {
  name: T;
  type: typeof FILTER_COMPARATOR.Is;
  value: string | number;
};

export type FilterForBeloningToGroup<T extends string> = {
  name: T;
  type: typeof FILTER_COMPARATOR.In;
  value: (string | number)[];
};

export type FilterForComparison<T extends string> = {
  name: T;
  type: FilterTypeComparison;
  value: number | string;
};

export type Filter<Name extends string> =
  | FilterForEquality<Name>
  | FilterForBeloningToGroup<Name>
  | FilterForComparison<Name>;
