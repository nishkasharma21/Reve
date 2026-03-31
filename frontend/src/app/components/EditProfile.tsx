import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Camera, ArrowLeft, Shield } from "lucide-react";
import { toast } from "sonner";
import { LoadingSpinner } from "../components/LoadingSpinner";

const API_URL = import.meta.env.VITE_API_URL;

const STYLES = ["Casual", "Streetwear", "Preppy", "Bohemian", "Minimalist", "Vintage", "Athleisure", "Formal"];

export function EditProfile() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    profile_pic: "",
    dorm_location: "",
    topStyle: "",
    bottomStyle: "",
    height: "",
    weight: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${API_URL}/api/profile`, { credentials: "include" });
        if (!res.ok) throw new Error("Not authenticated");
        const user = await res.json();
        setFormData({
          firstName: user.firstName ?? "",
          lastName: user.lastName ?? "",
          email: user.email ?? "",
          profile_pic: user.profile_pic ?? "",
          dorm_location: user.dorm_location ?? "",
          topStyle: user.topStyle ?? "",
          bottomStyle: user.bottomStyle ?? "",
          height: user.height ?? "",
          weight: user.weight ?? "",
        });
        if (user.profile_pic) setPreviewImage(user.profile_pic);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreviewImage(result);
        setFormData(prev => ({ ...prev, profile_pic: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/api/profile`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          profile_pic: formData.profile_pic,
          dorm_location: formData.dorm_location,
          topStyle: formData.topStyle,
          bottomStyle: formData.bottomStyle,
          height: formData.height,
          weight: formData.weight,
        }),
      });
      if (!res.ok) throw new Error("Failed to update profile");
      toast.success("Profile updated successfully!");
      navigate("/profile");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save changes. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  const initials = `${formData.firstName.charAt(0)}${formData.lastName.charAt(0)}`.toUpperCase();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-8">
        <Link
          to="/profile"
          className="inline-flex items-center text-sm text-gray-600 hover:text-black mb-4"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to Profile
        </Link>
        <h1 className="text-4xl font-bold">Edit Profile</h1>
        <p className="text-gray-600 mt-2">Update your profile information and style preferences</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">

          {/* Profile Photo */}
          <Card>
            <CardHeader>
              <CardTitle>Profile Photo</CardTitle>
              <CardDescription>Upload a profile picture to help others recognize you</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="w-32 h-32 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white text-4xl font-bold overflow-hidden">
                    {previewImage ? (
                      <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      initials
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 bg-black text-white rounded-full p-3 hover:bg-gray-800 transition-colors"
                  >
                    <Camera size={18} />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
                <div>
                  <h3 className="font-medium mb-1">Upload new photo</h3>
                  <p className="text-sm text-gray-600 mb-3">JPG, PNG or GIF. Max size 5MB.</p>
                  <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                    Choose File
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Your name and campus location visible to other users</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    placeholder="First name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    placeholder="Last name"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">
                  Email
                  <span className="inline-flex items-center ml-2 text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                    <Shield size={12} className="mr-1" />
                    SSO Protected
                  </span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  disabled
                  className="bg-gray-50 cursor-not-allowed"
                />
                <p className="text-xs text-gray-500">Your email is managed through SSO and cannot be changed here</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dorm_location">Dorm / Location</Label>
                <Input
                  id="dorm_location"
                  value={formData.dorm_location}
                  onChange={(e) => setFormData({ ...formData, dorm_location: e.target.value })}
                  placeholder="e.g. Rieber Hall, De Neve Plaza"
                />
                <p className="text-xs text-gray-500">Helps borrowers know where to pick up items</p>
              </div>
            </CardContent>
          </Card>

          {/* Style & Sizing */}
          <Card>
            <CardHeader>
              <CardTitle>Style & Sizing</CardTitle>
              <CardDescription>Help others find items that fit your vibe and body</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="topStyle">Top Style</Label>
                  <Select
                    value={formData.topStyle}
                    onValueChange={(value) => setFormData({ ...formData, topStyle: value })}
                  >
                    <SelectTrigger id="topStyle">
                      <SelectValue placeholder="Select a style" />
                    </SelectTrigger>
                    <SelectContent>
                      {STYLES.map(s => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bottomStyle">Bottom Style</Label>
                  <Select
                    value={formData.bottomStyle}
                    onValueChange={(value) => setFormData({ ...formData, bottomStyle: value })}
                  >
                    <SelectTrigger id="bottomStyle">
                      <SelectValue placeholder="Select a style" />
                    </SelectTrigger>
                    <SelectContent>
                      {STYLES.map(s => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="height">Height</Label>
                  <Input
                    id="height"
                    value={formData.height}
                    onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                    placeholder='e.g. 5&apos;6"'
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weight">Weight</Label>
                  <Input
                    id="weight"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    placeholder="e.g. 130 lbs"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/profile")}
              size="lg"
              disabled={saving}
            >
              Cancel
            </Button>
            <Button type="submit" size="lg" className="min-w-[120px]" disabled={saving}>
              {saving ? "Saving…" : "Save Changes"}
            </Button>
          </div>

        </div>
      </form>
    </div>
  );
}