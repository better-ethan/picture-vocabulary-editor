import { initCategory } from "./category.js";

async function seed() {
  console.log("Seeding database...");
  await initCategory();
  console.log("Database seeded successfully.");
}

await seed();
