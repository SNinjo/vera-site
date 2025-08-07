import { X } from 'lucide-react';
import React, { useEffect } from 'react';
import { IconButton, TextButton } from '@/components/Button';
import Loading from '@/components/Loading';
import styles from './index.module.scss';

type PopupProps = {
  isOpen?: boolean;
  onClose?: () => void;
  children: React.ReactNode;
};
export function Popup({ isOpen = true, onClose, children }: PopupProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose?.();
    }
  };
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose?.();
    }
  };

  if (!isOpen) return <></>;
  return (
    <div
      className={styles.popup}
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      {children}
    </div>
  );
}

type PopupLoadingProps = {
  isOpen?: boolean;
};
export function PopupLoading({ isOpen = true }: PopupLoadingProps) {
  return (
    <Popup isOpen={isOpen}>
      <div className={styles.loading}>
        <Loading size={40} />
      </div>
    </Popup>
  );
}

type PopupWindowProps = PopupProps & {
  title?: string;
};
export function PopupWindow({ isOpen, onClose, title, children }: PopupWindowProps) {
  return (
    <Popup isOpen={isOpen} onClose={onClose}>
      <div className={styles.window}>
        <header>
          {title && <h2>{title}</h2>}
          <IconButton icon={<X size={20} />} onClick={onClose} />
        </header>
        <div>{children}</div>
      </div>
    </Popup>
  );
}

type PopupDialogProps = {
  isOpen?: boolean;
  onClose?: () => void;
  onConfirm?: () => void;
  cancelable?: boolean;
  title?: string;
  message: string;
};
export function PopupDialog({
  isOpen = true,
  onClose,
  onConfirm,
  title,
  message,
  cancelable = false,
}: PopupDialogProps) {
  const handleConfirm = () => {
    onConfirm?.();
    onClose?.();
  };

  if (!isOpen) return <></>;
  return (
    <PopupWindow isOpen={isOpen} title={title} onClose={onClose}>
      <div className={styles.dialog}>
        <p>{message}</p>
        <footer>
          {cancelable && <TextButton text="Cancel" type="outline" onClick={onClose} />}
          <TextButton text="Confirm" type="solid" onClick={handleConfirm} />
        </footer>
      </div>
    </PopupWindow>
  );
}
