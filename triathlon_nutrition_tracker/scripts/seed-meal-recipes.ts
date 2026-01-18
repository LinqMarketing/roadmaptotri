import { drizzle } from "drizzle-orm/mysql2";
import { mealPrepRecipes } from "../drizzle/schema";
import dotenv from "dotenv";

dotenv.config();

const db = drizzle(process.env.DATABASE_URL!);

const mealRecipes = [
  // Pre-Workout Meals
  {
    name: "Quick Oats with Honey",
    category: "pre-workout" as const,
    description: "Light, easily digestible pre-workout fuel",
    ingredients: JSON.stringify(["0.5 cup oatmeal", "1 tbsp honey", "water"]),
    instructions: "Cook oatmeal in microwave for 90 seconds. Add honey and stir.",
    caloriesPerServing: 150,
    carbs: 30,
    protein: 5,
    fats: 2,
    servingSize: "1 bowl",
    prepTime: 2,
    cookTime: 1,
  },
  {
    name: "Energy Toast",
    category: "pre-workout" as const,
    description: "Simple white bread with jam for quick carbs",
    ingredients: JSON.stringify(["1 slice white bread", "1 tbsp jam"]),
    instructions: "Toast bread and spread jam. Serve immediately.",
    caloriesPerServing: 140,
    carbs: 28,
    protein: 2,
    fats: 1,
    servingSize: "1 slice",
    prepTime: 1,
    cookTime: 2,
  },

  // Post-Workout Meals
  {
    name: "Recovery Smoothie",
    category: "post-workout" as const,
    description: "Fast-digesting recovery shake with protein and carbs",
    ingredients: JSON.stringify(["1 scoop whey protein", "1 cup frozen mango", "1 cup spinach", "1 tbsp chia seeds", "1 cup almond milk"]),
    instructions: "Blend all ingredients until smooth. Serve immediately.",
    caloriesPerServing: 280,
    carbs: 35,
    protein: 25,
    fats: 5,
    servingSize: "1 smoothie",
    prepTime: 2,
    cookTime: 0,
  },
  {
    name: "Avocado Toast with Eggs",
    category: "post-workout" as const,
    description: "Your preferred post-workout breakfast with added carbs",
    ingredients: JSON.stringify(["2 boiled eggs", "0.25 avocado", "2 slices whole-grain toast", "1 cup berries"]),
    instructions: "Toast bread, spread avocado, top with eggs. Serve with berries.",
    caloriesPerServing: 550,
    carbs: 70,
    protein: 30,
    fats: 20,
    servingSize: "1 plate",
    prepTime: 5,
    cookTime: 10,
  },
  {
    name: "Sweet Potato Hash",
    category: "post-workout" as const,
    description: "Excellent 3:1 carb-to-protein ratio for recovery",
    ingredients: JSON.stringify(["4 oz pre-cooked turkey", "1 cup air-fried sweet potato", "1 fried egg", "salt and pepper"]),
    instructions: "Warm turkey and sweet potato. Fry egg. Combine and season.",
    caloriesPerServing: 450,
    carbs: 50,
    protein: 40,
    fats: 12,
    servingSize: "1 plate",
    prepTime: 3,
    cookTime: 8,
  },

  // Lunch Meals
  {
    name: "Slow Cooker Chicken & Quinoa Bowl",
    category: "lunch" as const,
    description: "High-protein complete meal with complex carbs",
    ingredients: JSON.stringify(["4 oz slow-cooker shredded chicken", "1.5 cups cooked quinoa", "1 cup roasted vegetables", "olive oil", "seasonings"]),
    instructions: "Combine slow-cooker chicken with quinoa and roasted vegetables. Drizzle with olive oil.",
    caloriesPerServing: 650,
    carbs: 75,
    protein: 50,
    fats: 15,
    servingSize: "1 bowl",
    prepTime: 5,
    cookTime: 0,
  },
  {
    name: "Turkey & Brown Rice",
    category: "lunch" as const,
    description: "High protein, high fiber sustained energy meal",
    ingredients: JSON.stringify(["4 oz ground turkey", "1.5 cups brown rice", "0.5 cup black beans", "vegetables"]),
    instructions: "Cook turkey, combine with rice and beans. Add vegetables.",
    caloriesPerServing: 680,
    carbs: 80,
    protein: 55,
    fats: 12,
    servingSize: "1 bowl",
    prepTime: 5,
    cookTime: 15,
  },
  {
    name: "Air Fryer Potatoes with Chicken",
    category: "lunch" as const,
    description: "Crispy potatoes with lean protein",
    ingredients: JSON.stringify(["4 oz chicken breast", "1 cup air-fried potatoes", "1 cup steamed broccoli", "olive oil spray"]),
    instructions: "Air fry potatoes and chicken. Steam broccoli. Combine on plate.",
    caloriesPerServing: 520,
    carbs: 65,
    protein: 48,
    fats: 8,
    servingSize: "1 plate",
    prepTime: 3,
    cookTime: 20,
  },

  // Dinner Meals
  {
    name: "Baked Chicken & Potato",
    category: "dinner" as const,
    description: "Classic high-protein, high-carb dinner for recovery",
    ingredients: JSON.stringify(["5 oz baked chicken breast", "1.5 cups baked regular potato", "1 cup steamed broccoli", "salt and pepper"]),
    instructions: "Bake chicken and potato. Steam broccoli. Season and serve.",
    caloriesPerServing: 800,
    carbs: 80,
    protein: 60,
    fats: 15,
    servingSize: "1 plate",
    prepTime: 5,
    cookTime: 35,
  },
  {
    name: "Lean Steak & Vegetables",
    category: "dinner" as const,
    description: "Iron-rich dinner for endurance athletes",
    ingredients: JSON.stringify(["5 oz lean sirloin steak", "1 cup roasted root vegetables", "olive oil", "seasonings"]),
    instructions: "Grill steak. Roast vegetables with olive oil. Serve together.",
    caloriesPerServing: 750,
    carbs: 60,
    protein: 65,
    fats: 25,
    servingSize: "1 plate",
    prepTime: 5,
    cookTime: 25,
  },
  {
    name: "Turkey Chili",
    category: "dinner" as const,
    description: "Slow-cooker meal prep friendly high-protein dinner",
    ingredients: JSON.stringify(["1 lb ground turkey", "2 cans kidney beans", "1 can diced tomatoes", "onion", "spices"]),
    instructions: "Brown turkey. Add beans and tomatoes. Simmer 30 minutes.",
    caloriesPerServing: 620,
    carbs: 55,
    protein: 70,
    fats: 12,
    servingSize: "1.5 cups",
    prepTime: 10,
    cookTime: 40,
  },

  // Snacks
  {
    name: "Greek Yogurt",
    category: "snack" as const,
    description: "High-protein evening snack for muscle recovery",
    ingredients: JSON.stringify(["1 cup 0% Greek yogurt", "optional: berries"]),
    instructions: "Serve yogurt in bowl. Add berries if desired.",
    caloriesPerServing: 250,
    carbs: 15,
    protein: 25,
    fats: 0,
    servingSize: "1 cup",
    prepTime: 1,
    cookTime: 0,
  },
];

async function seed() {
  try {
    console.log("🌱 Seeding meal prep recipes...");
    
    for (const recipe of mealRecipes) {
      await db.insert(mealPrepRecipes).values(recipe);
      console.log(`✓ Added: ${recipe.name}`);
    }
    
    console.log("✅ Seeding complete!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
}

seed();
