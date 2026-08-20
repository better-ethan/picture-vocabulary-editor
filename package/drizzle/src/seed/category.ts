import { db, category } from "../../index.js";

export const initCategory = async () => {
  await db
    .insert(category)
    .values([
      { name: "Animals", slug: "animals" },
      { name: "Food & Drinks", slug: "food-drinks" },
      { name: "Body & Health", slug: "body-health" },
      { name: "Clothing", slug: "clothing" },
      { name: "Home", slug: "home" },
      { name: "School", slug: "school" },
      { name: "Work & Jobs", slug: "work-jobs" },
      { name: "Transportation", slug: "transportation" },
      { name: "Nature", slug: "nature" },
      { name: "Weather & Seasons", slug: "weather-seasons" },
      { name: "Places", slug: "places" },
      { name: "Family & People", slug: "family-people" },
      { name: "Sports & Activities", slug: "sports-activities" },
      { name: "Daily Life", slug: "daily-life" },
      { name: "Grammar", slug: "grammar" },
      { name: "Others", slug: "others" },
    ])
    .onConflictDoNothing({ target: category.slug });
};
