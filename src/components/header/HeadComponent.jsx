import Head from 'next/head';
import Link from 'next/link';
import UB from '@/public/UB.png';

export default function HeadContent() {
  return (
    <Head>
      <Link rel="shortcut icon" href={UB} />
      <meta name="fast2sms" content="HlP9ycWlnE7ml6bRo17rml20kmjhOczh" />
    </Head>
  );
}