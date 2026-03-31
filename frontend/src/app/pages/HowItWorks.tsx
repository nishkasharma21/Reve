import { Link } from "react-router";
import { Button } from "../components/ui/button";
import { ArrowRight, Users, ShoppingBag, RefreshCw, Shield, Handshake, DollarSign } from "lucide-react";

export function HowItWorks() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-r from-purple-50 to-pink-50 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6">How Campus Closet Works</h1>
          <p className="text-xl text-gray-700">
            A simple, sustainable way to share fashion on your campus
          </p>
        </div>
      </section>

      {/* Main Steps */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-20">
          {/* For Renters */}
          <div>
            <h2 className="text-3xl font-bold mb-12 text-center">
              For Renters
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="text-center">
                <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <ShoppingBag size={32} className="text-purple-600" />
                </div>
                <h3 className="text-xl font-bold mb-3">1. Browse & Select</h3>
                <p className="text-gray-600">
                  Search through hundreds of items from students at your
                  university. Filter by size, style, and price.
                </p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Handshake size={32} className="text-purple-600" />
                </div>
                <h3 className="text-xl font-bold mb-3">2. Rent Item</h3>
                <p className="text-gray-600">
                  Pick your dates and send a rental request. Connect with the
                  owner to arrange pickup on campus.
                </p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <RefreshCw size={32} className="text-purple-600" />
                </div>
                <h3 className="text-xl font-bold mb-3">3. Wear & Return</h3>
                <p className="text-gray-600">
                  Rock your new outfit! When you're done, meet on campus to
                  return it to the owner.
                </p>
              </div>
            </div>
          </div>

          {/* For Lenders */}
          <div>
            <h2 className="text-3xl font-bold mb-12 text-center">
              For Lenders
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="text-center">
                <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users size={32} className="text-pink-600" />
                </div>
                <h3 className="text-xl font-bold mb-3">1. List Your Items</h3>
                <p className="text-gray-600">
                  Upload photos of clothes you want to rent out. Set your own
                  prices and availability.
                </p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Shield size={32} className="text-pink-600" />
                </div>
                <h3 className="text-xl font-bold mb-3">2. Approve Requests</h3>
                <p className="text-gray-600">
                  Review rental requests and approve the ones that work for you.
                  You're always in control.
                </p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <DollarSign size={32} className="text-pink-600" />
                </div>
                <h3 className="text-xl font-bold mb-3">3. Earn Money</h3>
                <p className="text-gray-600">
                  Get paid for items sitting in your closet! Turn your wardrobe
                  into a source of income.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Safety & Trust */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-12 text-center">
            Safety & Trust
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white rounded-lg p-6">
              <h3 className="font-bold text-lg mb-3">Campus-Only Community</h3>
              <p className="text-gray-600">
                Only verified students from your university can join, creating a
                trusted community you know and trust.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6">
              <h3 className="font-bold text-lg mb-3">Public Meetups</h3>
              <p className="text-gray-600">
                All pickups and returns happen on campus in public locations.
                Safety first, always.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6">
              <h3 className="font-bold text-lg mb-3">Rating System</h3>
              <p className="text-gray-600">
                Build trust through our rating system. Good behavior is rewarded
                with positive reviews.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6">
              <h3 className="font-bold text-lg mb-3">Damage Protection</h3>
              <p className="text-gray-600">
                Items are protected against damage. Renters are responsible for
                returning items in the same condition.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Simple, Fair Pricing</h2>
          <p className="text-xl text-gray-600 mb-8">
            Campus Closet takes a small 15% service fee to keep the platform
            running. Renters pay the daily rate set by the owner, plus any
            applicable fees.
          </p>
          <div className="bg-gray-50 rounded-lg p-8">
            <h3 className="font-bold text-xl mb-4">Example</h3>
            <div className="space-y-2 text-left max-w-sm mx-auto">
              <div className="flex justify-between">
                <span>Item price (3 days × $10/day)</span>
                <span className="font-medium">$30.00</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Service fee (15%)</span>
                <span>$4.50</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>$34.50</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-12 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6">
              <h3 className="font-bold mb-2">
                What if the item doesn't fit?
              </h3>
              <p className="text-gray-600">
                Check size guides and ask the owner questions before renting. If
                it doesn't fit upon pickup, you can cancel the rental.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6">
              <h3 className="font-bold mb-2">
                What happens if I damage an item?
              </h3>
              <p className="text-gray-600">
                Renters are responsible for items during the rental period.
                Report any damage immediately and work with the owner to resolve
                it.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6">
              <h3 className="font-bold mb-2">How do I get paid as a lender?</h3>
              <p className="text-gray-600">
                Payments are processed automatically after successful rentals.
                Funds are transferred to your account within 2-3 business days.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6">
              <h3 className="font-bold mb-2">
                Can I rent to students from other universities?
              </h3>
              <p className="text-gray-600">
                Currently, Campus Closet is campus-specific to ensure safety and
                convenience for all users.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
        <p className="text-xl text-gray-600 mb-8">
          Join the sustainable fashion movement on your campus today
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link to="/browse">
            <Button size="lg" className="text-lg px-8">
              Browse Closets
              <ArrowRight className="ml-2" size={20} />
            </Button>
          </Link>
          <Link to="/upload">
            <Button size="lg" variant="outline" className="text-lg px-8">
              List Your Items
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
