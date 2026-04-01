import { useSearchParams, Link } from "react-router";
import { Button } from "../components/ui/button";

export function StripeReturn() {
  const [searchParams] = useSearchParams();
  const status = searchParams.get("status");

  if (status === "success") {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center">
        <div className="text-5xl mb-6">✓</div>
        <h1 className="text-2xl font-bold mb-3">Payout account connected</h1>
        <p className="text-gray-600 mb-8">
          You're all set. Rental payments will be transferred to your bank account after pickup is confirmed.
        </p>
        <Button asChild><Link to="/profile">Back to Profile</Link></Button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-24 text-center">
      <div className="text-5xl mb-6">↺</div>
      <h1 className="text-2xl font-bold mb-3">Onboarding incomplete</h1>
      <p className="text-gray-600 mb-8">
        It looks like you didn't finish setting up your payout account. You can complete it from your profile.
      </p>
      <Button asChild><Link to="/profile">Back to Profile</Link></Button>
    </div>
  );
}
