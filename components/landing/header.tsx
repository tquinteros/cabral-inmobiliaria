"use client";

import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto flex h-14 items-center px-4">
        <Link href="/" className="font-semibold text-lg">
          Cabral Inmobiliaria
        </Link>
        <nav className="ml-auto flex gap-6">
          <Link
            href="/"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Inicio
          </Link>
          <Link
            href="/propiedades"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Propiedades
          </Link>
        </nav>
      </div>
    </header>
  );
}
