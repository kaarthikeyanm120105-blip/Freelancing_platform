import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { toast } from 'sonner';
import { Briefcase, IndianRupee, Calendar, Layers, Star, Info } from 'lucide-react';
import jobService from '../../services/jobService';

export default function PostJob() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    jobTitle: '',
    jobDescription: '',
    category: '',
    skillsRequired: '',
    budget: '',
    deadline: '',
    experienceLevel: 'beginner',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const skillsArray = formData.skillsRequired.split(',').map((skill) => skill.trim()).filter((s) => s !== '');
      const jobData = {
        ...formData,
        skillsRequired: skillsArray,
        budget: Number(formData.budget),
      };

      const response = await jobService.createJob(jobData);
      if (response.success) {
        toast.success('Job posted successfully!');
        navigate('/client/jobs');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to post job');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600">
          <Briefcase className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Post a New Job</h1>
          <p className="text-gray-500">Share your project details to find the best talent</p>
        </div>
      </div>

      <Card className="p-8 border-2 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 col-span-1 md:col-span-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Info className="w-4 h-4 text-indigo-500" /> Job Title
              </label>
              <Input
                name="jobTitle"
                placeholder="e.g. React Developer for E-commerce Site"
                required
                value={formData.jobTitle}
                onChange={handleChange}
                className="focus-visible:ring-indigo-500"
              />
            </div>

            <div className="space-y-2 col-span-1 md:col-span-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Info className="w-4 h-4 text-indigo-500" /> Job Description
              </label>
              <textarea
                name="jobDescription"
                rows={5}
                required
                value={formData.jobDescription}
                onChange={handleChange}
                placeholder="Describe the project goals, responsibilities, and deliverables..."
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all border-gray-200"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-500" /> Category
              </label>
              <Input
                name="category"
                placeholder="e.g. Web Development"
                required
                value={formData.category}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Star className="w-4 h-4 text-indigo-500" /> Experience Level
              </label>
              <select
                name="experienceLevel"
                className="w-full p-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 border-gray-200"
                value={formData.experienceLevel}
                onChange={handleChange}
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="expert">Expert</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <IndianRupee className="w-4 h-4 text-indigo-500" /> Budget (₹)
              </label>
              <Input
                name="budget"
                type="number"
                placeholder="e.g. 5000"
                required
                value={formData.budget}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-indigo-500" /> Deadline
              </label>
              <Input
                name="deadline"
                type="date"
                required
                value={formData.deadline}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2 col-span-1 md:col-span-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Info className="w-4 h-4 text-indigo-500" /> Skills Required (comma separated)
              </label>
              <Input
                name="skillsRequired"
                placeholder="e.g. React, Node.js, MongoDB"
                value={formData.skillsRequired}
                onChange={handleChange}
              />
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.skillsRequired.split(',').map((skill, i) => skill.trim() && (
                  <Badge key={i} variant="secondary" className="bg-indigo-50 text-indigo-700 border-indigo-100">
                    {skill.trim()}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => navigate('/client/jobs')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 px-8"
            >
              {loading ? 'Posting...' : 'Post Job'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
