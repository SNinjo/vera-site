import { LoaderCircle } from 'lucide-react';
import React, { FC } from 'react';
import style from './index.module.scss';

type Props = {
  className?: string;
  size?: number;
};
const Loading: FC<Props> = ({ className, size }) => {
  return <LoaderCircle className={`${style.icon} ${className}`} size={size} />;
};
export default Loading;
