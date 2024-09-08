import { SxProps, Typography } from '@mui/material';
import { Variant } from '@mui/material/styles/createTypography';

type XpmTypographyProps = {
  text: React.ReactNode;
  className?: string;
  align?: 'center' | 'right' | 'left' | 'inherit' | 'justify' | undefined;
  component?: React.ElementType;
  variant?: Variant;
  id?: string;
  sx?: SxProps;
};

export const XpmTypography = ({
  text,
  className = '',
  align = 'inherit',
  component = 'span',
  variant = 'body1',
  id,
  sx,
}: XpmTypographyProps) => {
  return (
    <Typography
      variant={variant}
      component={component}
      align={align}
      className={className}
      id={id}
      sx={sx}
    >
      {text}
    </Typography>
  );
};
