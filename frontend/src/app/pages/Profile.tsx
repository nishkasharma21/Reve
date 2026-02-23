import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router";
import { Button } from "../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { User, MapPin, Mail, Edit, Package, Clock, Inbox, PlusCircle } from "lucide-react";
import { mockItems } from "../data/mockData";

export function Profile() {
  const [activeTab, setActiveTab] = useState("listed");
  const [user, setUser] = useState<any>(null); // Change from User | null
  const [items, setItems] = useState<any[]>([]); // New state for DB items
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL;

  interface UserProfile {
    firstName: string;
    lastName: string;
    email: string;
    joinDate: string;
  }

  interface BorrowRequest {
    id: number;
    item_id: number;
    item_name: string;
    borrower_id: number;
    borrower_name: string;
    status: 'pending' | 'approved' | 'rejected' | 'completed' | 'cancelled';
    start_date: string | null;
    end_date: string | null;
    created_at: string;
  }

  interface Requests {
    incoming: BorrowRequest[];
    outgoing: BorrowRequest[];
  }

  const STATUS_COLORS: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    completed: 'bg-blue-100 text-blue-800',
    cancelled: 'bg-gray-100 text-gray-600',
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await fetch(`${API_URL}/api/profile`, { credentials: "include" });
        if (!userRes.ok) throw new Error("Not authenticated");
        const userData = await userRes.json();
        setUser(userData);

        // Changed from /api/items to /api/my-items
        const itemsRes = await fetch(`${API_URL}/api/my-items`, { credentials: "include" });
        const itemsData = await itemsRes.json();
        setItems(itemsData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [API_URL]);

  const listedItems = items;
  
  const savedItems: any[] = []; // Set to empty until backend feature is ready
  
  const STATUS_FILTERS = ['all', 'pending', 'approved', 'rejected', 'completed', 'cancelled'];
  const [requests, setRequests] = useState<Requests>({ incoming: [], outgoing: [] });
  const [requestView, setRequestView] = useState<'incoming' | 'outgoing'>('incoming');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetch(`${API_URL}/api/profile`, { credentials: "include" })
      .then(res => { if (!res.ok) throw new Error("Not authenticated"); return res.json(); })
      .then(data => setUser(data))
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (activeTab === 'requests') {
      fetch(`${API_URL}/api/borrow-requests`, { credentials: "include" })
        .then(res => res.json())
        .then(data => setRequests(data))
        .catch(console.error);
    }
  }, [activeTab]);

  const updateRequestStatus = async (requestId: number, status: string) => {
    try {
      const res = await fetch(`${API_URL}/api/borrow-requests/${requestId}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        // Refresh requests after update
        const updated = await fetch(`${API_URL}/api/borrow-requests`, { credentials: "include" });
        const data = await updated.json();
        setRequests(data);
      }
    } catch (err) {
      console.error('Failed to update request:', err);
    }
  };

  if (!user) return <div>Loading...</div>;

  const formattedJoinDate = new Date(user.joinDate).toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric",
  });

  const rentedItems = mockItems.slice(7, 10);

  const displayedRequests = (requestView === 'incoming' ? requests.incoming : requests.outgoing)
    .filter(r => statusFilter === 'all' || r.status === statusFilter);

  const totalRequests = requests.incoming.length + requests.outgoing.length;

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
                  <MapPin size={14} />Stanford
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
                  <span className="font-bold">{listedItems.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Items Rented</span>
                  <span className="font-bold">Temp</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Rating</span>
                  <span className="font-bold">⭐ Temp</span>
                </div>
              </div>
              <Button variant="outline" className="w-full mt-6">
                <Edit size={16} className="mr-2" />Edit Profile
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
              <TabsTrigger value="requests">
                <Inbox size={16} className="mr-2" />
                Requests ({totalRequests})
              </TabsTrigger>
            </TabsList>

            {/* Listed Items */}
            <TabsContent value="listed">
              {/* Add Item Button - always visible at top */}
              <div className="mb-6">
                <Link to="/upload" className="block">
                  <Button className="w-full">
                    <PlusCircle size={16} className="mr-2" />
                    Add New Item
                  </Button>
                </Link>
              </div>
              {listedItems.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Package size={48} className="mx-auto text-gray-400 mb-4" />
                    <h3 className="text-xl font-bold mb-2">No items listed yet</h3>
                    <p className="text-gray-600 mb-6">Start earning by listing items from your closet</p>
                    <Link to="/upload"><Button>List Your First Item</Button></Link>
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
                              src={item.images?.[0]}
                              alt={item.item_name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h3 className="font-bold mb-1">{item.name}</h3>
                                <p className="text-sm text-gray-600">Size {item.size}</p>
                              </div>
                              <Badge variant="secondary">Active</Badge>
                            </div>
                            <p className="font-bold mb-3">${item.price_per_day}/day</p>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" className="flex-1">Edit</Button>
                              <Button size="sm" variant="outline" className="flex-1">Manage</Button>
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
                    <p className="text-gray-600 mb-6">Browse items to find your next outfit</p>
                    <Link to="/browse"><Button>Start Browsing</Button></Link>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {rentedItems.map((item) => (
                    <Card key={item.id}>
                      <CardContent className="p-4">
                        <div className="flex gap-4">
                          <div className="w-24 h-32 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold mb-1">{item.name}</h3>
                            <p className="text-sm text-gray-600 mb-2">Rented from {item.owner}</p>
                            <Badge className="mb-3">Due: Mar 15, 2026</Badge>
                            <div className="flex gap-2">
                              <Button size="sm" className="flex-1">Contact Owner</Button>
                              <Button size="sm" variant="outline" className="flex-1">Extend Rental</Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Requests Tab */}
            <TabsContent value="requests">
              {/* Incoming / Outgoing toggle */}
              <div className="flex gap-2 mb-4">
                <Button
                  size="sm"
                  variant={requestView === 'incoming' ? 'default' : 'outline'}
                  onClick={() => setRequestView('incoming')}
                >
                  Incoming ({requests.incoming.length})
                </Button>
                <Button
                  size="sm"
                  variant={requestView === 'outgoing' ? 'default' : 'outline'}
                  onClick={() => setRequestView('outgoing')}
                >
                  Outgoing ({requests.outgoing.length})
                </Button>
              </div>

              {/* Status filter */}
              <div className="flex gap-2 flex-wrap mb-6">
                {STATUS_FILTERS.map(s => (
                  <button
                    key={s}
                    onClick={() => setStatusFilter(s)}
                    className={`px-3 py-1 rounded-full text-xs font-medium capitalize border transition-colors
                      ${statusFilter === s ? 'bg-black text-white border-black' : 'border-gray-300 text-gray-600 hover:border-gray-500'}`}
                  >
                    {s}
                  </button>
                ))}
              </div>

              {displayedRequests.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Inbox size={48} className="mx-auto text-gray-400 mb-4" />
                    <h3 className="text-xl font-bold mb-2">No requests</h3>
                    <p className="text-gray-600">
                      {requestView === 'incoming'
                        ? 'No one has requested to borrow your items yet'
                        : "You haven't sent any borrow requests yet"}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {displayedRequests.map((req) => (
                    <Card key={req.id}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-bold mb-1">{req.item_name}</h3>
                            {requestView === 'incoming' && (
                              <p className="text-sm text-gray-600 mb-1">From: {req.borrower_name}</p>
                            )}
                            {req.start_date && req.end_date && (
                              <p className="text-sm text-gray-600 mb-2">
                                {new Date(req.start_date).toLocaleDateString()} → {new Date(req.end_date).toLocaleDateString()}
                              </p>
                            )}
                            <span className={`text-xs font-medium px-2 py-1 rounded-full capitalize ${STATUS_COLORS[req.status]}`}>
                              {req.status}
                            </span>
                          </div>

                          {/* Actions */}
                          <div className="flex gap-2 mt-1">
                            {requestView === 'incoming' && req.status === 'pending' && (
                              <>
                                <Button size="sm" onClick={() => updateRequestStatus(req.id, 'approved')}>
                                  Approve
                                </Button>
                                <Button size="sm" variant="outline" onClick={() => updateRequestStatus(req.id, 'rejected')}>
                                  Reject
                                </Button>
                              </>
                            )}
                            {requestView === 'incoming' && req.status === 'approved' && (
                              <Button size="sm" onClick={() => updateRequestStatus(req.id, 'completed')}>
                                Mark Completed
                              </Button>
                            )}
                            {requestView === 'outgoing' && req.status === 'pending' && (
                              <Button size="sm" variant="outline" onClick={() => updateRequestStatus(req.id, 'cancelled')}>
                                Cancel
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
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
