'use client';

import { useRouter } from 'next/navigation';
import LandingPage from './LandingPage';

export default function Home() {
  const router = useRouter();
  return <LandingPage onNavigate={() => router.push('/auth/login')} />;
}
