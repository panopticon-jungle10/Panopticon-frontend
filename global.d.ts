// Type declarations for importing CSS/SASS files in TypeScript
// This tells the compiler these files are modules and can be imported for side-effects
declare module '*.css';
declare module '*.scss';
declare module '*.sass';
declare module '*.module.css';
declare module '*.module.scss';
declare module '*.module.sass';

// Declarations for ESLint Next configs imported in eslint.config.mjs
declare module 'eslint-config-next/typescript';
declare module 'eslint-config-next/core-web-vitals';
declare module 'eslint-plugin-prettier';
declare module 'eslint-plugin-next';
