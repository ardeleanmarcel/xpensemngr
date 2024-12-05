import './XpmVerticalSpacer.scss';
interface XpmVerticalSpacerProps {
  size: 'xs' | 's' | 'sm' | 'm' | 'ml' | 'l' | 'xl' | 'xxl' | 'xxxl';
}
export function XpmVerticalSpacer({ size }: XpmVerticalSpacerProps) {
  return <div className={`XpmVerticalSpacer--${size}`} />;
}
