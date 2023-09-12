import Head from 'next/head';
import { useRouter } from 'next/router';
import styles from '../styles/Layout.module.css';
import Navbar from 'components/ui/Navbar';
import Footer from 'components/ui/Footer';
import { ReactNode } from 'react';
import { PageMeta } from '../types/types';
import { Button, Icon } from '@chakra-ui/react';
import { FaDiscord } from 'react-icons/fa';
import Link from 'next/link';
import { getURL } from '@/utils/helpers';

interface Props {
  children: ReactNode;
  meta?: PageMeta;
}



export default function Layout({ children, meta: pageMeta }: Props) {
  const router = useRouter();

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        justifyContent: 'space-between'
      }}
    >

      <main id="skip" className={styles.main}>
        {children}
      </main>
    </div>
  );
}
