import { Bookmark, LogOut, Mail, SquarePlay, UserRound } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import styles from './index.module.scss';
import { ContextMenu, ContextMenuItem } from '../ContextMenu';

type LayoutProps = {
  children: React.ReactNode;
};
export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isAuthenticated, loading, claims, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return <div className={styles.message}>Loading...</div>;
  }
  if (!isAuthenticated) {
    return <div className={styles.message}>Redirecting...</div>;
  }

  return (
    <div className={styles.div}>
      <aside>
        <header>
          <Link href="/app">
            <Image src="/sninjo512x512.png" alt="logo" width={30} height={30} />
          </Link>
        </header>
        <nav>
          <Link href="/user" className={router.pathname.match(/^\/user/) ? styles.current : ''}>
            <UserRound size={18} />
            <span>User</span>
          </Link>
          <Link href="/url" className={router.pathname.match(/^\/url/) ? styles.current : ''}>
            <Bookmark size={18} />
            <span>URL</span>
          </Link>
          <Link href="/video" className={router.pathname.match(/^\/video/) ? styles.current : ''}>
            <SquarePlay size={18} />
            <span>Video</span>
          </Link>
        </nav>
        <ContextMenu
          trigger={
            <footer className={styles.footer}>
              <Image
                className={styles.avatar}
                src={claims.picture}
                alt="avatar"
                width={30}
                height={30}
              />
              <span>{claims.name}</span>
            </footer>
          }
          position="top"
        >
          <ContextMenuItem icon={<Mail size={18} />} disabled>
            {claims.email}
          </ContextMenuItem>
          <ContextMenuItem icon={<LogOut size={18} />} onClick={logout}>
            Logout
          </ContextMenuItem>
        </ContextMenu>
      </aside>
      <main>{children}</main>
    </div>
  );
};
