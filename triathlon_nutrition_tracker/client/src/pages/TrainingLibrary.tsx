import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Download } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";

interface TrainingPlan {
  id: string;
  title: string;
  distance: string;
  duration: string;
  level: string;
  description: string;
  highlights: string[];
  fileName: string;
}

const trainingPlans: TrainingPlan[] = [
  {
    id: "5k-12",
    title: "5K Running: 12-Week Beginner",
    distance: "5 kilometers (3.1 miles)",
    duration: "12 weeks",
    level: "Beginner",
    description: "Perfect for complete beginners with no running experience. Uses run/walk intervals progressing to continuous running.",
    highlights: [
      "Run/walk intervals gradually transition to continuous running",
      "3-4 training days per week",
      "Progressive volume increases following 10% rule",
      "Injury prevention and recovery guidance"
    ],
    fileName: "5k_12week.pdf"
  },
  {
    id: "5k-24",
    title: "5K Running: 24-Week Beginner",
    distance: "5 kilometers (3.1 miles)",
    duration: "24 weeks",
    level: "Beginner",
    description: "Extended 24-week program with longer base building phase. Ideal for those wanting a gradual progression with more recovery time.",
    highlights: [
      "Extended base building phase (6 weeks)",
      "Gradual run/walk progression",
      "3-4 training days per week",
      "Multiple recovery weeks built in"
    ],
    fileName: "5k_24week.pdf"
  },
  {
    id: "half-marathon-12",
    title: "Half Marathon: 12-Week Program",
    distance: "21.1 kilometers (13.1 miles)",
    duration: "12 weeks",
    level: "Intermediate",
    description: "Structured 12-week program for runners with 5K fitness. Includes tempo runs, speed work, and progressive long runs.",
    highlights: [
      "One speed/tempo session per week",
      "Progressive long runs up to 13K+",
      "4-5 training days per week",
      "Race-specific preparation and taper"
    ],
    fileName: "half_marathon_12week.pdf"
  },
  {
    id: "half-marathon-24",
    title: "Half Marathon: 24-Week Program",
    distance: "21.1 kilometers (13.1 miles)",
    duration: "24 weeks",
    level: "Beginner",
    description: "Extended 24-week program with 6 training phases. Includes speed work, tempo runs, and peak long runs over 15K.",
    highlights: [
      "6 distinct training phases",
      "Progressive speed work introduction",
      "Peak long runs over half marathon distance",
      "Extended taper and race preparation"
    ],
    fileName: "half_marathon_24week.pdf"
  },
  {
    id: "sprint-12",
    title: "Sprint Triathlon: 12-Week Beginner",
    distance: "750m swim | 20km bike | 5km run",
    duration: "12 weeks",
    level: "Beginner",
    description: "Perfect for absolute beginners wanting to complete their first sprint triathlon. Focuses on building basic fitness and establishing a training routine.",
    highlights: [
      "Gradual progression from 2-3 hours to 4-5 hours per week",
      "Foundation building with form focus",
      "Injury prevention emphasis",
      "Flexible schedule for busy athletes"
    ],
    fileName: "sprint_12week.pdf"
  },
  {
    id: "sprint-18",
    title: "Sprint Triathlon: 18-Week Intermediate",
    distance: "750m swim | 20km bike | 5km run",
    duration: "18 weeks",
    level: "Intermediate",
    description: "Structured program with speed work and brick workouts. Ideal for those with some fitness background looking to race competitively.",
    highlights: [
      "Structured speed work and tempo sessions",
      "Brick workouts (bike-run combinations)",
      "4 distinct training phases",
      "Race-specific preparation"
    ],
    fileName: "sprint_18week.pdf"
  },
  {
    id: "sprint-24",
    title: "Sprint Triathlon: 24-Week Beginner-Friendly",
    distance: "750m swim | 20km bike | 5km run",
    duration: "24 weeks",
    level: "Beginner",
    description: "Extended timeline perfect for complete beginners with limited fitness. Allows gradual progression with more recovery weeks.",
    highlights: [
      "Most gradual progression available",
      "Extra recovery weeks built in",
      "Lower weekly time commitment (2-7 hours)",
      "Ideal for busy professionals"
    ],
    fileName: "sprint_24week.pdf"
  },
  {
    id: "half-ironman-8",
    title: "Half Ironman (70.3): 8-Week Plan",
    distance: "1.9km swim | 90km bike | 21.1km run",
    duration: "8 weeks",
    level: "Advanced",
    description: "Intensive 8-week program designed for athletes with sprint triathlon experience. Builds from 600m swim to 1.9km race distance.",
    highlights: [
      "Designed for sprint-experienced athletes",
      "Swim progression: 600m → 1,900m",
      "Integrated nutrition strategy",
      "Race-week taper included"
    ],
    fileName: "half_ironman_8week.pdf"
  },
  {
    id: "half-ironman-24",
    title: "Half Ironman (70.3): 6-Month Beginner",
    distance: "1.9km swim | 90km bike | 21.1km run",
    duration: "24 weeks",
    level: "Beginner",
    description: "Comprehensive 6-month program taking beginners from zero to half ironman ready. Includes gradual volume increases and recovery weeks.",
    highlights: [
      "Beginner-friendly progression",
      "6 distinct training phases",
      "Brick workouts and speed work",
      "7-8 hours per week at peak"
    ],
    fileName: "half_ironman_24week.pdf"
  }
];

