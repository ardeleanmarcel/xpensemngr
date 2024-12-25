import './LayoutMobile.scss';

import React from 'react';

import { ThreeLines } from '../../../../icons/ThreeLines/ThreeLines';

// TODO (Valle) -> create an ButtonIcon component that takes an icon as a prop
export const LayoutMobile: React.FunctionComponent<React.PropsWithChildren> = ({ children }) => {
  return (
    <div className="LayoutMobile">
      <div className="LayoutMobile--menu">
        <button
          onClick={() => {
            console.log('menu');
          }}
        >
          <ThreeLines />
        </button>
      </div>
      <div className="LayoutMobile--content">{children}</div>
    </div>
  );
};
