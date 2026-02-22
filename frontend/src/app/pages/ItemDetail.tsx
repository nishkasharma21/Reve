import { useState, useEffect } from "react";  // add useEffect
import { useParams, Link, useNavigate } from "react-router";
// REMOVE: import { mockItems } from "../data/mockData";
// REMOVE: import { mockConversations } from "../data/mockMessages";
import { Button } from "../components/ui/button";
import { Calendar } from "../components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/popover";
import { Badge } from "../components/ui/badge";
import { CalendarIcon, MapPin, User, ArrowLeft, Heart, MessageCircle } from "lucide-react";
import { format } from "date-fns";

const API_URL = import.meta.env.VITE_API_URL;

export function ItemDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState<any>(null);       // REPLACE mock lookup
  const [loading, setLoading] = useState(true);       // ADD
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [isLiked, setIsLiked] = useState(false);
  const [requesting, setRequesting] = useState(false); // ADD

  // ADD this entire useEffect
  useEffect(() => {
    fetch(`${API_URL}/api/items/${id}`, { credentials: 'include' })
      .then(res => { if (!res.ok) throw new Error('Not found'); return res.json(); })
      .then(data => setItem(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  // ADD this handler
  const handleRequestToRent = async () => {
    if (!startDate || !endDate) return;
    setRequesting(true);
    try {
      const res = await fetch(`${API_URL}/api/borrow-requests`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          item_id: item.id,
          start_date: format(startDate, 'yyyy-MM-dd'),
          end_date: format(endDate, 'yyyy-MM-dd'),
        }),
      });
      if (res.ok) {
        alert('Request sent!');
        navigate('/profile');
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to send request');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setRequesting(false);
    }
  };

  // REPLACE the old mock-based loading check
  if (loading) return <div className="max-w-7xl mx-auto px-4 py-12 text-center">Loading...</div>;
  if (!item) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Item not found</h1>
        <Link to="/browse"><Button>Back to Browse</Button></Link>
      </div>
    );
  }

  const calculateTotal = () => {
    if (!startDate || !endDate) return 0;
    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    return days * item.price_per_day;  // CHANGE item.price → item.price_per_day
  };

  const handleMessageOwner = () => navigate("/messages");

  return (
    <div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Link to="/browse" className="inline-flex items-center text-sm hover:underline">
          <ArrowLeft size={16} className="mr-2" />Back to Browse
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image */}
          <div className="relative">
            <div className="aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={item.images?.[0] || 'https://via.placeholder.com/400x600'}  // CHANGE item.image → item.images?.[0]
                alt={item.item_name}  // CHANGE item.name → item.item_name
                className="w-full h-full object-cover"
              />
            </div>
            <button
              onClick={() => setIsLiked(!isLiked)}
              className="absolute top-4 right-4 bg-white rounded-full p-3 shadow-lg hover:scale-110 transition-transform"
            >
              <Heart size={24} className={isLiked ? "fill-red-500 text-red-500" : ""} />
            </button>
          </div>

          {/* Details */}
          <div>
            <div className="mb-6">
              <h1 className="text-4xl font-bold mb-2">{item.item_name}</h1>  {/* CHANGE */}
              {item.brand && <p className="text-lg text-gray-600 mb-4">{item.brand}</p>}
              <div className="flex items-center gap-4 mb-4">
                <p className="text-3xl font-bold">${item.price_per_day}/day</p>  {/* CHANGE */}
                <Badge variant="secondary">{item.condition}</Badge>
              </div>
            </div>

            {/* Owner Info */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <User size={20} />
                  <span className="font-medium">{item.owner_name}</span>  {/* CHANGE */}
                </div>
                <Button variant="outline" size="sm" onClick={handleMessageOwner} className="flex items-center gap-2">
                  <MessageCircle size={16} />Message
                </Button>
              </div>
              <div className="flex items-center gap-3">
                <MapPin size={20} />
                <span className="text-gray-600">Stanford</span>
              </div>
            </div>

            {/* Details */}
            <div className="space-y-4 mb-6">
              <div>
                <h3 className="font-bold text-sm uppercase tracking-wide mb-2">Size</h3>
                <p>{item.size}</p>
              </div>
              <div>
                <h3 className="font-bold text-sm uppercase tracking-wide mb-2">Description</h3>
                <p className="text-gray-700">{item.description}</p>
              </div>
            </div>

            {/* Date Picker */}
            <div className="border-t pt-6 mb-6">
              <h3 className="font-bold text-sm uppercase tracking-wide mb-4">Select Rental Dates</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <Popover>
                  <PopoverTrigger asChild>
                    <button className="flex items-center gap-2 border rounded-md px-4 py-2 text-sm hover:bg-gray-50 justify-start w-full">
                      <CalendarIcon size={16} />
                      {startDate ? format(startDate, "MMM dd, yyyy") : "Start Date"}
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={startDate} onSelect={setStartDate}
                      disabled={(date) => date < new Date()} />
                  </PopoverContent>
                </Popover>

                <Popover>
                  <PopoverTrigger asChild>
                    <button className="flex items-center gap-2 border rounded-md px-4 py-2 text-sm hover:bg-gray-50 justify-start w-full">
                      <CalendarIcon size={16} />
                      {endDate ? format(endDate, "MMM dd, yyyy") : "End Date"}
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={endDate} onSelect={setEndDate}
                      disabled={(date) => date < new Date() || (startDate ? date <= startDate : false)} />
                  </PopoverContent>
                </Popover>
              </div>

              {startDate && endDate && (
                <div className="bg-black text-white rounded-lg p-4 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg">Total</span>
                    <span className="text-2xl font-bold">${calculateTotal()}</span>
                  </div>
                  <p className="text-sm text-gray-300 mt-1">
                    {Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))} days × ${item.price_per_day}/day
                  </p>
                </div>
              )}

              {/* CHANGE: add onClick and disabled/requesting state */}
              <Button
                size="lg"
                className="w-full"
                disabled={!startDate || !endDate || requesting}
                onClick={handleRequestToRent}
              >
                {requesting ? 'Sending...' : 'Request to Rent'}
              </Button>
              <p className="text-xs text-gray-500 text-center mt-2">Meet on campus for pickup and return</p>
            </div>
          </div>
        </div>

        {/* Remove related items section since it still uses mock data */}
      </div>
    </div>
  );
}