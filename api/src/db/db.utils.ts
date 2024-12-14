export const FILTER_TYPE = {
  In: 'IN',
  Is: '=',
  GreaterThan: '>',
  GreaterOrEqualThan: '>=',
  LessThan: '<',
  LessOrEqualThan: '<=',
} as const;

type FilterTypeComparison =
  | typeof FILTER_TYPE.GreaterThan
  | typeof FILTER_TYPE.GreaterOrEqualThan
  | typeof FILTER_TYPE.LessThan
  | typeof FILTER_TYPE.LessOrEqualThan;

export type FilterType = (typeof FILTER_TYPE)[keyof typeof FILTER_TYPE];

export type FilterValue = string | number | (string | number)[];

export type FilterForEquality<T extends string> = {
  name: T;
  type: typeof FILTER_TYPE.Is;
  value: string | number;
};

export type FilterForBeloningToGroup<T extends string> = {
  name: T;
  type: typeof FILTER_TYPE.In;
  value: (string | number)[];
};

export type FilterForComparison<T extends string> = {
  name: T;
  type: FilterTypeComparison;
  value: number;
};

export type Filter<T extends string> = FilterForEquality<T> | FilterForBeloningToGroup<T> | FilterForComparison<T>;
