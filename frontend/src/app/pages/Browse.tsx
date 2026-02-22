import { useState, useMemo } from "react";
import { Link, useParams, useSearchParams } from "react-router";
import { mockItems } from "../data/mockData";
import { Button } from "../components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Checkbox } from "../components/ui/checkbox";
import { Label } from "../components/ui/label";
import { SlidersHorizontal } from "lucide-react";

const categories = [
  "All",
  "New Arrivals",
  "Dresses",
  "Tops",
  "Bottoms",
  "Jackets",
  "Sets",
  "Bodysuits",
  "Skirts",
  "Sweaters",
];

const sizes = ["XS", "S", "M", "L", "XL"];
const conditions = ["Like New", "Excellent", "Good"];
const universities = ["All", "UCLA", "USC"];

export function Browse() {
  const { category } = useParams();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";

  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [selectedUniversity, setSelectedUniversity] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);

  const filteredItems = useMemo(() => {
    let filtered = [...mockItems];

    // Filter by category
    if (category && category !== "all") {
      const categorySlug = category.toLowerCase().replace(/-/g, " ");
      filtered = filtered.filter(
        (item) => item.category.toLowerCase() === categorySlug.replace("new arrivals", "new-arrivals")
      );
    }

    // Filter by search
    if (searchQuery) {
      filtered = filtered.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by size
    if (selectedSizes.length > 0) {
      filtered = filtered.filter((item) => selectedSizes.includes(item.size));
    }

    // Filter by condition
    if (selectedConditions.length > 0) {
      filtered = filtered.filter((item) =>
        selectedConditions.includes(item.condition)
      );
    }

    // Filter by university
    if (selectedUniversity !== "All") {
      filtered = filtered.filter(
        (item) => item.university === selectedUniversity
      );
    }

    // Sort
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "newest":
      default:
        // Already in newest order
        break;
    }

    return filtered;
  }, [
    category,
    searchQuery,
    selectedSizes,
    selectedConditions,
    selectedUniversity,
    sortBy,
  ]);

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const toggleCondition = (condition: string) => {
    setSelectedConditions((prev) =>
      prev.includes(condition)
        ? prev.filter((c) => c !== condition)
        : [...prev, condition]
    );
  };

  const categoryName = category
    ? category
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    : "All Items";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">
          {searchQuery ? `Search Results for "${searchQuery}"` : categoryName}
        </h1>
        <p className="text-gray-600">{filteredItems.length} items available</p>
      </div>

      {/* Filters and Sort Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="md:hidden"
        >
          <SlidersHorizontal size={16} className="mr-2" />
          Filters
        </Button>

        <div className="flex-1" />

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="price-low">Price: Low to High</SelectItem>
            <SelectItem value="price-high">Price: High to Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-8">
        {/* Sidebar Filters */}
        <aside
          className={`${
            showFilters ? "block" : "hidden"
          } md:block w-full md:w-64 space-y-8`}
        >
          {/* University Filter */}
          <div>
            <h3 className="font-bold mb-4 uppercase tracking-wide text-sm">
              University
            </h3>
            <Select
              value={selectedUniversity}
              onValueChange={setSelectedUniversity}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {universities.map((uni) => (
                  <SelectItem key={uni} value={uni}>
                    {uni}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Size Filter */}
          <div>
            <h3 className="font-bold mb-4 uppercase tracking-wide text-sm">
              Size
            </h3>
            <div className="space-y-3">
              {sizes.map((size) => (
                <div key={size} className="flex items-center space-x-2">
                  <Checkbox
                    id={`size-${size}`}
                    checked={selectedSizes.includes(size)}
                    onCheckedChange={() => toggleSize(size)}
                  />
                  <Label
                    htmlFor={`size-${size}`}
                    className="cursor-pointer text-sm"
                  >
                    {size}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Condition Filter */}
          <div>
            <h3 className="font-bold mb-4 uppercase tracking-wide text-sm">
              Condition
            </h3>
            <div className="space-y-3">
              {conditions.map((condition) => (
                <div key={condition} className="flex items-center space-x-2">
                  <Checkbox
                    id={`condition-${condition}`}
                    checked={selectedConditions.includes(condition)}
                    onCheckedChange={() => toggleCondition(condition)}
                  />
                  <Label
                    htmlFor={`condition-${condition}`}
                    className="cursor-pointer text-sm"
                  >
                    {condition}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Clear Filters */}
          {(selectedSizes.length > 0 ||
            selectedConditions.length > 0 ||
            selectedUniversity !== "All") && (
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                setSelectedSizes([]);
                setSelectedConditions([]);
                setSelectedUniversity("All");
              }}
            >
              Clear Filters
            </Button>
          )}
        </aside>

        {/* Items Grid */}
        <div className="flex-1">
          {filteredItems.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-xl text-gray-600 mb-4">
                No items found matching your criteria
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedSizes([]);
                  setSelectedConditions([]);
                  setSelectedUniversity("All");
                }}
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredItems.map((item) => (
                <Link
                  key={item.id}
                  to={`/item/${item.id}`}
                  className="group cursor-pointer"
                >
                  <div className="aspect-[3/4] bg-white rounded-lg overflow-hidden mb-3 border border-gray-200">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-medium group-hover:underline">
                      {item.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {item.owner} • {item.university}
                    </p>
                    <p className="text-sm text-gray-500">
                      Size {item.size} • {item.condition}
                    </p>
                    <p className="font-bold">${item.price}/day</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
