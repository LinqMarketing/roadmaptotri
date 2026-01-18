import { eq, and, gte, lte, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, mealPrepRecipes, mealLogs, trainingSessions, progressLogs, supplementLogs } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getUserMealLogs(userId: number, date: Date) {
  const db = await getDb();
  if (!db) return [];

  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const result = await db
    .select()
    .from(mealLogs)
    .where(
      and(
        eq(mealLogs.userId, userId),
        gte(mealLogs.loggedDate, startOfDay),
        lte(mealLogs.loggedDate, endOfDay)
      )
    );

  return result;
}

export async function getUserTrainingSessions(userId: number, startDate: Date, endDate: Date) {
  const db = await getDb();
  if (!db) return [];

  const result = await db
    .select()
    .from(trainingSessions)
    .where(
      and(
        eq(trainingSessions.userId, userId),
        gte(trainingSessions.sessionDate, startDate),
        lte(trainingSessions.sessionDate, endDate)
      )
    );

  return result;
}

export async function getUserSupplementLogs(userId: number, date: Date) {
  const db = await getDb();
  if (!db) return [];

  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const result = await db
    .select()
    .from(supplementLogs)
    .where(
      and(
        eq(supplementLogs.userId, userId),
        gte(supplementLogs.loggedDate, startOfDay),
        lte(supplementLogs.loggedDate, endOfDay)
      )
    );

  return result;
}

export async function getUserProgressLogs(userId: number, limit: number = 30) {
  const db = await getDb();
  if (!db) return [];

  const result = await db
    .select()
    .from(progressLogs)
    .where(eq(progressLogs.userId, userId))
    .orderBy(desc(progressLogs.loggedDate))
    .limit(limit);

  return result;
}

export async function getMealPrepRecipes() {
  const db = await getDb();
  if (!db) return [];

  const result = await db.select().from(mealPrepRecipes);
  return result;
}

export async function getUserDailyNutrition(userId: number, date: Date) {
  const db = await getDb();
  if (!db) return { totalCalories: 0, totalCarbs: 0, totalProtein: 0, totalFats: 0, meals: [] };

  const meals = await getUserMealLogs(userId, date);
  
  let totalCalories = 0;
  let totalCarbs = 0;
  let totalProtein = 0;
  let totalFats = 0;

  for (const meal of meals) {
    if (meal.customCalories) totalCalories += meal.customCalories;
    if (meal.customCarbs) totalCarbs += meal.customCarbs;
    if (meal.customProtein) totalProtein += meal.customProtein;
    if (meal.customFats) totalFats += meal.customFats;
  }

  return { totalCalories, totalCarbs, totalProtein, totalFats, meals };
}

// TODO: add feature queries here as your schema grows.
