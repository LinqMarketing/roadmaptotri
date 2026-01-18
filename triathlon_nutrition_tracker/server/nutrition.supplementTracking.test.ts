import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { appRouter } from "./routers";
import { getDb } from "./db";
import { eq } from "drizzle-orm";

describe("Supplement Tracking - Data Persistence", () => {
  let caller: ReturnType<typeof appRouter.createCaller>;
  const testUser = {
    id: 999,
    email: "supplement-test@example.com",
    firstName: "Test",
    lastName: "User",
    phoneNumber: "1234567890",
    role: "user" as const,
  };

  beforeAll(async () => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    // Create test user in database
    const { users } = await import("../drizzle/schema");
    try {
      await db.insert(users).values({
        id: testUser.id,
        openId: "supplement-test-user",
        email: testUser.email,
        name: `${testUser.firstName} ${testUser.lastName}`,
        loginMethod: "manus",
        firstName: testUser.firstName,
        lastName: testUser.lastName,
        phoneNumber: testUser.phoneNumber,
        role: testUser.role,
        createdAt: new Date(),
        updatedAt: new Date(),
        lastSignedIn: new Date(),
      });
    } catch (error: any) {
      // User might already exist, ignore
      if (!error.message?.includes("Duplicate")) {
        throw error;
      }
    }

    // Create caller with test user context
    caller = appRouter.createCaller({ user: testUser });
  });

  afterAll(async () => {
    const db = await getDb();
    if (!db) return;

    // Clean up test data
    const { supplementLogs, users } = await import("../drizzle/schema");
    await db.delete(supplementLogs).where(eq(supplementLogs.userId, testUser.id));
    await db.delete(users).where(eq(users.id, testUser.id));
  });

  it("should log a supplement and retrieve it from database", async () => {
    const today = new Date();

    // Log a supplement
    await caller.nutrition.logSupplement({
      supplementName: "creatine",
      dosage: "5g",
    });

    // Retrieve logs for today
    const logs = await caller.nutrition.getSupplementLogs({ date: today });

    expect(logs).toBeDefined();
    expect(logs.length).toBeGreaterThan(0);
    expect(logs[0].supplementName).toBe("creatine");
    expect(logs[0].dosage).toBe("5g");
    expect(logs[0].userId).toBe(testUser.id);
  });

  it("should retrieve multiple logged supplements for the same day", async () => {
    const today = new Date();

    // Log multiple supplements
    await caller.nutrition.logSupplement({
      supplementName: "electrolytes",
      dosage: "500-750mg sodium",
    });

    await caller.nutrition.logSupplement({
      supplementName: "omega-3",
      dosage: "2-3g",
    });

    // Retrieve all logs for today
    const logs = await caller.nutrition.getSupplementLogs({ date: today });

    const supplementNames = logs.map((log) => log.supplementName);
    expect(supplementNames).toContain("creatine");
    expect(supplementNames).toContain("electrolytes");
    expect(supplementNames).toContain("omega-3");
  });

  it("should only retrieve supplements logged on the specified date", async () => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Retrieve logs for yesterday (should be empty or not contain today's logs)
    const yesterdayLogs = await caller.nutrition.getSupplementLogs({
      date: yesterday,
    });

    const yesterdaySupplements = yesterdayLogs.map((log) => log.supplementName);
    expect(yesterdaySupplements).not.toContain("creatine");
    expect(yesterdaySupplements).not.toContain("electrolytes");
    expect(yesterdaySupplements).not.toContain("omega-3");
  });

  it("should validate supplement name enum", async () => {
    try {
      // @ts-expect-error - testing invalid supplement name
      await caller.nutrition.logSupplement({
        supplementName: "invalid-supplement",
        dosage: "1g",
      });
      expect.fail("Should have thrown validation error");
    } catch (error: any) {
      expect(error.message).toContain("Invalid");
    }
  });

  it("should require dosage string", async () => {
    try {
      // @ts-expect-error - testing missing dosage
      await caller.nutrition.logSupplement({
        supplementName: "creatine",
      });
      expect.fail("Should have thrown validation error");
    } catch (error: any) {
      expect(error.message).toContain("expected string");
    }
  });

  it("should persist data across multiple queries", async () => {
    const today = new Date();

    // Log a supplement
    await caller.nutrition.logSupplement({
      supplementName: "vitamin-d",
      dosage: "2000-4000 IU",
    });

    // Query 1
    const logs1 = await caller.nutrition.getSupplementLogs({ date: today });
    const vitaminDLog1 = logs1.find((log) => log.supplementName === "vitamin-d");
    expect(vitaminDLog1).toBeDefined();

    // Query 2 - should still have the data
    const logs2 = await caller.nutrition.getSupplementLogs({ date: today });
    const vitaminDLog2 = logs2.find((log) => log.supplementName === "vitamin-d");
    expect(vitaminDLog2).toBeDefined();
    expect(vitaminDLog2?.id).toBe(vitaminDLog1?.id);
  });
});
