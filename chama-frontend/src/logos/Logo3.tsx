import { ReactComponent as LogoSvg } from './logo3.svg';

const Logo3 = ({
  className = 'h-12 w-auto',
  ...props
}: React.SVGProps<SVGSVGElement>) => {
  return (
    <LogoSvg
      className={className}
      {...(props as React.ComponentProps<typeof LogoSvg>)}
    />
  );
};

export default Logo3;
