/**
 * Buttonコンポーネント
 * TASK-0008: CSS Modules設定
 *
 * CSS Modulesの動作確認用サンプルコンポーネント
 *
 * 関連要件:
 * - REQ-233: チョーク風の色 🔵
 * - NFR-203: レスポンシブデザイン 🔵
 */

import React from 'react';
import styles from './Button.module.css';
import clsx from 'clsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  onClick,
  disabled = false,
  type = 'button',
  ...rest
}) => {
  return (
    <button
      type={type}
      className={clsx(styles.button, styles[variant])}
      onClick={onClick}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
