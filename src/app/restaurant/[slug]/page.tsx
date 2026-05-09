import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { RestaurantDetailClient } from "@/components/RestaurantDetailClient";
import { BackHomeLink } from "@/components/BackHomeLink";
import { IconParcel } from "@/components/icons";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function RestaurantPage({ params }: Props) {
  const { slug } = await params;

  const restaurant = await db.restaurant.findUnique({
    where: { slug },
    include: {
      packagingEntries: {
        where: { status: "APPROVED" },
        include: { area: { select: { name: true, slug: true } } },
        orderBy: { submittedAt: "desc" },
      },
    },
  });

  if (!restaurant) notFound();

  const count = restaurant.packagingEntries.length;

  return (
    <div className="max-w-[480px] mx-auto min-h-screen bg-white">
      <Navbar variant="white" />

      {/* Back + Header */}
      <div className="px-5 pt-5 pb-5">
        <BackHomeLink />

        <div className="flex items-end justify-between">
          <h1 className="text-[24px] font-black text-[#222] leading-[1.3]">{restaurant.name}</h1>
          <span className="text-[14px] font-medium text-[#777] leading-[1.1] tracking-[-0.28px] mb-0.5 shrink-0 ml-3">
            {count} {count === 1 ? "parcel" : "parcels"}
          </span>
        </div>
      </div>

      {/* Photo grid */}
      {count > 0 ? (
        <div className="px-5 pb-5">
          <div className="grid grid-cols-2 gap-2">
            {restaurant.packagingEntries.map((entry) => (
              <PhotoCard key={entry.id} entry={JSON.parse(JSON.stringify(entry))} />
            ))}
          </div>
        </div>
      ) : (
        <div className="px-5 py-12 text-center border-t border-[#f1f1f1]">
          <div className="w-16 h-16 rounded-[12px] bg-[#f1f1f1] flex items-center justify-center mx-auto mb-4">
            <IconParcel size={24} className="text-[#999]" />
          </div>
          <p className="text-[20px] font-black text-[#222] leading-[1.3] mb-2">No parcels yet</p>
          <p className="text-base text-[#777] leading-[1.4]">
            No packaging photos yet for this restaurant.
          </p>
        </div>
      )}

      <RestaurantDetailClient restaurantName={restaurant.name} />
      <Footer />
    </div>
  );
}

interface Entry {
  id: string;
  photoUrl: string;
  area: { name: string; slug: string };
}

function PhotoCard({ entry }: { entry: Entry }) {
  return (
    <div className="rounded-[8px] overflow-hidden bg-[#f1f1f1] border border-[rgba(0,0,0,0.1)]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={entry.photoUrl} alt="Packaging" className="w-full object-cover" />
      <div className="px-2.5 py-2">
        <p className="text-[11px] font-medium text-[#777] tracking-[-0.22px]">{entry.area.name}</p>
      </div>
    </div>
  );
}
