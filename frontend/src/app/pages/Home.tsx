import { Link } from "react-router";
import { Button } from "../components/ui/button";
import { ArrowRight } from "lucide-react";
import { mockItems } from "../data/mockData";

export function Home() {
  const featuredItems = mockItems.slice(0, 8);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[600px] bg-gradient-to-r from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center max-w-3xl px-4">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Your Campus Wardrobe,
            <br />
            Shared & Sustainable
          </h1>
          <p className="text-xl mb-8 text-gray-700">
            Rent trendy clothes from fellow students. Save money, reduce waste,
            and always have something fresh to wear.
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
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              1
            </div>
            <h3 className="text-xl font-bold mb-2">Browse</h3>
            <p className="text-gray-600">
              Explore closets from students at your university
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              2
            </div>
            <h3 className="text-xl font-bold mb-2">Rent</h3>
            <p className="text-gray-600">
              Pick your items and rent for days or weeks
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              3
            </div>
            <h3 className="text-xl font-bold mb-2">Return</h3>
            <p className="text-gray-600">
              Meet on campus to pick up and return items safely
            </p>
          </div>
        </div>
      </section>

      {/* Featured Items */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold">Trending Now</h2>
            <Link to="/browse">
              <Button variant="outline">
                View All
                <ArrowRight className="ml-2" size={16} />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {featuredItems.map((item) => (
              <Link
                key={item.id}
                to={`/item/${item.id}`}
                className="group cursor-pointer"
              >
                <div className="aspect-[3/4] bg-white rounded-lg overflow-hidden mb-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h3 className="font-medium mb-1 group-hover:underline">
                  {item.name}
                </h3>
                <p className="text-sm text-gray-600 mb-1">{item.owner}</p>
                <p className="font-bold">${item.price}/day</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12">
          Why Campus Closet?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <div className="text-4xl mb-4">💰</div>
            <h3 className="text-xl font-bold mb-2">Save Money</h3>
            <p className="text-gray-600">
              Rent instead of buying. Perfect for events, parties, or trying new
              styles.
            </p>
          </div>
          <div className="text-center p-6">
            <div className="text-4xl mb-4">🌍</div>
            <h3 className="text-xl font-bold mb-2">Sustainable</h3>
            <p className="text-gray-600">
              Reduce fashion waste by sharing clothes within your campus
              community.
            </p>
          </div>
          <div className="text-center p-6">
            <div className="text-4xl mb-4">👥</div>
            <h3 className="text-xl font-bold mb-2">Community</h3>
            <p className="text-gray-600">
              Connect with fellow students and build a sustainable campus
              culture.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-black text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Refresh Your Wardrobe?
          </h2>
          <p className="text-xl mb-8 text-gray-300">
            Join hundreds of students already sharing their style on campus.
          </p>
          <Link to="/browse">
            <Button size="lg" variant="secondary" className="text-lg px-8">
              Start Browsing
              <ArrowRight className="ml-2" size={20} />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
