import { cleanObject } from '../../../utils/object.utils';

import './XpmHorizontalSeparator.scss';

interface XpmHorizontalSeparatorProps {
  width?: string;
}

export function XpmHorizontalSeparator({
  width,
}: React.PropsWithChildren<XpmHorizontalSeparatorProps>) {
  const style = cleanObject({ width });
  return <div className="XpmHorizontalSeparator" style={style} />;
}
