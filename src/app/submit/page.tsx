import { db } from "@/lib/db";
import { SubmitClient } from "@/components/SubmitClient";

export default async function SubmitPage() {
  const areas = await db.$queryRaw<{ id: string; name: string; slug: string }[]>`
    SELECT id, name, slug FROM areas ORDER BY display_order ASC, name ASC
  `;
  return <SubmitClient areas={JSON.parse(JSON.stringify(areas))} />;
}
