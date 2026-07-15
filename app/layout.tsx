import '../src/index.css';

export const metadata = {
  title: 'PlateFactory ERP',
  icons: {
    icon: [
      { url: '/logo.png', type: 'image/png', sizes: 'any' },
    ],
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
