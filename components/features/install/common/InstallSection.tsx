// Step 3-1 / 3-2 같은 섹션 UI

'use client';

import { CopyableCodeBlock } from './CopyableCodeBlock';

type InstallSectionProps = {
  heading?: string;
  description?: string;
  code: string;
  language?: string;
};

export function InstallSection({ heading, description, code, language }: InstallSectionProps) {
  return (
    <div>
      {heading && <h3 className="text-xl font-bold text-gray-900 mb-1">{heading}</h3>}

      {description && <p className="text-sm text-gray-600 mb-3">{description}</p>}

      <div className="rounded-xl border border-gray-200 bg-gray-50/80 p-5">
        <CopyableCodeBlock code={code} language={language} />
      </div>
    </div>
  );
}
