import styles from './index.module.scss';

type InputProps = {
  value: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
};

export default function Input({ value, onChange, placeholder, disabled = false }: InputProps) {
  return (
    <input
      className={`${styles.input} ${disabled ? styles.disabled : ''}`}
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      placeholder={placeholder}
      type="text"
      disabled={disabled}
    />
  );
}
