import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Button } from "../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { User, MapPin, Mail, Edit, Package, Heart, Clock } from "lucide-react";
import { mockItems } from "../data/mockData";

export function Profile() {
  const [activeTab, setActiveTab] = useState("listed");

  // Mock user data
//   const user = {
//     name: "Sarah M.",
//     email: "sarah.m@ucla.edu",
//     university: "UCLA",
//     joinDate: "January 2026",
//     itemsListed: 5,
//     itemsRented: 12,
//     rating: 4.8,
//   };

  interface User {
    firstName: string;
    lastName: string;
    email: string;
    joinDate: string;
  }

  const [user, setUser] = useState<User | null>(null);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetch(`${API_URL}/api/profile`, { credentials: "include" }) // important to send cookies
      .then(res => {
        if (!res.ok) throw new Error("Not authenticated");
        return res.json();
      })
      .then(data => setUser(data))
      .catch(console.error);
  }, []);


  if (!user) return <div>Loading...</div>;

  const formattedJoinDate = new Date(user.joinDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const listedItems = mockItems.filter((item) => item.owner === user.firstName);
  const savedItems = mockItems.slice(3, 7);
  const rentedItems = mockItems.slice(7, 10);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <aside className="lg:col-span-1">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-3xl font-bold">
                  {user.firstName.charAt(0)}
                </div>
                <h2 className="text-xl font-bold mb-1">{user.firstName + " " + user.lastName}</h2>
                <p className="text-sm text-gray-600 flex items-center justify-center gap-1">
                  <MapPin size={14} />
                  {"Stanford"}
                </p>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-sm">
                  <Mail size={16} className="text-gray-400" />
                  <span className="text-gray-600">{user.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock size={16} className="text-gray-400" />
                  <span className="text-gray-600">Joined {formattedJoinDate}</span>
                </div>
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Items Listed</span>
                  <span className="font-bold">{"Temp"}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Items Rented</span>
                  <span className="font-bold">{"Temp"}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Rating</span>
                  <span className="font-bold">⭐ {"Temp"}</span>
                </div>
              </div>

              <Button variant="outline" className="w-full mt-6">
                <Edit size={16} className="mr-2" />
                Edit Profile
              </Button>
            </CardContent>
          </Card>
        </aside>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <h1 className="text-4xl font-bold mb-8">My Closet</h1>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="listed">
                <Package size={16} className="mr-2" />
                Listed ({listedItems.length})
              </TabsTrigger>
              <TabsTrigger value="rented">
                <User size={16} className="mr-2" />
                Rented ({rentedItems.length})
              </TabsTrigger>
              <TabsTrigger value="saved">
                <Heart size={16} className="mr-2" />
                Saved ({savedItems.length})
              </TabsTrigger>
            </TabsList>

            {/* Listed Items */}
            <TabsContent value="listed">
              {listedItems.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Package size={48} className="mx-auto text-gray-400 mb-4" />
                    <h3 className="text-xl font-bold mb-2">No items listed yet</h3>
                    <p className="text-gray-600 mb-6">
                      Start earning by listing items from your closet
                    </p>
                    <Link to="/upload">
                      <Button>List Your First Item</Button>
                    </Link>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {listedItems.map((item) => (
                    <Card key={item.id}>
                      <CardContent className="p-4">
                        <div className="flex gap-4">
                          <div className="w-24 h-32 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h3 className="font-bold mb-1">{item.name}</h3>
                                <p className="text-sm text-gray-600">
                                  Size {item.size}
                                </p>
                              </div>
                              <Badge variant="secondary">Active</Badge>
                            </div>
                            <p className="font-bold mb-3">${item.price}/day</p>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" className="flex-1">
                                Edit
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="flex-1"
                              >
                                Manage
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Rented Items */}
            <TabsContent value="rented">
              {rentedItems.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <User size={48} className="mx-auto text-gray-400 mb-4" />
                    <h3 className="text-xl font-bold mb-2">No active rentals</h3>
                    <p className="text-gray-600 mb-6">
                      Browse items to find your next outfit
                    </p>
                    <Link to="/browse">
                      <Button>Start Browsing</Button>
                    </Link>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {rentedItems.map((item) => (
                    <Card key={item.id}>
                      <CardContent className="p-4">
                        <div className="flex gap-4">
                          <div className="w-24 h-32 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold mb-1">{item.name}</h3>
                            <p className="text-sm text-gray-600 mb-2">
                              Rented from {item.owner}
                            </p>
                            <Badge className="mb-3">Due: Mar 15, 2026</Badge>
                            <div className="flex gap-2">
                              <Button size="sm" className="flex-1">
                                Contact Owner
                              </Button>
                              <Button size="sm" variant="outline" className="flex-1">
                                Extend Rental
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Saved Items */}
            <TabsContent value="saved">
              {savedItems.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Heart size={48} className="mx-auto text-gray-400 mb-4" />
                    <h3 className="text-xl font-bold mb-2">No saved items</h3>
                    <p className="text-gray-600 mb-6">
                      Save items you love for later
                    </p>
                    <Link to="/browse">
                      <Button>Start Browsing</Button>
                    </Link>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  {savedItems.map((item) => (
                    <Link
                      key={item.id}
                      to={`/item/${item.id}`}
                      className="group cursor-pointer"
                    >
                      <div className="aspect-[3/4] bg-white rounded-lg overflow-hidden mb-3 border border-gray-200 relative">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <button className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-lg">
                          <Heart size={16} className="fill-red-500 text-red-500" />
                        </button>
                      </div>
                      <h3 className="font-medium mb-1 group-hover:underline">
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-1">{item.owner}</p>
                      <p className="font-bold">${item.price}/day</p>
                    </Link>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
