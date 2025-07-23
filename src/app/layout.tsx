// src/app/layout.tsx
import './globals.css'
import  { Toaster } from 'react-hot-toast'

export const metadata = {
  title: 'College Lost & Found',
  description: 'Report and search lost and found items',
}



export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Toaster/>
        {children}
      </body>
    </html>
  )
}