export default function TrainingLibrary() {
  const { isAuthenticated } = useAuth();
  const [, navigate] = useLocation();

  if (!isAuthenticated) {
    navigate("/");
    return null;
  }

  const handleDownload = (plan: TrainingPlan) => {
    const pdfMap: Record<string, string> = {
      '5k-12': '/5k_12week.pdf',
      '5k-24': '/5k_24week.pdf',
      'half-marathon-12': '/half_marathon_12week.pdf',
      'half-marathon-24': '/half_marathon_24week.pdf',
      'sprint-12': '/sprint_12week.pdf',
      'sprint-18': '/sprint_18week.pdf',
      'sprint-24': '/sprint_24week.pdf',
      'half-ironman-8': '/half_ironman_8week.pdf',
      'half-ironman-24': '/half_ironman_24week.pdf'
    };

    const pdfPath = pdfMap[plan.id];
    if (pdfPath) {
      // Use simple direct download link approach
      const link = document.createElement('a');
      link.href = pdfPath;
      link.download = plan.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const runningPlans = trainingPlans.filter(p => p.id.includes('5k') || p.id.includes('half-marathon'));
  const sprintPlans = trainingPlans.filter(p => p.id.includes('sprint'));
  const halfIronmanPlans = trainingPlans.filter(p => p.id.includes('half-ironman') && !p.id.includes('half-marathon'));

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-16 space-generous">
        {/* Header */}
        <div className="space-y-4">
          <h1 className="text-5xl font-bold tracking-tight">Training Library</h1>
          <div className="divider-red" />
          <p className="text-lg text-muted-foreground">
            Choose a training program that matches your goals and experience level. All plans include weekly schedules, nutrition guidance, and injury prevention tips.
          </p>
        </div>

        {/* Running Programs */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold tracking-tight mb-8">Running Programs</h2>
          <p className="text-muted-foreground mb-8">Build your running fitness with structured programs for 5K and Half Marathon distances</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {runningPlans.map(plan => (
              <Card key={plan.id} className="card-strict flex flex-col">
                <div className="flex-1 space-y-4">
                  <div>
                    <h3 className="text-xl font-bold">{plan.title.split(':')[1].trim()}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{plan.distance}</p>
                    <p className="text-sm text-muted-foreground">{plan.duration}</p>
                  </div>
                  
                  <div className="inline-block px-3 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded">
                    {plan.level}
                  </div>

                  <p className="text-sm">{plan.description}</p>

                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-muted-foreground">Key Features:</p>
                    <ul className="text-xs space-y-1">
                      {plan.highlights.slice(0, 3).map((h, i) => (
                        <li key={i} className="flex gap-2">
                          <span className="text-red-600">•</span>
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <Button
                  onClick={() => handleDownload(plan)}
                  className="w-full mt-6 bg-red-600 hover:bg-red-700"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Plan
                </Button>
              </Card>
            ))}
          </div>
        </div>

        {/* Sprint Triathlon Programs */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold tracking-tight mb-8">Sprint Triathlon Programs</h2>
          <p className="text-muted-foreground mb-8">750m swim | 20km bike | 5km run</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sprintPlans.map(plan => (
              <Card key={plan.id} className="card-strict flex flex-col">
                <div className="flex-1 space-y-4">
                  <div>
                    <h3 className="text-xl font-bold">{plan.title.split(':')[1].trim()}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{plan.duration}</p>
                  </div>
                  
                  <div className="inline-block px-3 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded">
                    {plan.level}
                  </div>

                  <p className="text-sm">{plan.description}</p>

                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-muted-foreground">Key Features:</p>
                    <ul className="text-xs space-y-1">
                      {plan.highlights.slice(0, 3).map((h, i) => (
                        <li key={i} className="flex gap-2">
                          <span className="text-red-600">•</span>
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <Button
                  onClick={() => handleDownload(plan)}
                  className="w-full mt-6 bg-red-600 hover:bg-red-700"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Plan
                </Button>
              </Card>
            ))}
          </div>
        </div>

        {/* Half Ironman Programs */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold tracking-tight mb-8">Half Ironman (70.3) Programs</h2>
          <p className="text-muted-foreground mb-8">1.9km swim | 90km bike | 21.1km run</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {halfIronmanPlans.map(plan => (
              <Card key={plan.id} className="card-strict flex flex-col">
                <div className="flex-1 space-y-4">
                  <div>
                    <h3 className="text-xl font-bold">{plan.title.split(':')[1].trim()}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{plan.duration}</p>
                  </div>
                  
                  <div className="inline-block px-3 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded">
                    {plan.level}
                  </div>

                  <p className="text-sm">{plan.description}</p>

                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-muted-foreground">Key Features:</p>
                    <ul className="text-xs space-y-1">
                      {plan.highlights.slice(0, 3).map((h, i) => (
                        <li key={i} className="flex gap-2">
                          <span className="text-red-600">•</span>
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <Button
                  onClick={() => handleDownload(plan)}
                  className="w-full mt-6 bg-red-600 hover:bg-red-700"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Plan
                </Button>
              </Card>
            ))}
          </div>
        </div>

        {/* Training Tips Section */}
        <div className="mt-20 p-8 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-2xl font-bold mb-6">Training Tips for Success</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-bold mb-3 text-red-600">Pacing Guidelines</h4>
              <ul className="space-y-2 text-sm">
                <li><strong>Easy pace:</strong> Should be able to hold a conversation</li>
                <li><strong>Tempo pace:</strong> Comfortably hard, can speak in short sentences</li>
                <li><strong>Race pace:</strong> Hard effort, can only speak a few words</li>
                <li><strong>Hard pace:</strong> Maximum effort, cannot speak</li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-3 text-red-600">Recovery Essentials</h4>
              <ul className="space-y-2 text-sm">
                <li>• Sleep 7-9 hours per night</li>
                <li>• Take 1-2 complete rest days per week</li>
                <li>• Include easy/recovery sessions</li>
                <li>• Listen to your body and adjust as needed</li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-3 text-red-600">Injury Prevention</h4>
              <ul className="space-y-2 text-sm">
                <li>• Warm up 5-10 minutes before every session</li>
                <li>• Cool down 5-10 minutes after every session</li>
                <li>• Stretch 2-3x per week</li>
                <li>• Increase volume by no more than 10% per week</li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-3 text-red-600">Nutrition During Training</h4>
              <ul className="space-y-2 text-sm">
                <li>• Eat 2-3 hours before training</li>
                <li>• Hydrate with water or sports drink</li>
                <li>• For sessions over 60 min: 30-60g carbs/hour</li>
                <li>• Post-workout: Carbs + Protein within 30 min</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
