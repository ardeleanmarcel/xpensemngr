// TODO (Valle) -> find a "recursive" obect structure for this. maybe a tree? maybe create a class?
export enum PAGE {
  Dashboard = 'DASHBOARD',
  Labels = 'LABELS',
  Home = 'HOME',
}

// TODO (Valle) -> this could be a tree structure and nodes could implement "getPath" method
// which would traverse the tree and return the full path as a string.
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
  LandingPage: {
    Segment: '/',
  },
  ResetPassword: {
    Segment: '/reset-password',
  },
} as const;
