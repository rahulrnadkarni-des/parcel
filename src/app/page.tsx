export const dynamic = "force-dynamic";

import { db } from "@/lib/db";
import { HomeClient } from "@/components/HomeClient";

export default async function HomePage() {
  const [restaurants, areas, totalPackages] = await Promise.all([
    db.restaurant.findMany({
      where: { packagingEntries: { some: { status: "APPROVED" } } },
      include: {
        packagingEntries: {
          where: { status: "APPROVED" },
          select: { photoUrl: true },
          take: 1,
          orderBy: { submittedAt: "desc" },
        },
        _count: {
          select: { packagingEntries: { where: { status: "APPROVED" } } },
        },
      },
      orderBy: { name: "asc" },
    }),
    db.$queryRaw<{ id: string; name: string; slug: string }[]>`SELECT id, name, slug FROM areas ORDER BY display_order ASC, name ASC`,
    db.packagingEntry.count({ where: { status: "APPROVED" } }),
  ]);

  return (
    <HomeClient
      initialRestaurants={JSON.parse(JSON.stringify(restaurants))}
      areas={areas}
      initialTotalPackages={totalPackages}
    />
  );
}
