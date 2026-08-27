import Link from "next/link";
import { EBG_DATA } from "@/data/ebg-data";
import { BikeDealCard } from "./BikeDealCard";
import { ArrowRightIcon } from "./icons";

export function FeaturedDeals() {
  const deals = EBG_DATA.bikes.filter((b) => b.destacada).slice(0, 4);

  return (
    <section className="mx-auto max-w-[1280px] px-5 py-16 sm:px-8">
      <div className="flex items-end justify-between gap-4">
        <h2 className="text-2xl font-extrabold tracking-[-0.02em] text-ink sm:text-[28px]">
          Ofertas destacadas
        </h2>
        <Link
          href="/ofertas/"
          className="flex shrink-0 items-center gap-1 text-sm font-semibold text-acc-d hover:text-ink"
        >
          Ver todas <ArrowRightIcon className="size-3.5" />
        </Link>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {deals.map((bike) => (
          <BikeDealCard key={bike.id} bike={bike} />
        ))}
      </div>
    </section>
  );
}
