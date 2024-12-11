// TODO (Valle) -> find a "recursive" obect structure for this. maybe a tree? maybe create a class?
export enum PAGE {
  Dashboard = 'DASHBOARD',
  Labels = 'LABELS',
}

export const PATH = {
  ExpenseLabels: {
    Segment: '/expense-labels',
    // Example of how nesting could look like
    // SubPaths: {
    //   Id: {
    //     Segment: '/:id',
    //     FromRoot: '/expense-labels/:id', // could this be a function?
    //     SubPaths: {},
    //   },
    // },
  },
  ExpenseDashboard: {
    Segment: '/expense-dashboard',
  },
} as const;
