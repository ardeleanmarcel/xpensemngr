export interface OrderBy<T extends Array<string>> {
  column: T[number];
  direction: 'ASC' | 'DESC';
}

export type SqlBindingData = number | string | null | Array<number> | Array<string>;

export type SqlQueryBindings = Array<SqlBindingData>;
