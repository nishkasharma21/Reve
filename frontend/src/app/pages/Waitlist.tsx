import { useState } from "react";
import { Link } from "react-router";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { CheckCircle, Sparkles, Users, Building2, Calendar, TrendingUp, Instagram, Heart } from "lucide-react";

export function Waitlist() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      // Here you would normally send to backend/API
      console.log("Waitlist signup:", email);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="max-w-3xl">
            <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
              Your closet.
              <br />
              <span className="text-gray-400">Your campus.</span>
            </h1>
            
            <p className="text-xl text-gray-300 mb-12 max-w-2xl">
              We're just finishing touches on a clothing sharing platform that will forever change how students discover looks and borrow from each other's wardrobes.
            </p>

            {/* Email Form */}
            {!submitted ? (
              <form onSubmit={handleSubmit} className="mb-12">
                <div className="flex flex-col sm:flex-row gap-4 max-w-xl">
                  <Input
                    type="email"
                    placeholder="Enter your @college.edu email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="flex-1 bg-white text-black px-6 py-6 text-base"
                  />
                  <Button
                    type="submit"
                    size="lg"
                    className="bg-white text-black hover:bg-gray-100 px-8 py-6 text-base font-semibold whitespace-nowrap"
                  >
                    Join Waitlist
                  </Button>
                </div>
              </form>
            ) : (
              <div className="bg-white text-black p-8 rounded-lg max-w-xl mb-12">
                <div className="flex items-start gap-4">
                  <CheckCircle className="text-green-600 flex-shrink-0" size={28} />
                  <div>
                    <h3 className="font-bold text-xl mb-2">You're on the list!</h3>
                    <p className="text-gray-600">
                      We'll notify you at <strong>{email}</strong> when Campus Closet launches.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 max-w-2xl">
              <div>
                <div className="text-4xl font-bold mb-1">2.5k+</div>
                <div className="text-sm text-gray-400 uppercase tracking-wide">Members</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-1">12</div>
                <div className="text-sm text-gray-400 uppercase tracking-wide">Universities</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-1">Spring 2025</div>
                <div className="text-sm text-gray-400 uppercase tracking-wide">Launching</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Borrow. Share. Discover. */}
      <div className="bg-gray-900 text-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl lg:text-6xl font-bold mb-6">
            Borrow. Share. Discover.
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Turn your closet into a social experience and thrive on a grid of outfit options again.
          </p>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 text-sm uppercase tracking-widest mb-4 text-gray-500">
              <Sparkles size={16} />
              <span>How It Works</span>
            </div>
            <h2 className="text-4xl font-bold mb-4">Everything you need to be the fashion icon you are.</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Step 1 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                1
              </div>
              <h3 className="text-xl font-bold mb-3">Borrow from Your Campus</h3>
              <p className="text-gray-600">
                Borrow the item (yes it's your choice). Today, tomorrow, and forever you can share and select.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                2
              </div>
              <h3 className="text-xl font-bold mb-3">AI Outfit Discovery</h3>
              <p className="text-gray-600">
                Get personalized recommendations based on your style, vibe, and what's trending on campus.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                3
              </div>
              <h3 className="text-xl font-bold mb-3">Build Your Digital Closet</h3>
              <p className="text-gray-600">
                Post your fits, pay your loans, and tally up whining your own vault on Campus.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="bg-gray-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-black text-white p-12 rounded-lg aspect-square flex flex-col justify-end">
              <h3 className="text-2xl font-bold">Make Your Fits Matter</h3>
            </div>

            {/* Card 2 */}
            <div className="bg-black text-white p-12 rounded-lg aspect-square flex flex-col justify-end">
              <h3 className="text-2xl font-bold">Discover Trends</h3>
            </div>

            {/* Card 3 */}
            <div className="bg-black text-white p-12 rounded-lg aspect-square flex flex-col justify-end">
              <h3 className="text-2xl font-bold">Expand Your Closet</h3>
            </div>
          </div>
        </div>
      </div>

      {/* More than just borrowing */}
      <div className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 text-sm uppercase tracking-widest mb-4 text-gray-500">
              <Heart size={16} />
              <span>Why We Built This</span>
            </div>
            <h2 className="text-4xl font-bold mb-6">
              More than just borrowing clothes
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              REVE is where fashion meets community. Meet{" "}
              <span className="font-semibold">new connections</span>, we're truly changing fashion sense that matters to an entire campus wardrobe. Rent, borrow, and borrowers. Add outfits, styling quality and build a money exchange, everywhere.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            {/* Feature 1 */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="text-black" size={24} />
                <h3 className="text-xl font-bold">Earn While You Share</h3>
              </div>
              <p className="text-gray-600">
                List items in your closet, rent them out, and a make extra cash. Your wardrobe becomes your side hustle.
              </p>
            </div>

            {/* Feature 2 */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Instagram className="text-black" size={24} />
                <h3 className="text-xl font-bold">Social Fashion Feed</h3>
              </div>
              <p className="text-gray-600">
                See what the fits people are rocking and steal inspire from your campus influencers with a single tap.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="bg-black text-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl lg:text-6xl font-bold mb-6">
            Ready to revolutionize
            <br />
            <span className="text-gray-400">your campus closet?</span>
          </h2>
          <p className="text-xl text-gray-300 mb-12">
            Join 2,500+ college students already on the waitlist
          </p>
          {!submitted ? (
            <form onSubmit={handleSubmit} className="max-w-xl mx-auto">
              <div className="flex flex-col sm:flex-row gap-4">
                <Input
                  type="email"
                  placeholder="Enter your @college.edu email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1 bg-white text-black px-6 py-6 text-base"
                />
                <Button
                  type="submit"
                  size="lg"
                  className="bg-white text-black hover:bg-gray-100 px-8 py-6 text-base font-semibold whitespace-nowrap"
                >
                  Join the Waitlist
                </Button>
              </div>
            </form>
          ) : (
            <div className="bg-white text-black p-8 rounded-lg max-w-xl mx-auto">
              <div className="flex items-center justify-center gap-4">
                <CheckCircle className="text-green-600" size={32} />
                <div className="text-left">
                  <h3 className="font-bold text-xl mb-1">Welcome to Campus Closet!</h3>
                  <p className="text-gray-600">We'll see you in Spring 2025.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}