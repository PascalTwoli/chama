import React from 'react';
import { ReactComponent as LogoSvg } from './logo3.svg';

const Logo3 = (props: React.SVGProps<SVGSVGElement>) => {
  return <LogoSvg className='h-12 w-auto' {...props} />;
};

export default Logo3;
