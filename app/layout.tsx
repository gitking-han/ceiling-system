import '../src/index.css';

export const metadata = {
  title: 'PlateFactory ERP',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
