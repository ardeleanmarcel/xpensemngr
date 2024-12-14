import { FilterForBeloningToGroup, FILTER_TYPE, Filter, FilterValue } from '../../db.utils';

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
  return filter.type === FILTER_TYPE.In;
}
