import { z } from "zod";
import { eq, gte, lt } from "drizzle-orm";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
    updatePhoneNumber: protectedProcedure
      .input(z.object({ 
        firstName: z.string().min(1).max(100),
        lastName: z.string().min(1).max(100),
        phoneNumber: z.string().min(10).max(20).optional().or(z.literal("")) 
      }))
      .mutation(async ({ ctx, input }) => {
        const { users } = await import("../drizzle/schema");
        const db = await (await import("./db")).getDb();
        if (!db) throw new Error("Database not available");
        
        const updateData: any = { 
          firstName: input.firstName,
          lastName: input.lastName
        };
        
        if (input.phoneNumber && input.phoneNumber.length >= 10) {
          updateData.phoneNumber = input.phoneNumber;
        }
        
        await db.update(users)
          .set(updateData)
          .where(eq(users.id, ctx.user.id));
        
        return { success: true, firstName: input.firstName, lastName: input.lastName, phoneNumber: input.phoneNumber || "" };
      }),
  }),

  mission: router({
    getMissionAndGoals: protectedProcedure
      .query(async ({ ctx }) => {
        const { users } = await import("../drizzle/schema");
        const db = await (await import("./db")).getDb();
        if (!db) throw new Error("Database not available");
        
        const user = await db.select().from(users).where(eq(users.id, ctx.user.id)).limit(1);
        if (!user[0]) throw new Error("User not found");
        
        return {
          missionStatement: user[0].missionStatement,
          primaryGoal: user[0].primaryGoal,
          currentWeight: user[0].currentWeight,
          targetWeight: user[0].targetWeight,
          raceEvent: user[0].raceEvent,
          trainingMotivation: user[0].trainingMotivation,
        };
      }),
    updateMissionAndGoals: protectedProcedure
      .input(z.object({
        missionStatement: z.string().max(1000).optional(),
        primaryGoal: z.string().max(255).optional(),
        currentWeight: z.string().max(10).optional(),
        targetWeight: z.string().max(10).optional(),
        raceEvent: z.string().max(255).optional(),
        trainingMotivation: z.string().max(2000).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { users } = await import("../drizzle/schema");
        const db = await (await import("./db")).getDb();
        if (!db) throw new Error("Database not available");
        
        const updateData: Record<string, unknown> = {};
        if (input.missionStatement !== undefined) updateData.missionStatement = input.missionStatement || null;
        if (input.primaryGoal !== undefined) updateData.primaryGoal = input.primaryGoal || null;
        if (input.currentWeight !== undefined) updateData.currentWeight = input.currentWeight || null;
        if (input.targetWeight !== undefined) updateData.targetWeight = input.targetWeight || null;
        if (input.raceEvent !== undefined) updateData.raceEvent = input.raceEvent || null;
        if (input.trainingMotivation !== undefined) updateData.trainingMotivation = input.trainingMotivation || null;
        
        await db.update(users)
          .set(updateData)
          .where(eq(users.id, ctx.user.id));
        
        return { success: true, ...input };
      }),
  }),

  nutrition: router({
    getDailyTargets: publicProcedure.query(() => ({
      caloriesTarget: 2500,
      carbsTarget: { min: 344, max: 375 },
      proteinTarget: { min: 125, max: 156 },
      fatsTarget: { min: 42, max: 56 },
      weightGoal: 165,
      currentWeight: 172,
    })),
    logMeal: protectedProcedure
      .input(z.object({
        recipeId: z.number().optional(),
        mealTime: z.enum(["pre-workout-7am", "post-workout", "lunch-3pm", "dinner-6pm", "snack"]),
        servings: z.number().default(1),
        customMealName: z.string().optional(),
        customCalories: z.number().optional(),
        customCarbs: z.number().optional(),
        customProtein: z.number().optional(),
        customFats: z.number().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { mealLogs, mealPrepRecipes } = await import("../drizzle/schema");
        const db = await (await import("./db")).getDb();
        if (!db) throw new Error("Database not available");
        
        // If logging a preset recipe, fetch its nutritional data
        let logData: any = {
          userId: ctx.user.id,
          recipeId: input.recipeId,
          mealTime: input.mealTime,
          servings: input.servings,
          customMealName: input.customMealName,
          loggedDate: new Date(),
        };
        
        if (input.recipeId) {
          // Fetch recipe to get nutritional data
          const recipe = await db.select().from(mealPrepRecipes).where(eq(mealPrepRecipes.id, input.recipeId)).limit(1);
          if (recipe[0]) {
            // Store recipe nutritional data multiplied by servings
            logData.customCalories = recipe[0].caloriesPerServing * input.servings;
            logData.customCarbs = recipe[0].carbs * input.servings;
            logData.customProtein = recipe[0].protein * input.servings;
            logData.customFats = recipe[0].fats * input.servings;
          }
        } else {
          // Custom meal - use provided values
          logData.customCalories = input.customCalories;
          logData.customCarbs = input.customCarbs;
          logData.customProtein = input.customProtein;
          logData.customFats = input.customFats;
        }
        
        const result = await db.insert(mealLogs).values(logData);
        return result;
      }),
    logTrainingSession: protectedProcedure
      .input(z.object({
        sessionType: z.enum(["swim", "bike", "run", "brick"]),
        durationMinutes: z.number(),
        distanceKm: z.number().optional(),
        intensity: z.enum(["easy", "moderate", "hard", "race-pace"]),
        notes: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { trainingSessions } = await import("../drizzle/schema");
        const db = await (await import("./db")).getDb();
        if (!db) throw new Error("Database not available");
        
        const result = await db.insert(trainingSessions).values({
          userId: ctx.user.id,
          sessionType: input.sessionType,
          durationMinutes: input.durationMinutes,
          distanceKm: input.distanceKm,
          intensity: input.intensity,
          notes: input.notes,
          sessionDate: new Date(),
        });
        return result;
      }),
    logSupplement: protectedProcedure
      .input(z.object({
        supplementName: z.enum(["creatine", "electrolytes", "omega-3", "vitamin-d", "beta-alanine", "caffeine"]),
        dosage: z.string(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { supplementLogs } = await import("../drizzle/schema");
        const db = await (await import("./db")).getDb();
        if (!db) throw new Error("Database not available");
        
        const result = await db.insert(supplementLogs).values({
          userId: ctx.user.id,
          supplementName: input.supplementName,
          dosage: input.dosage,
          loggedDate: new Date(),
        });
        return result;
      }),
    logProgress: protectedProcedure
      .input(z.object({
        weight: z.number(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { progressLogs } = await import("../drizzle/schema");
        const db = await (await import("./db")).getDb();
        if (!db) throw new Error("Database not available");
        
        const result = await db.insert(progressLogs).values({
          userId: ctx.user.id,
          weight: input.weight,
          notes: input.notes,
          loggedDate: new Date(),
        });
        return result;
      }),
    getDailyNutrition: protectedProcedure
      .input(z.object({ date: z.date() }))
      .query(async ({ ctx, input }) => {
        const { getUserDailyNutrition } = await import("./db");
        return await getUserDailyNutrition(ctx.user.id, input.date);
      }),
    getMealLogs: protectedProcedure
      .input(z.object({ date: z.date() }))
      .query(async ({ ctx, input }) => {
        const { getUserMealLogs } = await import("./db");
        return await getUserMealLogs(ctx.user.id, input.date);
      }),
    getSupplementLogs: protectedProcedure
      .input(z.object({ date: z.date() }))
      .query(async ({ ctx, input }) => {
        const { getUserSupplementLogs } = await import("./db");
        return await getUserSupplementLogs(ctx.user.id, input.date);
      }),
    getProgressLogs: protectedProcedure
      .input(z.object({ limit: z.number().default(30) }))
      .query(async ({ ctx, input }) => {
        const { getUserProgressLogs } = await import("./db");
        return await getUserProgressLogs(ctx.user.id, input.limit);
      }),
    getMealRecipes: publicProcedure
      .query(async () => {
        const { getMealPrepRecipes } = await import("./db");
        return await getMealPrepRecipes();
      }),

    getTrainingSessions: protectedProcedure
      .input(z.object({ startDate: z.date(), endDate: z.date() }))
      .query(async ({ ctx, input }) => {
        const { getUserTrainingSessions } = await import("./db");
        return await getUserTrainingSessions(ctx.user.id, input.startDate, input.endDate);
      }),
    getFuelingRecommendation: publicProcedure
      .input(z.object({ durationMinutes: z.number() }))
      .query(({ input }) => {
        if (input.durationMinutes <= 60) {
          return { carbs: "30-60g", protein: "10-15g", fluids: "500-750ml", note: "Light fueling for short sessions" };
        } else if (input.durationMinutes <= 90) {
          return { carbs: "60-90g", protein: "15-20g", fluids: "750ml-1L", note: "Standard fueling for moderate sessions" };
        } else {
          return { carbs: "90-120g", protein: "20-30g", fluids: "1-1.5L", note: "High fueling for long sessions" };
        }
       }),
  }),

  quotes: router({
    getTodayQuote: protectedProcedure
      .query(async ({ ctx }) => {
        const { dailyQuotes, users } = await import("../drizzle/schema");
        const db = await (await import("./db")).getDb();
        if (!db) throw new Error("Database not available");
        
        // Use UTC date to avoid timezone issues
        const now = new Date();
        const utcYear = now.getUTCFullYear();
        const utcMonth = now.getUTCMonth();
        const utcDate = now.getUTCDate();
        
        // Create today's date at midnight UTC
        const today = new Date(Date.UTC(utcYear, utcMonth, utcDate, 0, 0, 0, 0));
        const tomorrow = new Date(Date.UTC(utcYear, utcMonth, utcDate + 1, 0, 0, 0, 0));
        
        // Check if quote already exists for today
        let quote = await db.select().from(dailyQuotes)
          .where(
            eq(dailyQuotes.userId, ctx.user.id) &&
            gte(dailyQuotes.quoteDate, today) &&
            lt(dailyQuotes.quoteDate, tomorrow)
          )
          .limit(1);
        
        // If no quote for today, generate one
        if (!quote || quote.length === 0) {
          const user = await db.select().from(users).where(eq(users.id, ctx.user.id)).limit(1);
          if (!user[0]) throw new Error("User not found");
          
          // Determine category based on day of week (rotate through 5 categories)
          const categories = ["training_mindset", "nutrition_discipline", "race_day_focus", "recovery", "mental_strength"];
          const dayOfWeek = today.getDay();
          const category = categories[dayOfWeek % 5];
          
          // Generate quote using LLM
          const { invokeLLM } = await import("./_core/llm");
          const response = await invokeLLM({
            messages: [
              {
                role: "system",
                content: `You are an inspiring triathlon coach creating personalized daily motivation quotes. Generate a single, powerful motivational quote (1-2 sentences max) for a triathlon athlete. The quote should be specific to the category and personalized to their mission and goals. Return ONLY the quote text, nothing else.`,
              },
              {
                role: "user",
                content: `Generate a ${category.replace(/_/g, " ")} motivational quote for an athlete with these goals:\n\nMission: ${user[0].missionStatement || "Complete a triathlon"}\nGoal: ${user[0].primaryGoal || "Achieve personal best"}\nRace: ${user[0].raceEvent || "Upcoming triathlon"}\nMotivation: ${user[0].trainingMotivation || "Personal growth through sport"}`,
              },
            ],
          });
          
          const quoteText = response.choices[0]?.message.content || "Every step forward is progress. Keep pushing!";
          
          // Save quote to database
          await db.insert(dailyQuotes).values({
            userId: ctx.user.id,
            quoteText: typeof quoteText === "string" ? quoteText : "Every step forward is progress. Keep pushing!",
            category: category as any,
            quoteDate: today, // Store as Date object
            sent: 0,
          });
          
          quote = await db.select().from(dailyQuotes)
            .where(
              eq(dailyQuotes.userId, ctx.user.id) &&
              gte(dailyQuotes.quoteDate, today) &&
              lt(dailyQuotes.quoteDate, tomorrow)
            )
            .limit(1);
        }
        
        return quote[0] || null;
      }),
  }),
});
export type AppRouter = typeof appRouter;
