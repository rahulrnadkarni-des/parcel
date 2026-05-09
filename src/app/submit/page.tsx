import { db } from "@/lib/db";
import { SubmitClient } from "@/components/SubmitClient";

export default async function SubmitPage() {
  const areas = await db.area.findMany({ orderBy: { name: "asc" } });
  return <SubmitClient areas={JSON.parse(JSON.stringify(areas))} />;
}
