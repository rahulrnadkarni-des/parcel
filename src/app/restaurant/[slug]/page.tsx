import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { RestaurantDetailClient } from "@/components/RestaurantDetailClient";
import { RestaurantPhotoGrid } from "@/components/RestaurantPhotoGrid";
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
    <div id="page-slide-root" className="fixed inset-0 bg-white overflow-y-auto">
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
        <RestaurantPhotoGrid entries={JSON.parse(JSON.stringify(restaurant.packagingEntries))} />
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
    </div>
  );
}
