import Image from 'next/image';
import React from 'react';
import GoogleSignInButton from '@/components/GoogleSignInButton';
import styles from './index.module.scss';

export default function HomePage() {
  const login = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_IDENTITY_SERVICE_URL}/auth/login`;
  };

  return (
    <div className={styles.div}>
      <div>
        <Image src="/sninjo512x512.png" alt="logo" width={60} height={60} />
        <h1>VERA</h1>
      </div>
      <GoogleSignInButton onClick={login} />
    </div>
  );
}
