import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'DBMS Concurrency Demo',
  description: 'Team 5 - Isolation Levels Live Demo',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <main className="min-h-screen flex flex-col items-center">
          {children}
        </main>
      </body>
    </html>
  );
}