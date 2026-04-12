import { Providers } from '../lib/providers';
import './globals.css';

export const metadata = {
  title: 'ChitraGupta',
  description: 'AI-powered academic assistant',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-slate-900 text-white">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
