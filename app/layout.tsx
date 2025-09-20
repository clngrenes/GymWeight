import React from 'react'
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = { title: 'GymWeight', description: 'Gewichts-Tracker PWA', manifest: '/manifest.json' }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body className="font-sans">{children}</body>
    </html>
  )
}