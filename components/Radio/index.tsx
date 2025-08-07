import React from 'react';
import styles from './index.module.scss';

type RadioProps<T> = {
  options: {
    text: string;
    value: T;
  }[];
  value: T;
  onChange?: (value: T) => void;
};

export default function Radio<T>({ options, value, onChange }: RadioProps<T>) {
  return (
    <div className={styles.div}>
      {options.map((option) => (
        <label key={String(option.value)}>
          <input
            type="radio"
            name="custom-radio"
            value={String(option.value)}
            checked={value === option.value}
            onChange={() => onChange?.(option.value)}
          />
          <span>{option.text}</span>
        </label>
      ))}
    </div>
  );
}
