import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function MyMission() {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    missionStatement: "",
    primaryGoal: "",
    currentWeight: "",
    targetWeight: "",
    raceEvent: "",
    trainingMotivation: "",
  });

  const { data: missionData, isLoading } = trpc.mission.getMissionAndGoals.useQuery();
  const updateMission = trpc.mission.updateMissionAndGoals.useMutation({
    onSuccess: () => {
      toast.success("Mission and goals updated successfully!");
      setIsEditing(false);
      setIsSaving(false);
    },
    onError: (err) => {
      toast.error(err.message || "Failed to update mission and goals");
      setIsSaving(false);
    },
  });

  useEffect(() => {
    if (missionData) {
      setFormData({
        missionStatement: missionData.missionStatement || "",
        primaryGoal: missionData.primaryGoal || "",
        currentWeight: missionData.currentWeight || "",
        targetWeight: missionData.targetWeight || "",
        raceEvent: missionData.raceEvent || "",
        trainingMotivation: missionData.trainingMotivation || "",
      });
    }
  }, [missionData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    setIsSaving(true);
    updateMission.mutate(formData);
  };

  const handleCancel = () => {
    if (missionData) {
      setFormData({
        missionStatement: missionData.missionStatement || "",
        primaryGoal: missionData.primaryGoal || "",
        currentWeight: missionData.currentWeight || "",
        targetWeight: missionData.targetWeight || "",
        raceEvent: missionData.raceEvent || "",
        trainingMotivation: missionData.trainingMotivation || "",
      });
    }
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <div className="container py-12">
        <div className="text-center">Loading your mission...</div>
      </div>
    );
  }

  return (
    <div className="container py-12 max-w-2xl">
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold">My Mission & Goals</h1>
          <p className="text-muted-foreground">
            Define your personal mission, goals, and why you're training. This is your motivation dashboard.
          </p>
        </div>

        {/* Display Mode */}
        {!isEditing && (
          <div className="space-y-6">
            {/* Mission Statement Card */}
            <Card className="p-6 bg-gradient-to-br from-red-50 to-orange-50 border-red-200">
              <div className="space-y-3">
                <h2 className="text-2xl font-bold text-red-900">My Mission</h2>
                <p className="text-lg text-gray-700 leading-relaxed min-h-20">
                  {formData.missionStatement || (
                    <span className="text-muted-foreground italic">
                      No mission statement yet. Click edit to add one.
                    </span>
                  )}
                </p>
              </div>
            </Card>

            {/* Goals Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Primary Goal */}
              <Card className="p-4 border-blue-200 bg-blue-50">
                <h3 className="font-semibold text-blue-900 mb-2">Primary Goal</h3>
                <p className="text-sm text-gray-700">
                  {formData.primaryGoal || (
                    <span className="text-muted-foreground italic">Not set</span>
                  )}
                </p>
              </Card>

              {/* Race Event */}
              <Card className="p-4 border-purple-200 bg-purple-50">
                <h3 className="font-semibold text-purple-900 mb-2">Race Event</h3>
                <p className="text-sm text-gray-700">
                  {formData.raceEvent || (
                    <span className="text-muted-foreground italic">Not set</span>
                  )}
                </p>
              </Card>
            </div>

            {/* Weight Goals */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="p-4 border-green-200 bg-green-50">
                <h3 className="font-semibold text-green-900 mb-2">Current Weight</h3>
                <p className="text-lg font-bold text-gray-700">
                  {formData.currentWeight ? `${formData.currentWeight} lbs` : (
                    <span className="text-muted-foreground italic text-sm">Not set</span>
                  )}
                </p>
              </Card>

              <Card className="p-4 border-green-200 bg-green-50">
                <h3 className="font-semibold text-green-900 mb-2">Target Weight</h3>
                <p className="text-lg font-bold text-gray-700">
                  {formData.targetWeight ? `${formData.targetWeight} lbs` : (
                    <span className="text-muted-foreground italic text-sm">Not set</span>
                  )}
                </p>
              </Card>
            </div>

            {/* Training Motivation */}
            <Card className="p-6 bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-200">
              <h3 className="text-lg font-bold text-yellow-900 mb-3">Why I'm Training</h3>
              <p className="text-gray-700 leading-relaxed min-h-20">
                {formData.trainingMotivation || (
                  <span className="text-muted-foreground italic">
                    No motivation statement yet. Click edit to add one.
                  </span>
                )}
              </p>
            </Card>

            {/* Edit Button */}
            <Button
              onClick={() => setIsEditing(true)}
              className="w-full bg-red-600 hover:bg-red-700"
              size="lg"
            >
              Edit My Mission & Goals
            </Button>
          </div>
        )}

        {/* Edit Mode */}
        {isEditing && (
          <div className="space-y-6">
            {/* Mission Statement */}
            <div className="space-y-2">
              <label className="text-sm font-semibold">My Mission Statement</label>
              <Textarea
                name="missionStatement"
                value={formData.missionStatement}
                onChange={handleChange}
                placeholder="Write your personal mission statement. What drives you? What are you committed to?"
                className="min-h-24"
              />
              <p className="text-xs text-muted-foreground">
                {formData.missionStatement.length}/1000 characters
              </p>
            </div>

            {/* Primary Goal */}
            <div className="space-y-2">
              <label className="text-sm font-semibold">Primary Goal</label>
              <Input
                name="primaryGoal"
                value={formData.primaryGoal}
                onChange={handleChange}
                placeholder="e.g., Complete a Half Ironman, Improve 5K time, Lose 10 lbs"
              />
            </div>

            {/* Weight Goals */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold">Current Weight (lbs)</label>
                <Input
                  name="currentWeight"
                  value={formData.currentWeight}
                  onChange={handleChange}
                  placeholder="e.g., 172"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold">Target Weight (lbs)</label>
                <Input
                  name="targetWeight"
                  value={formData.targetWeight}
                  onChange={handleChange}
                  placeholder="e.g., 165"
                />
              </div>
            </div>

            {/* Race Event */}
            <div className="space-y-2">
              <label className="text-sm font-semibold">Race Event</label>
              <Input
                name="raceEvent"
                value={formData.raceEvent}
                onChange={handleChange}
                placeholder="e.g., 70.3 Half Ironman - June 2026"
              />
            </div>

            {/* Training Motivation */}
            <div className="space-y-2">
              <label className="text-sm font-semibold">Why I'm Training (Motivation)</label>
              <Textarea
                name="trainingMotivation"
                value={formData.trainingMotivation}
                onChange={handleChange}
                placeholder="What's your motivation? Why does this matter to you? What will achieving this goal mean for you?"
                className="min-h-24"
              />
              <p className="text-xs text-muted-foreground">
                {formData.trainingMotivation.length}/2000 characters
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="flex-1 bg-red-600 hover:bg-red-700"
                size="lg"
              >
                {isSaving ? "Saving..." : "Save Mission & Goals"}
              </Button>
              <Button
                onClick={handleCancel}
                variant="outline"
                className="flex-1"
                size="lg"
                disabled={isSaving}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
