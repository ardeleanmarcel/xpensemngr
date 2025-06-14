import './CardV2.scss';

import cn from 'classnames';

import { cleanObject } from '../../../utils/object.utils';
import { XpmLoadingSpinner } from '../../info/XpmLoadingSpinner/XpmLoadingSpinner';

interface XpmCardProps {
  width?: string;
  height?: string;
  minHeight?: string;
  showLoading?: boolean;
  padding?: 's' | 'm' | 'l';
  shadow?: 'regular' | 'reduced';
}

export function CardV2({
  width,
  height,
  minHeight,
  padding = 'm',
  shadow = 'regular',
  showLoading = false,
  children,
}: React.PropsWithChildren<XpmCardProps>) {
  const style = cleanObject({ width, height, minHeight });

  return (
    <div className={cn('XpmCard', `XpmCard--shadow-${shadow}`, `XpmCard--padding-${padding}`)} style={style}>
      {children}
      <XpmLoadingSpinner isVisible={showLoading} />
    </div>
  );
}
