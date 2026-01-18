import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RecipeModal } from "@/components/RecipeModal";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { useLocation } from "wouter";

export default function MealLogging() {
  const { isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const [selectedMealTime, setSelectedMealTime] = useState<string | null>(null);
  const [today] = useState(new Date());
  const [selectedRecipe, setSelectedRecipe] = useState<any>(null);
  const [isRecipeModalOpen, setIsRecipeModalOpen] = useState(false);

  const mealRecipes = trpc.nutrition.getMealRecipes.useQuery();
  const dailyNutrition = trpc.nutrition.getDailyNutrition.useQuery(
    { date: today },
    { enabled: isAuthenticated }
  );
  const logMealMutation = trpc.nutrition.logMeal.useMutation({
    onSuccess: () => {
      dailyNutrition.refetch();
    },
  });

  const handleLogMeal = (recipeId: number, mealTime: string | null) => {
    if (!mealTime) return;
    logMealMutation.mutate({
      recipeId,
      mealTime: mealTime as "pre-workout-7am" | "post-workout" | "lunch-3pm" | "dinner-6pm" | "snack",
      customCalories: 0,
      customCarbs: 0,
      customProtein: 0,
      customFats: 0,
    });
  };

  const handleViewRecipe = (recipe: any) => {
    setSelectedRecipe(recipe);
    setIsRecipeModalOpen(true);
  };

  if (!isAuthenticated) {
    navigate("/");
    return null;
  }

  const mealTimes = [
    { id: "pre-workout-7am", label: "Pre-Workout (7 AM)", time: "7:00 AM" },
    { id: "post-workout", label: "Post-Workout", time: "After Training" },
    { id: "lunch-3pm", label: "Lunch (3 PM)", time: "3:00 PM" },
    { id: "dinner-6pm", label: "Dinner (6 PM)", time: "6:00 PM" },
    { id: "snack", label: "Snack", time: "Anytime" },
  ];

  const getRecipesByCategory = (category: string) => {
    return mealRecipes.data?.filter((r: any) => r.category === category) || [];
  };

  const getLoggedMealsForTime = (mealTime: string) => {
    return dailyNutrition.data?.meals?.filter((m: any) => m.mealTime === mealTime) || [];
  };

  const getRecipeNameById = (recipeId: number | null) => {
    if (!recipeId) return null;
    return mealRecipes.data?.find((r: any) => r.id === recipeId)?.name;
  };

  const renderMealCards = (category: string, title: string) => (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-bold mb-4">{title}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {getRecipesByCategory(category).map((recipe: any) => (
            <Card key={recipe.id} className="card-strict">
              <div className="space-y-4">
                <div>
                  <h4 className="text-lg font-bold">{recipe.name}</h4>
                  <p className="text-sm text-muted-foreground mt-1">{recipe.description}</p>
                </div>
                <div className="grid grid-cols-4 gap-2 text-center text-xs">
                  <div>
                    <p className="font-semibold">{recipe.caloriesPerServing}</p>
                    <p className="text-muted-foreground">kcal</p>
                  </div>
                  <div>
                    <p className="font-semibold">{recipe.carbs}g</p>
                    <p className="text-muted-foreground">carbs</p>
                  </div>
                  <div>
                    <p className="font-semibold">{recipe.protein}g</p>
                    <p className="text-muted-foreground">protein</p>
                  </div>
                  <div>
                    <p className="font-semibold">{recipe.fats}g</p>
                    <p className="text-muted-foreground">fats</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => handleViewRecipe(recipe)}
                  >
                    View Recipe
                  </Button>
                  <Button
                    className="flex-1 btn-primary"
                    onClick={() => handleLogMeal(recipe.id, selectedMealTime)}
                    disabled={logMealMutation.isPending}
                  >
                    {logMealMutation.isPending ? "Logging..." : "Log Meal"}
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-16 space-generous">
        {/* Header */}
        <div className="space-y-4">
          <h1 className="text-5xl font-bold tracking-tight">Log Your Meals</h1>
          <div className="divider-red" />
          <p className="text-lg text-muted-foreground">
            Select a meal time and choose from your meal prep recipes or log a custom meal.
          </p>
        </div>

        {/* Meal Time Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16">
          {mealTimes.map(mealTime => (
            <Card
              key={mealTime.id}
              className={`card-strict cursor-pointer transition-all ${
                selectedMealTime === mealTime.id ? "border-primary border-2" : ""
              }`}
              onClick={() => setSelectedMealTime(mealTime.id)}
            >
              <div className="space-y-2">
                <p className="text-sm font-semibold text-muted-foreground">{mealTime.label}</p>
                <p className="text-2xl font-bold">{mealTime.time}</p>
                <p className="text-xs text-muted-foreground">
                  {getLoggedMealsForTime(mealTime.id).length} logged
                </p>
                {getLoggedMealsForTime(mealTime.id).length > 0 && (
                  <div className="border-t pt-3 space-y-2">
                    {getLoggedMealsForTime(mealTime.id).map((meal: any, idx: number) => (
                      <div key={idx} className="text-sm">
                        <p className="font-medium text-foreground">
                          {meal.customMealName || getRecipeNameById(meal.recipeId) || "Custom Meal"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {meal.customCalories} cal
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>

        {/* Meal Selection */}
        {selectedMealTime && (
          <div className="mt-16">
            <h2 className="text-3xl font-bold tracking-tight mb-8">Select a Meal</h2>
            
            {selectedMealTime === "pre-workout-7am" && renderMealCards("pre-workout", "Pre-Workout Options")}
            {selectedMealTime === "post-workout" && renderMealCards("post-workout", "Post-Workout Recovery Options")}
            {selectedMealTime === "lunch-3pm" && renderMealCards("lunch", "Lunch Options")}
            {selectedMealTime === "dinner-6pm" && renderMealCards("dinner", "Dinner Options")}
            {selectedMealTime === "snack" && renderMealCards("snack", "Snack Options")}
          </div>
        )}
      </div>

      {/* Recipe Modal */}
      <RecipeModal
        isOpen={isRecipeModalOpen}
        onClose={() => setIsRecipeModalOpen(false)}
        recipe={selectedRecipe}
      />
    </div>
  );
}
