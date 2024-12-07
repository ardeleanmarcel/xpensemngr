import { cleanObject } from '../../../utils/object.utils';
import { XpmLoadingSpinner } from '../../info/XpmLoadingSpinner/XpmLoadingSpinner';

import './XpmCardV2.scss';

interface XpmCardProps {
  width?: string;
  height?: string;
  showLoading?: boolean;
}

export function XpmCardV2({ width, height, showLoading = false, children }: React.PropsWithChildren<XpmCardProps>) {
  const style = cleanObject({ width, height });

  return (
    <div className="XpmCard" style={style}>
      {children}
      <XpmLoadingSpinner isVisible={showLoading} />
    </div>
  );
}
