import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user-123",
    email: "test@example.com",
    name: "Test User",
    firstName: "Test",
    lastName: "User",
    phoneNumber: null,
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

describe("auth.updatePhoneNumber", () => {
  it("should update first name, last name, and phone number for authenticated user", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.auth.updatePhoneNumber({
      firstName: "Pedro",
      lastName: "Irizarry",
      phoneNumber: "5551234567",
    });

    expect(result).toEqual({
      success: true,
      firstName: "Pedro",
      lastName: "Irizarry",
      phoneNumber: "5551234567",
    });
  });

  it("should reject phone number with less than 10 digits", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.auth.updatePhoneNumber({
        firstName: "Pedro",
        lastName: "Irizarry",
        phoneNumber: "555123",
      });
      expect.fail("Should have thrown an error");
    } catch (error: any) {
      expect(error.message).toContain("have >=10 characters");
    }
  });

  it("should reject phone number with more than 20 characters", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.auth.updatePhoneNumber({
        firstName: "Pedro",
        lastName: "Irizarry",
        phoneNumber: "555123456789012345678901",
      });
      expect.fail("Should have thrown an error");
    } catch (error: any) {
      expect(error.message).toContain("have <=20 characters");
    }
  });

  it("should accept valid phone numbers with formatting", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const validPhones = [
      "5551234567",
      "1-555-123-4567",
      "+1 (555) 123-4567",
      "555.123.4567",
    ];

    for (const phone of validPhones) {
      const result = await caller.auth.updatePhoneNumber({
        firstName: "Test",
        lastName: "User",
        phoneNumber: phone,
      });
      expect(result.success).toBe(true);
    }
  });

  it("should reject empty first name", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.auth.updatePhoneNumber({
        firstName: "",
        lastName: "Irizarry",
        phoneNumber: "5551234567",
      });
      expect.fail("Should have thrown an error");
    } catch (error: any) {
      expect(error.message).toContain(">=1 characters");
    }
  });

  it("should reject empty last name", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.auth.updatePhoneNumber({
        firstName: "Pedro",
        lastName: "",
        phoneNumber: "5551234567",
      });
      expect.fail("Should have thrown an error");
    } catch (error: any) {
      expect(error.message).toContain(">=1 characters");
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
      await caller.auth.updatePhoneNumber({
        firstName: "Pedro",
        lastName: "Irizarry",
        phoneNumber: "5551234567",
      });
      expect.fail("Should have thrown an error");
    } catch (error: any) {
      expect(error.code).toBe("UNAUTHORIZED");
    }
  });
});
