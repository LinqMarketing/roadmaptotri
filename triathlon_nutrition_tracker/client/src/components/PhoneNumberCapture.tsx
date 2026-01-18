import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";

interface PhoneNumberCaptureProps {
  onComplete: () => void;
  userName?: string;
}

export default function PhoneNumberCapture({ onComplete, userName }: PhoneNumberCaptureProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const updatePhoneNumber = trpc.auth.updatePhoneNumber.useMutation({
    onSuccess: () => {
      onComplete();
    },
    onError: (err) => {
      setError(err.message || "Failed to save information");
      setIsLoading(false);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate name fields
    if (!firstName.trim()) {
      setError("Please enter your first name");
      return;
    }
    if (!lastName.trim()) {
      setError("Please enter your last name");
      return;
    }

    // Basic validation for phone
    const cleanedPhone = phoneNumber.replace(/\D/g, "");
    if (cleanedPhone.length < 10) {
      setError("Please enter a valid phone number (at least 10 digits)");
      return;
    }

    setIsLoading(true);
    updatePhoneNumber.mutate({ 
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      phoneNumber: cleanedPhone 
    });
  };

  const formatPhoneNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length <= 3) return cleaned;
    if (cleaned.length <= 6) return `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md p-8 space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Complete Your Profile</h2>
          <p className="text-muted-foreground">
            {userName ? `Welcome, ${userName}!` : "Welcome!"} Let's get to know you better so we can personalize your experience.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label htmlFor="firstName" className="text-sm font-medium">
                First Name
              </label>
              <Input
                id="firstName"
                type="text"
                placeholder="Pedro"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="lastName" className="text-sm font-medium">
                Last Name
              </label>
              <Input
                id="lastName"
                type="text"
                placeholder="Irizarry"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="phone" className="text-sm font-medium">
              Phone Number
            </label>
            <Input
              id="phone"
              type="tel"
              placeholder="(555) 123-4567"
              value={formatPhoneNumber(phoneNumber)}
              onChange={(e) => setPhoneNumber(e.target.value)}
              disabled={isLoading}
              className="text-lg"
            />
            <p className="text-xs text-muted-foreground">
              Used for: Daily motivational quotes, workout reminders, and community updates
            </p>
          </div>

          {error && (
            <div className="p-3 bg-red-50 text-red-700 text-sm rounded border border-red-200">
              {error}
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700"
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Continue"}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            Your information is secure and will only be used as described above.
          </p>
        </form>
      </Card>
    </div>
  );
}
