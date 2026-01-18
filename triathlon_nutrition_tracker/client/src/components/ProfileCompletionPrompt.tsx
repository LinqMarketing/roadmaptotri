import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";

interface ProfileCompletionPromptProps {
  onComplete: () => void;
  userName?: string;
}

export default function ProfileCompletionPrompt({ onComplete, userName }: ProfileCompletionPromptProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const firstNameInputRef = useRef<HTMLInputElement>(null);

  const updatePhoneNumber = trpc.auth.updatePhoneNumber.useMutation({
    onSuccess: () => {
      onComplete();
    },
    onError: (err) => {
      setError(err.message || "Failed to save information");
      setIsLoading(false);
    },
  });

  // Auto-focus first name input on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      if (firstNameInputRef.current) {
        firstNameInputRef.current.focus();
      }
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFirstName(e.target.value);
  };

  const handleLastNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLastName(e.target.value);
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhoneNumber(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    // Validate name fields
    const trimmedFirstName = firstName.trim();
    const trimmedLastName = lastName.trim();

    if (!trimmedFirstName) {
      setError("Please enter your first name");
      firstNameInputRef.current?.focus();
      return;
    }
    if (!trimmedLastName) {
      setError("Please enter your last name");
      return;
    }

    setIsLoading(true);
    updatePhoneNumber.mutate({
      firstName: trimmedFirstName,
      lastName: trimmedLastName,
      phoneNumber: phoneNumber.trim(),
    });
  };

  const handleSkip = () => {
    onComplete();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md p-8 space-y-6 bg-white shadow-lg">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-black">Complete Your Profile</h2>
          <p className="text-gray-600 text-sm">
            {userName ? `Welcome back, ${userName}!` : "Welcome!"} Help us personalize your experience by sharing your name.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label htmlFor="firstName" className="text-sm font-medium text-black">
                First Name
              </label>
              <input
                ref={firstNameInputRef}
                id="firstName"
                type="text"
                placeholder="Pedro"
                value={firstName}
                onChange={handleFirstNameChange}
                disabled={isLoading}
                autoComplete="given-name"
                className="w-full px-3 py-2 text-base text-black bg-white border-2 border-gray-300 rounded-md placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="lastName" className="text-sm font-medium text-black">
                Last Name
              </label>
              <input
                id="lastName"
                type="text"
                placeholder="Irizarry"
                value={lastName}
                onChange={handleLastNameChange}
                disabled={isLoading}
                autoComplete="family-name"
                className="w-full px-3 py-2 text-base text-black bg-white border-2 border-gray-300 rounded-md placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="phoneNumber" className="text-sm font-medium text-black">
              Phone Number (Optional)
            </label>
            <input
              id="phoneNumber"
              type="tel"
              placeholder="646-470-5889"
              value={phoneNumber}
              onChange={handlePhoneNumberChange}
              disabled={isLoading}
              autoComplete="tel"
              className="w-full px-3 py-2 text-base text-black bg-white border-2 border-gray-300 rounded-md placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            />
          </div>

          <p className="text-xs text-gray-500">
            We'll use your name to personalize your dashboard greeting and training experience.
          </p>

          {error && (
            <div className="p-3 bg-red-50 text-red-700 text-sm rounded border border-red-200">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <Button
              type="submit"
              className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium"
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Complete Profile"}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={handleSkip}
              disabled={isLoading}
            >
              Skip for Now
            </Button>
          </div>

          <p className="text-xs text-center text-gray-500">
            You can update your name anytime in your profile settings.
          </p>
        </form>
      </Card>
    </div>
  );
}
