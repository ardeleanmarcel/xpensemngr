import './DesktopLayout.scss';

import { MenuNavagationV2 } from './components/MenuNavagationV2';

export const DesktopLayout: React.FunctionComponent<React.PropsWithChildren> = ({ children }) => {
  return (
    <div className="DesktopLayout">
      <aside className="DesktopLayout--sidebar">
        <MenuNavagationV2 />
      </aside>
      <div className="DesktopLayout--scrollable-window">{children}</div>
    </div>
  );
};
