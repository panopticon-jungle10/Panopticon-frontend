// 입력창 공통 형식

'use client';

import * as React from 'react';

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        className={cn(
          // 기본 스타일
          'flex h-9 w-full rounded-md border border-input bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/50 shadow-sm transition-colors',
          // 포커스 효과
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400',
          // 비활성화 상태
          'disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';

export { Input };
