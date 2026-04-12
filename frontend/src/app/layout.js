import './globals.css';
import { Providers } from '../lib/providers';
import Navbar from '../components/Navbar';

export const metadata = {
  title: 'Chitraguptha',
  description: 'Your AI-powered academic assistant',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-900 text-slate-300 min-h-screen flex">
        <Providers>
          <Navbar />
          <main className="flex-1 p-6 overflow-y-auto">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
