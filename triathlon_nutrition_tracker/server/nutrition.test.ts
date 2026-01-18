import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("nutrition router", () => {
  it("returns daily targets correctly", async () => {
    const caller = appRouter.createCaller({} as TrpcContext);
    const targets = await caller.nutrition.getDailyTargets();

    expect(targets).toEqual({
      caloriesTarget: 2500,
      carbsTarget: { min: 344, max: 375 },
      proteinTarget: { min: 125, max: 156 },
      fatsTarget: { min: 42, max: 56 },
      weightGoal: 165,
      currentWeight: 172,
    });
  });

  it("returns fueling recommendations based on duration", async () => {
    const caller = appRouter.createCaller({} as TrpcContext);

    // Short session (30 minutes)
    const shortSession = await caller.nutrition.getFuelingRecommendation({
      durationMinutes: 30,
    });
    expect(shortSession.carbs).toBe("30-60g");
    expect(shortSession.note).toContain("Light fueling");

    // Moderate session (75 minutes)
    const moderateSession = await caller.nutrition.getFuelingRecommendation({
      durationMinutes: 75,
    });
    expect(moderateSession.carbs).toBe("60-90g");
    expect(moderateSession.note).toContain("Standard fueling");

    // Long session (120 minutes)
    const longSession = await caller.nutrition.getFuelingRecommendation({
      durationMinutes: 120,
    });
    expect(longSession.carbs).toBe("90-120g");
    expect(longSession.note).toContain("High fueling");
  });

  it("validates training session input", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    try {
      // This should fail validation due to invalid sessionType
      await caller.nutrition.logTrainingSession({
        sessionType: "invalid" as any,
        durationMinutes: 60,
        intensity: "moderate",
      });
      expect.fail("Should have thrown validation error");
    } catch (error: any) {
      expect(error.message).toContain("Invalid option");
    }
  });

  it("validates supplement input", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    try {
      // This should fail validation due to invalid supplementName
      await caller.nutrition.logSupplement({
        supplementName: "invalid" as any,
        dosage: "5g",
      });
      expect.fail("Should have thrown validation error");
    } catch (error: any) {
      expect(error.message).toContain("Invalid option");
    }
  });

  it("validates progress input", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    try {
      // This should fail validation due to missing required weight
      await caller.nutrition.logProgress({
        weight: undefined as any,
      });
      expect.fail("Should have thrown validation error");
    } catch (error: any) {
      expect(error.message).toContain("invalid_type");
    }
  });
});
