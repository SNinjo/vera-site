import styles from './index.module.scss';

type ButtonProps = {
  onClick?: () => void;
  disabled?: boolean;
};

type IconButtonProps = ButtonProps & {
  icon: React.ReactNode;
};
export function IconButton({ icon, onClick, disabled = false }: IconButtonProps) {
  return (
    <button
      className={`${styles.button} ${styles.icon} ${styles.animation} ${disabled ? styles.disabled : ''}`}
      onClick={onClick}
      disabled={disabled}
    >
      {icon}
    </button>
  );
}

type TextButtonProps = ButtonProps & {
  text: string;
  type: 'solid' | 'outline';
};
export function TextButton({ text, onClick, disabled = false, type = 'solid' }: TextButtonProps) {
  return (
    <button
      className={`${styles.button} ${styles.text} ${styles.animation} ${styles[type]} ${disabled ? styles.disabled : ''}`}
      onClick={onClick}
      disabled={disabled}
    >
      {text}
    </button>
  );
}
