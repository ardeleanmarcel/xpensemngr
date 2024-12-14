import './XpmHorizontalSeparator.scss';

import { cleanObject } from '../../../utils/object.utils';

interface XpmHorizontalSeparatorProps {
  width?: string;
}

export function XpmHorizontalSeparator({
  width,
}: React.PropsWithChildren<XpmHorizontalSeparatorProps>) {
  const style = cleanObject({ width });
  return <div className="XpmHorizontalSeparator" style={style} />;
}
