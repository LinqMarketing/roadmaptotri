import { describe, it, expect } from "vitest";
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

describe("auth.updatePhoneNumber with name collection", () => {
  it("should update first name, last name, and phone number", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.auth.updatePhoneNumber({
      firstName: "Pedro",
      lastName: "Irizarry",
      phoneNumber: "5551234567",
    });

    expect(result.success).toBe(true);
    expect(result.firstName).toBe("Pedro");
    expect(result.lastName).toBe("Irizarry");
    expect(result.phoneNumber).toBe("5551234567");
  });

  it("should reject first name that is empty", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    try {
      await caller.auth.updatePhoneNumber({
        firstName: "",
        lastName: "Irizarry",
        phoneNumber: "5551234567",
      });
      expect.fail("Should have thrown an error");
    } catch (err: any) {
      expect(err.message).toContain(">=1 characters");
    }
  });

  it("should reject last name that is empty", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    try {
      await caller.auth.updatePhoneNumber({
        firstName: "Pedro",
        lastName: "",
        phoneNumber: "5551234567",
      });
      expect.fail("Should have thrown an error");
    } catch (err: any) {
      expect(err.message).toContain(">=1 characters");
    }
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
    } catch (err: any) {
      expect(err.message).toContain(">=10 characters");
    }
  });

  it("should reject first name exceeding 100 characters", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    try {
      await caller.auth.updatePhoneNumber({
        firstName: "A".repeat(101),
        lastName: "Irizarry",
        phoneNumber: "5551234567",
      });
      expect.fail("Should have thrown an error");
    } catch (err: any) {
      expect(err.message).toContain("<=100 characters");
    }
  });

  it("should accept valid names with special characters", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.auth.updatePhoneNumber({
      firstName: "José",
      lastName: "O'Brien-Smith",
      phoneNumber: "5559876543",
    });

    expect(result.success).toBe(true);
    expect(result.firstName).toBe("José");
    expect(result.lastName).toBe("O'Brien-Smith");
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
});
