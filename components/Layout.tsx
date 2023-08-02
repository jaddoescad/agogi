import Head from 'next/head';
import { useRouter } from 'next/router';
import styles from '../styles/Layout.module.css';
import Navbar from 'components/ui/Navbar';
import Footer from 'components/ui/Footer';
import { ReactNode } from 'react';
import { PageMeta } from '../types';
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
  const meta = {
    title: 'Agogi',
    description: 'AI powered quiz platform'
    ...pageMeta
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        justifyContent: 'space-between'
      }}
    >
      <Head>
        <title>{meta.title}</title>
        <meta name="robots" content="follow, index" />
        <link href="/favicon.ico" rel="shortcut icon" />
        <meta content={meta.description} name="description" />
        <meta
          property="og:url"
          content={`
        
        ${getURL()}${router.asPath}`}
        />

        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={meta.title} />
        <meta property="og:description" content={meta.description} />
        <meta property="og:title" content={meta.title} />
        <meta property="og:image" content={meta.cardImage} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@vercel" />
        <meta name="twitter:title" content={meta.title} />
        <meta name="twitter:description" content={meta.description} />
        <meta name="twitter:image" content={meta.cardImage} />
      </Head>
      <Navbar />
      <main id="skip" className={styles.main}>
        {children}
      </main>
      <Footer />
      <Link href="https://discord.gg/crKZGpnz">
        <Button
          position="fixed"
          bottom={4}
          right={4}
          colorScheme="blue"
          rounded={'full'}
          leftIcon={<Icon as={FaDiscord} />}
        >
          Discord
        </Button>
      </Link>
    </div>
  );
}
