import { SVGProps } from 'react';

type IconProps = Omit<SVGProps<SVGSVGElement>, 'children'>;

// TODO (Valle) -> find a narrower type to explictly say it is an svg element
export type IconComponent = React.FunctionComponent<IconProps>;
