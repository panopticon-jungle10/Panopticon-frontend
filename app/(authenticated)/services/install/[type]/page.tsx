import { notFound } from 'next/navigation';
import { platformsData } from '@/components/features/install/platforms';
import { frameworksData } from '@/components/features/install/frameworks';
import { PlatformType, FrameworkType } from '@/types/agent-install';
import PlatformInstallClient from '@/components/features/install/PlatformInstallClient';
import FrameworkInstallClient from '@/components/features/install/FrameworkInstallClient';

type Props = {
  params: Promise<{
    type: string;
  }>;
};

export default async function InstallTypePage({ params }: Props) {
  const { type } = await params;

  // Check if it's a platform
  if (type in platformsData) {
    return <PlatformInstallClient platformKey={type as PlatformType} />;
  }

  // Check if it's a framework
  if (type in frameworksData) {
    const framework = frameworksData[type as FrameworkType];
    return <FrameworkInstallClient framework={framework} />;
  }

  // If neither, return 404
  notFound();
}
