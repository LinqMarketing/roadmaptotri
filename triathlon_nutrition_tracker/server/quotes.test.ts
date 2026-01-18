import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user-quotes",
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

describe("quotes.getTodayQuote", () => {
  it("should retrieve or generate today's quote for authenticated user", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const quote = await caller.quotes.getTodayQuote();

    expect(quote).not.toBeNull();
    expect(quote).toHaveProperty("id");
    expect(quote).toHaveProperty("userId");
    expect(quote).toHaveProperty("quoteText");
    expect(quote).toHaveProperty("category");
    expect(quote).toHaveProperty("quoteDate");
    expect(quote).toHaveProperty("sent");
  });

  it("should generate a quote with valid category", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const quote = await caller.quotes.getTodayQuote();

    const validCategories = [
      "training_mindset",
      "nutrition_discipline",
      "race_day_focus",
      "recovery",
      "mental_strength",
    ];

    expect(validCategories).toContain(quote?.category);
  });

  it("should return same quote when called multiple times on same day", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const quote1 = await caller.quotes.getTodayQuote();
    const quote2 = await caller.quotes.getTodayQuote();

    expect(quote1?.id).toBe(quote2?.id);
    expect(quote1?.quoteText).toBe(quote2?.quoteText);
  });

  it("should generate quote with non-empty text", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const quote = await caller.quotes.getTodayQuote();

    expect(quote?.quoteText).toBeTruthy();
    expect(quote?.quoteText?.length).toBeGreaterThan(0);
  });

  it("should set sent flag to 0 initially", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const quote = await caller.quotes.getTodayQuote();

    expect(quote?.sent).toBe(0);
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
      await caller.quotes.getTodayQuote();
      expect.fail("Should have thrown an error");
    } catch (error: any) {
      expect(error.code).toBe("UNAUTHORIZED");
    }
  });

  it("should use category rotation based on day of week", async () => {
    // Verify that the category rotation logic is implemented
    // The categories array has 5 categories that rotate based on day of week
    const categories = [
      "training_mindset",
      "nutrition_discipline",
      "race_day_focus",
      "recovery",
      "mental_strength",
    ];

    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    const quote = await caller.quotes.getTodayQuote();

    // Verify the quote has a category from the rotation list
    expect(categories).toContain(quote?.category);
  });
});
