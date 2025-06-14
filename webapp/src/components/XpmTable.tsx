import { Chip, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from '@mui/material';
import React, { ReactNode } from 'react';

import { Data } from '../Pages/MainDashboard/mainDashboard.utils';

const tableRowStyle = {
  '& .MuiTableRow-root': {
    height: '52px',
    maxHeight: '52px',
  },
  '& .MuiTableCell-root': {
    padding: '4px 16px',
    height: '52px',
    maxHeight: '52px',
  },
};

export interface Column {
  id: 'description' | 'amount' | 'date_expended_at' | 'labels';
  label: string;
  minWidth?: number;
  width?: `${number}%`;
  align?: 'center';
}

type XpmTableProps = {
  columns: Column[];
  rows: Data[]; // TODO (Valle) -> Data is specific to MainDashboard, consider making it more generic or passing a type parameter
  rowsPerPage: number;
  page: number;
  handleChangePage: (event: unknown, newPage: number) => void;
  handleChangeRowsPerPage: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export const XpmTable = ({ columns, rows, rowsPerPage, page, handleChangePage, handleChangeRowsPerPage }: XpmTableProps) => {
  const computedRows = rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
    const rowKey = row['expense_id'] as string | number;

    return (
      <TableRow hover role="checkbox" tabIndex={-1} key={rowKey}>
        {columns.map((column) => {
          let content: unknown = row[column.id];

          if (column.id === 'labels') {
            content =
              row[column.id].length === 0
                ? '-'
                : row[column.id].map((label) => <Chip key={label.label_id} label={label.name} style={{ marginLeft: '4px' }} />);
          }

          return (
            <TableCell key={column.id} align={column.align}>
              {content as ReactNode}
            </TableCell>
          );
        })}
      </TableRow>
    );
  });

  if (computedRows.length < 10) {
    const emptyRows = 10 - computedRows.length;
    for (let i = 0; i < emptyRows; i++) {
      computedRows.push(
        <TableRow key={`empty-row-${i}`} style={{ maxHeight: 24, height: 24 }}>
          <TableCell colSpan={columns.length} />
        </TableRow>
      );
    }
  }

  return (
    <>
      <TableContainer>
        <Table stickyHeader aria-label="sticky table" sx={tableRowStyle}>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.id} align={column.align} style={{ minWidth: column.minWidth, width: column.width }}>
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>{computedRows}</TableBody>
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
