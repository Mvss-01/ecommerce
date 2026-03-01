// app/fonts.ts
import localFont from 'next/font/local'
import { Noto_Kufi_Arabic } from 'next/font/google'

export const myCustomFont = localFont({
  src: [
    {
      path: './fonts/MyFont-Regular.woff2',
    },
  ],
  variable: '--font-custom',
})