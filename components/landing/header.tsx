"use client";

import Link from "next/link";
import Image from "next/image";

export function Header() {
  return (
    <header
      id="site-header"
      className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60"
    >
      <div className="container mx-auto flex py-2 items-center px-4">
        <div>
          <Link href="/">
            <Image src="/logo.jpg" alt="Cabral Inmobiliaria" width={64} height={64} className="w-full" />
          </Link>
        </div>
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
