import { FilterForBeloningToGroup, FILTER_COMPARATOR, Filter } from '../../db.utils.ts';
import { OrderBy, SqlBindingData, SqlQueryBindings } from '../types/sql.types.ts';

export function composeWhereClause(filters: Filter<string>[]) {
  if (filters.length === 0) return { whereClauses: '', bindings: [] };

  const clauses: string[] = [];
  let bindings: SqlQueryBindings = [];

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

interface GetSqlQueryBindingsArgs<Obj> {
  objects: Array<Obj>;
  keys: Array<keyof Obj>;
  insertBeforeEachSet?: Array<SqlBindingData>;
  insertAfterEachSet?: Array<SqlBindingData>;
}
interface SqlQueryBindingsRecord {
  [key: string]: SqlBindingData;
}
export function getSqlQueryBindings<Obj extends SqlQueryBindingsRecord>(args: GetSqlQueryBindingsArgs<Obj>) {
  const { objects, keys, insertBeforeEachSet, insertAfterEachSet } = args;

  const bindings = objects.reduce<SqlQueryBindings>((binds, obj) => {
    if (insertBeforeEachSet) binds.push(...insertBeforeEachSet);
    keys.forEach((key) => binds.push(obj[key]));
    if (insertAfterEachSet) binds.push(...insertAfterEachSet);

    return binds;
  }, []);

  return bindings;
}
