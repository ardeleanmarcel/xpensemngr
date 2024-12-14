export const FILTER_TYPE = {
  In: 'IN',
  Is: '=',
} as const;

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

export type Filter<T extends string> = FilterForEquality<T> | FilterForBeloningToGroup<T>;
