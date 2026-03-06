import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Calendar } from "../components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/popover";
import { Badge } from "../components/ui/badge";
import { CalendarIcon, MapPin, User, ArrowLeft, Heart, MessageCircle, ExternalLink, Pencil, Check, X } from "lucide-react";
import { format } from "date-fns";
import { LoadingSpinner } from "../components/LoadingSpinner";

const API_URL = import.meta.env.VITE_API_URL;

const CONDITIONS = ["New", "Like New", "Good", "Fair"];
const CATEGORIES = ["Tops", "Bottoms", "Dresses", "Outerwear", "Shoes", "Accessories", "Other"];
const SIZES = ["XS", "S", "M", "L", "XL", "XXL", "One Size"];

export function ItemDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [item, setItem]       = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  // Rental state
  const [startDate, setStartDate] = useState<Date>();
  const [endDate,   setEndDate]   = useState<Date>();
  const [isLiked,   setIsLiked]   = useState(false);
  const [requesting, setRequesting] = useState(false);

  // Edit state
  const [isEditing, setIsEditing] = useState(false);
  const [saving,    setSaving]    = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [form, setForm] = useState({
    item_name:     "",
    description:   "",
    category:      "",
    size:          "",
    brand:         "",
    condition:     "",
    price_per_day: "",
    link:          "",
  });

  useEffect(() => {
    // Fetch item and current user in parallel
    Promise.all([
      fetch(`${API_URL}/api/items/${id}`, { credentials: "include" }),
      fetch(`${API_URL}/api/profile`,     { credentials: "include" }),
    ])
      .then(async ([itemRes, profileRes]) => {
        if (!itemRes.ok) throw new Error("Not found");
        const itemData = await itemRes.json();
        setItem(itemData);
        setForm({
          item_name:     itemData.item_name     ?? "",
          description:   itemData.description   ?? "",
          category:      itemData.category      ?? "",
          size:          itemData.size          ?? "",
          brand:         itemData.brand         ?? "",
          condition:     itemData.condition     ?? "",
          price_per_day: String(itemData.price_per_day ?? ""),
          link:          itemData.link          ?? "",
        });
        if (profileRes.ok) {
          const profile = await profileRes.json();
          setCurrentUserId(profile.id);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const isOwner = item && currentUserId && item.owner_id === currentUserId;

  const handleField = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setSaveError(null);
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveError(null);
    try {
      const res = await fetch(`${API_URL}/api/items/${id}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          price_per_day: parseInt(form.price_per_day, 10),
        }),
      });
      if (res.ok) {
        // Refresh item from server
        const refreshed = await fetch(`${API_URL}/api/items/${id}`, { credentials: "include" });
        setItem(await refreshed.json());
        setIsEditing(false);
      } else {
        const err = await res.json();
        setSaveError(err.error || "Failed to save");
      }
    } catch (e) {
      setSaveError("Network error");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    // Reset form to current item values
    setForm({
      item_name:     item.item_name     ?? "",
      description:   item.description   ?? "",
      category:      item.category      ?? "",
      size:          item.size          ?? "",
      brand:         item.brand         ?? "",
      condition:     item.condition     ?? "",
      price_per_day: String(item.price_per_day ?? ""),
      link:          item.link          ?? "",
    });
    setSaveError(null);
    setIsEditing(false);
  };

  const handleRequestToRent = async () => {
    if (!startDate || !endDate) return;
    setRequesting(true);
    try {
      const res = await fetch(`${API_URL}/api/rentals`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          item_id:    item.id,
          start_date: format(startDate, "yyyy-MM-dd"),
          end_date:   format(endDate,   "yyyy-MM-dd"),
        }),
      });
      if (res.ok) {
        alert("Successfully rented item!");
        navigate("/profile");
      } else {
        const err = await res.json();
        alert(err.error || "Failed to rent item");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setRequesting(false);
    }
  };

  const calculateTotal = () => {
    if (!startDate || !endDate) return 0;
    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    return days * item.price_per_day;
  };

  if (loading) return <LoadingSpinner />;
  if (!item) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Item not found</h1>
        <Link to="/browse"><Button>Back to Browse</Button></Link>
      </div>
    );
  }

  // ── Shared input classes ──────────────────────────────────────────────────
  const inputCls = "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black";
  const selectCls = inputCls;

  return (
    <div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
        <Link to="/browse" className="inline-flex items-center text-sm hover:underline">
          <ArrowLeft size={16} className="mr-2" />Back to Browse
        </Link>

        {/* Edit / Save / Cancel controls for owner */}
        {isOwner && (
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button size="sm" variant="outline" onClick={handleCancel} disabled={saving}>
                  <X size={14} className="mr-1" />Cancel
                </Button>
                <Button size="sm" onClick={handleSave} disabled={saving}>
                  <Check size={14} className="mr-1" />{saving ? "Saving…" : "Save Changes"}
                </Button>
              </>
            ) : (
              <Button size="sm" variant="outline" onClick={() => setIsEditing(true)}>
                <Pencil size={14} className="mr-1" />Edit Item
              </Button>
            )}
          </div>
        )}
      </div>

      {saveError && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4">
          <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-4 py-2">{saveError}</p>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

          {/* Image */}
          <div className="relative">
            <div className="aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={item.images?.[0] || "https://via.placeholder.com/400x600"}
                alt={item.item_name}
                className="w-full h-full object-cover"
              />
            </div>
            {!isOwner && (
              <button
                onClick={() => setIsLiked(!isLiked)}
                className="absolute top-4 right-4 bg-white rounded-full p-3 shadow-lg hover:scale-110 transition-transform"
              >
                <Heart size={24} className={isLiked ? "fill-red-500 text-red-500" : ""} />
              </button>
            )}
          </div>

          {/* Details */}
          <div>
            <div className="mb-6">
              {isEditing ? (
                <div className="space-y-3 mb-4">
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1 block">Item Name</label>
                    <input className={inputCls} value={form.item_name} onChange={e => handleField("item_name", e.target.value)} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1 block">Brand</label>
                      <input className={inputCls} value={form.brand} onChange={e => handleField("brand", e.target.value)} placeholder="e.g. Zara" />
                    </div>
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1 block">Price / day ($)</label>
                      <input className={inputCls} type="number" min="0" value={form.price_per_day} onChange={e => handleField("price_per_day", e.target.value)} />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1 block">Category</label>
                      <select className={selectCls} value={form.category} onChange={e => handleField("category", e.target.value)}>
                        <option value="">Select</option>
                        {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1 block">Size</label>
                      <select className={selectCls} value={form.size} onChange={e => handleField("size", e.target.value)}>
                        <option value="">Select</option>
                        {SIZES.map(s => <option key={s}>{s}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1 block">Condition</label>
                      <select className={selectCls} value={form.condition} onChange={e => handleField("condition", e.target.value)}>
                        <option value="">Select</option>
                        {CONDITIONS.map(c => <option key={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1 block">Description</label>
                    <textarea className={inputCls} rows={3} value={form.description} onChange={e => handleField("description", e.target.value)} />
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1 block">Link (optional)</label>
                    <input className={inputCls} value={form.link} onChange={e => handleField("link", e.target.value)} placeholder="https://..." />
                  </div>
                </div>
              ) : (
                <>
                  <h1 className="text-4xl font-bold mb-2">{item.item_name}</h1>
                  {item.brand && <p className="text-lg text-gray-600 mb-4">{item.brand}</p>}
                  <div className="flex items-center gap-4 mb-4">
                    <p className="text-3xl font-bold">${item.price_per_day}/day</p>
                    <Badge variant="secondary">{item.condition}</Badge>
                  </div>
                  {item.link && (
                    <a href={item.link} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="sm" className="flex items-center gap-2">
                        <ExternalLink size={16} />View Item
                      </Button>
                    </a>
                  )}
                </>
              )}
            </div>

            {/* Owner Info */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <User size={20} />
                  <span className="font-medium">{item.owner_name}</span>
                </div>
                {!isOwner && (
                  <Button variant="outline" size="sm" onClick={() => navigate("/messages")} className="flex items-center gap-2">
                    <MessageCircle size={16} />Message
                  </Button>
                )}
              </div>
              <div className="flex items-center gap-3">
                <MapPin size={20} />
                <span className="text-gray-600">Stanford</span>
              </div>
            </div>

            {/* Read-only details when not editing */}
            {!isEditing && (
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
            )}

            {/* Rental section — only shown to non-owners */}
            {!isOwner && (
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

                <Button size="lg" className="w-full"
                  disabled={!startDate || !endDate || requesting}
                  onClick={handleRequestToRent}>
                  {requesting ? "Sending..." : "Request to Rent"}
                </Button>
                <p className="text-xs text-gray-500 text-center mt-2">Meet on campus for pickup and return</p>
              </div>
            )}

            {/* Owner save button at bottom too for convenience */}
            {isEditing && (
              <div className="border-t pt-6 flex gap-3">
                <Button variant="outline" className="flex-1" onClick={handleCancel} disabled={saving}>Cancel</Button>
                <Button className="flex-1" onClick={handleSave} disabled={saving}>
                  {saving ? "Saving…" : "Save Changes"}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}