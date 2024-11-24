import { cleanObject } from '../../../utils/object.utils';
import './XpmCard.scss';

interface XpmCardProps {
  width?: string;
}

export function XpmCardV2({
  width,
  children,
}: React.PropsWithChildren<XpmCardProps>) {
  const style = cleanObject({ width });

  return (
    <div className="XpmCard" style={style}>
      {children}
    </div>
  );
}
