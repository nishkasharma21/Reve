import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Search, User, ShoppingBag, Menu, X, MessageCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { mockConversations } from "../data/mockMessages";

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
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  // Calculate total unread messages
  const totalUnread = mockConversations.reduce((sum, conv) => sum + conv.unreadCount, 0);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/browse?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
    }
  };

  return (
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
            {/* Search */}
            <form onSubmit={handleSearch} className="hidden md:block relative">
              <Input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-24 h-9 pr-8"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2"
              >
                <Search size={16} className="text-gray-400" />
              </button>
            </form>

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

            {/* Upload Button */}
            <Link to="/upload">
              <Button size="sm" className="hidden md:inline-flex">
                List Item
              </Button>
            </Link>

            {/* Cart */}
            <button className="relative">
              <ShoppingBag size={20} className="hover:text-gray-600 transition-colors" />
              <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                0
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-4 space-y-3">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="relative">
              <Input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 pr-8"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2"
              >
                <Search size={16} className="text-gray-400" />
              </button>
            </form>

            {/* Mobile Categories */}
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

            {/* Mobile Messages Link */}
            <Link
              to="/messages"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between text-sm font-medium py-2 hover:text-gray-600 transition-colors uppercase tracking-wide"
            >
              <span>Messages</span>
              {totalUnread > 0 && (
                <Badge>{totalUnread}</Badge>
              )}
            </Link>

            {/* Mobile Upload Button */}
            <Link to="/upload" onClick={() => setMobileMenuOpen(false)}>
              <Button className="w-full">List Item</Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}