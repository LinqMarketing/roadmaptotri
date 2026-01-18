import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import { useState, useEffect } from "react";
import ErrorBoundary from "./components/ErrorBoundary";
import Navigation from "./components/Navigation";
import PhoneNumberCapture from "./components/PhoneNumberCapture";
import ProfileCompletionPrompt from "./components/ProfileCompletionPrompt";
import { ThemeProvider } from "./contexts/ThemeContext";
import { useAuth } from "./_core/hooks/useAuth";
import { trpc } from "./lib/trpc";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import MealLogging from "./pages/MealLogging";
import TrainingLogger from "./pages/TrainingLogger";
import SupplementTracking from "./pages/SupplementTracking";
import TrainingLibrary from "./pages/TrainingLibrary";
import MyMission from "./pages/MyMission";

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/dashboard"} component={Dashboard} />
      <Route path={"/meals"} component={MealLogging} />
      <Route path={"/training"} component={TrainingLogger} />
      <Route path={"/supplements"} component={SupplementTracking} />
      <Route path={"/training-library"} component={TrainingLibrary} />
      <Route path={"/my-mission"} component={MyMission} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function AppContent() {
  const { user, isAuthenticated } = useAuth();
  const [showPhoneCapture, setShowPhoneCapture] = useState(false);
  const [showProfileCompletion, setShowProfileCompletion] = useState(false);
  const utils = trpc.useUtils();

  useEffect(() => {
    // Show phone number capture if user is authenticated but doesn't have a phone number
    if (isAuthenticated && user && !user.phoneNumber) {
      setShowPhoneCapture(true);
    } else {
      setShowPhoneCapture(false);
    }

    // Show profile completion prompt if user has phone number but no first/last name
    if (isAuthenticated && user && user.phoneNumber && (!user.firstName || !user.lastName)) {
      setShowProfileCompletion(true);
    } else {
      setShowProfileCompletion(false);
    }
  }, [isAuthenticated, user]);

  const handlePhoneNumberComplete = () => {
    setShowPhoneCapture(false);
    // Refresh user data
    utils.auth.me.invalidate();
  };

  const handleProfileCompletionComplete = () => {
    setShowProfileCompletion(false);
    // Refresh user data
    utils.auth.me.invalidate();
  };

  return (
    <>
      <Navigation />
      <Router />
      {showPhoneCapture && user && (
        <PhoneNumberCapture
          onComplete={handlePhoneNumberComplete}
          userName={user.name || undefined}
        />
      )}
      {showProfileCompletion && user && (
        <ProfileCompletionPrompt
          onComplete={handleProfileCompletionComplete}
          userName={user.name || undefined}
        />
      )}
    </>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <AppContent />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
