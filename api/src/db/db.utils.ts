export const FILTER_TYPE = {
  In: 'IN',
  Is: '=',
} as const;

export type FilterType = (typeof FILTER_TYPE)[keyof typeof FILTER_TYPE];

export type FilterValue = string | number | (string | number)[];

export interface Filter<T extends string> {
  name: T;
  type: FilterType;
  value: FilterValue;
}

export interface ArrayFilter<T extends string> extends Filter<T> {
  value: (string | number)[];
}
