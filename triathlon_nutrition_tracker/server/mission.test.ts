import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user-mission",
    email: "test@example.com",
    name: "Test Athlete",
    phoneNumber: "5551234567",
    loginMethod: "oauth",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };

  return ctx;
}

describe("mission.getMissionAndGoals", () => {
  it("should retrieve mission and goals for authenticated user", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.mission.getMissionAndGoals();

    expect(result).toHaveProperty("missionStatement");
    expect(result).toHaveProperty("primaryGoal");
    expect(result).toHaveProperty("currentWeight");
    expect(result).toHaveProperty("targetWeight");
    expect(result).toHaveProperty("raceEvent");
    expect(result).toHaveProperty("trainingMotivation");
  });

  it("should require authentication", async () => {
    const ctx: TrpcContext = {
      user: null,
      req: {
        protocol: "https",
        headers: {},
      } as TrpcContext["req"],
      res: {
        clearCookie: () => {},
      } as TrpcContext["res"],
    };
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.mission.getMissionAndGoals();
      expect.fail("Should have thrown an error");
    } catch (error: any) {
      expect(error.code).toBe("UNAUTHORIZED");
    }
  });
});

describe("mission.updateMissionAndGoals", () => {
  it("should update mission statement", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.mission.updateMissionAndGoals({
      missionStatement: "To complete a Half Ironman and inspire others to pursue their fitness goals.",
    });

    expect(result.success).toBe(true);
    expect(result.missionStatement).toBe(
      "To complete a Half Ironman and inspire others to pursue their fitness goals."
    );
  });

  it("should update primary goal", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.mission.updateMissionAndGoals({
      primaryGoal: "Complete Half Ironman in under 6 hours",
    });

    expect(result.success).toBe(true);
    expect(result.primaryGoal).toBe("Complete Half Ironman in under 6 hours");
  });

  it("should update weight goals", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.mission.updateMissionAndGoals({
      currentWeight: "172",
      targetWeight: "165",
    });

    expect(result.success).toBe(true);
    expect(result.currentWeight).toBe("172");
    expect(result.targetWeight).toBe("165");
  });

  it("should update race event", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.mission.updateMissionAndGoals({
      raceEvent: "70.3 Half Ironman - June 2026",
    });

    expect(result.success).toBe(true);
    expect(result.raceEvent).toBe("70.3 Half Ironman - June 2026");
  });

  it("should update training motivation", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const motivation =
      "I want to prove to myself that I can achieve anything I set my mind to. This race is about personal growth and pushing my limits.";
    const result = await caller.mission.updateMissionAndGoals({
      trainingMotivation: motivation,
    });

    expect(result.success).toBe(true);
    expect(result.trainingMotivation).toBe(motivation);
  });

  it("should update all fields at once", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.mission.updateMissionAndGoals({
      missionStatement: "Complete a Half Ironman",
      primaryGoal: "Finish strong with good nutrition",
      currentWeight: "172",
      targetWeight: "165",
      raceEvent: "70.3 Half Ironman - June 2026",
      trainingMotivation: "Personal challenge and growth",
    });

    expect(result.success).toBe(true);
    expect(result.missionStatement).toBe("Complete a Half Ironman");
    expect(result.primaryGoal).toBe("Finish strong with good nutrition");
    expect(result.currentWeight).toBe("172");
    expect(result.targetWeight).toBe("165");
    expect(result.raceEvent).toBe("70.3 Half Ironman - June 2026");
    expect(result.trainingMotivation).toBe("Personal challenge and growth");
  });

  it("should reject mission statement exceeding 1000 characters", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const longStatement = "a".repeat(1001);

    try {
      await caller.mission.updateMissionAndGoals({
        missionStatement: longStatement,
      });
      expect.fail("Should have thrown an error");
    } catch (error: any) {
      expect(error.message).toContain("have <=1000 characters");
    }
  });

  it("should reject training motivation exceeding 2000 characters", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const longMotivation = "a".repeat(2001);

    try {
      await caller.mission.updateMissionAndGoals({
        trainingMotivation: longMotivation,
      });
      expect.fail("Should have thrown an error");
    } catch (error: any) {
      expect(error.message).toContain("have <=2000 characters");
    }
  });

  it("should require authentication", async () => {
    const ctx: TrpcContext = {
      user: null,
      req: {
        protocol: "https",
        headers: {},
      } as TrpcContext["req"],
      res: {
        clearCookie: () => {},
      } as TrpcContext["res"],
    };
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.mission.updateMissionAndGoals({
        missionStatement: "Test",
      });
      expect.fail("Should have thrown an error");
    } catch (error: any) {
      expect(error.code).toBe("UNAUTHORIZED");
    }
  });
});
