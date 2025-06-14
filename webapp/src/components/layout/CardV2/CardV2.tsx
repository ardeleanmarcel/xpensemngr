import './CardV2.scss';

import { cleanObject } from '../../../utils/object.utils';
import { XpmLoadingSpinner } from '../../info/XpmLoadingSpinner/XpmLoadingSpinner';

interface XpmCardProps {
  width?: string;
  height?: string;
  minHeight?: string;
  showLoading?: boolean;
}

export function CardV2({ width, height, minHeight, showLoading = false, children }: React.PropsWithChildren<XpmCardProps>) {
  const style = cleanObject({ width, height, minHeight });

  return (
    <div className="XpmCard" style={style}>
      {children}
      <XpmLoadingSpinner isVisible={showLoading} />
    </div>
  );
}
