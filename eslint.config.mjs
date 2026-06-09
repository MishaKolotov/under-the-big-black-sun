import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { FlatCompat } from '@eslint/eslintrc'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Flat config (ESLint 9). `eslint-config-next` ships legacy "extends" presets, so we
// bridge them through FlatCompat. `pnpm lint` runs the ESLint CLI directly (not the
// deprecated `next lint`), which keeps it fully non-interactive.
const compat = new FlatCompat({ baseDirectory: __dirname })

const eslintConfig = [
  {
    // Generated / vendored output we never author by hand.
    ignores: [
      '.next/**',
      'node_modules/**',
      'src/payload-types.ts',
      'src/app/(payload)/admin/importMap.js',
      'next-env.d.ts',
      'src/migrations/**',
    ],
  },
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
]

export default eslintConfig
