import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { mockItems } from "../data/mockData";
import { mockConversations } from "../data/mockMessages";
import { Button } from "../components/ui/button";
import { Calendar } from "../components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/popover";
import { Badge } from "../components/ui/badge";
import { CalendarIcon, MapPin, User, ArrowLeft, Heart, MessageCircle } from "lucide-react";
import { format } from "date-fns";

export function ItemDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const item = mockItems.find((i) => i.id === id);
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [isLiked, setIsLiked] = useState(false);

  if (!item) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Item not found</h1>
        <Link to="/browse">
          <Button>Back to Browse</Button>
        </Link>
      </div>
    );
  }

  const calculateTotal = () => {
    if (!startDate || !endDate) return 0;
    const days = Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    return days * item.price;
  };

  const relatedItems = mockItems
    .filter((i) => i.category === item.category && i.id !== item.id)
    .slice(0, 4);

  // Find existing conversation for this item
  const existingConversation = mockConversations.find((c) => c.itemId === item.id);

  const handleMessageOwner = () => {
    if (existingConversation) {
      navigate(`/messages/${existingConversation.id}`);
    } else {
      // In a real app, this would create a new conversation
      navigate("/messages");
    }
  };

  return (
    <div>
      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Link to="/browse" className="inline-flex items-center text-sm hover:underline">
          <ArrowLeft size={16} className="mr-2" />
          Back to Browse
        </Link>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image */}
          <div className="relative">
            <div className="aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            </div>
            <button
              onClick={() => setIsLiked(!isLiked)}
              className="absolute top-4 right-4 bg-white rounded-full p-3 shadow-lg hover:scale-110 transition-transform"
            >
              <Heart
                size={24}
                className={isLiked ? "fill-red-500 text-red-500" : ""}
              />
            </button>
          </div>

          {/* Details */}
          <div>
            <div className="mb-6">
              <h1 className="text-4xl font-bold mb-2">{item.name}</h1>
              {item.brand && (
                <p className="text-lg text-gray-600 mb-4">{item.brand}</p>
              )}
              <div className="flex items-center gap-4 mb-4">
                <p className="text-3xl font-bold">${item.price}/day</p>
                <Badge variant="secondary">{item.condition}</Badge>
              </div>
            </div>

            {/* Owner Info */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <User size={20} />
                  <span className="font-medium">{item.owner}</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleMessageOwner}
                  className="flex items-center gap-2"
                >
                  <MessageCircle size={16} />
                  Message
                </Button>
              </div>
              <div className="flex items-center gap-3">
                <MapPin size={20} />
                <span className="text-gray-600">{item.university}</span>
              </div>
            </div>

            {/* Details */}
            <div className="space-y-4 mb-6">
              <div>
                <h3 className="font-bold text-sm uppercase tracking-wide mb-2">
                  Size
                </h3>
                <p>{item.size}</p>
              </div>
              <div>
                <h3 className="font-bold text-sm uppercase tracking-wide mb-2">
                  Description
                </h3>
                <p className="text-gray-700">{item.description}</p>
              </div>
            </div>

            {/* Date Picker */}
            <div className="border-t pt-6 mb-6">
              <h3 className="font-bold text-sm uppercase tracking-wide mb-4">
                Select Rental Dates
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="justify-start">
                      <CalendarIcon className="mr-2" size={16} />
                      {startDate ? format(startDate, "MMM dd, yyyy") : "Start Date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      disabled={(date) => date < new Date()}
                    />
                  </PopoverContent>
                </Popover>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="justify-start">
                      <CalendarIcon className="mr-2" size={16} />
                      {endDate ? format(endDate, "MMM dd, yyyy") : "End Date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      disabled={(date) =>
                        date < new Date() || (startDate ? date <= startDate : false)
                      }
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {startDate && endDate && (
                <div className="bg-black text-white rounded-lg p-4 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg">Total</span>
                    <span className="text-2xl font-bold">
                      ${calculateTotal()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-300 mt-1">
                    {Math.ceil(
                      (endDate.getTime() - startDate.getTime()) /
                        (1000 * 60 * 60 * 24)
                    )}{" "}
                    days × ${item.price}/day
                  </p>
                </div>
              )}

              <Button
                size="lg"
                className="w-full"
                disabled={!startDate || !endDate}
              >
                Request to Rent
              </Button>
              <p className="text-xs text-gray-500 text-center mt-2">
                Meet on campus for pickup and return
              </p>
            </div>
          </div>
        </div>

        {/* Related Items */}
        {relatedItems.length > 0 && (
          <div className="mt-20">
            <h2 className="text-2xl font-bold mb-8">Similar Items</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedItems.map((relatedItem) => (
                <Link
                  key={relatedItem.id}
                  to={`/item/${relatedItem.id}`}
                  className="group cursor-pointer"
                >
                  <div className="aspect-[3/4] bg-white rounded-lg overflow-hidden mb-3 border border-gray-200">
                    <img
                      src={relatedItem.image}
                      alt={relatedItem.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="font-medium mb-1 group-hover:underline">
                    {relatedItem.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-1">
                    {relatedItem.owner}
                  </p>
                  <p className="font-bold">${relatedItem.price}/day</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}