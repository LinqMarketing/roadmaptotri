import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { getLoginUrl } from "@/const";
import { useLocation } from "wouter";
import { useEffect } from "react";

export default function Home() {
  const { isAuthenticated } = useAuth();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="container py-24 space-generous">
        <div className="max-w-4xl">
          <h1 className="text-6xl font-bold tracking-tight leading-tight">
            70.3 Triathlon<br />
            <span className="text-primary">Nutrition Tracker</span>
          </h1>
          <div className="divider-red w-16 mt-8" />
          <p className="text-xl text-muted-foreground mt-8 leading-relaxed">
            Track your nutrition, training, and progress toward your 165 lbs lean muscle goal. 
            Designed for athletes training for a Half Ironman with intermittent fasting and 
            high-performance fueling strategies.
          </p>
        </div>

        <div className="mt-16 flex gap-4">
          <a href={getLoginUrl()}>
            <Button className="btn-primary">Start Tracking</Button>
          </a>
          <Button variant="outline" className="border border-foreground">
            Learn More
          </Button>
        </div>
      </div>

      {/* Features Section */}
      <div className="border-t border-foreground">
        <div className="container py-24">
          <h2 className="text-4xl font-bold tracking-tight mb-16">Features</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            {/* Feature 1 */}
            <div className="space-y-4">
              <div className="w-3 h-3 bg-primary" />
              <h3 className="text-2xl font-bold">Daily Nutrition Tracking</h3>
              <p className="text-muted-foreground">
                Log meals across your 9 AM–1 PM training window with automatic macronutrient 
                calculation. Track against your 2,500 kcal target with 344-375g carbs, 
                125-156g protein, and 42-56g fats.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="space-y-4">
              <div className="w-3 h-3 bg-primary" />
              <h3 className="text-2xl font-bold">Training Integration</h3>
              <p className="text-muted-foreground">
                Log swim, bike, and run sessions with automatic fueling recommendations 
                based on duration and intensity. Track your 70.3 progression.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="space-y-4">
              <div className="w-3 h-3 bg-primary" />
              <h3 className="text-2xl font-bold">Meal Prep Database</h3>
              <p className="text-muted-foreground">
                Access pre-built recipes including Slow Cooker Chicken, Air Fryer Potatoes, 
                and Recovery Smoothies with complete nutritional breakdowns.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="space-y-4">
              <div className="w-3 h-3 bg-primary" />
              <h3 className="text-2xl font-bold">Progress Tracking</h3>
              <p className="text-muted-foreground">
                Monitor your weight loss journey from 172 lbs to 165 lbs with weekly 
                progress charts and body composition tracking.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="space-y-4">
              <div className="w-3 h-3 bg-primary" />
              <h3 className="text-2xl font-bold">Supplement Management</h3>
              <p className="text-muted-foreground">
                Track your 5g daily creatine, electrolytes, Omega-3, Vitamin D, Beta-Alanine, 
                and caffeine with daily reminders.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="space-y-4">
              <div className="w-3 h-3 bg-primary" />
              <h3 className="text-2xl font-bold">Race Week Protocol</h3>
              <p className="text-muted-foreground">
                Countdown to race day with carb-loading protocol reminders (60-70% carbs 
                3 days pre-race) and race-day fueling strategy.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="border-t border-foreground bg-primary text-primary-foreground">
        <div className="container py-24 text-center space-generous">
          <h2 className="text-4xl font-bold tracking-tight">
            Ready to optimize your 70.3 performance?
          </h2>
          <p className="text-lg opacity-90 mt-8">
            Start tracking your nutrition and training today.
          </p>
          <div className="mt-12">
            <a href={getLoginUrl()}>
              <Button className="bg-background text-foreground hover:bg-secondary">
                Get Started Now
              </Button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
