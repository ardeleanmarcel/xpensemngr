import './CardV2.scss';

import cn from 'classnames';

import { cleanObject } from '../../../utils/object.utils';
import { XpmLoadingSpinner } from '../../info/XpmLoadingSpinner/XpmLoadingSpinner';

interface XpmCardProps {
  width?: string;
  height?: string;
  minHeight?: string;
  showLoading?: boolean;
  padding?: 'm' | 'l';
}

export function CardV2({
  width,
  height,
  minHeight,
  padding = 'm',
  showLoading = false,
  children,
}: React.PropsWithChildren<XpmCardProps>) {
  const style = cleanObject({ width, height, minHeight });

  return (
    <div
      className={cn('XpmCard', {
        'XpmCard--padding-m': padding === 'm',
        'XpmCard--padding-l': padding === 'l',
      })}
      style={style}
    >
      {children}
      <XpmLoadingSpinner isVisible={showLoading} />
    </div>
  );
}
