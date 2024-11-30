import { cleanObject } from '../../../utils/object.utils';
import { XpmLoadingSpinner } from '../../info/XpmLoadingSpinner/XpmLoadingSpinner';
import './XpmCard.scss';

interface XpmCardProps {
  width?: string;
  showLoading?: boolean;
}

export function XpmCardV2({
  width,
  showLoading = false,
  children,
}: React.PropsWithChildren<XpmCardProps>) {
  const style = cleanObject({ width });

  return (
    <div className="XpmCard" style={style}>
      <XpmLoadingSpinner isVisible={showLoading} />
      {children}
    </div>
  );
}
