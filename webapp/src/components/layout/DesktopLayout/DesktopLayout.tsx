import './DesktopLayout.scss';

import { MenuNavagationV2 } from './components/MenuNavagationV2';

interface DesktopLayoutProps extends React.PropsWithChildren {}

// TODO (Valle) -> make this the standard way of typing a function component
export const DesktopLayout: React.FunctionComponent<DesktopLayoutProps> = ({ children }) => {
  return (
    <div className="DesktopLayout">
      <aside className="DesktopLayout--sidebar">
        <MenuNavagationV2 />
      </aside>
      <div className="DesktopLayout--scrollable-window">
        <div className="DesktopLayout--content-area">{children}</div>
      </div>
    </div>
  );
};
