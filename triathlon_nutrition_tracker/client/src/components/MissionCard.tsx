import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";

export default function MissionCard() {
  const [, navigate] = useLocation();
  const { data: missionData, isLoading } = trpc.mission.getMissionAndGoals.useQuery();

  if (isLoading) {
    return (
      <Card className="p-6 bg-gradient-to-br from-red-50 to-orange-50 border-red-200">
        <div className="text-center text-muted-foreground">Loading...</div>
      </Card>
    );
  }

  const hasMission = missionData?.missionStatement || missionData?.primaryGoal;

  return (
    <Card className="p-6 bg-gradient-to-br from-red-50 to-orange-50 border-red-200">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-red-900">Your Mission</h2>
            <p className="text-sm text-red-700">Your personal motivation & goals</p>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => navigate("/my-mission")}
            className="border-red-300 hover:bg-red-100"
          >
            Edit
          </Button>
        </div>

        {/* Mission Content */}
        {hasMission ? (
          <div className="space-y-4">
            {/* Mission Statement */}
            {missionData?.missionStatement && (
              <div>
                <p className="text-sm font-semibold text-red-900 mb-1">Mission Statement</p>
                <p className="text-gray-700 leading-relaxed line-clamp-2">
                  {missionData.missionStatement}
                </p>
              </div>
            )}

            {/* Primary Goal & Race Event */}
            <div className="grid grid-cols-2 gap-3">
              {missionData?.primaryGoal && (
                <div className="bg-white bg-opacity-60 p-3 rounded border border-red-100">
                  <p className="text-xs font-semibold text-red-900">Goal</p>
                  <p className="text-sm text-gray-700 line-clamp-1">
                    {missionData.primaryGoal}
                  </p>
                </div>
              )}

              {missionData?.raceEvent && (
                <div className="bg-white bg-opacity-60 p-3 rounded border border-red-100">
                  <p className="text-xs font-semibold text-red-900">Race Event</p>
                  <p className="text-sm text-gray-700 line-clamp-1">
                    {missionData.raceEvent}
                  </p>
                </div>
              )}
            </div>

            {/* Weight Goals */}
            {(missionData?.currentWeight || missionData?.targetWeight) && (
              <div className="bg-white bg-opacity-60 p-3 rounded border border-red-100">
                <p className="text-xs font-semibold text-red-900 mb-1">Weight Progress</p>
                <p className="text-sm text-gray-700">
                  {missionData?.currentWeight && (
                    <>
                      <span className="font-semibold">{missionData.currentWeight} lbs</span>
                      {missionData?.targetWeight && (
                        <> → <span className="font-semibold">{missionData.targetWeight} lbs</span></>
                      )}
                    </>
                  )}
                </p>
              </div>
            )}

            {/* Training Motivation */}
            {missionData?.trainingMotivation && (
              <div className="bg-white bg-opacity-60 p-3 rounded border border-red-100">
                <p className="text-xs font-semibold text-red-900 mb-1">Why I'm Training</p>
                <p className="text-sm text-gray-700 line-clamp-2">
                  {missionData.trainingMotivation}
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-gray-600 mb-3">
              Define your mission, goals, and training purpose to stay motivated.
            </p>
            <Button
              onClick={() => navigate("/my-mission")}
              className="bg-red-600 hover:bg-red-700"
            >
              Create My Mission
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}
