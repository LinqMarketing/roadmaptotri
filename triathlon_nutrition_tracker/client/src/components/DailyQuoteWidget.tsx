import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { useEffect, useState, useRef } from "react";

const categoryColors: Record<string, { bg: string; border: string; text: string; icon: string }> = {
  training_mindset: {
    bg: "bg-blue-50",
    border: "border-blue-200",
    text: "text-blue-900",
    icon: "💪",
  },
  nutrition_discipline: {
    bg: "bg-green-50",
    border: "border-green-200",
    text: "text-green-900",
    icon: "🥗",
  },
  race_day_focus: {
    bg: "bg-purple-50",
    border: "border-purple-200",
    text: "text-purple-900",
    icon: "🏁",
  },
  recovery: {
    bg: "bg-amber-50",
    border: "border-amber-200",
    text: "text-amber-900",
    icon: "😴",
  },
  mental_strength: {
    bg: "bg-red-50",
    border: "border-red-200",
    text: "text-red-900",
    icon: "🧠",
  },
};

export default function DailyQuoteWidget() {
  const [currentDate, setCurrentDate] = useState<string>(new Date().toDateString());
  const lastRefetchDateRef = useRef<string>(new Date().toDateString());

  const { data: quote, isLoading, refetch } = trpc.quotes.getTodayQuote.useQuery(undefined, {
    staleTime: 0, // Always consider data stale
  });

  // Poll every minute to check if date has changed
  useEffect(() => {
    const pollInterval = setInterval(() => {
      const today = new Date().toDateString();
      setCurrentDate(today);

      // If date has changed since last refetch, refetch the quote
      if (today !== lastRefetchDateRef.current) {
        lastRefetchDateRef.current = today;
        refetch();
      }
    }, 60000); // Check every minute (60,000 ms)

    return () => clearInterval(pollInterval);
  }, [refetch]);

  // Also check immediately on mount and when component remounts
  useEffect(() => {
    const today = new Date().toDateString();
    if (today !== lastRefetchDateRef.current) {
      lastRefetchDateRef.current = today;
      refetch();
    }
  }, [refetch]);

  if (isLoading) {
    return (
      <Card className="p-6 bg-gradient-to-r from-slate-100 to-slate-50 border-slate-200">
        <div className="text-center text-muted-foreground">Loading today's motivation...</div>
      </Card>
    );
  }

  if (!quote) {
    return null;
  }

  const colors = categoryColors[quote.category] || categoryColors.training_mindset;
  const categoryLabel = quote.category.replace(/_/g, " ").toUpperCase();

  return (
    <Card className={`p-6 bg-gradient-to-br ${colors.bg} ${colors.border} border-2 shadow-md`}>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-3xl">{colors.icon}</span>
            <h3 className={`font-bold ${colors.text}`}>Today's Motivation</h3>
          </div>
          <span className={`text-xs font-semibold px-3 py-1 rounded-full ${colors.bg} ${colors.text} border ${colors.border}`}>
            {categoryLabel}
          </span>
        </div>

        {/* Quote Text */}
        <div className={`text-lg font-semibold italic ${colors.text} leading-relaxed min-h-16 flex items-center`}>
          "{quote.quoteText}"
        </div>

        {/* Footer */}
        <div className="text-xs text-muted-foreground text-right">
          {new Date(quote.quoteDate).toLocaleDateString("en-US", {
            weekday: "long",
            month: "short",
            day: "numeric",
          })}
        </div>
      </div>
    </Card>
  );
}
