import { platformsData, PlatformType } from '../platforms';
import PlatformInstallClient from './PlatformInstallClient';

export function generateStaticParams() {
  return Object.keys(platformsData).map((platform) => ({ platform }));
}

export default async function Page({ params }: { params: Promise<{ platform: PlatformType }> }) {
  const resolvedParams = await params;
  return <PlatformInstallClient platformKey={resolvedParams.platform} />;
}
