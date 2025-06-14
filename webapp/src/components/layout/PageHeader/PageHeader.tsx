import './PageHeader.scss';

import cn from 'classnames';
import React from 'react';

import { SCREEN_SIZE } from '../../../constants/screenSize';
import { useScreenSize } from '../../../hooks/useScreenSize';
import { FilterFunnel } from '../../icons/FilterFunnel/FilterFunnel';
import { XpmText } from '../../XpmText/XpmText';

interface PageHeaderProps {
  title: string;
  filters?: React.ReactNode;
}

// TODO (Valle) -> update component to accept fiulters
// and render them either in the header itself when in desktop mode
// or in a popover modal when in mobile mode
export const PageHeader: React.FunctionComponent<PageHeaderProps> = ({ filters, title }) => {
  const { screenSize } = useScreenSize();

  return (
    <div style={{ height: '200px', width: '100%' }}>
      <div
        className={cn('PageHeader--title-container', {
          'PageHeader--title-container--phone': screenSize === SCREEN_SIZE.Phone,
        })}
      >
        <XpmText content={title} size="m" />
        {screenSize === SCREEN_SIZE.Phone && !!filters && <FilterFunnel />}
      </div>
      {screenSize !== SCREEN_SIZE.Phone && filters}
    </div>
  );
};
