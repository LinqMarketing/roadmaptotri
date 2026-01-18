import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  firstName: varchar("first_name", { length: 100 }),
  lastName: varchar("last_name", { length: 100 }),
  email: varchar("email", { length: 320 }),
  phoneNumber: varchar("phone_number", { length: 20 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  // Athlete mission and goals
  missionStatement: text("mission_statement"),
  primaryGoal: varchar("primary_goal", { length: 255 }),
  currentWeight: varchar("current_weight", { length: 10 }),
  targetWeight: varchar("target_weight", { length: 10 }),
  raceEvent: varchar("race_event", { length: 255 }),
  trainingMotivation: text("training_motivation"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Note: phoneNumber is captured during profile completion for SMS notifications, community outreach, feedback, and EFT payments
 * firstName and lastName are captured during onboarding for personalized greetings and athlete identification
 * Mission and goals fields allow athletes to customize their personal mission statement, goals, and training purpose
 */

/**
 * Meal prep recipes database
 */
export const mealPrepRecipes = mysqlTable("meal_prep_recipes", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  category: mysqlEnum("category", ["pre-workout", "post-workout", "lunch", "dinner", "snack"]).notNull(),
  description: text("description"),
  ingredients: text("ingredients").notNull(), // JSON array
  instructions: text("instructions").notNull(),
  caloriesPerServing: int("calories_per_serving").notNull(),
  carbs: int("carbs").notNull(), // grams
  protein: int("protein").notNull(), // grams
  fats: int("fats").notNull(), // grams
  servingSize: varchar("serving_size", { length: 100 }).notNull(),
  prepTime: int("prep_time").notNull(), // minutes
  cookTime: int("cook_time").notNull(), // minutes
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type MealPrepRecipe = typeof mealPrepRecipes.$inferSelect;
export type InsertMealPrepRecipe = typeof mealPrepRecipes.$inferInsert;

/**
 * Daily meal logs
 */
export const mealLogs = mysqlTable("meal_logs", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull().references(() => users.id),
  mealTime: mysqlEnum("meal_time", ["pre-workout-7am", "post-workout", "lunch-3pm", "dinner-6pm", "snack"]).notNull(),
  recipeId: int("recipe_id").references(() => mealPrepRecipes.id),
  customMealName: varchar("custom_meal_name", { length: 255 }),
  customCalories: int("custom_calories"),
  customCarbs: int("custom_carbs"),
  customProtein: int("custom_protein"),
  customFats: int("custom_fats"),
  servings: int("servings").default(1).notNull(),
  loggedDate: timestamp("logged_date").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type MealLog = typeof mealLogs.$inferSelect;
export type InsertMealLog = typeof mealLogs.$inferInsert;

/**
 * Training sessions
 */
export const trainingSessions = mysqlTable("training_sessions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull().references(() => users.id),
  sessionDate: timestamp("session_date").notNull(),
  sessionType: mysqlEnum("session_type", ["swim", "bike", "run", "brick"]).notNull(),
  durationMinutes: int("duration_minutes").notNull(),
  distanceKm: int("distance_km"),
  intensity: mysqlEnum("intensity", ["easy", "moderate", "hard", "race-pace"]).notNull(),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type TrainingSession = typeof trainingSessions.$inferSelect;
export type InsertTrainingSession = typeof trainingSessions.$inferInsert;

/**
 * Supplement tracking
 */
export const supplementLogs = mysqlTable("supplement_logs", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull().references(() => users.id),
  supplementName: mysqlEnum("supplement_name", ["creatine", "electrolytes", "omega-3", "vitamin-d", "beta-alanine", "caffeine"]).notNull(),
  dosage: varchar("dosage", { length: 100 }).notNull(),
  loggedDate: timestamp("logged_date").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type SupplementLog = typeof supplementLogs.$inferSelect;
export type InsertSupplementLog = typeof supplementLogs.$inferInsert;

/**
 * Weight and progress tracking
 */
export const progressLogs = mysqlTable("progress_logs", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull().references(() => users.id),
  weight: int("weight").notNull(), // in pounds
  bodyFatPercentage: int("body_fat_percentage"),
  notes: text("notes"),
  loggedDate: timestamp("logged_date").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ProgressLog = typeof progressLogs.$inferSelect;
export type InsertProgressLog = typeof progressLogs.$inferInsert;

/**
 * Hydration tracking
 */
export const hydrationLogs = mysqlTable("hydration_logs", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull().references(() => users.id),
  waterIntakeMl: int("water_intake_ml").notNull(),
  loggedDate: timestamp("logged_date").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type HydrationLog = typeof hydrationLogs.$inferSelect;
export type InsertHydrationLog = typeof hydrationLogs.$inferInsert;

/**
 * Race event tracking
 */
export const raceEvents = mysqlTable("race_events", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull().references(() => users.id),
  raceName: varchar("race_name", { length: 255 }).notNull(),
  raceDate: timestamp("race_date").notNull(),
  carbLoadingStartDate: timestamp("carb_loading_start_date"),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type RaceEvent = typeof raceEvents.$inferSelect;
export type InsertRaceEvent = typeof raceEvents.$inferInsert;

/**
 * Daily motivation quotes
 * Stores generated personalized quotes for each athlete
 * One quote per day per athlete, rotates through 5 categories
 */
export const dailyQuotes = mysqlTable("daily_quotes", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull().references(() => users.id),
  quoteText: text("quote_text").notNull(),
  category: mysqlEnum("category", ["training_mindset", "nutrition_discipline", "race_day_focus", "recovery", "mental_strength"]).notNull(),
  quoteDate: timestamp("quote_date").notNull(), // Date this quote was generated/assigned
  sent: int("sent").default(0).notNull(), // Whether morning notification was sent (0 = false, 1 = true)
  sentAt: timestamp("sent_at"), // When the notification was sent
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type DailyQuote = typeof dailyQuotes.$inferSelect;
export type InsertDailyQuote = typeof dailyQuotes.$inferInsert;
