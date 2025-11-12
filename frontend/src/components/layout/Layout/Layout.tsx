import { ReactNode } from 'react';
import { Header } from '../Header/Header';
import './Layout.css';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="app-layout">
      <Header />
      <main className="app-content">{children}</main>
    </div>
  );
}
