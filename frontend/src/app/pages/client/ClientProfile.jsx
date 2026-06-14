import { useState, useRef, useEffect } from 'react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Badge } from '../../components/ui/badge';
import { useAuth } from '../../context/AuthContext';
import { Building2, Star, Briefcase, DollarSign, Camera, Loader2, Link } from 'lucide-react';
import { toast } from 'sonner';
import api from '../../services/api';

export default function ClientProfile() {
  const { user, refreshUser } = useAuth();
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  const [formData, setFormData] = useState({
    companyName: '',
    industry: '',
    companyWebsite: '',
    companyDescription: '',
    phone: '',
    address: '',
    companyLogo: null
  });

  useEffect(() => {
    if (user) {
      setFormData({
        companyName: user.companyName || user.fullName || '',
        industry: user.industry || '',
        companyWebsite: user.companyWebsite || '',
        companyDescription: user.companyDescription || user.companyBio || '',
        phone: user.phone || '',
        address: user.address || '',
        companyLogo: null
      });
      if (user.companyLogo) {
        setPreviewImage(`http://localhost:3000${user.companyLogo}`);
      }
    }
  }, [user]);

  if (!user) return null;

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }
      setFormData(prev => ({ ...prev, companyLogo: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const data = new FormData();
      data.append('companyName', formData.companyName);
      data.append('industry', formData.industry);
      data.append('companyWebsite', formData.companyWebsite);
      data.append('companyDescription', formData.companyDescription);
      data.append('phone', formData.phone);
      data.append('address', formData.address);

      if (formData.companyLogo) {
        data.append('companyLogo', formData.companyLogo);
      }

      const response = await api.post('/auth/update-client-profile', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        toast.success("Profile updated successfully");
        refreshUser();
      }
    } catch (error) {
      console.error("Save profile error:", error);
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-2">Company Profile</h2>
          <p className="text-gray-600">Manage your company information</p>
        </div>
        <Button
          className="bg-gradient-to-r from-indigo-600 to-purple-600"
          onClick={handleSave}
          disabled={loading}
        >
          {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</> : 'Save Changes'}
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="p-6">
          <div className="text-center">
            <div className="relative w-32 h-32 mx-auto mb-4 group">
              <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center text-white text-3xl font-bold overflow-hidden">
                {previewImage ? (
                  <img src={previewImage} alt="Company Logo" className="w-full h-full object-cover" />
                ) : (
                  <Building2 className="w-16 h-16" />
                )}
              </div>
              <button
                onClick={() => fileInputRef.current.click()}
                className="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              >
                <Camera className="w-8 h-8 text-white" />
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
              />
            </div>

            {formData.companyLogo && (
              <Button
                size="sm"
                variant="outline"
                className="mb-4 border-indigo-200 text-indigo-600 hover:bg-indigo-50"
                onClick={handleSave}
                disabled={loading}
              >
                {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Camera className="w-4 h-4 mr-2" />}
                Save New Logo
              </Button>
            )}

            <h3 className="text-xl font-semibold mb-1">{formData.companyName}</h3>
            <p className="text-gray-600 mb-4">{formData.industry || 'Company'}</p>

            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Rating</span>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <span className="font-semibold">{user.rating || 0}</span>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Jobs Posted</span>
                <span className="font-semibold">{user.totalJobsPosted || 0}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Total Spent</span>
                <span className="font-semibold">${(user.totalSpent || 0).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Company Information</h3>
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="industry">Industry</Label>
                  <Input
                    id="industry"
                    value={formData.industry}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="companyWebsite">Website</Label>
                <div className="relative">
                  <Link className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="companyWebsite"
                    type="url"
                    className="pl-10"
                    placeholder="https://example.com"
                    value={formData.companyWebsite}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="companyDescription">Company Description</Label>
                <Textarea
                  id="companyDescription"
                  rows={4}
                  placeholder="Tell us about your company..."
                  value={formData.companyDescription}
                  onChange={handleChange}
                />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold mb-4">Contact Information</h3>
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={user.email} disabled className="bg-gray-50" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}





