import React from 'react';
import styles from './index.module.scss';

type RowProps = {
  label: string;
  children: React.ReactNode;
};

export default function Row({ label, children }: RowProps) {
  return (
    <div className={styles.div}>
      <span>{label}</span>
      {children}
    </div>
  );
}
