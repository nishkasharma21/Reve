import { useState, useEffect, useRef } from "react";
import { Link, useSearchParams } from "react-router";
import { Button } from "../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import {
  MapPin, Mail, Edit, Package, Clock, Inbox, PlusCircle,
  ArrowDownToLine, CalendarOff
} from "lucide-react";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { UnavailabilityCalendar, Block, toDate, isItemAvailableFromBlocks } from "./unavailabilitycalendar";

const API_URL = import.meta.env.VITE_API_URL;

const STATUS_COLORS: Record<string, string> = {
  pending_pickup: "bg-yellow-100 text-yellow-800",
  in_use:         "bg-green-100 text-green-800",
  returned:       "bg-blue-100 text-blue-800",
  cancelled:      "bg-gray-100 text-gray-600",
};

const STATUS_FILTERS = ["all", "pending_pickup", "in_use", "returned", "cancelled"];

interface Rental {
  id: number;
  item_id: number;
  item_name: string;
  item_image: string | null;
  status: "pending_pickup" | "in_use" | "returned" | "cancelled";
  pickup_code?: string;
  return_code?: string;
  start_date: string | null;
  end_date: string | null;
  created_at: string;
  owner_name?: string;
  borrower_name?: string;
}

// ─── Profile ──────────────────────────────────────────────────────────────────

