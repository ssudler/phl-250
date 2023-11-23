import './globals.css'

export const metadata = {
  title: 'PHL 250',
  description: 'PHL 250 exhibit',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
