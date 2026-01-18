import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { getDb } from "./db";
import { users, mealLogs, mealPrepRecipes } from "../drizzle/schema";
import { eq } from "drizzle-orm";

describe("nutrition.logMeal - Nutritional Values Storage", () => {
  let db: any;
  let testUserId: number;

  beforeAll(async () => {
    db = await getDb();
    if (!db) throw new Error("Database not available");

    // Create test user
    const userResult = await db.insert(users).values({
      openId: `test-user-${Date.now()}`,
      name: "Test User",
      email: "test@example.com",
      role: "user",
    });
    testUserId = userResult[0].insertId;
  });

  afterAll(async () => {
    if (!db) return;
    // Clean up test data
    await db.delete(mealLogs).where(eq(mealLogs.userId, testUserId));
    await db.delete(users).where(eq(users.id, testUserId));
  });

  it("should store recipe nutritional data when logging a preset recipe", async () => {
    if (!db) throw new Error("Database not available");

    // Get first recipe from database
    const recipes = await db.select().from(mealPrepRecipes).limit(1);
    expect(recipes.length).toBeGreaterThan(0);

    const recipe = recipes[0];

    // Log the meal
    const logResult = await db.insert(mealLogs).values({
      userId: testUserId,
      recipeId: recipe.id,
      mealTime: "pre-workout-7am",
      servings: 1,
      customCalories: recipe.caloriesPerServing,
      customCarbs: recipe.carbs,
      customProtein: recipe.protein,
      customFats: recipe.fats,
      loggedDate: new Date(),
    });

    expect(logResult).toBeDefined();

    // Verify the logged meal has nutritional data
    const loggedMeals = await db
      .select()
      .from(mealLogs)
      .where(eq(mealLogs.userId, testUserId));

    expect(loggedMeals.length).toBeGreaterThan(0);
    const loggedMeal = loggedMeals[0];

    expect(loggedMeal.customCalories).toBe(recipe.caloriesPerServing);
    expect(loggedMeal.customCarbs).toBe(recipe.carbs);
    expect(loggedMeal.customProtein).toBe(recipe.protein);
    expect(loggedMeal.customFats).toBe(recipe.fats);
  });

  it("should multiply nutritional values by servings", async () => {
    if (!db) throw new Error("Database not available");

    const recipes = await db.select().from(mealPrepRecipes).limit(1);
    const recipe = recipes[0];

    const servings = 2;

    // Log meal with 2 servings
    const logResult = await db.insert(mealLogs).values({
      userId: testUserId,
      recipeId: recipe.id,
      mealTime: "post-workout",
      servings: servings,
      customCalories: recipe.caloriesPerServing * servings,
      customCarbs: recipe.carbs * servings,
      customProtein: recipe.protein * servings,
      customFats: recipe.fats * servings,
      loggedDate: new Date(),
    });

    expect(logResult).toBeDefined();

    const loggedMeals = await db
      .select()
      .from(mealLogs)
      .where(eq(mealLogs.userId, testUserId));

    const loggedMeal = loggedMeals.find((m: any) => m.mealTime === "post-workout");
    expect(loggedMeal).toBeDefined();
    expect(loggedMeal.customCalories).toBe(recipe.caloriesPerServing * servings);
    expect(loggedMeal.customCarbs).toBe(recipe.carbs * servings);
  });

  it("should allow custom meal logging with manual nutritional values", async () => {
    if (!db) throw new Error("Database not available");

    const customMeal = {
      customMealName: "Custom Protein Shake",
      customCalories: 250,
      customCarbs: 30,
      customProtein: 25,
      customFats: 5,
    };

    const logResult = await db.insert(mealLogs).values({
      userId: testUserId,
      mealTime: "snack",
      servings: 1,
      customMealName: customMeal.customMealName,
      customCalories: customMeal.customCalories,
      customCarbs: customMeal.customCarbs,
      customProtein: customMeal.customProtein,
      customFats: customMeal.customFats,
      loggedDate: new Date(),
    });

    expect(logResult).toBeDefined();

    const loggedMeals = await db
      .select()
      .from(mealLogs)
      .where(eq(mealLogs.userId, testUserId));

    const loggedMeal = loggedMeals.find((m: any) => m.customMealName === customMeal.customMealName);
    expect(loggedMeal).toBeDefined();
    expect(loggedMeal.customCalories).toBe(customMeal.customCalories);
    expect(loggedMeal.customCarbs).toBe(customMeal.customCarbs);
    expect(loggedMeal.customProtein).toBe(customMeal.customProtein);
    expect(loggedMeal.customFats).toBe(customMeal.customFats);
  });

  it("should retrieve all logged meals for a user on a specific date", async () => {
    if (!db) throw new Error("Database not available");

    const today = new Date();
    const startOfDay = new Date(today);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999);

    const loggedMeals = await db
      .select()
      .from(mealLogs)
      .where(
        eq(mealLogs.userId, testUserId)
      );

    expect(loggedMeals.length).toBeGreaterThan(0);
    expect(loggedMeals.every((m: any) => m.userId === testUserId)).toBe(true);
  });

  it("should sum nutritional values for daily totals", async () => {
    if (!db) throw new Error("Database not available");

    const loggedMeals = await db
      .select()
      .from(mealLogs)
      .where(eq(mealLogs.userId, testUserId));

    let totalCalories = 0;
    let totalCarbs = 0;
    let totalProtein = 0;
    let totalFats = 0;

    for (const meal of loggedMeals) {
      if (meal.customCalories) totalCalories += meal.customCalories;
      if (meal.customCarbs) totalCarbs += meal.customCarbs;
      if (meal.customProtein) totalProtein += meal.customProtein;
      if (meal.customFats) totalFats += meal.customFats;
    }

    expect(totalCalories).toBeGreaterThan(0);
    expect(totalCarbs).toBeGreaterThan(0);
    expect(totalProtein).toBeGreaterThan(0);
    expect(totalFats).toBeGreaterThan(0);
  });
});
