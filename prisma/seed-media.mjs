// One-off: seed the Media table with the current partner logos + project photos
// so they're editable in admin. Idempotent — only seeds a category if empty.
//   node --env-file=.env prisma/seed-media.mjs
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const PARTNERS = [
  ["WAAREE", "/brands/waaree.jpg"],
  ["EMMVEE", "/brands/emmvee.jpg"],
  ["Adani Solar", "/brands/adani.jpg"],
];
const PROJECTS = Array.from({ length: 9 }, (_, i) => [`Project ${i + 1}`, `/work/work-${i + 1}.jpg`]);

async function seed(category, rows) {
  const existing = await prisma.media.count({ where: { category } });
  if (existing > 0) {
    console.log(`${category}: ${existing} already present — skipped.`);
    return;
  }
  await prisma.media.createMany({
    data: rows.map(([title, imageUrl], i) => ({ category, title, imageUrl, sort: i, published: true })),
  });
  console.log(`${category}: seeded ${rows.length}.`);
}

async function main() {
  await seed("partner", PARTNERS);
  await seed("project", PROJECTS);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
