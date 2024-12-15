import { FilterForBeloningToGroup, FILTER_COMPARATOR, Filter, FilterValue } from '../../db.utils';
import { OrderBy } from '../types/sql.types';

export function composeWhereClause(filters: Filter<string>[]) {
  if (filters.length === 0) return { whereClauses: '', bindings: [] };

  const clauses: string[] = [];
  let bindings: FilterValue[] = [];

  filters.forEach((f) => {
    if (isArrayFilter(f)) {
      clauses.push(`${f.name} IN ( ${f.value.map(() => ' ? ').join(',')} )`);
      bindings = [...bindings, ...f.value];
      return;
    }

    clauses.push(`${f.name} ${f.type} ?`);
    bindings.push(f.value);
  });

  const whereClauses = `WHERE\n  ` + clauses.join('\n  AND ');

  return { whereClauses, bindings };
}

function isArrayFilter(filter: Filter<string>): filter is FilterForBeloningToGroup<string> {
  return filter.type === FILTER_COMPARATOR.In;
}

export function composeLimitClause(limit?: number) {
  return limit ? `LIMIT ${limit}` : '';
}

export function composeOrderByClause(orderBy: Array<OrderBy<Array<string>>> = []) {
  return 'ORDER BY\n' + orderBy.map(({ column, direction }) => `  ${column} ${direction}`).join(',\n');
}
