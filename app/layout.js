import './globals.css'
import { Source_Sans_3 } from 'next/font/google'

const ss3 = Source_Sans_3({
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
})

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={ss3.className}>
      <body>{children}</body>
    </html>
  )
}