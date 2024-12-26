export enum SCREEN_SIZE {
  Phone = 'Phone',
  Tablet = 'Tablet',
  Desktop = 'Desktop',
}

export const BREAKPOINT = {
  PhoneToTablet: 800,
  TabletToDesktop: 1200,
} as const;