export function Profile() {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "listed");
  const [user,    setUser]    = useState<any>(null);
  const [items,   setItems]   = useState<any[]>([]);
  const [rentals, setRentals] = useState<{ borrowed: Rental[]; lent: Rental[] }>({ borrowed: [], lent: [] });
  const [borrowedStatusFilter, setBorrowedStatusFilter] = useState("all");
  const [lentStatusFilter,     setLentStatusFilter]     = useState("all");

  const [manageOpenFor, setManageOpenFor] = useState<number | null>(null);
  const [blocksByItem, setBlocksByItem] = useState<Record<number, Block[]>>({});
  const [rentalsByItem, setRentalsByItem] = useState<Record<number, RentalRange[]>>({});

  const [pickupInput, setPickupInput] = useState<Record<number, string>>({});
  const [pickupError, setPickupError] = useState<Record<number, string>>({});
  const [returnInput, setReturnInput] = useState<Record<number, string>>({});
  const [returnError, setReturnError] = useState<Record<number, string>>({});

  const fetchRentals = async () => {
    try {
      const res = await fetch(`${API_URL}/api/rentals`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch rentals");
      setRentals(await res.json());
    } catch (err) { console.error(err); }
  };

  const refreshItems = async () => {
    try {
      const res = await fetch(`${API_URL}/api/my-items`, { credentials: "include" });
      if (!res.ok) return;
      setItems(await res.json());
    } catch (err) { console.error(err); }
  };

  const fetchBlocksForItem = async (itemId: number) => {
    try {
      const res  = await fetch(`${API_URL}/api/items/${itemId}`, { credentials: "include" });
      const data = await res.json();
      setBlocksByItem(prev => ({ ...prev, [itemId]: data.unavailability_blocks || [] }));
      setRentalsByItem(prev => ({ ...prev, [itemId]: data.active_rentals || [] }));
    } catch (err) { console.error(err); }
  };

  const openManage = async (itemId: number) => {
    setManageOpenFor(itemId);
    await fetchBlocksForItem(itemId);
  };

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [userRes, itemsRes] = await Promise.all([
          fetch(`${API_URL}/api/profile`,  { credentials: "include" }),
          fetch(`${API_URL}/api/my-items`, { credentials: "include" }),
        ]);
        if (!userRes.ok) throw new Error("Not authenticated");
        setUser(await userRes.json());
        setItems(await itemsRes.json());
      } catch (err) { console.error(err); }
    };
    fetchAll();
    fetchRentals();
  }, []);

  const handleConfirmPickup = async (rentalId: number) => {
    try {
      const res = await fetch(`${API_URL}/api/rentals/${rentalId}/confirm-pickup`, {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: pickupInput[rentalId] }),
      });
      if (res.ok) { setPickupError({}); setPickupInput({}); fetchRentals(); }
      else { const err = await res.json(); setPickupError(prev => ({ ...prev, [rentalId]: err.error || "Incorrect code" })); }
    } catch (err) { console.error(err); }
  };

  const handleConfirmReturn = async (rentalId: number) => {
    try {
      const res = await fetch(`${API_URL}/api/rentals/${rentalId}/confirm-return`, {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: returnInput[rentalId] }),
      });
      if (res.ok) { setReturnError({}); setReturnInput({}); fetchRentals(); }
      else { const err = await res.json(); setReturnError(prev => ({ ...prev, [rentalId]: err.error || "Incorrect code" })); }
    } catch (err) { console.error(err); }
  };

  const handleCancelRental = async (rentalId: number) => {
    try {
      const res = await fetch(`${API_URL}/api/rentals/${rentalId}/cancel`, { method: "PATCH", credentials: "include" });
      if (res.ok) fetchRentals();
    } catch (err) { console.error(err); }
  };

  const getAvailable = (item: any): boolean => {
    if (item.id in blocksByItem) return isItemAvailableFromBlocks(blocksByItem[item.id]);
    return item.available;
  };

  if (!user) return <LoadingSpinner />;

  const formattedJoinDate = new Date(user.joinDate).toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric",
  });
  const filteredBorrowed = rentals.borrowed.filter(r => borrowedStatusFilter === "all" || r.status === borrowedStatusFilter);
  const filteredLent     = rentals.lent.filter(r => lentStatusFilter === "all" || r.status === lentStatusFilter);

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
                <h2 className="text-xl font-bold mb-1">{user.firstName} {user.lastName}</h2>
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
                  <span className="font-bold">{items.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Currently Borrowing</span>
                  <span className="font-bold">{rentals.borrowed.filter(r => r.status === "in_use").length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Currently Lending</span>
                  <span className="font-bold">{rentals.lent.filter(r => r.status === "in_use").length}</span>
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
              <TabsTrigger value="listed"><Package size={16} className="mr-2" />Listed ({items.length})</TabsTrigger>
              <TabsTrigger value="borrowed"><ArrowDownToLine size={16} className="mr-2" />Borrowed ({rentals.borrowed.length})</TabsTrigger>
              <TabsTrigger value="lent"><Inbox size={16} className="mr-2" />Lent ({rentals.lent.length})</TabsTrigger>
            </TabsList>

            {/* Listed Items */}
            <TabsContent value="listed">
              <div className="mb-6">
                <Link to="/upload">
                  <Button className="w-full"><PlusCircle size={16} className="mr-2" />Add New Item</Button>
                </Link>
              </div>

              {items.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Package size={48} className="mx-auto text-gray-400 mb-4" />
                    <h3 className="text-xl font-bold mb-2">No items listed yet</h3>
                    <p className="text-gray-600 mb-6">Start earning by listing items from your closet</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {items.map((item) => {
                    const available = getAvailable(item);
                    const blocks    = blocksByItem[item.id] ?? [];
                    return (
                      <Card key={item.id}>
                        <CardContent className="p-4">
                          <div className="flex gap-4">
                            <div className="w-24 h-32 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                              <img src={item.images?.[0]} alt={item.item_name} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between items-start mb-2">
                                <div>
                                  <h3 className="font-bold mb-1">
                                    <Link to={`/items/${item.id}`} className="hover:underline">
                                      {item.item_name}
                                    </Link>
                                  </h3>
                                  <p className="text-sm text-gray-600">Size {item.size}</p>
                                </div>
                                <Badge variant={available ? "secondary" : "destructive"}>
                                  {available ? "Available" : "Unavailable"}
                                </Badge>
                              </div>
                              <p className="font-bold mb-3">${item.price_per_day}/day</p>
                              <div className="flex gap-2">
                                <Link to={`/items/${item.id}?edit=true&ownerId=${user?.id}`}><Button size="sm" variant="outline" className="w-full">Edit</Button></Link>
                                <div className="relative flex-1">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="w-full"
                                    onClick={() =>
                                      manageOpenFor === item.id
                                        ? setManageOpenFor(null)
                                        : openManage(item.id)
                                    }
                                  >
                                    <CalendarOff size={14} className="mr-1.5" />
                                    {blocks.length > 0 ? `${blocks.length} Block${blocks.length > 1 ? "s" : ""}` : "Availability"}
                                  </Button>
                                  {manageOpenFor === item.id && (
                                    <UnavailabilityCalendar
                                      itemId={item.id}
                                      blocks={blocks}
                                      rentals={rentalsByItem[item.id] ?? []}
                                      onBlocksChanged={async (updated) => {
                                        setBlocksByItem(prev => ({ ...prev, [item.id]: updated }));
                                        await refreshItems();
                                      }}
                                      onClose={() => setManageOpenFor(null)}
                                    />
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </TabsContent>

            {/* Borrowed Tab */}
            <TabsContent value="borrowed">
              <div className="flex gap-2 flex-wrap mb-6">
                {STATUS_FILTERS.map(s => (
                  <button key={s} onClick={() => setBorrowedStatusFilter(s)}
                    className={`px-3 py-1 rounded-full text-xs font-medium capitalize border transition-colors ${borrowedStatusFilter === s ? "bg-black text-white border-black" : "border-gray-300 text-gray-600 hover:border-gray-500"}`}>
                    {s.replace("_", " ")}
                  </button>
                ))}
              </div>
              {filteredBorrowed.length === 0 ? (
                <Card><CardContent className="py-12 text-center">
                  <ArrowDownToLine size={48} className="mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl font-bold mb-2">No rentals yet</h3>
                  <p className="text-gray-600 mb-6">Browse items to find your next outfit</p>
                  <Link to="/browse"><Button>Start Browsing</Button></Link>
                </CardContent></Card>
              ) : (
                <div className="space-y-4">
                  {filteredBorrowed.map((rental) => (
                    <Card key={rental.id}><CardContent className="p-4">
                      <div className="flex gap-4">
                        <div className="w-24 h-32 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                          <img src={rental.item_image || undefined} alt={rental.item_name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-1">
                            <h3 className="font-bold">
                              <Link to={`/items/${rental.item_id}`} className="hover:underline">
                                {rental.item_name}
                              </Link>
                            </h3>
                            <span className={`text-xs font-medium px-2 py-1 rounded-full capitalize ${STATUS_COLORS[rental.status]}`}>{rental.status.replace("_", " ")}</span>
                          </div>
                          <p className="text-sm text-gray-600 mb-1">From: {rental.owner_name}</p>
                          {rental.start_date && rental.end_date && (
                            <p className="text-sm text-gray-600 mb-3">{new Date(rental.start_date).toLocaleDateString()} → {new Date(rental.end_date).toLocaleDateString()}</p>
                          )}
                          {rental.status === "pending_pickup" && (
                            <div className="bg-black text-white rounded-lg p-3 mb-3 text-center">
                              <p className="text-xs uppercase tracking-widest mb-1">Show to lender on pickup</p>
                              <p className="text-3xl font-bold tracking-widest">{rental.pickup_code}</p>
                            </div>
                          )}
                          {rental.status === "in_use" && (
                            <div className="mb-3">
                              <p className="text-xs text-gray-500 mb-2">Enter the code shown by the lender to confirm return:</p>
                              <div className="flex gap-2">
                                <input type="text" maxLength={4} placeholder="Enter 4-digit code"
                                  value={returnInput[rental.id] || ""}
                                  onChange={e => setReturnInput(prev => ({ ...prev, [rental.id]: e.target.value }))}
                                  className="border rounded-md px-3 py-1 text-sm w-40" />
                                <Button size="sm" onClick={() => handleConfirmReturn(rental.id)}>Confirm Return</Button>
                              </div>
                              {returnError[rental.id] && <p className="text-red-500 text-xs mt-1">{returnError[rental.id]}</p>}
                            </div>
                          )}
                          <div className="flex gap-2">
                            <Button size="sm" className="flex-1">Contact Owner</Button>
                            <Button size="sm" variant="outline" className="flex-1">Extend Rental</Button>
                          </div>
                        </div>
                      </div>
                    </CardContent></Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Lent Tab */}
            <TabsContent value="lent">
              <div className="flex gap-2 flex-wrap mb-6">
                {STATUS_FILTERS.map(s => (
                  <button key={s} onClick={() => setLentStatusFilter(s)}
                    className={`px-3 py-1 rounded-full text-xs font-medium capitalize border transition-colors ${lentStatusFilter === s ? "bg-black text-white border-black" : "border-gray-300 text-gray-600 hover:border-gray-500"}`}>
                    {s.replace("_", " ")}
                  </button>
                ))}
              </div>
              {filteredLent.length === 0 ? (
                <Card><CardContent className="py-12 text-center">
                  <Inbox size={48} className="mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl font-bold mb-2">No active loans</h3>
                  <p className="text-gray-600">Your items that are being borrowed will appear here</p>
                </CardContent></Card>
              ) : (
                <div className="space-y-4">
                  {filteredLent.map((rental) => (
                    <Card key={rental.id}><CardContent className="p-4">
                      <div className="flex gap-4">
                        <div className="w-24 h-32 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                          <img src={rental.item_image || undefined} alt={rental.item_name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-1">
                            <h3 className="font-bold">
                              <Link to={`/items/${rental.item_id}`} className="hover:underline">
                                {rental.item_name}
                              </Link>
                            </h3>
                            <span className={`text-xs font-medium px-2 py-1 rounded-full capitalize ${STATUS_COLORS[rental.status]}`}>{rental.status.replace("_", " ")}</span>
                          </div>
                          <p className="text-sm text-gray-600 mb-1">Borrowed by: {rental.borrower_name}</p>
                          {rental.start_date && rental.end_date && (
                            <p className="text-sm text-gray-600 mb-3">{new Date(rental.start_date).toLocaleDateString()} → {new Date(rental.end_date).toLocaleDateString()}</p>
                          )}
                          {rental.status === "pending_pickup" && (
                            <div className="mb-3">
                              <p className="text-xs text-gray-500 mb-2">Enter the code shown by the borrower to confirm pickup:</p>
                              <div className="flex gap-2">
                                <input type="text" maxLength={4} placeholder="Enter 4-digit code"
                                  value={pickupInput[rental.id] || ""}
                                  onChange={e => setPickupInput(prev => ({ ...prev, [rental.id]: e.target.value }))}
                                  className="border rounded-md px-3 py-1 text-sm w-40" />
                                <Button size="sm" onClick={() => handleConfirmPickup(rental.id)}>Confirm Pickup</Button>
                              </div>
                              {pickupError[rental.id] && <p className="text-red-500 text-xs mt-1">{pickupError[rental.id]}</p>}
                            </div>
                          )}
                          {rental.status === "in_use" && rental.return_code && (
                            <div className="bg-black text-white rounded-lg p-3 mb-3 text-center">
                              <p className="text-xs uppercase tracking-widest mb-1">Show to borrower on return</p>
                              <p className="text-3xl font-bold tracking-widest">{rental.return_code}</p>
                            </div>
                          )}
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" className="flex-1">Contact Borrower</Button>
                            {(rental.status === "pending_pickup" || rental.status === "in_use") && (
                              <Button size="sm" variant="outline" className="flex-1 text-red-600 border-red-300 hover:bg-red-50"
                                onClick={() => handleCancelRental(rental.id)}>Cancel</Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent></Card>
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