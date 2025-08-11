import { ChevronRight, ExternalLink, FolderOpen, SquarePen, SquarePlus, Trash } from 'lucide-react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import TimeAgo from 'react-timeago';
import useSWR from 'swr';
import { IconButton, TextButton } from '@/components/Button';
import Input from '@/components/Input';
import { Layout } from '@/components/Layout';
import Loading from '@/components/Loading';
import { PopupDialog, PopupLoading, PopupWindow } from '@/components/Popup';
import Radio from '@/components/Radio';
import Row from '@/components/Row';
import axios, { fetcherGet } from '@/lib/axios';
import styles from './index.module.scss';

type SelectedURL = {
  id: string;
  name: string;
  type: 'folder' | 'url';
  url: string | null;
  parent_id: string;
};
type BaseURL = {
  id: string;
  name: string;
  type: 'folder' | 'url';
  url: string | null;
  created_at: string;
  updated_at: string;
};
type URL = BaseURL & {
  parent: BaseURL[];
  children: BaseURL[];
};

export default function UrlPage() {
  const router = useRouter();
  const urlId = router.query.id as string;
  const { data, isLoading, error, mutate } = useSWR<URL>(
    `${process.env.NEXT_PUBLIC_DRIVE_SERVICE_URL}/urls/${urlId}`,
    fetcherGet,
  );
  const [isSaving, setIsSaving] = useState(false);
  const [dialog, setDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
  }>({ isOpen: false, title: '', message: '' });

  const [selectedUrl, setSelectedUrl] = useState<SelectedURL | null>(null);
  const [deletingUrlId, setDeletingUrlId] = useState<string | null>(null);

  const handleSave = async () => {
    if (!selectedUrl) return;

    setIsSaving(true);
    try {
      if (selectedUrl.id === '') {
        await axios.post(`${process.env.NEXT_PUBLIC_DRIVE_SERVICE_URL}/urls`, selectedUrl);
      } else {
        await axios.put(
          `${process.env.NEXT_PUBLIC_DRIVE_SERVICE_URL}/urls/${selectedUrl.id}`,
          selectedUrl,
        );
      }

      setSelectedUrl(null);
      await mutate();
    } catch (error: unknown) {
      setDialog({
        isOpen: true,
        title: 'Error',
        message: `${error}`,
      });
    } finally {
      setSelectedUrl(null);
      setIsSaving(false);
    }
  };
  const handleDelete = async () => {
    if (!deletingUrlId) return;

    setIsSaving(true);
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_DRIVE_SERVICE_URL}/urls/${deletingUrlId}`);
      await mutate();
    } catch (error) {
      setDialog({
        isOpen: true,
        title: 'Error',
        message: `${error}`,
      });
    } finally {
      setDeletingUrlId(null);
      setIsSaving(false);
    }
  };

  return (
    <Layout>
      <Head>
        <title>URL | Vera</title>
      </Head>
      <div className={styles.container}>
        {error && <p className={styles.error}>Error loading urls: {error.message}</p>}
        {isLoading && <Loading size={40} />}
        {data && (
          <div>
            <div className={styles.breadcrumb}>
              {[...data.parent, data].map((breadcrumb, index) => (
                <>
                  <Link href={`/url/${breadcrumb.id}`}>
                    {index === 0 ? 'Root' : breadcrumb.name}
                  </Link>
                  {index !== data.parent.length && <ChevronRight size={15} />}
                </>
              ))}
            </div>
            <div className={styles.header}>
              <h1>URL</h1>
              <div>
                <IconButton
                  icon={<SquarePlus size={20} />}
                  onClick={() =>
                    setSelectedUrl({ id: '', name: '', type: 'url', url: '', parent_id: urlId })
                  }
                />
              </div>
            </div>
            <div className={styles.table}>
              <table>
                <thead>
                  <tr>
                    <th>NAME</th>
                    <th>CREATED</th>
                    <th>UPDATED</th>
                    <th>FUNCTION</th>
                  </tr>
                </thead>
                <tbody>
                  {data.children.length === 0 && (
                    <tr>
                      <td colSpan={4}>Empty...</td>
                    </tr>
                  )}
                  {data.children
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .sort((a, b) => a.type.localeCompare(b.type))
                    .map((url: BaseURL) => (
                      <tr key={url.id} className={styles.tableRow}>
                        <td>{url.name}</td>
                        <td>
                          <TimeAgo date={url.created_at} title={url.created_at} />
                        </td>
                        <td>
                          <TimeAgo date={url.updated_at} title={url.updated_at} />
                        </td>
                        <td>
                          <div className={styles.functions}>
                            <IconButton
                              icon={<SquarePen size={20} />}
                              onClick={() => setSelectedUrl({ ...url, parent_id: urlId })}
                            />
                            <IconButton
                              icon={<Trash size={20} />}
                              onClick={() => setDeletingUrlId(url.id)}
                            />
                            {url.type === 'url' && (
                              <IconButton
                                icon={<ExternalLink size={20} />}
                                onClick={() => window.open(url.url!, '_blank')}
                              />
                            )}
                            {url.type === 'folder' && (
                              <IconButton
                                icon={<FolderOpen size={20} />}
                                onClick={() => router.push(`/url/${url.id}`)}
                              />
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <PopupLoading isOpen={isSaving} />
        {selectedUrl && (
          <PopupWindow
            onClose={() => setSelectedUrl(null)}
            title={selectedUrl.id === '' ? 'Create URL' : 'Edit URL'}
          >
            <div className={styles.form}>
              <div>
                {selectedUrl.id === '' && (
                  <Row label="Type">
                    <Radio<BaseURL['type']>
                      options={[
                        { text: 'URL', value: 'url' },
                        { text: 'Folder', value: 'folder' },
                      ]}
                      value={selectedUrl.type}
                      onChange={(value) => setSelectedUrl({ ...selectedUrl, type: value })}
                    />
                  </Row>
                )}
                <Row label="Name">
                  <Input
                    value={selectedUrl.name}
                    onChange={(value) => setSelectedUrl({ ...selectedUrl, name: value })}
                  />
                </Row>
                {selectedUrl.type === 'url' && (
                  <Row label="URL">
                    <Input
                      value={selectedUrl.url ?? ''}
                      onChange={(value) => setSelectedUrl({ ...selectedUrl, url: value })}
                    />
                  </Row>
                )}
              </div>
              <footer>
                <TextButton text="Confirm" type="solid" onClick={handleSave} />
              </footer>
            </div>
          </PopupWindow>
        )}
        <PopupDialog
          isOpen={dialog.isOpen}
          onClose={() => setDialog({ isOpen: false, title: '', message: '' })}
          title={dialog.title}
          message={dialog.message}
          cancelable
        />
        <PopupDialog
          isOpen={!!deletingUrlId}
          onClose={() => setDeletingUrlId(null)}
          onConfirm={handleDelete}
          title="Delete URL"
          message="Are you sure you want to delete this URL? This action cannot be undone."
          cancelable
        />
      </div>
    </Layout>
  );
}
