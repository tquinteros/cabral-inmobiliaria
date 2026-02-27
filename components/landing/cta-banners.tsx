import Link from "next/link";
import Image from "next/image";

const CTAS = [
  {
    title: "Alquiler",
    imageSrc: "/cta_alquiler.jpg",
    href: "/propiedades",
    ariaLabel: "Ver propiedades (Alquiler)",
  },
  {
    title: "Venta",
    imageSrc: "/cta_venta.jpg",
    href: "/propiedades",
    ariaLabel: "Ver propiedades (Venta)",
  },
] as const;

export function CtaBanners() {
  return (
    <section className="py-12 sm:py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid gap-5 md:gap-6 md:grid-cols-2">
          {CTAS.map((cta) => (
            <Link
              key={cta.title}
              href={cta.href}
              aria-label={cta.ariaLabel}
              className="group relative block overflow-hidden rounded shadow-xl ring-1 ring-border/50"
            >
              <div className="relative aspect-4/5">
                <Image
                  src={cta.imageSrc}
                  alt={cta.title}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority={false}
                />
                <div className="absolute inset-0 bg-black/25" />
                <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-black/10" />
              </div>

              <div className="pointer-events-none absolute inset-0">
                <div className="absolute inset-x-0 top-10 text-center px-6">
                  <div className="text-2xl sm:text-3xl font-medium tracking-tight text-white drop-shadow-[0_1px_12px_rgba(0,0,0,0.65)]">
                    {cta.title}
                  </div>
                </div>
                <div className="absolute inset-x-0 bottom-12 text-center px-6">
                  <div className="text-xl sm:text-2xl font-light tracking-tight text-white/90 drop-shadow-[0_1px_12px_rgba(0,0,0,0.65)]">
                    Cabral Real Estate
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

