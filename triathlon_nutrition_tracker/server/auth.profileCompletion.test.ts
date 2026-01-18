import { describe, it, expect } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContextWithPhone(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user-123",
    email: "test@example.com",
    name: "Test User",
    firstName: null,
    lastName: null,
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

describe("Profile Completion Prompt - Existing Users", () => {
  it("should update first and last name for existing user with phone number", async () => {
    const ctx = createAuthContextWithPhone();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.auth.updatePhoneNumber({
      firstName: "Pedro",
      lastName: "Irizarry",
      phoneNumber: "5551234567", // Keep existing phone number
    });

    expect(result.success).toBe(true);
    expect(result.firstName).toBe("Pedro");
    expect(result.lastName).toBe("Irizarry");
    expect(result.phoneNumber).toBe("5551234567");
  });

  it("should allow updating name without changing phone number", async () => {
    const ctx = createAuthContextWithPhone();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.auth.updatePhoneNumber({
      firstName: "Jane",
      lastName: "Smith",
      phoneNumber: "5551234567", // Same phone number
    });

    expect(result.success).toBe(true);
    expect(result.firstName).toBe("Jane");
    expect(result.lastName).toBe("Smith");
    expect(result.phoneNumber).toBe("5551234567");
  });

  it("should reject empty first name in profile completion", async () => {
    const ctx = createAuthContextWithPhone();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.auth.updatePhoneNumber({
        firstName: "",
        lastName: "Smith",
        phoneNumber: "5551234567",
      });
      expect.fail("Should have thrown an error");
    } catch (err: any) {
      expect(err.message).toContain(">=1 characters");
    }
  });

  it("should reject empty last name in profile completion", async () => {
    const ctx = createAuthContextWithPhone();
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

  it("should accept international names in profile completion", async () => {
    const ctx = createAuthContextWithPhone();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.auth.updatePhoneNumber({
      firstName: "François",
      lastName: "Müller",
      phoneNumber: "5551234567",
    });

    expect(result.success).toBe(true);
    expect(result.firstName).toBe("François");
    expect(result.lastName).toBe("Müller");
  });

  it("should accept hyphenated names in profile completion", async () => {
    const ctx = createAuthContextWithPhone();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.auth.updatePhoneNumber({
      firstName: "Mary-Jane",
      lastName: "O'Brien-Smith",
      phoneNumber: "5551234567",
    });

    expect(result.success).toBe(true);
    expect(result.firstName).toBe("Mary-Jane");
    expect(result.lastName).toBe("O'Brien-Smith");
  });

  it("should accept names without extra spaces", async () => {
    const ctx = createAuthContextWithPhone();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.auth.updatePhoneNumber({
      firstName: "Pedro",
      lastName: "Irizarry",
      phoneNumber: "5551234567",
    });

    expect(result.success).toBe(true);
    expect(result.firstName).toBe("Pedro");
    expect(result.lastName).toBe("Irizarry");
  });
});

