import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const areas = [
  { name: "Koramangala", slug: "koramangala" },
  { name: "HSR Layout", slug: "hsr-layout" },
  { name: "Indiranagar", slug: "indiranagar" },
  { name: "Whitefield", slug: "whitefield" },
  { name: "Electronic City", slug: "electronic-city" },
  { name: "MG Road", slug: "mg-road" },
  { name: "Marathahalli", slug: "marathahalli" },
  { name: "Bellandur", slug: "bellandur" },
  { name: "Sarjapur Road", slug: "sarjapur-road" },
  { name: "Hebbal", slug: "hebbal" },
];

const restaurants = [
  { name: "Social", slug: "social" },
  { name: "Truffles", slug: "truffles" },
  { name: "Byg Brewski", slug: "byg-brewski" },
  { name: "Meghana Foods", slug: "meghana-foods" },
  { name: "Empire Restaurant", slug: "empire-restaurant" },
  { name: "Fanoos", slug: "fanoos" },
  { name: "Farzi Cafe", slug: "farzi-cafe" },
  { name: "Smoke House Deli", slug: "smoke-house-deli" },
  { name: "Toit Brewpub", slug: "toit-brewpub" },
  { name: "Chinita", slug: "chinita" },
  { name: "The Fatty Bao", slug: "the-fatty-bao" },
  { name: "Onesta", slug: "onesta" },
  { name: "Flechazo", slug: "flechazo" },
  { name: "Biryani Blues", slug: "biryani-blues" },
  { name: "Absolute Barbecues", slug: "absolute-barbecues" },
  { name: "Glen's Bakehouse", slug: "glens-bakehouse" },
];

async function main() {
  console.log("Seeding areas...");
  for (const area of areas) {
    await prisma.area.upsert({
      where: { slug: area.slug },
      update: {},
      create: area,
    });
  }

  console.log("Seeding restaurants...");
  for (const restaurant of restaurants) {
    await prisma.restaurant.upsert({
      where: { slug: restaurant.slug },
      update: {},
      create: restaurant,
    });
  }

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
