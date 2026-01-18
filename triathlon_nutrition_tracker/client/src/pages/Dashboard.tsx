import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useRoute } from "wouter";
import { trpc } from "@/lib/trpc";
import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import MissionCard from "@/components/MissionCard";
import DailyQuoteWidget from "@/components/DailyQuoteWidget";


export default function Dashboard() {
  const { user, isAuthenticated } = useAuth();
  const [today] = useState(new Date());

  const dailyTargets = trpc.nutrition.getDailyTargets.useQuery();
  const dailyNutrition = trpc.nutrition.getDailyNutrition.useQuery(
    { date: today },
    { enabled: isAuthenticated }
  );
  const progressLogs = trpc.nutrition.getProgressLogs.useQuery(
    { limit: 30 },
    { enabled: isAuthenticated }
  );
  const missionAndGoals = trpc.mission.getMissionAndGoals.useQuery(
    undefined,
    { enabled: isAuthenticated }
  );

  // Calculate daily totals
  const calculateTotals = () => {
    if (!dailyNutrition.data) return { calories: 0, carbs: 0, protein: 0, fats: 0 };

    return dailyNutrition.data.meals.reduce(
      (acc: any, meal: any) => {
        const calories = meal.customCalories || meal.caloriesPerServing || 0;
        const carbs = meal.customCarbs || meal.carbs || 0;
        const protein = meal.customProtein || meal.protein || 0;
        const fats = meal.customFats || meal.fats || 0;
        return {
          calories: acc.calories + calories,
          carbs: acc.carbs + carbs,
          protein: acc.protein + protein,
          fats: acc.fats + fats,
        };
      },
      { calories: 0, carbs: 0, protein: 0, fats: 0 }
    );
  };

  const totals = calculateTotals();
  const targets = dailyTargets.data;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="max-w-2xl mx-auto px-8 text-center space-generous">
          <h1 className="text-5xl font-bold tracking-tight">
            70.3 Triathlon<br />Nutrition Tracker
          </h1>
          <p className="text-lg text-muted-foreground mt-8">
            Track your nutrition, training, and progress toward your 165 lbs lean muscle goal.
          </p>
          <div className="mt-12 flex gap-4 justify-center">
            <Button className="btn-primary">Get Started</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-16 space-generous">
        {/* Header */}
        <div className="space-y-4">
          <h1 className="text-5xl font-bold tracking-tight">
            Welcome, {user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : user?.name || "Athlete"}
          </h1>
          <div className="divider-red" />
        </div>

        {/* Daily Quote Widget */}
        <DailyQuoteWidget />

        {/* Mission & Goals Card */}
        <MissionCard />

        {/* Daily Targets Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <Card className="card-strict">
            <div className="space-y-2">
              <p className="text-sm font-semibold text-muted-foreground">CALORIES</p>
              <p className="text-3xl font-bold">
                {totals.calories} / {targets?.caloriesTarget}
              </p>
              <div className="w-full bg-muted h-1 mt-4">
                <div
                  className="bg-primary h-1 transition-all"
                  style={{
                    width: `${Math.min((totals.calories / (targets?.caloriesTarget || 1)) * 100, 100)}%`,
                  }}
                />
              </div>
            </div>
          </Card>

          <Card className="card-strict">
            <div className="space-y-2">
              <p className="text-sm font-semibold text-muted-foreground">CARBS</p>
              <p className="text-3xl font-bold">
                {totals.carbs}g
              </p>
              <p className="text-xs text-muted-foreground">
                Target: {targets?.carbsTarget.min}-{targets?.carbsTarget.max}g
              </p>
            </div>
          </Card>

          <Card className="card-strict">
            <div className="space-y-2">
              <p className="text-sm font-semibold text-muted-foreground">PROTEIN</p>
              <p className="text-3xl font-bold">
                {totals.protein}g
              </p>
              <p className="text-xs text-muted-foreground">
                Target: {targets?.proteinTarget.min}-{targets?.proteinTarget.max}g
              </p>
            </div>
          </Card>

          <Card className="card-strict">
            <div className="space-y-2">
              <p className="text-sm font-semibold text-muted-foreground">FATS</p>
              <p className="text-3xl font-bold">
                {totals.fats}g
              </p>
              <p className="text-xs text-muted-foreground">
                Target: {targets?.fatsTarget.min}-{targets?.fatsTarget.max}g
              </p>
            </div>
          </Card>
        </div>

        {/* Progress Chart */}
        {progressLogs.data && progressLogs.data.length > 0 && (
          <div className="mt-16">
            <h2 className="text-3xl font-bold tracking-tight mb-8">Weight Progress</h2>
            <Card className="card-strict">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={progressLogs.data.map(log => ({
                  date: new Date(log.loggedDate).toLocaleDateString(),
                  weight: log.weight,
                }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#000" />
                  <XAxis dataKey="date" stroke="#000" />
                  <YAxis stroke="#000" />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="weight"
                    stroke="#c41e3a"
                    dot={{ fill: "#c41e3a" }}
                    isAnimationActive={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </div>
        )}

        {/* Weight Goal */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold tracking-tight mb-8">Weight Goal</h2>
          <Card className="card-strict">
            {missionAndGoals.data?.currentWeight && missionAndGoals.data?.targetWeight ? (
              <div className="grid grid-cols-3 gap-8 text-center">
                <div>
                  <p className="text-sm font-semibold text-muted-foreground mb-2">CURRENT</p>
                  <p className="text-4xl font-bold">{missionAndGoals.data.currentWeight} lbs</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-muted-foreground mb-2">GOAL</p>
                  <p className="text-4xl font-bold">{missionAndGoals.data.targetWeight} lbs</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-muted-foreground mb-2">REMAINING</p>
                  <p className="text-4xl font-bold text-primary">
                    {(parseInt(missionAndGoals.data.currentWeight) || 0) - (parseInt(missionAndGoals.data.targetWeight) || 0)} lbs
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">Set your weight goals to track your progress</p>
                <Button className="bg-red-600 hover:bg-red-700" onClick={() => window.location.href = '/my-mission'}>
                  Set Weight Goals
                </Button>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
