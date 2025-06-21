import './DesktopLayout.scss';

import { MenuNavigationV2 } from './components/MenuNavigationV2';

export const DesktopLayout: React.FunctionComponent<React.PropsWithChildren> = ({ children }) => {
  return (
    <div className="DesktopLayout">
      <aside className="DesktopLayout--sidebar">
        <MenuNavigationV2 />
      </aside>
      <div className="DesktopLayout--scrollable-window">{children}</div>
    </div>
  );
};
