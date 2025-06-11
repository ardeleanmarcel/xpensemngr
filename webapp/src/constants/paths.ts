// TODO (Valle) -> find a "recursive" obect structure for this. maybe a tree? maybe create a class?
export enum PAGE {
  Dashboard = 'DASHBOARD',
  Labels = 'LABELS',
  Home = 'HOME',
}

// TODO (Valle) -> this could be a tree structure and nodes could implement "getPath" method
// which would traverse the tree and return the full path as a string.
export const PATH = {
  LabelManagement: {
    Segment: '/label-management',
    // Example of how nesting could look like
    // SubPaths: {
    //   Id: {
    //     Segment: '/:id',
    //     FromRoot: '/label-management/:id', // could this be a function?
    //     SubPaths: {},
    //   },
    // },
  },
  MainDashboard: {
    Segment: '/main-dashboard',
  },
  // LabelManagement: {
  //   Segment: '/label-management',
  // },
  LandingPage: {
    Segment: '/',
  },
  ResetPassword: {
    Segment: '/reset-password',
  },
  UserRegistration: {
    Segment: '/user-registration',
  },
} as const;
