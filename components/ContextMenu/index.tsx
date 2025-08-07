import React, { useState, useRef, useEffect } from 'react';
import styles from './index.module.scss';

type ContextMenuProps = {
  trigger: React.ReactNode;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
};
export const ContextMenu: React.FC<ContextMenuProps> = ({
  trigger,
  children,
  position = 'bottom',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };
  const handleClose = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node) &&
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        handleClose();
      }
    };
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  return (
    <div className={styles.contextMenu}>
      <div ref={triggerRef} className={styles.trigger} onClick={handleToggle}>
        {trigger}
      </div>

      {isOpen && (
        <div ref={menuRef} className={`${styles.menu} ${styles[position]}`}>
          {children}
        </div>
      )}
    </div>
  );
};

type ContextMenuItemProps = {
  icon: React.ReactNode;
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
};
export const ContextMenuItem: React.FC<ContextMenuItemProps> = ({
  icon,
  children,
  onClick,
  disabled = false,
}) => {
  const handleClick = () => {
    if (!disabled && onClick) {
      onClick();
    }
  };

  return (
    <div className={`${styles.menuItem} ${disabled ? styles.disabled : ''}`} onClick={handleClick}>
      {icon}
      {children}
    </div>
  );
};
