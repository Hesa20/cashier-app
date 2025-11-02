import '../src/styles/index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavbarClient from '../src/components/NavbarClient';

export const metadata = {
  title: 'Kasir App',
  description: 'Kasir App migrated to Next.js App Router',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <head />
      <body>
        <NavbarClient />
        <main>{children}</main>
      </body>
    </html>
  );
}
