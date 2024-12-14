import './XpmText.scss';

import cn from 'classnames';

interface XpmTextProps {
  content: string;
  size?: 'xs' | 's' | 'sm' | 'm';
}

export function XpmText({
  content,
  size = 's',
}: React.PropsWithChildren<XpmTextProps>) {
  const classes = cn('XpmText', `XpmText--${size}`);

  return <span className={classes}>{content}</span>;
}
