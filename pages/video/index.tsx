import Head from 'next/head';
import React from 'react';
import { Layout } from '@/components/Layout';
import styles from './index.module.scss';

export default function VideoPage() {
  return (
    <Layout>
      <Head>
        <title>Video | Vera</title>
      </Head>
      <div className={styles.div}>
        <span>Not implemented</span>
      </div>
    </Layout>
  );
}
