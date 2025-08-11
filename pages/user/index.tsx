import { SquarePen, SquarePlus, Trash } from 'lucide-react';
import Head from 'next/head';
import Image from 'next/image';
import React, { useState } from 'react';
import TimeAgo from 'react-timeago';
import useSWR from 'swr';
import { IconButton, TextButton } from '@/components/Button';
import Input from '@/components/Input';
import { Layout } from '@/components/Layout';
import Loading from '@/components/Loading';
import { PopupDialog, PopupLoading, PopupWindow } from '@/components/Popup';
import Row from '@/components/Row';
import axios, { fetcherGet } from '@/lib/axios';
import styles from './index.module.scss';

type SelectedUser = {
  id: number;
  email: string;
};
type User = SelectedUser & {
  name: string | null;
  picture: string | null;
  last_login_at: string | null;
  created_at: string;
  updated_at: string;
};

export default function UserPage() {
  const { data, isLoading, error, mutate } = useSWR<User[]>(
    `${process.env.NEXT_PUBLIC_IDENTITY_SERVICE_URL}/users`,
    fetcherGet,
  );
  const [isSaving, setIsSaving] = useState(false);
  const [dialog, setDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
  }>({ isOpen: false, title: '', message: '' });

  const [selectedUser, setSelectedUser] = useState<SelectedUser | null>(null);
  const [deletingUserId, setDeletingUserId] = useState<number | null>(null);

  const handleSave = async () => {
    if (!selectedUser) return;

    setIsSaving(true);
    try {
      if (selectedUser.id === 0) {
        await axios.post(`${process.env.NEXT_PUBLIC_IDENTITY_SERVICE_URL}/users`, {
          email: selectedUser.email.trim(),
        });
      } else {
        await axios.patch(
          `${process.env.NEXT_PUBLIC_IDENTITY_SERVICE_URL}/users/${selectedUser.id}`,
          {
            email: selectedUser.email.trim(),
          },
        );
      }

      setSelectedUser(null);
      await mutate();
    } catch (error: unknown) {
      setDialog({
        isOpen: true,
        title: 'Error',
        message: `${error}`,
      });
    } finally {
      setSelectedUser(null);
      setIsSaving(false);
    }
  };
  const handleDelete = async () => {
    if (!deletingUserId) return;

    setIsSaving(true);
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_IDENTITY_SERVICE_URL}/users/${deletingUserId}`);
      await mutate();
    } catch (error) {
      setDialog({
        isOpen: true,
        title: 'Error',
        message: `${error}`,
      });
    } finally {
      setDeletingUserId(null);
      setIsSaving(false);
    }
  };

  return (
    <Layout>
      <Head>
        <title>User | Vera</title>
      </Head>
      <div className={styles.container}>
        {error && <p className={styles.error}>Error loading users: {error.message}</p>}
        {isLoading && <Loading size={40} />}
        {data && (
          <div>
            <header className={styles.header}>
              <h1>User List</h1>
              <IconButton
                icon={<SquarePlus size={20} />}
                onClick={() => setSelectedUser({ id: 0, email: '' })}
              />
            </header>
            <div className={styles.table}>
              <table>
                <thead>
                  <tr>
                    <th>ROW</th>
                    <th>NAME</th>
                    <th>EMAIL</th>
                    <th>PICTURE</th>
                    <th>LAST LOGIN</th>
                    <th>CREATED</th>
                    <th>UPDATED</th>
                    <th>FUNCTION</th>
                  </tr>
                </thead>
                <tbody>
                  {data
                    .sort((a, b) => a.id - b.id)
                    .map((user: User, index: number) => (
                      <tr key={user.id} className={styles.tableRow}>
                        <td>{index + 1}</td>
                        <td>
                          {user.name ? (
                            <span>{user.name}</span>
                          ) : (
                            <span className={styles.emptyValue}>-</span>
                          )}
                        </td>
                        <td>{user.email}</td>
                        <td>
                          {user.picture ? (
                            <Image
                              className={styles.image}
                              src={user.picture}
                              alt={`${user.email} picture`}
                              width={40}
                              height={40}
                            />
                          ) : (
                            <span className={styles.emptyValue}>-</span>
                          )}
                        </td>
                        <td>
                          {user.last_login_at ? (
                            <TimeAgo date={user.last_login_at} title={user.last_login_at} />
                          ) : (
                            <span className={styles.emptyValue}>-</span>
                          )}
                        </td>
                        <td>
                          <TimeAgo date={user.created_at} title={user.created_at} />
                        </td>
                        <td>
                          <TimeAgo date={user.updated_at} title={user.updated_at} />
                        </td>
                        <td>
                          <div className={styles.functions}>
                            <IconButton
                              icon={<SquarePen size={20} />}
                              onClick={() => setSelectedUser(user)}
                            />
                            <IconButton
                              icon={<Trash size={20} />}
                              onClick={() => setDeletingUserId(user.id)}
                            />
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
        {selectedUser && (
          <PopupWindow
            onClose={() => setSelectedUser(null)}
            title={selectedUser.id === 0 ? 'Create User' : 'Edit User'}
          >
            <div className={styles.form}>
              <div>
                <Row label="Email">
                  <Input
                    value={selectedUser.email}
                    onChange={(value) => setSelectedUser({ ...selectedUser, email: value })}
                  />
                </Row>
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
          isOpen={!!deletingUserId}
          onClose={() => setDeletingUserId(null)}
          onConfirm={handleDelete}
          title="Delete User"
          message="Are you sure you want to delete this user? This action cannot be undone."
          cancelable
        />
      </div>
    </Layout>
  );
}
