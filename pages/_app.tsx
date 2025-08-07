import type { AppProps } from 'next/app';
import { Playwrite_AU_QLD, Roboto } from 'next/font/google';
import { useRouter } from 'next/router';
import { setRouter } from '@/lib/navigation';
import { AuthProvider } from '../contexts/AuthContext';
import './globals.scss';

const roboto = Roboto({
  variable: '--font-roboto',
  subsets: ['latin'],
});
const playwriteAUQLD = Playwrite_AU_QLD({
  variable: '--font-playwrite-au-qld',
});

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  setRouter(router);

  return (
    <AuthProvider>
      <div className={`${playwriteAUQLD.variable} ${roboto.variable}`}>
        <Component {...pageProps} />
      </div>
    </AuthProvider>
  );
}
