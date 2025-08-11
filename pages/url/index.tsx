import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import useSWR from 'swr';
import { Layout } from '@/components/Layout';
import Loading from '@/components/Loading';
import { fetcherGet } from '@/lib/axios';
import styles from './index.module.scss';

export default function RootUrlPage() {
  const router = useRouter();
  const { data, isLoading, error } = useSWR(
    `${process.env.NEXT_PUBLIC_DRIVE_SERVICE_URL}/urls/root-id`,
    fetcherGet,
  );

  useEffect(() => {
    if (data) {
      router.push(`/url/${data}`);
    }
  }, [data, router]);

  return (
    <Layout>
      <Head>
        <title>URL | Vera</title>
      </Head>
      <div className={styles.container}>
        {error && <p className={styles.error}>Error loading urls: {error.message}</p>}
        {isLoading && <Loading size={40} />}
      </div>
    </Layout>
  );
}
