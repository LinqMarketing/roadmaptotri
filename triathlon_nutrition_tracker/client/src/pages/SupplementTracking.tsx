import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { trpc } from "@/lib/trpc";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";

const SUPPLEMENTS = [
  { name: "creatine" as const, label: "Creatine", dosage: "5g", time: "Anytime" },
  { name: "electrolytes" as const, label: "Electrolytes", dosage: "500-750mg sodium", time: "During training" },
  { name: "omega-3" as const, label: "Omega-3", dosage: "2-3g", time: "With meals" },
  { name: "vitamin-d" as const, label: "Vitamin D", dosage: "2000-4000 IU", time: "Morning" },
  { name: "beta-alanine" as const, label: "Beta-Alanine", dosage: "3-5g", time: "Daily" },
  { name: "caffeine" as const, label: "Caffeine", dosage: "100-200mg", time: "Pre-training" },
];

export default function SupplementTracking() {
  const { isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const [today] = useState(new Date());
  const [completedSupplements, setCompletedSupplements] = useState<Set<string>>(new Set());

  const supplementLogs = trpc.nutrition.getSupplementLogs.useQuery(
    { date: today },
    { enabled: isAuthenticated }
  );
  const logSupplement = trpc.nutrition.logSupplement.useMutation();

  // Initialize completedSupplements from database logs
  useEffect(() => {
    if (supplementLogs.data && supplementLogs.data.length > 0) {
      const supplementSet = new Set(
        supplementLogs.data.map(log => log.supplementName)
      );
      setCompletedSupplements(supplementSet);
    } else {
      setCompletedSupplements(new Set());
    }
  }, [supplementLogs.data]);

  if (!isAuthenticated) {
    navigate("/");
    return null;
  }

  const handleToggleSupplement = async (supplementName: typeof SUPPLEMENTS[0]["name"]) => {
    const isCompleted = completedSupplements.has(supplementName);

    if (!isCompleted) {
      try {
        const supplement = SUPPLEMENTS.find(s => s.name === supplementName);
        if (supplement) {
          await logSupplement.mutateAsync({
            supplementName,
            dosage: supplement.dosage,
          });
          const newSet = new Set(Array.from(completedSupplements));
          newSet.add(supplementName);
          setCompletedSupplements(newSet);
          toast.success(`${supplement.label} logged!`);
          // Refetch the logs to ensure consistency
          supplementLogs.refetch();
        }
      } catch (error) {
        toast.error("Failed to log supplement");
        console.error(error);
      }
    } else {
      // For unchecking, we would need a delete procedure
      // For now, just update local state
      const newSet = new Set(Array.from(completedSupplements));
      newSet.delete(supplementName);
      setCompletedSupplements(newSet);
      toast.info(`${SUPPLEMENTS.find(s => s.name === supplementName)?.label} unchecked`);
    }
  };

  const completionPercentage = (Array.from(completedSupplements).length / SUPPLEMENTS.length) * 100;

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-16 space-generous">
        {/* Header */}
        <div className="space-y-4">
          <h1 className="text-5xl font-bold tracking-tight">Supplement Tracking</h1>
          <div className="divider-red" />
          <p className="text-lg text-muted-foreground">
            Track your daily supplement intake to ensure optimal recovery and performance.
          </p>
        </div>

        {/* Progress */}
        <div className="mt-16">
          <Card className="card-strict">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-sm font-semibold text-muted-foreground">TODAY'S COMPLETION</p>
                <p className="text-2xl font-bold text-primary">{Math.round(completionPercentage)}%</p>
              </div>
              <div className="w-full bg-muted h-2">
                <div
                  className="bg-primary h-2 transition-all"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
              <p className="text-sm text-muted-foreground">
                {completedSupplements.size} of {SUPPLEMENTS.length} supplements logged
              </p>
            </div>
          </Card>
        </div>

        {/* Supplement Checklist */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold tracking-tight mb-8">Daily Supplements</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {SUPPLEMENTS.map(supplement => (
              <Card
                key={supplement.name}
                className={`card-strict cursor-pointer transition-all ${
                  completedSupplements.has(supplement.name)
                    ? "border-primary border-2 bg-primary bg-opacity-5"
                    : ""
                }`}
                onClick={() => handleToggleSupplement(supplement.name)}
              >
                <div className="flex items-start gap-4">
                  <Checkbox
                    checked={completedSupplements.has(supplement.name)}
                    onCheckedChange={() => handleToggleSupplement(supplement.name)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-bold">{supplement.label}</h3>
                    <p className="text-sm text-muted-foreground mt-2">
                      <span className="font-semibold">Dosage:</span> {supplement.dosage}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <span className="font-semibold">Time:</span> {supplement.time}
                    </p>
                  </div>
                  <div className="w-6 h-6 rounded-full border-2 border-foreground flex items-center justify-center">
                    {completedSupplements.has(supplement.name) && (
                      <div className="w-3 h-3 bg-primary rounded-full" />
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Tips */}
        <div className="mt-16 border-t border-foreground pt-16">
          <h2 className="text-3xl font-bold tracking-tight mb-8">Supplement Guide</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="card-strict">
              <div className="space-y-4">
                <h3 className="text-lg font-bold">Creatine (5g daily)</h3>
                <p className="text-sm text-muted-foreground">
                  Supports muscle strength and endurance. Take consistently for best results. Mix with carbs for better absorption.
                </p>
              </div>
            </Card>

            <Card className="card-strict">
              <div className="space-y-4">
                <h3 className="text-lg font-bold">Electrolytes</h3>
                <p className="text-sm text-muted-foreground">
                  Essential during training sessions lasting over 60 minutes. Helps maintain hydration and performance.
                </p>
              </div>
            </Card>

            <Card className="card-strict">
              <div className="space-y-4">
                <h3 className="text-lg font-bold">Omega-3 (2-3g daily)</h3>
                <p className="text-sm text-muted-foreground">
                  Reduces inflammation and supports cardiovascular health. Take with meals for better absorption.
                </p>
              </div>
            </Card>

            <Card className="card-strict">
              <div className="space-y-4">
                <h3 className="text-lg font-bold">Vitamin D (2000-4000 IU)</h3>
                <p className="text-sm text-muted-foreground">
                  Supports immune function and bone health. Take in the morning with breakfast.
                </p>
              </div>
            </Card>

            <Card className="card-strict">
              <div className="space-y-4">
                <h3 className="text-lg font-bold">Beta-Alanine (3-5g daily)</h3>
                <p className="text-sm text-muted-foreground">
                  Buffers lactic acid during high-intensity efforts. Consistent daily intake is key.
                </p>
              </div>
            </Card>

            <Card className="card-strict">
              <div className="space-y-4">
                <h3 className="text-lg font-bold">Caffeine (100-200mg)</h3>
                <p className="text-sm text-muted-foreground">
                  Enhances focus and reduces perceived effort. Take 30-60 minutes before training.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
