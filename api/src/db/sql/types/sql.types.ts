export interface OrderBy<T extends Array<string>> {
  column: T[number];
  direction: 'ASC' | 'DESC';
}
