import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Upload as UploadIcon, X, CheckCircle } from "lucide-react";

export function Upload() {
  interface ItemFormData {
    item_name: string;
    category: string;
    brand: string;
    size: string;
    condition: string;
    price_per_day: string;
    description: string;
    link: string;
    images: string[]; // Explicitly allow an array of strings
  }

  const [images, setImages] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false); // Track loading state
  const [formData, setFormData] = useState<ItemFormData>({
    item_name: "",
    category: "",
    brand: "",
    size: "",
    condition: "",
    price_per_day: "",
    description: "",
    link: "",
    images: [], // Ensure this is initialized as an empty array
  });

  const [imageUploading, setImageUploading] = useState(false);
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    
    setImageUploading(true);
    const uploadedUrls: string[] = [];

    try {
      for (const file of Array.from(files)) {
        const data = new FormData();
        data.append('file', file);
        // Double check that 'goreve' is set to "Unsigned" in your Cloudinary Settings
        data.append('upload_preset', 'goreve'); 

        const res = await fetch(`https://api.cloudinary.com/v1_1/dvwjl1ibc/image/upload`, {
          method: 'POST',
          body: data, // Do NOT set Content-Type header; browser sets it for FormData
        });

        if (!res.ok) {
          const errorData = await res.json();
          console.error('Cloudinary Error:', errorData);
          throw new Error('Upload failed');
        }

        const result = await res.json();
        uploadedUrls.push(result.secure_url); // Only call this ONCE
      }

      const allImages = [...images, ...uploadedUrls];
      setImages(allImages);
      setFormData(prev => ({ ...prev, images: allImages }));
    } catch (err) {
      alert("Failed to upload one or more images.");
    } finally {
      setImageUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const submissionData = {
      ...formData,
      price_per_day: parseFloat(formData.price_per_day),
    };

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
        credentials: 'include',
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitted(true); 
      } else {
        alert(result.error || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      console.error('Submit failed:', err);
      alert('Failed to submit. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <CheckCircle size={64} className="mx-auto text-green-500 mb-6" />
        <h1 className="text-4xl font-bold mb-4">Item Listed Successfully!</h1>
        <p className="text-xl text-gray-600 mb-8">
          Your item is now available for rent. You'll be notified when someone requests it.
        </p>
        <div className="flex gap-4 justify-center">
          <Button onClick={() => setSubmitted(false)}>List Another Item</Button>
          <Button variant="outline" onClick={() => window.location.href = "/browse"}>
            Browse Items
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">List Your Item</h1>
        <p className="text-gray-600">
          Share your wardrobe with fellow students and earn money!
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Image Upload */}
        <div>
          <Label className="text-lg font-bold mb-4 block">Photos</Label>
          <p className="text-sm text-gray-600 mb-4">
            Add at least 3 photos to help renters see the item better
          </p>
          <div className="grid grid-cols-3 gap-4 mb-4">
            {images.map((image, index) => (
              <div key={index} className="relative aspect-square">
                <img
                  src={image}
                  alt={`Upload ${index + 1}`}
                  className="w-full h-full object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-lg"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
          <label className="border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors">
            <UploadIcon size={48} className="text-gray-400 mb-2" />
            <span className="text-sm text-gray-600">
              {imageUploading ? 'Uploading...' : 'Click to upload photos'}
            </span>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>
        </div>

        {/* Item Details */}
        <div className="space-y-6">
          <div>
            <Label htmlFor="name">Item Name *</Label>
            <Input
              id="name"
              value={formData.item_name}
              onChange={(e) =>
                setFormData({ ...formData, item_name: e.target.value })
              }
              placeholder="e.g., Black Mini Dress"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) =>
                  setFormData({ ...formData, category: value })
                }
                required
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dresses">Dresses</SelectItem>
                  <SelectItem value="tops">Tops</SelectItem>
                  <SelectItem value="bottoms">Bottoms</SelectItem>
                  <SelectItem value="jackets">Jackets</SelectItem>
                  <SelectItem value="sets">Sets</SelectItem>
                  <SelectItem value="bodysuits">Bodysuits</SelectItem>
                  <SelectItem value="skirts">Skirts</SelectItem>
                  <SelectItem value="sweaters">Sweaters</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="brand">Brand</Label>
              <Input
                id="brand"
                value={formData.brand}
                onChange={(e) =>
                  setFormData({ ...formData, brand: e.target.value })
                }
                placeholder="e.g., Zara"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="size">Size *</Label>
              <Select
                value={formData.size}
                onValueChange={(value) =>
                  setFormData({ ...formData, size: value })
                }
                required
              >
                <SelectTrigger id="size">
                  <SelectValue placeholder="Select size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="XS">XS</SelectItem>
                  <SelectItem value="S">S</SelectItem>
                  <SelectItem value="M">M</SelectItem>
                  <SelectItem value="L">L</SelectItem>
                  <SelectItem value="XL">XL</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="condition">Condition *</Label>
              <Select
                value={formData.condition}
                onValueChange={(value) =>
                  setFormData({ ...formData, condition: value })
                }
                required
              >
                <SelectTrigger id="condition">
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Like New">Like New</SelectItem>
                  <SelectItem value="Excellent">Excellent</SelectItem>
                  <SelectItem value="Good">Good</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="price">Price per Day ($) *</Label>
            <Input
              id="price"
              type="number"
              value={formData.price_per_day}
              onChange={(e) =>
                setFormData({ ...formData, price_per_day: e.target.value })
              }
              placeholder="10"
              min="1"
              required
            />
            <p className="text-sm text-gray-600 mt-1">
              We recommend $5-$25 per day based on item value
            </p>
          </div>

          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Describe the item, its fit, and any important details..."
              rows={4}
              required
            />
          </div>
        </div>

        {/* Guidelines */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="font-bold mb-3">Listing Guidelines</h3>
          <ul className="text-sm text-gray-700 space-y-2">
            <li>• Items must be clean and in good condition</li>
            <li>• Provide accurate descriptions and photos</li>
            <li>• Meet on campus in public areas for exchanges</li>
            <li>• Respond to rental requests within 24 hours</li>
          </ul>
        </div>

        <Button type="submit" size="lg" className="w-full">
          List Item
        </Button>
      </form>
    </div>
  );
}
