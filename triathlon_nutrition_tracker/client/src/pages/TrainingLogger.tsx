import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";

export default function TrainingLogger() {
  const { isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const [sessionType, setSessionType] = useState<"swim" | "bike" | "run" | "brick">("bike");
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [distanceKm, setDistanceKm] = useState<number | undefined>();
  const [intensity, setIntensity] = useState<"easy" | "moderate" | "hard" | "race-pace">("moderate");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const logTraining = trpc.nutrition.logTrainingSession.useMutation();
  const fuelingRec = trpc.nutrition.getFuelingRecommendation.useQuery({ durationMinutes });

  if (!isAuthenticated) {
    navigate("/");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await logTraining.mutateAsync({
        sessionType,
        durationMinutes,
        distanceKm,
        intensity,
        notes,
      });
      toast.success("Training session logged successfully!");
      setSessionType("bike");
      setDurationMinutes(60);
      setDistanceKm(undefined);
      setIntensity("moderate");
      setNotes("");
    } catch (error) {
      toast.error("Failed to log training session");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-16 space-generous">
        {/* Header */}
        <div className="space-y-4">
          <h1 className="text-5xl font-bold tracking-tight">Log Training Session</h1>
          <div className="divider-red" />
          <p className="text-lg text-muted-foreground">
            Track your swim, bike, and run workouts. Get automatic fueling recommendations based on duration.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 mt-16">
          {/* Form */}
          <div className="lg:col-span-2">
            <Card className="card-strict">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Session Type */}
                <div className="space-y-2">
                  <Label htmlFor="session-type" className="text-sm font-semibold">
                    SESSION TYPE
                  </Label>
                  <Select value={sessionType} onValueChange={(value: any) => setSessionType(value)}>
                    <SelectTrigger id="session-type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="swim">Swim</SelectItem>
                      <SelectItem value="bike">Bike</SelectItem>
                      <SelectItem value="run">Run</SelectItem>
                      <SelectItem value="brick">Brick (Bike + Run)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Duration */}
                <div className="space-y-2">
                  <Label htmlFor="duration" className="text-sm font-semibold">
                    DURATION (MINUTES)
                  </Label>
                  <Input
                    id="duration"
                    type="number"
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(parseInt(e.target.value) || 0)}
                    min="1"
                    className="border border-foreground"
                  />
                </div>

                {/* Distance */}
                <div className="space-y-2">
                  <Label htmlFor="distance" className="text-sm font-semibold">
                    DISTANCE (KM) - OPTIONAL
                  </Label>
                  <Input
                    id="distance"
                    type="number"
                    value={distanceKm || ""}
                    onChange={(e) => setDistanceKm(e.target.value ? parseFloat(e.target.value) : undefined)}
                    step="0.1"
                    className="border border-foreground"
                  />
                </div>

                {/* Intensity */}
                <div className="space-y-2">
                  <Label htmlFor="intensity" className="text-sm font-semibold">
                    INTENSITY
                  </Label>
                  <Select value={intensity} onValueChange={(value: any) => setIntensity(value)}>
                    <SelectTrigger id="intensity">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="moderate">Moderate</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                      <SelectItem value="race-pace">Race Pace</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Notes */}
                <div className="space-y-2">
                  <Label htmlFor="notes" className="text-sm font-semibold">
                    NOTES - OPTIONAL
                  </Label>
                  <textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="How did you feel? Any observations?"
                    className="w-full border border-foreground p-4 bg-background text-foreground"
                    rows={4}
                  />
                </div>

                <Button
                  type="submit"
                  className="btn-primary w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Logging..." : "Log Training Session"}
                </Button>
              </form>
            </Card>
          </div>

          {/* Fueling Recommendation */}
          <div>
            <Card className="card-strict sticky top-8">
              <div className="space-y-4">
                <h3 className="text-xl font-bold">FUELING GUIDE</h3>
                <div className="divider-red" />
                
                {fuelingRec.data && (
                  <div className="space-y-6">
                    <div>
                      <p className="text-sm font-semibold text-muted-foreground">CARBS</p>
                      <p className="text-2xl font-bold">{fuelingRec.data.carbs}</p>
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-muted-foreground">PROTEIN</p>
                      <p className="text-2xl font-bold">{fuelingRec.data.protein}</p>
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-muted-foreground">FLUIDS</p>
                      <p className="text-2xl font-bold">{fuelingRec.data.fluids}</p>
                    </div>

                    <div className="pt-4 border-t border-foreground">
                      <p className="text-sm text-muted-foreground italic">
                        {fuelingRec.data.note}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
