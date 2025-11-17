// Panopticon 로고

import Link from 'next/link';

interface LogoProps {
  textSize?: string;
  iconSize?: string;
  showText?: boolean;
  className?: string;
}

export default function Logo({
  textSize = 'text-xl',
  iconSize = 'w-8 h-8',
  showText = true,
  className = '',
}: LogoProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Link href="/" className="flex items-center gap-2">
        <div className={`${iconSize} flex items-center justify-center`}>
          <img src="/logo/Logo.png" alt="Panopticon" className="w-full h-full object-contain" />
        </div>
        {showText && <span className={`${textSize} font-semibold`}>Panopticon</span>}
      </Link>
    </div>
  );
}
