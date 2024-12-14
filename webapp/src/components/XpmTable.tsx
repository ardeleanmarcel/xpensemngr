import {
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from '@mui/material';
import React, { ReactNode } from 'react';

import { Column, Data } from '../Pages/Expenses/expensesUtils';

type XpmTableProps = {
  columns: Column[];
  rows: Data[];
  rowsPerPage: number;
  page: number;
  handleChangePage: (event: unknown, newPage: number) => void;
  handleChangeRowsPerPage: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export const XpmTable = ({
  columns,
  rows,
  rowsPerPage,
  page,
  handleChangePage,
  handleChangeRowsPerPage,
}: XpmTableProps) => {
  return (
    <>
      <TableContainer>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                const rowKey = row['expense_id'] as string | number;

                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={rowKey}>
                    {columns.map((column) => {
                      let content: unknown = row[column.id];

                      if (column.id === 'labels') {
                        content =
                          row[column.id].length === 0
                            ? '-'
                            : row[column.id].map((label) => (
                                <Chip key={label.label_id} label={label.name} />
                              ));
                      }

                      return (
                        <TableCell key={column.id} align={column.align}>
                          {content as ReactNode}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </>
  );
};
