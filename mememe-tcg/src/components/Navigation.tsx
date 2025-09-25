'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();

  const navLinks = [
    { href: '/collection', label: 'カードコレクション' },
    { href: '/deck-builder', label: 'デッキビルダー' },
    { href: '/game', label: '対戦' },
  ];

  return (
    <nav className="bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-white text-xl font-bold">
              めめめのくらげ TCG
            </Link>
          </div>
          <div className="flex space-x-4">
            {navLinks.map(({ href, label }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`${
                    isActive
                      ? 'text-blue-300'
                      : 'text-white hover:text-blue-300'
                  } transition-colors`}
                >
                  {label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}