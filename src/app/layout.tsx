import './globals.css'
import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import localFont from 'next/font/local'


const inter = Inter({ subsets: ['latin'] })

const mona = localFont({
  src: '../fonts/Mona-Sans.woff2',
  display: 'swap'
})

export const metadata: Metadata = {
  title: 'Lumen',
  description: 'ask me anything',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={mona.className}>{children}</body>
    </html>
  )
}
