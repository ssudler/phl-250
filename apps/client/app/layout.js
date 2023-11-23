import './globals.css'

export const metadata = {
  title: process.env.NEXT_PUBLIC_METADATA_TITLE,
  description: process.env.NEXT_PUBLIC_METADATA_DESCRIPTION,
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
