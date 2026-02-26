import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { Search, User, Menu, X, MessageCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { mockConversations } from "../data/mockMessages";

const API_URL = import.meta.env.VITE_API_URL;

const categories = [
  { name: "New Arrivals", path: "/browse/new-arrivals" },
  { name: "Dresses", path: "/browse/dresses" },
  { name: "Tops", path: "/browse/tops" },
  { name: "Bottoms", path: "/browse/bottoms" },
  { name: "Jackets", path: "/browse/jackets" },
  { name: "Bodysuits", path: "/browse/bodysuits" },
  { name: "Skirts", path: "/browse/skirts" },
  { name: "Sweaters", path: "/browse/sweaters" },
];

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [allItems, setAllItems] = useState<any[]>([]);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loadingResults, setLoadingResults] = useState(false);
  const navigate = useNavigate();

  // Calculate total unread messages
  const totalUnread = mockConversations.reduce((sum, conv) => sum + conv.unreadCount, 0);

  // Fetch ALL items once on mount
  useEffect(() => {
    const fetchAllItems = async () => {
      try {
        const response = await fetch(`${API_URL}/api/browse-items`, {
          credentials: 'include'
        });
        const data = await response.json();
        setAllItems(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to fetch items:', err);
        setAllItems([]);
      }
    };
    fetchAllItems();
  }, []);

  // Filter items client-side as user types
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    setLoadingResults(true);
    const timeoutId = setTimeout(() => {
      // Filter by item_name only
      const filtered = allItems.filter((item) =>
        item.item_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(filtered.slice(0, 5)); // Show top 5 results
      setLoadingResults(false);
    }, 300); // Debounce

    return () => clearTimeout(timeoutId);
  }, [searchQuery, allItems]);

  const handleSearchClick = () => {
    setSearchOpen(!searchOpen);
    if (!searchOpen) {
      setTimeout(() => {
        document.getElementById("search-input")?.focus();
      }, 100);
    } else {
      setSearchQuery("");
      setSearchResults([]);
    }
  };

  // Handle Enter key press - navigate to browse page
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/browse?search=${encodeURIComponent(searchQuery)}`);
      setSearchOpen(false);
      setSearchQuery("");
      setSearchResults([]);
    }
  };

  const handleViewAll = () => {
    navigate(`/browse?search=${encodeURIComponent(searchQuery)}`);
    setSearchOpen(false);
    setSearchQuery("");
    setSearchResults([]);
  };

  const handleResultClick = (itemId: number) => {
    navigate(`/item/${itemId}`);
    setSearchOpen(false);
    setSearchQuery("");
    setSearchResults([]);
  };

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
        {/* Top Bar */}
        <div className="bg-black text-white text-center py-2 text-sm">
          Campus Closet - Rent. Share. Repeat. 🎓
        </div>

        {/* Main Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Logo */}
            <Link to="/home" className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 text-transparent bg-clip-text">
              REVE
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-6">
              {categories.map((category) => (
                <Link
                  key={category.path}
                  to={category.path}
                  className="text-sm font-medium hover:text-gray-600 transition-colors uppercase tracking-wide"
                >
                  {category.name}
                </Link>
              ))}
            </div>

            {/* Right Side Icons */}
            <div className="flex items-center space-x-4">
              {/* Search Icon Only */}
              <button
                onClick={handleSearchClick}
                className="hover:text-gray-600 transition-colors"
              >
                <Search size={20} />
              </button>

              {/* User Profile */}
              <Link to="/profile">
                <User size={20} className="hover:text-gray-600 transition-colors" />
              </Link>

              {/* Messages */}
              <Link to="/messages" className="relative">
                <MessageCircle size={20} className="hover:text-gray-600 transition-colors" />
                {totalUnread > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 min-w-5 flex items-center justify-center p-1 text-xs">
                    {totalUnread}
                  </Badge>
                )}
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 bg-white">
            <div className="px-4 py-4 space-y-3">
              {categories.map((category) => (
                <Link
                  key={category.path}
                  to={category.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-sm font-medium py-2 hover:text-gray-600 transition-colors uppercase tracking-wide"
                >
                  {category.name}
                </Link>
              ))}

              <Link
                to="/messages"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between text-sm font-medium py-2 hover:text-gray-600 transition-colors uppercase tracking-wide"
              >
                <span>Messages</span>
                {totalUnread > 0 && <Badge>{totalUnread}</Badge>}
              </Link>

              <Link to="/upload" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full">List Item</Button>
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Search Overlay */}
      {searchOpen && (
        <>
          {/* Backdrop only below navbar */}
          <div 
            className="fixed inset-0 z-40 bg-black/50" 
            onClick={handleSearchClick}
          />
          
          {/* Search Content - positioned below navbar */}
          <div className="fixed top-[104px] left-0 right-0 z-50 bg-white shadow-lg" onClick={(e) => e.stopPropagation()}>
            {/* Search Bar */}
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <form onSubmit={handleSearchSubmit}>
                <div className="relative">
                  <Input
                    id="search-input"
                    type="text"
                    placeholder="Search for items..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-14 pr-20 text-lg"
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery("")}
                        className="p-2 hover:bg-gray-100 rounded-full"
                      >
                        <X size={20} className="text-gray-400" />
                      </button>
                    )}
                    <button
                      type="submit"
                      className="p-2 hover:bg-gray-100 rounded-full"
                    >
                      <Search size={20} className="text-gray-400" />
                    </button>
                  </div>
                </div>
              </form>
            </div>

            {/* Search Results Preview */}
            {searchQuery && (
              <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
                <div className="bg-white rounded-lg shadow-lg border border-gray-200 max-h-[60vh] overflow-y-auto">
                  {loadingResults ? (
                    <div className="p-8 text-center text-gray-500">Loading...</div>
                  ) : searchResults.length === 0 ? (
                    <div className="p-8 text-center">
                      <p className="text-gray-500 mb-4">No results found for "{searchQuery}"</p>
                      <p className="text-sm text-gray-400">Try searching with different keywords</p>
                    </div>
                  ) : (
                    <>
                      <div className="p-4 border-b border-gray-200">
                        <h3 className="font-bold text-sm uppercase">Products</h3>
                      </div>
                      <div className="divide-y">
                        {searchResults.map((item) => (
                          <button
                            key={item.id}
                            onClick={() => handleResultClick(item.id)}
                            className="w-full p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors text-left"
                          >
                            <div className="w-16 h-20 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                              {item.images?.[0] ? (
                                <img
                                  src={item.images[0]}
                                  alt={item.item_name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                                  No image
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium truncate">{item.item_name}</h4>
                              <p className="text-sm text-gray-500">
                                ${item.price_per_day}/day • Size {item.size}
                              </p>
                            </div>
                          </button>
                        ))}
                      </div>
                      <div className="p-4 border-t border-gray-200">
                        <button
                          onClick={handleViewAll}
                          className="text-sm font-medium hover:underline flex items-center gap-2"
                        >
                          View all results for "{searchQuery}" →
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}